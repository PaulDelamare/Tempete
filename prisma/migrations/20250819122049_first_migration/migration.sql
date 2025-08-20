-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('draft', 'published', 'cancelled', 'soldout', 'hidden');

-- CreateEnum
CREATE TYPE "public"."AreaType" AS ENUM ('stage', 'food', 'merch', 'chill', 'service', 'info', 'medical');

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imgurl" TEXT,
    "description" TEXT,
    "datestart" TIMESTAMP(3) NOT NULL,
    "dateend" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'draft',
    "areaId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "links" JSONB,
    "bio" TEXT,
    "imgurl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imgurl" TEXT,
    "description" TEXT,
    "type" "public"."AreaType" NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "capacity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imgurl" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imgurl" TEXT,
    "website_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "firstname" TEXT,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventTag" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "EventTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArtistTag" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ArtistTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventArtist" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "EventArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MailAlert" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_datestart_idx" ON "public"."Event"("datestart");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "public"."Event"("status");

-- CreateIndex
CREATE INDEX "Event_areaId_idx" ON "public"."Event"("areaId");

-- CreateIndex
CREATE INDEX "Area_type_idx" ON "public"."Area"("type");

-- CreateIndex
CREATE INDEX "Product_areaId_idx" ON "public"."Product"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "EventTag_eventId_idx" ON "public"."EventTag"("eventId");

-- CreateIndex
CREATE INDEX "EventTag_tagId_idx" ON "public"."EventTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTag_eventId_tagId_key" ON "public"."EventTag"("eventId", "tagId");

-- CreateIndex
CREATE INDEX "ArtistTag_artistId_idx" ON "public"."ArtistTag"("artistId");

-- CreateIndex
CREATE INDEX "ArtistTag_tagId_idx" ON "public"."ArtistTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistTag_artistId_tagId_key" ON "public"."ArtistTag"("artistId", "tagId");

-- CreateIndex
CREATE INDEX "EventArtist_eventId_idx" ON "public"."EventArtist"("eventId");

-- CreateIndex
CREATE INDEX "EventArtist_artistId_idx" ON "public"."EventArtist"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "EventArtist_eventId_artistId_key" ON "public"."EventArtist"("eventId", "artistId");

-- CreateIndex
CREATE INDEX "MailAlert_eventId_email_idx" ON "public"."MailAlert"("eventId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "MailAlert_eventId_email_key" ON "public"."MailAlert"("eventId", "email");

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTag" ADD CONSTRAINT "EventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventTag" ADD CONSTRAINT "EventTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTag" ADD CONSTRAINT "ArtistTag_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArtistTag" ADD CONSTRAINT "ArtistTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventArtist" ADD CONSTRAINT "EventArtist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventArtist" ADD CONSTRAINT "EventArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MailAlert" ADD CONSTRAINT "MailAlert_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
