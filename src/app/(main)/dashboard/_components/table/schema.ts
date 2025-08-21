import z from "zod";

export const recentLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  type: z.string(),
  created_at: z.string(),
  modified_at: z.string(),
});
