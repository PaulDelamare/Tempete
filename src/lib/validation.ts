import { ZodType } from "zod";
import { ApiError, throwError } from "./errors";

export function validateBody<T>(schema: ZodType<T>, body: unknown): T {
     const parsed = schema.safeParse(body);

     if (!parsed.success) {
          const formatted = parsed.error.issues.map(err => ({
               path: err.path.join("."),
               message: err.message
          }));

          console.warn("Validation error:", formatted);

          throwError(400, "Validation échouée", formatted);
     }
     return parsed.data as T;
}
