import { useContext, useEffect, useState } from "react";
import { CategFields, EvnFields } from "../../types/event";
import Dropdown from "../Dropdown";
import Input, { BtnSecondary, InputSelect, Line } from "../Input";
import Context from "../../helpers/UserContext";
import { ManualTeamFields, manualTeamSchema } from "../../types/zod/registerManualTeam.zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeams } from "../../api/api_event";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { Btn, Text, View } from "../UI";
import { Ionicons } from "../Icons";

const EvnTeams = ({
  categories,
  event,
  forceUpdate,
}: {
  forceUpdate:()=>void,
  categories: CategFields[];
  event: EvnFields;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onPress = () => setIsOpen(!isOpen);
  const [categ, setCateg] = useState<CategFields>(categories[0]);
  const ocCateg = (t: any) => {
    setCateg(categories.find((c) => c.name === t) ?? categories[0]);
  };

  useEffect(() => {
    ocCateg(categ.name);
  }, [event]);
  if (!event._id) return null;
  return (
    <Dropdown title="EQUIPOS" {...{ onPress, isOpen }}>
      <InputSelect
        options={categories.map((c) => c.name)}
        onChange={ocCateg}
        value={categ.name}
      />
      <Line />
      {event.manual_teams ? (
        <TeamInputs {...{ categ, setIsOpen, forceUpdate }} />
      ) : (
        null
        // <TeamCards {...{ categ, categories, event_id: event._id }} />
      )}
    </Dropdown>
  );
};

export default EvnTeams



const TeamInputs = ({
  categ,
  setIsOpen,
  forceUpdate,
}: {
  forceUpdate: () => void;
  categ: CategFields;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { setMsg } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(true);
  const {
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ManualTeamFields>({
    resolver: zodResolver(manualTeamSchema),
    defaultValues: { teams: categ.teams },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teams",
  });

  //@ts-ignore
  useEffect(() => {
    if (first) return setFirst(false);
    setValue("teams", []);
    setTimeout(() => {
      //@ts-ignore
      setValue("teams", categ.teams);
    }, 200);
  }, [categ]);

  const newTeam = () => append({ name: "" });

  const onConfirm = async (dta: ManualTeamFields) => {
    if (!categ._id) return null;
    const toDelete: string[] = [];
    categ.teams.forEach((team) => {
      const ifExist = dta.teams.find((t) => t._id === team._id);
      if (!ifExist) toDelete.push(team._id);
    });

    setLoading(true);
    const { status, data } = await updateTeams(dta, categ._id);
    setLoading(false);
    if (status === 200) {
      setMsg({
        type: "success",
        text: "Equipos Actualizados!",
        onClose: () => {
          forceUpdate();
          setIsOpen(false);
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
    <ViewFadeStatic className="min-h-[400px] gap-4 flex flex-col">
      {fields.map(({ id }, i) => (
        <ViewFadeStatic className="gap-3 flex flex-row" key={id}>
          <View className="flex flex-row w-[90%] ">
            <Input
              {...{ control, errors }}
              name={`teams.${i}.name`}
              label={i === 0 ? "Nombre del equipo" : undefined}
              ph="Ej:Team Exodus"
            />
          </View>
          <Btn onPress={() => remove(i)} className="flex justify-center pb-2 px-1.5 cursor-pointer">
            <Ionicons name="close-circle-outline" size={24} />
          </Btn>
        </ViewFadeStatic>
      ))}
      {!errors.root?.message ? null : (
        <Text style={{ color: "red" }}>{errors.root.message}</Text>
      )}
      <View style={{ marginTop: "auto" }} />
      <BtnSecondary
        onPress={newTeam}
        text="Añadir Equipo"
        bg="black"
        color="white"
      />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <BtnSecondary
          onPress={() => reset()}
          text="Cancelar"
          color="black"
          bg="white"
        />
        <BtnSecondary
          onPress={handleSubmit(onConfirm)}
          text="Confirmar"
          loading={loading}
        />
      </View>
    </ViewFadeStatic>
  );
};