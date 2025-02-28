import { z } from "zod";

export const manualTeamSchema = z.object({
  teams: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z.string().min(2),
      })
    )
    .default([]),
});

export type ManualTeamFields = z.infer<typeof manualTeamSchema>;
