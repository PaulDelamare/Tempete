import { prisma } from "@/lib/prisma";
import { CreateEventApiSchemaType, MergedEventPutSchemaType } from "@/helpers/zod/event/create-event-schema";
import { EventStatus } from "@/generated/prisma";
import { attachArtistsToEvent, replaceArtistsForEvent } from "./artist.service";
import { attachTagsToEvent, replaceTagsForEvent } from "./tag.service";
import { throwError } from "@/lib/errors";

/**
 * Retrieves all events from the database, including related areas, tags, and artists.
 *
 * - Includes associated `area` information.
 * - Includes joined tags via `tagsJoin`, with each tag's details.
 * - Includes joined artists via `artists`, with each artist's details.
 * - Orders the results by the event's start date (`datestart`) in ascending order.
 *
 * @returns A promise that resolves to an array of event objects with their related data.
 */
export function findAllEvent() {
    return prisma.event.findMany({
        include: {
            area: true,
            tagsJoin: {
                include: {
                    tag: true,
                },
            },
            artists: {
                include: {
                    artist: true,
                },
            },
        },
        orderBy: {
            datestart: "asc",
        },
    });
}

export async function findOneEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            area: true,
            tagsJoin: {
                include: {
                    tag: true,
                },
            },
            artists: {
                include: {
                    artist: true,
                },
            },
        },
    });

    if (!event) {
        throw throwError(404, "Événement introuvable");
    }

    return event;
}

/**
 * Validates potential scheduling conflicts for an event based on area and artist availability.
 *
 * Checks if there is already an event scheduled in the specified area (`areaId`) that overlaps
 * with the given start and end times. Also checks if any of the specified artists are already
 * scheduled for another event during the same time slot.
 *
 * Throws an error if a conflict is detected:
 * - If another event exists in the same area at the same time.
 * - If any artist is already booked for another event at the same time.
 *
 * @param params - The parameters for conflict validation.
 * @param params.areaId - The ID of the area (scene) to check for event conflicts. Optional.
 * @param params.artists - Array of artist IDs to check for scheduling conflicts.
 * @param params.start - The start date and time of the event.
 * @param params.end - The end date and time of the event.
 * @throws {Error} If an event or artist conflict is detected.
 */
async function validateEventConflicts({
    areaId,
    artists,
    start,
    end,
}: {
    areaId?: string | null;
    artists: string[];
    start: Date;
    end: Date;
}) {
    if (areaId) {
        const conflictEvents = await prisma.event.findFirst({
            where: {
                areaId,
                datestart: { lte: end },
                dateend: { gte: start },
            },
        });

        if (conflictEvents) {
            throw throwError(400, "Un autre événement existe déjà sur cette scène aux mêmes horaires.");
        }
    }

    if (artists.length > 0) {
        const conflictArtist = await prisma.eventArtist.findFirst({
            where: {
                artistId: { in: artists },
                event: {
                    datestart: { lte: end },
                    dateend: { gte: start },
                },
            },
        });

        if (conflictArtist) {
            throw throwError(400, "Un artiste est déjà prévu sur une autre scène à ce créneau.");
        }
    }
}

/**
 * Inserts a new event into the database.
 *
 * @param params - The parameters for creating the event.
 * @param params.name - The name of the event.
 * @param params.description - The description of the event (optional).
 * @param params.datestart - The start date of the event.
 * @param params.dateend - The end date of the event.
 * @param params.capacity - The maximum capacity of the event (optional).
 * @param params.status - The status of the event.
 * @param params.areaId - The ID of the area associated with the event (optional).
 * @returns A promise that resolves to the created event.
 */
async function insertEvent({
    name,
    description,
    datestart,
    dateend,
    capacity,
    status,
    areaId,
    imgurl
}: {
    name: string;
    description?: string | null;
    datestart: Date;
    dateend: Date;
    capacity?: number | null;
    status: EventStatus;
    areaId?: string | null;
    imgurl?: string | null;
}) {
    return prisma.event.create({
        data: {
            name,
            description,
            datestart,
            dateend,
            capacity: capacity ?? null,
            status,
            areaId: areaId ?? null,
            imgurl
        },
    });
}

/**
 * Creates a new event with the provided data.
 *
 * This function performs the following steps:
 * 1. Parses the start and end dates.
 * 2. Validates event conflicts for the specified area and artists.
 * 3. Inserts the event into the database.
 * 4. Attaches artists and tags to the newly created event.
 *
 * @param data - The event data conforming to `CreateEventApiSchemaType`.
 * @returns The created event object.
 * @throws Will throw an error if event conflicts are detected or if insertion fails.
 */
