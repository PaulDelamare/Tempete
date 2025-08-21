import z from "zod";

interface RHFError {
     message?: string;
     types?: unknown;
     [key: string]: unknown;
}

export function logRHFErrors(errors: Record<string, unknown>, prefix = "") {
     if (!errors) return;
     for (const key of Object.keys(errors)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const val = errors[key] as RHFError;
          if (val?.message || val?.types) console.error(`${fullKey} →`, val.message ?? val.types ?? val);
          else if (typeof val === "object" && val !== null) logRHFErrors(val as Record<string, unknown>, fullKey);
          else console.error(fullKey, val);
     }
}

export function debugZodParse<T>(schema: z.ZodSchema<T>, values: unknown) {
     const res = schema.safeParse(values);
     if (!res.success) {
          console.error("🔍 Zod errors (raw):", res.error);
          const details = res.error.issues.map(e => ({
               path: e.path.join(".") || "<root>",
               message: e.message,
               code: e.code,
          }));
          console.table(details);
     }
}
