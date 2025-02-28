import {
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormWatch,
} from "react-hook-form";
import { MsgT } from "../../helpers/UserContext";
import { CategFields, cleanWod, WodFields } from "../../types/event";
import {
  newWod,
  wFields,
  wodFields,
  wSchema,
} from "../../types/zod/registerWod.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWods } from "../../api/api_event";
import Dropdown from "../Dropdown";
import Input, {
  BtnPrimary,
  BtnSecondary,
  InputSelect,
  Line,
  Subtitle,
} from "../Input";
import { useState } from "react";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { Ionicons } from "../Icons";

const EvnWods = ({
  wods,
  setMsg,
  categories,
  setWods,
}: {
  wods: WodFields[];
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
  categories: CategFields[];
  setWods: React.Dispatch<React.SetStateAction<WodFields[] | undefined>>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onPress = () => setIsOpen(!isOpen);
  const [loading, setLoading] = useState(false);
  const [toDelete, setToDelete] = useState<string[]>([]);
  const [categ, setCateg] = useState<CategFields>(categories[0]);
  const ocCateg = (t: any) => {
    setCateg(categories.find((c) => c.name === t) ?? categories[0]);
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<wFields>({
    resolver: zodResolver(wSchema),
    defaultValues: { wods },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "wods",
  });

  const plusWod = () => append({ ...newWod(), category_id: categ._id });

  const uploadWods = async ({ wods: wodsData }: wFields) => {
    const c_id: string[] = [];
    categories.forEach((c) => (c._id ? c_id.push(c._id) : null));
    const copyWods = [...wodsData];
    copyWods.forEach((w, i) => {
      cleanWod(w, i);
    });
    setLoading(true);
    const { status, data } = await updateWods(copyWods, toDelete, c_id);
    setLoading(false);
    if (status === 200) {
      setWods(data);
      setMsg({
        type: "success",
        text: "Wods Actualizados con éxito!",
        onClose: () => {
          setIsOpen(false);
          setValue("wods", data);
        },
      });
    } else {
      setMsg({
        type: "error",
        text: data.msg,
      });
    }
  };
  return (
    <Dropdown title="WODS" {...{ onPress, isOpen }}>
      <div style={{ maxWidth: 320 }}>
        <InputSelect
          value={categ.name}
          onChange={ocCateg}
          options={categories.map((c) => c.name)}
          label="Categoria"
        />
      </div>
      <Line />
      {fields.map(({ id }, index) => {
        const isCateg = watch(`wods.${index}.category_id`);
        if (isCateg === categ._id)
          return (
            <Wod
              {...{
                watch,
                control,
                errors,
                index,
                remove,
                setToDelete,
              }}
              key={id}
            />
          );
      })}
      <div style={{ maxWidth: 320, minWidth: 200 }}>
        <BtnSecondary
          onPress={plusWod}
          text="Añadir Wod"
          bg="#181818"
          color="#fff"
        />
      </div>
      <Line />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <ViewFadeStatic style={{ width: 180 }}>
          <BtnSecondary
            bg="#fff"
            color="#181818"
            onPress={() => setValue("wods", wods)}
            text="Cancelar"
          />
        </ViewFadeStatic>
        <ViewFadeStatic style={{ width: 180 }}>
          <BtnPrimary
            loading={loading}
            onPress={handleSubmit(uploadWods)}
            text="Confirmar"
          />
        </ViewFadeStatic>
      </div>
    </Dropdown>
  );
};

const Wod = ({
  errors,
  control,
  index,
  remove,
  watch,
  setToDelete,
}: {
  errors: FieldErrors<wFields>;
  control: Control<wFields>;
  watch: UseFormWatch<wFields>;
  index: number;
  remove: (i: number | number[]) => void;
  setToDelete: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const name = watch(`wods.${index}.name`);
  const btnDel = () => {
    const isId = watch(`wods.${index}._id`);
    if (isId) {
      setToDelete((prev) => [...prev, isId]);
    }
    remove(index);
  };
  return (
    <ViewFadeStatic
      style={{ display: "flex", gap: 12, flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
          marginBottom: 6,
          width: 280,
        }}
      >
        <Subtitle text={name.length > 0 ? name : `Wod ${index + 1}`} />
        <button onClick={btnDel} style={{ width: 24 }}>
          <Ionicons name="close" size={24} color="black" />
        </button>
      </div>
      <div className="inputs_ctn">
        {wodFields(index).map((itm, i) => (
          <ViewFadeStatic key={i}>
            <Input {...{ control, errors }} {...itm} />
          </ViewFadeStatic>
        ))}
        {watch(`wods.${index}.wod_type`) === "FORTIME" ||
        watch(`wods.${index}.wod_type`) === "NADO" ? (
          <ViewFadeStatic key={10}>
            <Input
              {...{ control, errors }}
              label="Repeticiones Limite"
              ph="0"
              name={`wods.${index}.amount_cap`}
            />
          </ViewFadeStatic>
        ) : null}
        {watch(`wods.${index}.wod_type`) === "RM" ? (
          <ViewFadeStatic key={11}>
            <Input
              {...{ control, errors }}
              label="Tipo de Cantidad"
              ph="Ej: Lbs"
              name={`wods.${index}.amount_type`}
              mode="select"
              options={["Lbs", "Reps"]}
            />
          </ViewFadeStatic>
        ) : null}
      </div>
    </ViewFadeStatic>
  );
};

export default EvnWods;
