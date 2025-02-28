
import { z } from "./zod";

export type ImgT = {
  secure_url: string;
  public_id: string;
};

// type KeyByString = { [key: string]: any };

const img = z.object({
  secure_url: z.string().optional(),
  public_id: z.string().optional(),
});

const numOrUndef = z.coerce.number().or(z.undefined());

const TeamSchema = z.object({
  _id: z.string(),
  users: z.array(z.string()).optional(),
  name: z.string().optional(),
});
// users: z.array(z.string()).or(z.object({name:z.string(),_id:z.string(),card_id:z.string()})).optional(),
export type TeamFields = z.infer<typeof TeamSchema>;

export const CategSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2).default(""),
  price: z.coerce.number(),
  updating: z.boolean().default(false),
  slots: z.number().default(0),
  filter: z
    .object({
      age_min: numOrUndef,
      age_max: numOrUndef,
      male: numOrUndef,
      female: numOrUndef,
      amount: numOrUndef,
      limit: numOrUndef,
    })
    .optional(),
  teams: z.array(TeamSchema).default([]),
});

export type CategFields = z.infer<typeof CategSchema>;

export const EvnSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  place: z.string(),
  dues: z.coerce.number().default(0),
  since: z.string().date().default("2025-01-01"),
  until: z.string().date().default("2025-01-01"),
  // until: z.date().default(new Date()),
  register_time: z
    .object({
      since: z.string().date().default("2025-01-01"),
      until: z.string().date().default("2025-01-01"),
    })
    .default({
      since: "2025-01-01",
      until: "2025-01-01",
    }),
  details: z.string().optional(),
  accesible: z.boolean().default(false),
  manual_teams: z.boolean().default(false),
  categories: z.array(CategSchema).default([]),
  secure_url: z.string(),
  public_id: z.string().optional(),
  partners: z.array(img.optional()).default([]).optional(),
});
export type EvnFields = z.infer<typeof EvnSchema>;

export const ResultSchema = z.object({
  _id: z.string().optional(),
  team_id: z.string(),
  users: z.string().array(),
  time: z.coerce.number().default(0),
  tiebrake: z.coerce.number().default(0),
  penalty: z.coerce.number().default(0),
  amount: z.coerce.number().default(0),
});
export type ResultFields = z.infer<typeof ResultSchema>;

export const WodsSchema = z.object({
  _id: z.string().optional(),
  name: z.string().default(""),
  time_cap: z.number().optional(),
  amount_cap: z.coerce.number().optional(),
  amount_type: z.enum(["Lbs", "Reps", "Pts", "Mts"]).default("Lbs"),
  wod_type: z
    .enum(["AMRAP", "FORTIME", "RM", "CIRCUITO", "NADO"])
    .default("AMRAP"),
  category_id: z.string(),
  description: z.string().default(""),
  index: z.number().default(0),
  results: z.array(ResultSchema).default([]),
});
export type WodFields = z.infer<typeof WodsSchema>;

export const cleanWod = (w: WodFields, i: number) => {
  w.index = i;
  switch (w.wod_type) {
    case "AMRAP":
      {
        w.amount_cap = undefined;
        w.amount_type = "Reps";
      }
      break;
    case "FORTIME":
      w.amount_type = "Reps";
      break;
    case "RM":
      w.amount_cap = undefined;
      break;
    case "CIRCUITO":
      w.amount_cap = undefined;
      w.amount_type = "Pts";
      break;
    case "NADO":
      w.amount_type = "Mts";

      break;
    default:
      break;
  }
};

export type TicketT = {
  _id: string;
  event: string;
  category: string;
  category_id: string;
  users: {
    name: string;
    card_id: string;
  }[];
  phone: string;
  name: string;
  duesLimit: number;
  dues: {
    _id: string;
    secure_url: string;
    public_id: string;
    transf: string;
    payDues: number;
  }[];
  createdAt: string;
};
