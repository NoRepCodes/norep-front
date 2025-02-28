import { Path } from "react-hook-form";
import { z } from "zod";

export const registerSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3),
  box: z.string().min(1),
  phone: z
    .string()
    .regex(/^[0-9+-]*$/)
    .max(18),
  shirt: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  email: z.coerce.string().email(),
  card_id: z.coerce
    .string()
    .regex(/^[0-9]*$/)
    .max(9),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  birth: z
    .string()
    .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g)
    .default("2001-01-01"),
  genre: z.enum(["Masculino", "Femenino"]),
  location: z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
  }),
});

type TInfo = {
  label: string;
  ph?: string;
  name: Path<RegisterFields>;
  mode?: "text" | "date" | "checkbox" | "select";
  required?: boolean;
  options?: string[];
  hidePass?: boolean;
};

export const registerField: TInfo[] = [
  {
    label: "Nombre y Apellido",
    ph: "Ej: John Doe",
    name: "name",
    mode: "text",
    required: true,
  },
  {
    label: "Cédula",
    ph: "Ej: 22657819",
    name: "card_id",
    mode: "text",
    required: true,
  },
  {
    label: "Email",
    ph: "Ej: ejemplo@gmail.com",
    name: "email",
    mode: "text",
    required: true,
  },
  {
    label: "Contraseña",
    ph: "********",
    name: "password",
    mode: "text",
    required: true,
    hidePass: true,
  },
  {
    label: "Confirmar Contraseña",
    ph: "********",
    name: "confirmPassword",
    mode: "text",
    required: true,
    hidePass: true,
  },
  {
    label: "Fecha de nacimiento",
    ph: "01/01/2001",
    name: "birth",
    mode: "date",
    required: true,
  },
];
export const registerField2: TInfo[] = [
  {
    label: "Género",
    ph: "Seleccionar Género",
    name: "genre",
    mode: "select",
    required: true,
    options: ["Masculino", "Femenino"],
  },
  {
    label: "Talla Franela",
    ph: "Seleccionar Talla",
    name: "shirt",
    mode: "select",
    required: true,
    options: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    label: "Pais",
    ph: "Ej: Venezuela",
    name: "location.country",
    mode: "text",
    required: true,
  },
  {
    label: "Estado",
    ph: "Ej: Zulia",
    name: "location.state",
    mode: "text",
    required: true,
  },
  {
    label: "Ciudad",
    ph: "Ej: Cabimas",
    name: "location.city",
    mode: "text",
    required: true,
  },
  {
    label: "Teléfono",
    ph: "Ej: 04142568748",
    name: "phone",
    mode: "text",
    required: true,
  },
  {
    label: "Centro de Entrenamiento",
    ph: "Ej: Santa Cruz",
    name: "box",
    mode: "text",
    required: true,
  },
];

export type RegisterFields = z.infer<typeof registerSchema>;
