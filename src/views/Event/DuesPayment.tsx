import { useContext, useState } from "react";
import { EvnFields } from "../../types/event";
import Context from "../../helpers/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PushDueFields,
  pushDueSchema,
} from "../../types/zod/registerTicket.zod";
import { pushTicket } from "../../api/api_user";
import { ViewFadeStatic } from "../../components/AnimatedLayouts";
import { v, View } from "../../components/UI";
import { InfoBanner } from "./InscriptionDetails";
import { InfoLabel } from "../../components/Info";
import Input, { BtnSecondary, InputBase } from "../../components/Input";

const DuesPayment = ({
  event,
  setPage,
}: {
  event: EvnFields;
  setPage: (x: number) => void;
}) => {
  const duesAmount = () => {
    let aux = [];
    for (let i = 0; i < event.dues; i++) aux.push((i + 1).toString());
    return aux;
  };
  const { userData, setMsg } = useContext(Context);
  if (!userData) return null;

  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PushDueFields>({
    resolver: zodResolver(pushDueSchema),
    defaultValues: {
      captain_id: userData._id,
      transf: "",
      payDues: 0,
      image: "",
    },
  });

  const confirm = async (values: PushDueFields) => {
    setLoading(true);
    const { status, data } = await pushTicket(values);
    setLoading(false);
    if (status === 200) {
      setMsg({
        type: "success",
        text: "Pago registrado con éxito!",
        onClose: () => {
          setPage(2);
        },
      });
    } else
      setMsg({
        type: "error",
        text: data.msg,
      });
  };

  return (
    <ViewFadeStatic style={{flexDirection:'column',display:'flex'}} >
      <View style={{ marginTop: -1 }} />
      <View style={{padding:'1px 1px 0px 1px',backgroundColor:'#181818'}} >
        <InfoBanner />
      </View>
      <View style={{ gap: 12, width: "95%", paddingBottom: 52,alignSelf:'center' }}>
        <InfoLabel label="Pago de cuota" />
        {/* <Input
            {...{ errors, control }}
            name="captain_id"
            label="C.I Capitán"
            isDisabled
          /> */}
        <InputBase isDisabled value={userData.card_id} onChange={() => {}} />
        <Input
          {...{ errors, control }}
          name="payDues"
          label="Nro. de cuota a pagar"
          ph="1"
          mode="select"
          options={duesAmount()}
        />
        <Input
          {...{ errors, control }}
          name="transf"
          label="Nro. de Transferencia"
          ph="9876574321"
        />
        <Input
          mode="image"
          {...{ control, errors }}
          name={`image`}
          label="Comprobante de pago"
        />
        <View style={{ height: 24 }} />
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

export default DuesPayment;
