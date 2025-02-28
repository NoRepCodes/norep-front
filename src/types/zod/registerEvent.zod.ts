import { Path } from "react-hook-form";
import { EvnFields } from "../event";

type TField = {
  label: string;
  ph?: string;
  multiline?: boolean;
  name: Path<EvnFields>;
  mode?: "text" | "date" | "checkbox";
  required?: boolean;
};
export const registerEventFields: TField[] = [
  {
    label: "Info del Evento",
    ph: "Fitgames",
    name: "name",
  },
  {
    label: "Ubicacion",
    ph: "Avenida...",
    name: "place",
    required: false,
  },
  {
    label: "Cuotas",
    ph: "0",
    name: "dues",
  },
  {
    label: "Fecha de Inicio",
    ph: "01/01/2024",
    name: "since",
    mode: "date",
  },
  {
    label: "Fecha de Cierre",
    ph: "01/01/2025",
    name: "until",
    mode: "date",
  },
  {
    label: "Fecha de Inicio Inscripcion",
    ph: "01/01/2025",
    name: "register_time.since",
    mode: "date",
  },
  {
    label: "Fecha de Cierre Inscripcion",
    ph: "01/01/2025",
    name: "register_time.until",
    mode: "date",
  },
  {
    label: "Detalles de pago",
    ph: "Detalles...",
    name: "details",
    multiline: true,
  },
  // {
  //   label: "Evento Accesible",
  //   name: "accesible",
  //   mode: "checkbox",
  // },
  // {
  //   label: "Equipos Manuales",
  //   name: "manual_teams",
  //   mode: "checkbox",
  // },
];

type TInsideC = {
  label: string;
  ph: string;
  name: Path<EvnFields>;
  mode?: "text" | "date" | "checkbox";
}[];
export const categFields = (i: number): TInsideC => {
  const pre: `categories.${number}` = `categories.${i}`;
  return [
    {
      label: "Nombre",
      ph: "Ej:Avanzado FEMENINO",
      name: `${pre}.name`,
      mode: "text",
    },
    {
      label: "Precio Inscripción ($)",
      ph: "0",
      name: `${pre}.price`,
      mode: "text",
    },
  ];
};
export const categFields2 = (i: number): TInsideC => {
  const pre: `categories.${number}` = `categories.${i}`;
  return [
    {
      label: "Edad minima",
      ph: "0",
      name: `${pre}.filter.age_min`,
    },
    {
      label: "Edad maxima",
      ph: "0",
      name: `${pre}.filter.age_max`,
    },
    {
      label: "Integrantes femeninos por equipos",
      ph: "0",
      name: `${pre}.filter.female`,
    },
    {
      label: "Integrantes masculinos por equipos",
      ph: "0",
      name: `${pre}.filter.male`,
    },
    {
      label: "Liimite de integrantes por equipos",
      ph: "0",
      name: `${pre}.filter.amount`,
    },
    {
      label: "Limite de equipos",
      ph: "0",
      name: `${pre}.filter.limit`,
    },
  ];
};
