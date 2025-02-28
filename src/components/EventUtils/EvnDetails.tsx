import { useState } from "react";
import { createEvent, deleteEvent, updateEvent } from "../../api/api_event";
import { MsgT } from "../../helpers/UserContext";
import { CategSchema, EvnFields, EvnSchema } from "../../types/event";
import { getDefaults } from "../../types/zod";
import {
  Control,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";
import { IconLoad, Ionicons } from "../Icons";
import Input, {
  BtnPrimary,
  BtnSecondary,
  CheckBox,
  Line,
  Subtitle,
} from "../Input";
import {
  categFields,
  categFields2,
  registerEventFields,
} from "../../types/zod/registerEvent.zod";
import { ViewFadeStatic } from "../AnimatedLayouts";

const newCateg = () => getDefaults(CategSchema);

const EvnDetails = ({
  setMsg,
  event,
  defaultOpen = false,
  setEvent,
}: {
  setEvent?: React.Dispatch<React.SetStateAction<EvnFields | undefined>>;
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
  event: EvnFields;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [deLoading, setDeLoading] = useState(false);
  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EvnFields>({
    resolver: zodResolver(EvnSchema),
    defaultValues: async () => {
      if (!event.manual_teams) {
        const aux = JSON.parse(JSON.stringify(event));
        aux.categories.forEach((c: any) => {
          c.teams.forEach((t: any) => {
            if (t.users) {
              t.users = t.users.map((u: any) => u._id);
            }
          });
        });
        return aux;
      } else return event;
    },
  });

  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const confirm = async (dta: EvnFields) => {
    let edit = event._id;
    setLoading(true);
    const { data, status } = edit
      ? await updateEvent(dta)
      : await createEvent(dta);
    setLoading(false);
    if (status === 200) {
      setMsg({
        type: "success",
        text: edit ? "Evento Actualizado!" : "Evento Creado con éxito!",
        onClose: () => {
          if (setEvent && edit) {
            setEvent(data);
            setIsOpen(false);
          } else navigate(-1);
        },
      });
    } else {
      setMsg({
        type: "error",
        text: data.msg,
      });
    }
  };

  const plusCategory = () => append(newCateg());
  const onPress = () => setIsOpen(!isOpen);
  const cancel = () => {
    reset();
    setIsOpen(false);
  };

  const checkIfAnyTeam = () => {
    let aux = false;
    event.categories.forEach((c) => {
      if (c.teams.length > 0) aux = true;
    });
    return aux;
  };

  const pressDelete = async () => {
    setMsg({
      type: "warning",
      text: "Estas seguro que desea eliminar el evento?",
      onClose: () => setMsg(undefined),
      onConfirm: async () => {
        const text = "Evento eliminado con Exito";
        // setDeLoading(true);
        // const { status, data } = await deleteEvent(
        //   event._id ?? "",
        //   event.public_id ?? ""
        // );
        // setDeLoading(false);
        // if (status === 200)
        if (true)
          setMsg({
            type: "success",
            text,
            onClose: () => navigate(-1),
          });
        // else setMsg({ type: "error", text: data.msg });
      },
    });
  };
  return (
    <Dropdown title="DETALLES" {...{ isOpen, onPress }}>
      <div style={{display:'flex',justifyContent:'space-between'}} >
        <Subtitle text="Info del Evento" fs={20} />
        {!event._id ? null : (
          <button onClick={pressDelete} style={{width:24}} >
            {deLoading ? (
              <IconLoad />
            ) : (
              <Ionicons name="close-circle-outline" size={20} />
            )}
          </button>
        )}
      </div>
      <div className="checks_ctn">
        <Input
          {...{ control, errors, width: 200 }}
          label="Evento Accesible"
          name="accesible"
          mode="checkbox"
        />
        <Input
          {...{ control, errors, width: 200 }}
          label="Equipos Manuales"
          name="manual_teams"
          mode="checkbox"
          isDisabled={checkIfAnyTeam()}
        />
      </div>
      <div className="inputs_ctn">
        {registerEventFields.map((itm, index) => (
          <Input {...{ control, errors, width: "auto" }} {...itm} key={index} />
        ))}
      </div>
      <Line />
      {fields.map(({ id }, index) => {
        return (
          <Category
            {...{ watch, control, errors, index, remove, setValue }}
            key={id}
          />
        );
      })}
      <div className="btn_hover_white">
        <BtnSecondary
          bg="#fff"
          color="##181818"
          text="Añadir Categoría"
          onPress={plusCategory}
        />
      </div>
      {/* <Line />
      <Subtitle text="Extras" fs={20} />
      <Input
        mode="image"
        {...{ control, errors }}
        name="secure_url"
        label="Imagen del Evento"
      /> */}
      <Line />
      <p style={{ color: "red" }}>{errors.root?.message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <ViewFadeStatic style={{ width: 180 }}>
          <BtnSecondary
            bg="#fff"
            color="#181818"
            onPress={cancel}
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
    </Dropdown>
  );
};

export default EvnDetails;

const Category = ({
  errors,
  control,
  index,
  remove,
  watch,
  setValue,
}: {
  errors: FieldErrors<EvnFields>;
  control: Control<EvnFields>;
  watch: UseFormWatch<EvnFields>;
  index: number;
  remove: (i: number | number[]) => void;
  setValue: UseFormSetValue<EvnFields>;
}) => {
  const btnDel = () => remove(index);

  const name = watch(`categories.${index}.name`);
  const t = watch(`categories.${index}.teams`);
  const isDisabled = t && t.length > 0 ? true : false;

  const fillChecks = () => {
    const f = watch(`categories.${index}.filter`);
    const age = f?.age_max || f?.age_min ? true : false;
    const gender = f?.male || f?.female ? true : false;
    const users = f?.amount ? true : false;
    const teams = f?.limit ? true : false;
    return { age, gender, users, teams };
  };

  const [checks, setChecks] = useState(fillChecks);
  const changeAge = () => {
    if (!checks.age) setChecks({ ...checks, age: true });
    else {
      setChecks(() => {
        setValue(`categories.${index}.filter.age_min`, 0);
        setValue(`categories.${index}.filter.age_max`, 0);
        return { ...checks, age: false };
      });
    }
  };
  const changeGender = () => {
    if (!checks.gender) setChecks({ ...checks, gender: true });
    else {
      setChecks(() => {
        setValue(`categories.${index}.filter.male`, 0);
        setValue(`categories.${index}.filter.female`, 0);
        return { ...checks, gender: false };
      });
    }
  };
  const changeUsers = () => {
    if (!checks.users) setChecks({ ...checks, users: true });
    else {
      setChecks(() => {
        setValue(`categories.${index}.filter.amount`, 0);
        return { ...checks, users: false };
      });
    }
  };
  const changeTeams = () => {
    if (!checks.teams) setChecks({ ...checks, teams: true });
    else {
      setChecks(() => {
        setValue(`categories.${index}.filter.limit`, 0);
        return { ...checks, teams: false };
      });
    }
  };
  return (
    <ViewFadeStatic
      style={{
        gap: 12,
        display: "flex",
        flexDirection: "column",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
          marginBottom: 6,
          gap: 12,
          display: "flex",
        }}
      >
        <Subtitle
          fs={20}
          text={name && name.length > 0 ? name : `Categoria ${index + 1}`}
        />
        {!isDisabled ? (
          <div onClick={btnDel}>
            <Ionicons name="close" size={24} color="black" />
          </div>
        ) : null}
      </div>
      {isDisabled ? <CategWarning /> : null}
      <div className="checks_ctn">
        <CheckBox
          label="Edad"
          onChange={changeAge}
          value={checks.age}
          {...{ isDisabled }}
        />
        <CheckBox
          label="Genero"
          onChange={changeGender}
          value={checks.gender}
          {...{ isDisabled }}
        />
        <CheckBox
          label="Integrantes por Equipos"
          onChange={changeUsers}
          value={checks.users}
          {...{ isDisabled }}
        />
        <CheckBox
          label="Limite de equipos"
          onChange={changeTeams}
          value={checks.teams}
          {...{ isDisabled }}
        />
      </div>
      <div className="inputs_ctn">
        {categFields(index).map((itm, i) => (
          <ViewFadeStatic key={i}>
            <Input {...{ control, errors, isDisabled }} {...itm} />
          </ViewFadeStatic>
        ))}
        {checks.age && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[0]}
            />
          </ViewFadeStatic>
        )}
        {checks.age && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[1]}
            />
          </ViewFadeStatic>
        )}
        {checks.gender && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[2]}
            />
          </ViewFadeStatic>
        )}
        {checks.gender && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[3]}
            />
          </ViewFadeStatic>
        )}
        {checks.users && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[4]}
            />
          </ViewFadeStatic>
        )}
        {checks.teams && (
          <ViewFadeStatic>
            <Input
              {...{ control, errors, isDisabled }}
              {...categFields2(index)[5]}
            />
          </ViewFadeStatic>
        )}
      </div>
    </ViewFadeStatic>
  );
};

const CategWarning = () => {
  return (
    <div
      style={{
        flexDirection: "row",
        backgroundColor: "#F1FF48",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        alignItems: "center",
        maxWidth: 320,
        display: "flex",
      }}
    >
      <p style={{ width: "90%" }}>
        Esta categoria no puede ser actualizada porque ya tiene equipos
        inscritos.
      </p>
      <Ionicons name="lock-closed" color="black" size={20} />
    </div>
  );
};
