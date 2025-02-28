import { Path } from "react-hook-form";
import { z } from "zod";

export const editUserSchema = z.object({
  _id: z.string(),
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
  birth: z.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g).default('2001-01-01'),
  genre: z.enum(["Masculino", "Femenino"]),
  location: z.object({
    country: z.string(),
    state: z.string(),
    city: z.string(),
  }),
});

export type UpdateUserFields = z.infer<typeof editUserSchema>;

type TInfo = {
  label: string;
  ph?: string;
  name: Path<UpdateUserFields>;
  mode?: "text" | "date" | "checkbox" | "select";
  required?: boolean;
  options?: string[];
  hidePass?: boolean;
  isDisabled?:boolean,
};

export const userUpdateField: TInfo[] = [
  {
    label: "Nombre y Apellido",
    ph: "Ej: Jane Doe",
    name: "name",
    required: true,
  },
  {
    label: "Cédula",
    ph: "Ej: 22657819",
    name: "card_id",
    required: true,
    isDisabled:true,
  },
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
    label: "Fecha de nacimiento",
    ph: "01/01/2001",
    name: "birth",
    mode: "date",
    required: true,
  },
];
export const userUpdateField2: TInfo[] = [
  {
    label: "Centro de Entrenamiento",
    ph: "Santa Cruz",
    name: "box",
    mode: "text",
    required: true,
  },
  {
    label: "Teléfono",
    ph: "04142568748",
    name: "phone",
    mode: "text",
    required: true,
  },
  {
    label: "Email",
    ph: "ejemplo@gmail.com",
    name: "email",
    required: true,
    isDisabled:true,
  },
  {
    label: "Pais",
    ph: "Venezuela",
    name: "location.country",
    required: true,
  },
  {
    label: "Estado",
    ph: "Zulia",
    name: "location.state",
    required: true,
  },
  {
    label: "Ciudad",
    ph: "Cabimas",
    name: "location.city",
    required: true,
  },
];
