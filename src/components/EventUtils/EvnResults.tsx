import { useEffect, useState } from "react";
import { MsgT } from "../../helpers/UserContext";
import { CategFields, WodFields } from "../../types/event";
import Dropdown from "../Dropdown";
import Input, {
  BtnPrimary,
  BtnSecondary,
  InputBase,
  InputSelect,
  Line,
  Subtitle,
} from "../Input";
import { Ionicons } from "../Icons";
import { ViewFadeStatic } from "../AnimatedLayouts";
import {
  getDefaultResults,
  rFields,
  rSchema,
} from "../../types/zod/registerResult.zod";
import { updateResults } from "../../api/api_event";
import { Control, FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useScreen from "../../hooks/useSize";

const EvnResults = ({
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

  const [categ, setCateg] = useState<CategFields>(categories[0]);

  const ogWod = () => wods.filter((w) => w.category_id === categ._id)[0];

  const [wodSelect, setWodSelect] = useState<WodFields | undefined>(ogWod());

  const ocCateg = (t: any) => {
    setCateg(categories.find((c) => c.name === t) ?? categories[0]);
  };

  const closeWindow = () => setIsOpen(false);

  useEffect(() => {
    setWodSelect(ogWod());
  }, [wods, categ]);

  const { ww } = useScreen();

  return (
    <Dropdown title="RESULTADOS" {...{ isOpen, onPress }}>
      <div style={{ width: "100%", maxWidth: ww < 800 ? 360 : 280 }}>
        <InputSelect
          value={categ.name}
          onChange={ocCateg}
          options={categories.map((c) => c.name)}
          label="Categoria"
        />
      </div>
      {!wodSelect ? (
        <NoWodInfo />
      ) : (
        <>
          <WodResults
            {...{
              ogWod,
              setWodSelect,
              wods,
              wodSelect,
              categ,
              setMsg,
              setWods,
              closeWindow,
              categories: categories.map((c) => c._id ?? ""),
            }}
          />
        </>
      )}
    </Dropdown>
  );
};

export default EvnResults;

const NoWodInfo = () => {
  return (
    <div
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: "#F1FF48",
      }}
    >
      <Ionicons name="information-circle" size={20} />
      <p style={{ flex: 1 }}>
        Registre un wod para poder acceder a la ventana de resultados.
      </p>
    </div>
  );
};

const WodResults = ({
  ogWod,
  wods,
  wodSelect,
  categ,
  setWodSelect,
  setWods,
  setMsg,
  categories,
}: // closeWindow,
{
  ogWod: () => WodFields;
  wods: WodFields[];
  wodSelect: WodFields;
  categ: CategFields;
  setWodSelect: React.Dispatch<React.SetStateAction<WodFields | undefined>>;
  setWods: React.Dispatch<React.SetStateAction<WodFields[] | undefined>>;
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
  categories: string[];
  closeWindow: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const oc = (e: any) => setSearchBar(e.target.value);

  const getTeamName = (team_id: string) => {
    return categ.teams.find((ct) => ct._id === team_id)?.name ?? "Error";
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<rFields>({
    resolver: zodResolver(rSchema),
    defaultValues: { results: getDefaultResults(wodSelect, categ) },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "results",
  });
  useEffect(() => {
    replace(getDefaultResults(wodSelect, categ));
  }, [wodSelect, categ]);

  const confirm = async ({ results }: rFields) => {
    if (wodSelect._id === undefined)
      return setMsg({ type: "error", text: "El wod...no existe? Error: 404" });
    setLoading(true);
    const { status, data } = await updateResults(
      wodSelect._id,
      results,
      categories
    );
    setLoading(false);
    if (status === 200) {
      setMsg({
        type: "success",
        text: "Resultados Actualizados!",
        onClose: () => {
          setWods(data);
        },
      });
    } else
      setMsg({
        type: "error",
        text: data.msg,
      });
  };

  const wodNames = () => {
    return wods.filter((w) => w.category_id === categ._id).map((w2) => w2.name);
  };
  const ocWod = (t: any) => {
    setWodSelect(() => {
      const aux = wods.find((w) => w.name === t) ?? ogWod();
      replace(getDefaultResults(aux, categ));
      return aux;
    });
  };
  const { ww } = useScreen();
  return (
    <ViewFadeStatic
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: ww < 800 ? 360 : 280 }}>
        <InputSelect
          value={wodSelect.name}
          onChange={ocWod}
          options={wodNames()}
          label="Wod"
        />
      </div>
      <div style={{ width: "100%", maxWidth: ww < 800 ? 360 : 280 }}>
        <InputBase
          onChange={oc}
          value={searchBar}
          label="Buscar Equipo"
          ph="Ej: Team King"
        />
      </div>
      <WodtypeSubtitle text={wodSelect.wod_type} />
      {/** */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {fields.map(({ id, team_id }, index) => {
          if (searchBar && searchBar.length > 0) {
            let regex = new RegExp(searchBar, "i");
            if (regex.test(getTeamName(team_id)))
              return (
                <ViewFadeStatic
                  style={{ gap: 12, display: "flex", flexDirection: "column" }}
                  key={id}
                >
                  <Subtitle text={getTeamName(team_id)} />
                  {wodSelect.wod_type === "CIRCUITO" ? (
                    <CIRCUIT_Fields
                      {...{ wodSelect, control, errors, index }}
                    />
                  ) : (
                    <OTHER_Fields {...{ wodSelect, control, errors, index }} />
                  )}
                </ViewFadeStatic>
              );
            else return null;
          } else
            return (
              <ViewFadeStatic
                style={{ gap: 12, display: "flex", flexDirection: "column" }}
                key={id}
              >
                <Subtitle text={getTeamName(team_id)} />
                {wodSelect.wod_type === "CIRCUITO" ? (
                  <CIRCUIT_Fields {...{ wodSelect, control, errors, index }} />
                ) : (
                  <CIRCUIT_Fields {...{ wodSelect, control, errors, index }} />
                  // <OTHER_Fields {...{ wodSelect, control, errors, index }} />
                )}
              </ViewFadeStatic>
            );
        })}
      </div>
      <div style={{ height: 24 }} />
      <Line />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          width: "100%",
        }}
      >
        <ViewFadeStatic style={{ width: 180 }}>
          <BtnSecondary
            bg="#fff"
            color="#181818"
            onPress={() => reset()}
            text="Cancelar"
          />
        </ViewFadeStatic>
        <ViewFadeStatic style={{ width: 180 }}>
          <BtnPrimary
            loading={loading}
            onPress={handleSubmit(confirm)}
            text="Confirmar"
          />
        </ViewFadeStatic>
      </div>
    </ViewFadeStatic>
  );
};

