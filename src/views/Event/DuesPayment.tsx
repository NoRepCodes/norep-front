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
import { v } from "../../components/UI";
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
    <div className="flex flex-col flex-1 -mt-[1px] border-black border-[1px] pb-6">
      <div className="-mt-[1px] pt-[1px]">
        <InfoBanner />
      </div>
      {/* <CategLbs showLb={false} /> */}
      <div className="w-full p-3 self-center">
        <InfoLabel label="Pago de cuota" />
      </div>

      <div className="flex flex-col gap-3 w-[95%] p-1.5 self-center lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-3 w-full self-center lg:self-auto lg:w-[40%]">
          <InputBase
            isDisabled
            value={userData.card_id}
            onChange={() => {}}
            label="C.I Capitan"
          />
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
        </div>
        <div className="flex flex-col gap-3 w-full self-center lg:self-auto lg:w-[40%]">
          <Input
            mode="image"
            {...{ control, errors }}
            name={`image`}
            label="Comprobante de pago"
          />
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
        </div>
      </div>
    </div>
  );
};

export default DuesPayment;
