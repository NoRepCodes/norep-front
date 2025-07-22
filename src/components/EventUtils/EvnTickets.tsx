import { useContext, useState } from "react";
import Dropdown from "../Dropdown";
import { approveTicket, getTickets, rejectTicket } from "../../api/api_admin";
import { TicketT } from "../../types/event";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { Btn, v } from "../UI";
import { Ionicons } from "../Icons";
import { InfoLabel } from "../Info";
import { BtnSecondary, Line } from "../Input";
import { UserCard } from "./EvnUsers";
import { todayString } from "../../helpers/date";
import Context from "../../helpers/UserContext";

const EvnTickets = ({ categories_id }: { categories_id: string[] }) => {
  if (false) console.log(categories_id);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketT[] | undefined>(undefined);
  const [ticketInfo, setTicketInfo] = useState<TicketT | undefined>(undefined);

  const cleanTicket = () => {
    setTicketInfo(undefined);
  };

  const onPress = async () => {
    if (isOpen) return setIsOpen(false);
    setIsLoading(true);
    const { status, data } = await getTickets();
    setIsLoading(false);
    if (status === 200) {
      setIsOpen(true);
      setTickets(data);
    }
    // else setMsg({})
  };

  return (
    <Dropdown title="SOLICITUDES" {...{ isOpen, onPress, isLoading }}>
      {tickets && !ticketInfo ? (
        <TicketListDisplay {...{ tickets, setTicketInfo }} />
      ) : null}
      {ticketInfo ? (
        <TicketInfoDisplay {...{ ticketInfo, setTickets, cleanTicket }} />
      ) : null}
    </Dropdown>
  );
};
export default EvnTickets;

const TicketListDisplay = ({
  tickets,
  setTicketInfo,
}: {
  tickets: TicketT[];
  setTicketInfo: React.Dispatch<React.SetStateAction<TicketT | undefined>>;
}) => {
  return (
    <ViewFadeStatic style={{ alignItems: "center" }}>
      {tickets.map((t) => (
        <ViewFadeStatic key={t._id}>
          <Btn
            onPress={() => setTicketInfo(t)}
            className="-mx-3 -mt-[1px] cursor-pointer "
          >
            <div className="w-full min-h-13 border-1 px-6 py-3 flex flex-row justify-between gap-3 items-center">
              <p className="font-RobotoMono text-sm">{t.name}</p>
              <Ionicons
                name={isDone(t) ? "checkmark-circle" : "hourglass-outline"}
                size={24}
                color={isDone(t) ? v.second : "black"}
              />
            </div>
          </Btn>
        </ViewFadeStatic>
      ))}
    </ViewFadeStatic>
  );
};

const TicketInfoDisplay = ({
  ticketInfo,
  setTickets,
  cleanTicket,
}: {
  ticketInfo: TicketT;
  setTickets: React.Dispatch<React.SetStateAction<TicketT[] | undefined>>;
  cleanTicket: () => void;
}) => {
  if (false) console.log(ticketInfo);

  
  const { setMsg } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    const { status, data } = await approveTicket(ticketInfo);
    setLoading(false);
    if (status === 200) {
      setTickets(data);
      setMsg({
        type: "success",
        text: "Solicitud aprovada con éxito!",
        onClose: cleanTicket,
      });
    } else {
      setMsg({
        type: "error",
        text: data.msg,
      });
    }
  };

  const onCancel = () => {
    setMsg({
      type: "warning",
      text: "Seguro que desea rechazar la solicitud?",
      onConfirm:()=>{rejectTicket(ticketInfo)},
    });
  };

  return (
    <div className="flex flex-col gap-2 -mt-2">
      <div>
        <BtnSecondary text="Regresar" onPress={()=>setTickets(undefined)} />
      </div>
      <div className="flex flex-col md:flex-row md:gap-6 md:justify-between lg:w-full">
        <div className="flex flex-col gap-4 md:w-100 lg:w-full">
          <InfoLabel label="Detalles" />
          <LabelItm label="Evento: " text={ticketInfo.event} />
          <LabelItm label="C.I Capitán: " text={ticketInfo.users[0].card_id} />
          <LabelItm label="Nro Telefónico: " text={ticketInfo.phone} />
          <LabelItm
            label="Fecha de registro: "
            text={todayString(ticketInfo.createdAt)}
          />
        </div>
        <div className="flex flex-col gap-4 pb-3 lg:w-full">
          <InfoLabel label="Usuarios" />
          <ViewFadeStatic className="overflow-hidden">
            {ticketInfo.users.map((user, i) => (
              <UserCard {...{ user, i }} key={i} />
            ))}
          </ViewFadeStatic>
        </div>
      </div>
      <Line />
      <div className="flex flex-col md:flex-row md:gap-12 md:flex-wrap">
        {ticketInfo.dues.map((due, index) => (
          <PayDisplay {...{ due, ticketInfo, index }} key={due._id} />
        ))}
      </div>
      <Line />
      <div className=" flex flex-col gap-3 md:flex-row md:w-100 md:self-end">
        <BtnSecondary
          bg="#9747FF"
          color="#fff"
          font_weigth={400}
          onPress={onConfirm}
          text="Aceptar Solicitud"
          loading={loading}
        />
        <BtnSecondary onPress={onCancel} text="Cancelar Solicitud" />
      </div>
    </div>
  );
};

const isDone = (t: TicketT) => {
  let aux = 0;
  t.dues.forEach((d) => {
    if (d.payDues > aux) aux = d.payDues;
  });
  if (aux >= t.duesLimit) return true;
  else return false;
};

const LabelItm = ({ label, text }: { label: string; text: string }) => {
  return (
    <p>
      <span className="font-medium">{label}</span>
      {text}
    </p>
  );
};

const PayDisplay = ({
  due,
  ticketInfo,
  index,
}: {
  due: {
    _id: string;
    secure_url: string;
    public_id: string;
    transf: string;
    payDues: number;
  };
  index: number;
  ticketInfo: TicketT;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-Anton">Pago {index + 1}</p>
      <LabelItm label="Nro. Transferencia:" text={due.transf} />
      <LabelItm
        label="Coutas:"
        text={`${due.payDues}/${ticketInfo.duesLimit}`}
      />
      <div className="w-50 h-60 self-center p-1 border-1 border-dashed rounded-xs overflow-hidden">
        <img className="w-full" src={due.secure_url} />
      </div>
    </div>
  );
};