export async function createEvent(data: CreateEventApiSchemaType) {
    const { name, description, datestart, dateend, capacity, status, artists, tagsJoin, areaId, imgurl } = data;

    const start = new Date(datestart);
    const end = new Date(dateend);

    await validateEventConflicts({ areaId, artists, start, end });

    const event = await insertEvent({
        name,
        description,
        datestart: start,
        dateend: end,
        capacity,
        status,
        areaId,
        imgurl
    });

    await attachArtistsToEvent(event.id, artists);

    await attachTagsToEvent(event.id, tagsJoin ?? []);

    return event;
}

/**
 * Validates potential scheduling conflicts when updating an event.
 *
 * Checks for overlapping events in the same area and for artists scheduled in other events
 * during the specified time range. Throws an error if a conflict is detected.
 *
 * @param params - The parameters for conflict validation.
 * @param params.eventId - The ID of the event being updated.
 * @param params.areaId - The ID of the area (scene) where the event takes place (optional).
 * @param params.artists - Array of artist IDs participating in the event.
 * @param params.start - The start date and time of the event.
 * @param params.end - The end date and time of the event.
 * @throws {Error} If another event exists in the same area at the same time, or if an artist is scheduled elsewhere during the specified time.
 */
async function validateEventConflictsOnUpdate({
    eventId,
    areaId,
    artists,
    start,
    end,
}: {
    eventId: string;
    areaId?: string | null;
    artists: string[];
    start: Date;
    end: Date;
}) {
    if (areaId) {
        const conflictEvents = await prisma.event.findFirst({
            where: {
                id: { not: eventId },
                areaId,
                datestart: { lte: end },
                dateend: { gte: start },
            },
        });

        if (conflictEvents) {
            throw new Error("Un autre événement existe déjà sur cette scène aux mêmes horaires.");
        }
    }

    if (artists.length > 0) {
        const conflictArtist = await prisma.eventArtist.findFirst({
            where: {
                eventId: { not: eventId },
                artistId: { in: artists },
                event: {
                    datestart: { lte: end },
                    dateend: { gte: start },
                },
            },
        });

        if (conflictArtist) {
            throw new Error("Un artiste est déjà prévu sur une autre scène à ce créneau.");
        }
    }
}

/**
 * Updates an existing event in the database with the provided data.
 *
 * @param params - The event data to update.
 * @param params.id - The unique identifier of the event.
 * @param params.name - The name of the event.
 * @param params.description - The description of the event (optional).
 * @param params.datestart - The start date of the event.
 * @param params.dateend - The end date of the event.
 * @param params.capacity - The maximum capacity of the event (optional).
 * @param params.status - The status of the event.
 * @param params.areaId - The identifier of the area associated with the event (optional).
 * @returns A promise that resolves to the updated event object.
 */
async function updateEventData({
    id,
    name,
    description,
    datestart,
    dateend,
    capacity,
    status,
    areaId,
}: {
    id: string;
    name: string;
    description?: string | null;
    datestart: Date;
    dateend: Date;
    capacity?: number | null;
    status: EventStatus;
    areaId?: string | null;
}) {
    return prisma.event.update({
        where: { id },
        data: {
            name,
            description,
            datestart,
            dateend,
            capacity: capacity ?? null,
            status,
            areaId: areaId ?? null,
            modified_at: new Date(),
        },
    });
}

/**
 * Updates an existing event with the provided data.
 *
 * This function performs the following steps:
 * 1. Extracts event details from the input data.
 * 2. Converts date strings to `Date` objects.
 * 3. Checks if the event exists; throws an error if not found.
 * 4. Validates for scheduling conflicts in the specified area and with the given artists.
 * 5. Updates the event data in the database.
 * 6. Replaces the associated artists and tags for the event.
 *
 * @param data - The merged event data to update, including event details, artists, tags, and area.
 * @returns The updated event object.
 * @throws {Error} If the event is not found or if there are scheduling conflicts.
 */
export async function updateEvent(data: MergedEventPutSchemaType) {
    const { id, name, description, datestart, dateend, capacity, status, artists, tagsJoin, areaId } = data;

    const start = new Date(datestart);
    const end = new Date(dateend);

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
        throw new Error("Événement introuvable");
    }

    await validateEventConflictsOnUpdate({ eventId: id, areaId, artists, start, end });

    const event = await updateEventData({
        id,
        name,
        description,
        datestart: start,
        dateend: end,
        capacity,
        status,
        areaId,
    });

    await replaceArtistsForEvent(event.id, artists);
    await replaceTagsForEvent(event.id, tagsJoin ?? []);

    return event;
}

/**
 * Deletes an event by its unique identifier.
 *
 * @param eventId - The unique identifier of the event to delete.
 * @returns An object indicating the success of the operation.
 * @throws {Error} If the event with the given ID does not exist.
 */
export async function deleteEvent(eventId: string) {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
        throw new Error("Événement introuvable");
    }

    await prisma.event.delete({ where: { id: eventId } });

    return { success: true };
}