const WodtypeSubtitle = ({ text = "" }) => {
  return (
    <div
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        display: "flex",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        <Line />
      </div>
      <div style={{ width: 80, display: "flex", justifyContent: "flex-end" }}>
        <Subtitle text={text} />
      </div>
    </div>
  );
};

const OTHER_Fields = ({
  wodSelect,
  errors,
  control,
  index,
}: {
  wodSelect: WodFields;
  control: Control<rFields>;
  errors: FieldErrors<rFields>;
  index: number;
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ width: 140 }}>
        <Input
          {...{ errors, control }}
          name={`results.${index}.amount`}
          label={wodSelect.amount_type}
        />
      </div>
      {wodSelect.wod_type === "NADO" || wodSelect.wod_type === "FORTIME" ? (
        <div style={{ width: 140 }}>
          <Input
            {...{ errors, control }}
            name={`results.${index}.time`}
            label="Tiempo"
            mode="time"
          />
        </div>
      ) : null}
      <div style={{ width: 140 }}>
        <Input
          {...{ errors, control }}
          name={`results.${index}.tiebrake`}
          label="Tiebrake"
          mode="time"
        />
      </div>
    </div>
  );
};

const CIRCUIT_Fields = ({
  control,
  errors,
  // wodSelect,
  index,
}: {
  wodSelect: WodFields;
  control: Control<rFields>;
  errors: FieldErrors<rFields>;
  index: number;
}) => {
  const { ww } = useScreen();
  return (
    <div style={{ gap: 12, display: "flex",flexDirection:ww<800?"column":'row' }} >
      <div
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          gap: 12,
          display: "flex",
        }}
      >
        <Input
          width={ww < 800 ? "45%" : 140}
          {...{ errors, control }}
          name={`results.${index}.amount`}
          label="Puntos"
        />
        <Input
          width={ww < 800 ? "45%" : 140}
          {...{ errors, control }}
          name={`results.${index}.penalty`}
          label="Penalty"
        />
      </div>
      <div
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          gap: 12,
          display: "flex",
        }}
      >
        <Input
          {...{ errors, control }}
          width={ww < 800 ? "45%" : 140}
          name={`results.${index}.time`}
          label="Tiempo"
          mode="time"
        />

        <Input
          {...{ errors, control }}
          width={ww < 800 ? "45%" : 140}
          name={`results.${index}.tiebrake`}
          label="Tiebrake"
          mode="time"
        />
      </div>
    </div>
  );
};
