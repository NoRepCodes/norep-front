import { useContext, useEffect, useState } from "react";
import { CategFields, EvnFields } from "../../types/event";
import Dropdown from "../Dropdown";
import Input, {
  BtnPrimary,
  BtnSecondary,
  InputBase,
  InputSelect,
  Line,
} from "../Input";
import Context from "../../helpers/UserContext";
import {
  ManualTeamFields,
  manualTeamSchema,
} from "../../types/zod/registerManualTeam.zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeams } from "../../api/api_event";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { Btn, Text, View } from "../UI";
import { IconLoad, Ionicons } from "../Icons";
import { getTeamInfo, updateTeamInfo } from "../../api/api_admin";
import { todaySplit } from "../../helpers/date";

const EvnTeams = ({
  categories,
  event,
  forceUpdate,
}: {
  forceUpdate: () => void;
  categories: CategFields[];
  event: EvnFields;
}) => {
  const [team_id, setTeam_id] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const onPress = () => setIsOpen(!isOpen);
  const [categ, setCateg] = useState<CategFields>(categories[0]);
  const ocCateg = (t: any) => {
    setCateg(categories.find((c) => c.name === t) ?? categories[0]);
  };

  useEffect(() => {
    // console.log(categ.teams);
    ocCateg(categ.name);
  }, [event]);
  if (!event._id) return null;

  return (
    <>
      {team_id ? (
        <TeamModal
          {...{ categories, team_id, categ, setTeam_id, forceUpdate }}
        />
      ) : null}
      <Dropdown title="EQUIPOS" {...{ onPress, isOpen }}>
        <InputSelect
          options={categories.map((c) => c.name)}
          onChange={ocCateg}
          value={categ.name}
        />
        <Line />
        {event.manual_teams ? (
          <ManualTeamInputs {...{ categ, setIsOpen, forceUpdate }} />
        ) : (
          <TeamCard {...{ categ, event_id: event._id, setTeam_id }} />
        )}
      </Dropdown>
    </>
  );
};

export default EvnTeams;

const ManualTeamInputs = ({
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
          <Btn
            onPress={() => remove(i)}
            className="flex justify-center pb-2 px-1.5 cursor-pointer"
          >
            <Ionicons name="close-circle-outline" size={24} />
          </Btn>
        </ViewFadeStatic>
      ))}
      {!errors.root?.message ? null : (
        <Text style={{ color: "red" }}>{errors.root.message}</Text>
      )}
      <View style={{ marginTop: "auto" }} />

      {/* <div style={{ maxWidth: 320, minWidth: 200,aligs }}> */}

      <div className="flex flex-col gap-3 w-full justify-between sm:flex-row">
        <div className="max-w-70 min-w-45 self-start">
          <BtnSecondary
            onPress={newTeam}
            text="Añadir Equipo"
            bg="black"
            color="white"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ViewFadeStatic style={{ width: 180 }}>
            <BtnSecondary
              onPress={() => reset()}
              text="Cancelar"
              color="black"
              bg="white"
            />
          </ViewFadeStatic>
          <ViewFadeStatic style={{ width: 180 }}>
            <BtnPrimary
              onPress={handleSubmit(onConfirm)}
              text="Confirmar"
              loading={loading}
            />
          </ViewFadeStatic>
        </div>
      </div>
    </ViewFadeStatic>
  );
};

