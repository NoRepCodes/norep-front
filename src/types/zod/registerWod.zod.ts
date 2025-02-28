import { Path } from "react-hook-form";
import { z } from "zod";
import { WodsSchema } from "../event";
import { getDefaults } from "../zod";
export const newWod = () => getDefaults(WodsSchema);
export const wSchema = z.object({
  wods: z.array(WodsSchema),
});
export type wFields = z.infer<typeof wSchema>;

type TInsideW = {
  label: string;
  ph: string;
  name: Path<wFields>;
  mode?: "text" | "select" | "time";
  options?: string[];
  multiline?: boolean;
}[];
export const wodFields = (i: number): TInsideW => {
  const pre: `wods.${number}` = `wods.${i}`;
  return [
    {
      label: "Nombre",
      ph: "Ej: Wod Militar",
      name: `${pre}.name`,
    },
    {
      label: "Descripcion (opcional)",
      ph: "Descripcion del wod...",
      name: `${pre}.description`,
      mode: "text",
      multiline: true,
    },
    {
      label: "Tipo de Wod",
      ph: "Ej: AMRAP",
      name: `${pre}.wod_type`,
      mode: "select",
      options: ["AMRAP", "FORTIME", "RM", "CIRCUITO", "NADO"],
    },
    {
      label: "Tiempo Limite",
      ph: "Ej: Wod Militar",
      name: `${pre}.time_cap`,
      mode: "time",
    },
  ];
};
