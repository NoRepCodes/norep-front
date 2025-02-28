import { z } from "zod";

export const ticketSchema = z.object({
  event: z.string(),
  category: z.string(),
  // category_id:z.string(),
  users: z.array(
    z.object({
      card_id: z.coerce
        .string()
        .regex(/^[0-9]*$/)
        .max(9),
    })
  ),
  phone: z.string(),
  name: z.string(),
  dues: z.array(
    z.object({
      secure_url: z.string(),
      public_id: z.string().optional(),
      transf: z.string().min(1),
      payDues: z.coerce.number().min(1),
    })
  ),
  duesLimit: z.number(),
});

export type TicketFields = z.infer<typeof ticketSchema>;

export const pushDueSchema = z.object({
  captain_id: z.string(),
  transf: z.string().min(1),
  payDues: z.coerce.number().min(1),
  image: z.string(),
});
export type PushDueFields = z.infer<typeof pushDueSchema>;