const TeamCard = ({
  categ,
  setTeam_id,
}: {
  categ: CategFields;
  event_id: string;
  setTeam_id: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  return (
    <div>
      {categ.teams.map((t) => (
        <ViewFadeStatic
          key={t._id}
          onClick={() => setTeam_id(t._id)}
          className="flex border-1 p-4 items-center cursor-pointer"
        >
          <div className="w-full flex gap-3">
            <p className="min-w-[160px]">{t.name}</p>
          </div>
          <Ionicons name="open-outline" size={24} color="black" />
        </ViewFadeStatic>
      ))}
    </div>
  );
};

// <div className="">
//   {categ.teams.map((t, i) => (
//     <div key={t._id} className="flex justify-between px-3" >
//       <p>{t.name}</p>
//       <Ionicons name="open-outline" />
//     </div>
//   ))}
// </div>

const TeamModal = ({
  categories,
  team_id,
  setTeam_id,
  categ: c,
  forceUpdate,
}: {
  categories: CategFields[];
  team_id: string;
  setTeam_id: React.Dispatch<React.SetStateAction<string | undefined>>;
  categ: CategFields;
  forceUpdate: () => void;
}) => {
  const { setMsg } = useContext(Context);

  const [tname, setTname] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [categ, setCateg] = useState<CategFields>(c);
  const ocCateg = (t: any) => {
    setCateg(categories.find((c) => c.name === t) ?? categories[0]);
  };
  const [loading, setLoading] = useState(true);
  const [isLoad, setIsLoad] = useState(false);
  const [team, setTeam] = useState<TeamModalT | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status, data } = await getTeamInfo(team_id);
      setLoading(false);
      if (status === 200) {
        const aux = data.users.map((u: any) => u.card_id);
        setCards(aux);
        setTeam(data);
        setTname(data.name);
      } else {
        //setMsg
      }
    })();
  }, []);
  const changeCard = (t: string, n: number) => {
    const aux = [...cards];
    aux[n] = t;
    setCards(aux);
  };
  const close = (force?: boolean) => {
    setTeam_id(undefined);
    if (force) forceUpdate();
  };
  const Head = () => {
    return (
      <>
        <div
          className="absolute top-0 right-0 p-5 cursor-pointer"
          onClick={() => close()}
        >
          <Ionicons name="close" />
        </div>
        <p className="font-Anton text-xl ">Editar Equipo</p>
      </>
    );
  };
  const confirm = async () => {
    setIsLoad(true);
    const c_id = c._id === categ._id ? undefined : categ._id;
    const t = { name: tname, _id: team_id, users: [] };
    const { status, data } = await updateTeamInfo(t, c_id, cards);
    setIsLoad(false);
    if (status === 200) {
      close(true);
      setMsg({ text: "Equipo actualizado con exito", type: "success" });
    } else {
      setMsg({ text: data.msg, type: "error" });
    }
  };

  return (
    <div className="w-full h-full  absolute top-0 left-0 z-400">
      <div className="bg-black/50 min-h-[100vh] w-full sticky top-0 flex justify-center items-center">
        <div className="w-80 min-h-80 bg-white p-5 rounded-md gap-5 flex flex-col relative">
          <Head />
          {loading ? (
            <div className="self-center mt-10">
              <IconLoad />
            </div>
          ) : (
            <>
              <InputBase
                label="Nombre del equipo"
                value={tname}
                onChange={setTname}
              />
              <InputSelect
                label="Categoria"
                options={categories.map((c) => c.name)}
                onChange={ocCateg}
                value={categ.name}
              />
              <div className=" -my-2">
                <Line />
              </div>
              <p className="font-Roboto font-medium">C.I de Integrantes</p>
              {team?.users.map((u, i) => (
                <TeamModalInput
                  {...{ cards, changeCard, user: u, i }}
                  key={i}
                />
              ))}

              {/** BTNS */}
              <div className="flex gap-3 justify-between">
                <BtnSecondary onPress={close} text="Cancelar" />
                <BtnSecondary
                  onPress={confirm}
                  text="Confirmar"
                  bg="#9747FF"
                  color="#fff"
                  font_weigth={400}
                  loading={isLoad}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

type TeamModalT = {
  _id: string;
  users: Usr[];
  name: string;
};

type Usr = {
  card_id: string;
  name: string;
  phone: string;
  _id: string;
  birth: string;
  genre: string;
};

const TeamModalInput = ({
  cards,
  changeCard,
  user,
  i,
}: {
  cards: string[];
  changeCard: (t: string, i: number) => void;
  user: Usr;
  i: number;
}) => {
  useEffect(() => {
    const st = setTimeout(() => {}, 1000);
    return () => clearTimeout(st);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-end justify-between gap-3">
        <div className="w-full">
          <InputBase
            onChange={(t) => changeCard(t, i)}
            value={cards[i]}
            ph="29456123"
          />
        </div>
      </div>
      {user.card_id === cards[i] ? (
        <div className="flex text-sm text-neutral-900/90 items-center gap-2">
          {user.genre === "Masculino" ? (
            <Ionicons name="male" size={14} />
          ) : (
            <Ionicons name="female" size={14} />
          )}
          <p>{user.name}</p>
          <p>{toAge(user.birth)} Años</p>
        </div>
      ) : null}
    </div>
  );
};

const toAge = (birth: string) => {
  const b = todaySplit(birth);
  const t = todaySplit();
  //year
  let age = parseInt(t[0]) - parseInt(b[0]);
  //month
  if (parseInt(t[1]) < parseInt(b[1])) age += 1;
  else if (parseInt(t[1]) === parseInt(b[1])) {
    //day
    if (parseInt(t[2]) <= parseInt(b[2])) age += 1;
  }
  return age;
};

//{team?.users?.map((u) => (
//                <div
//                  className="flex border-1 py-3 px-4 justify-between items-center cursor-pointer"
//                  // @ts-ignore
//                  key={typeof u === "string" ? u : u._id}
//                >
//                  {/** @ts-ignore */}
//                  <p>{u.name ? u.name : null}</p>
//                  <Ionicons name="pencil-outline" size={16} />
//                </div>
//              ))}
