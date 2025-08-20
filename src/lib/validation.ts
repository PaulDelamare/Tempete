// lib/validation.ts
import { ZodSchema } from "zod";
import { ApiError } from "./errors";

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
     const parsed = schema.safeParse(body);

     if (!parsed.success) {
          console.error("Validation error:", parsed.error);
          throw new ApiError(400, "Validation échouée", parsed.error);
     }
     return parsed.data;
}
