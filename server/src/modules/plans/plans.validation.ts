import z from "zod";

export const GetPlans = z.object({
  query: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    search: z.string().optional().default(""),
    sort: z.string().optional().default("asc"),
    sort_by: z.string().optional().default("name"),
  }),
});
