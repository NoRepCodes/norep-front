import { useContext, useEffect, useState } from "react";
import { EvnFields } from "../../types/event";
import Context from "../../helpers/UserContext";
import { useFieldArray, useForm } from "react-hook-form";
import { TicketFields, ticketSchema } from "../../types/zod/registerTicket.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkUsers, registerTicket } from "../../api/api_user";
import { ViewFadeStatic } from "../../components/AnimatedLayouts";
import { v, View } from "../../components/UI";
import { InfoBanner } from "./InscriptionDetails";
import { InfoLabel } from "../../components/Info";
import Input, { BtnSecondary } from "../../components/Input";

const InscriptionTeam = ({
  event,
  setPage,
  setEvent,
}: {
  event: EvnFields;
  setPage: (x: number) => void;
  setEvent: React.Dispatch<React.SetStateAction<EvnFields | undefined>>;
}) => {
  const { userData, setMsg } = useContext(Context);
  if (!userData) return null;

  const findAmount = (c_name: string) => {
    const categ = event.categories.find((c) => c.name === c_name);
    return categ?.filter?.amount ?? 1;
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TicketFields>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      event: event.name,
      name: findAmount(event.categories[0].name) <= 1 ? userData?.name : "",
      category: event.categories[0].name,
      duesLimit: event.dues,
      users: [{ card_id: userData.card_id }],
      phone: userData?.phone,
      dues: [
        {
          secure_url: undefined,
          public_id: undefined,
          transf: "",
          payDues: 1,
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "users",
  });

  const [loading, setLoading] = useState(false);

  const duesAmount = () => {
    let aux = [];
    for (let i = 0; i < event.dues; i++) aux.push((i + 1).toString());
    return aux;
  };

  useEffect(() => {
    let aux = [{ card_id: userData.card_id }];
    if (findAmount(watch("category")) <= 1) {
      setValue("name", userData.name);
    } else {
      for (let i = 1; i < findAmount(watch("category")); i++) {
        aux.push({ card_id: "" });
      }
    }
    setValue("users", aux);
  }, [watch("category")]);

  const confirm = async (values: TicketFields) => {
    const categ = event.categories.find((c) => c.name === values.category);
    if (!categ || !categ._id || !userData) return null;
    setLoading(true);
    const { status: st, data: users } = await checkUsers(
      categ,
      userData,
      values.users[1] ? values.users[1].card_id : undefined,
      values.users[2] ? values.users[2].card_id : undefined,
      values.users[3] ? values.users[3].card_id : undefined
    );
    if (st !== 200) {
      setLoading(false);
      setMsg({ type: "error", text: users.msg });
    }

    const { status, data } = await registerTicket(users, values, categ._id);
    setLoading(false);
    if (status === 200) {
      setEvent((prev) => {
        if (!prev) return prev;
        let aux = { ...prev };
        aux.categories.forEach((c) => {
          if (c._id === categ._id) c.slots = c.slots + 1;
        });
        return aux;
      });
      setMsg({
        type: "success",
        text: "Solicitud registrada con éxito!",
        onClose: () => setPage(2),
      });
    } else setMsg({ type: "error", text: data.msg });
  };

  return (
    <ViewFadeStatic  style={{flexDirection:'column',display:'flex'}} >
      <View style={{ marginTop: -1 }} />
      <View style={{padding:'1px 1px 0px 1px',backgroundColor:'#181818'}} >
        <InfoBanner />
      </View>
      {/* <CategLbs showLb={false} /> */}
      <View style={{ gap: 12, width: "95%", padding:6,alignSelf:'center' }}>
        <InfoLabel label="Inscripcion" />
        <Input
          {...{ errors, control }}
          name="category"
          ph="Ej: Avanzado"
          label="Categoría"
          mode="select"
          options={event.categories.map((c) => c.name)}
        />
        <Input
          {...{ errors, control }}
          name="name"
          ph="Ej: Team Rayo"
          label="Nombre de equipo"
          isDisabled={findAmount(watch("category")) <= 1 ? true : false}
        />
        {fields.map(({ id }, i) => {
          if (i === 0)
            return (
              <Input
                key={id}
                {...{ control, errors }}
                name={`users.${i}.card_id`}
                label="C.I Capitán:"
                isDisabled
              />
            );
          else
            return (
              <Input
                key={id}
                {...{ control, errors }}
                name={`users.${i}.card_id`}
                label={`C.I Atleta ${i + 1}`}
                ph="29789456"
              />
            );
        })}

        <Input
          {...{ errors, control }}
          name="dues.0.payDues"
          label="Cuotas a pagar"
          ph="1"
          mode="select"
          options={duesAmount()}
        />
        <Input
          {...{ errors, control }}
          name="dues.0.transf"
          label="Nro. de Transferencia"
          ph="9876574321"
        />
        <Input
          mode="image"
          {...{ control, errors }}
          name={`dues.0.secure_url`}
          label="Comprobante de pago"
        />
        <View style={{ height: 32 }} />
        <BtnSecondary
          bg={v.prime}
          color="#181818"
          onPress={handleSubmit(confirm)}
          text="Confirmar"
          loading={loading}
        />
        <BtnSecondary
          bg="#fff"
          color="#181818"
          onPress={() => setPage(2)}
          text="Regresar"
        />
      </View>
    </ViewFadeStatic>
  );
};

export default InscriptionTeam;
