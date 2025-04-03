import { useState } from "react";
import Dropdown from "../Dropdown";
import { getTickets } from "../../api/api_admin";
import { TicketT } from "../../types/event";
import { ViewFadeStatic } from "../AnimatedLayouts";
import { Btn, ReactCSS, Text, v, View } from "../UI";
import { Ionicons } from "../Icons";

const EvnTickets = ({ categories_id }: { categories_id: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketT[] | undefined>(undefined);
  const [ticketInfo, setTicketInfo] = useState<TicketT | undefined>(undefined);

  const cleanTicket = () => {
    setTicketInfo(undefined);
  };

  if (false) console.log(tickets, ticketInfo, cleanTicket, categories_id);

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
      {/* {ticketInfo ? (
        <TicketInfoDisplay {...{ ticketInfo, setTickets, cleanTicket }} />
      ) : null} */}
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
      {tickets.map((t, i) => (
        <ViewFadeStatic key={t._id}>
          <Btn onPress={() => setTicketInfo(t)} style={st.teamCard_btn}>
            <View style={st.teamCard_ctn}>
              <Text style={st.teamCard_name}>{t.name}</Text>
              <Ionicons
                name={isDone(t) ? "checkmark-circle" : "hourglass-outline"}
                size={24}
                color={isDone(t) ? v.second : "black"}
              />
            </View>
          </Btn>
        </ViewFadeStatic>
      ))}
    </ViewFadeStatic>
  );
};

// const TicketInfoDisplay = ({
//   ticketInfo,
//   setTickets,
//   cleanTicket,
// }: {
//   ticketInfo: TicketT;
//   setTickets: React.Dispatch<React.SetStateAction<TicketT[] | undefined>>;
//   cleanTicket: () => void;
// }) => {
//   return()
// }


const st:ReactCSS = {
  teamCard_btn: {
    margin: '0px -12px',
    marginTop: -1,
  },
  teamCard_ctn: {
    minWidth: 'calc(100vh * 0.95)',
    minHeight: 52,
    borderWidth: 1,
    padding: '12px 24px',
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  teamCard_name: {
    fontFamily: "RobotoMono",
    fontSize: 14,
    marginTop: -3,
    flex: 1,
    alignSelf: "center",
  },
  btn_remove: {
    justifyContent: "flex-end",
    paddingBottom: 8,
    padding: '0px 6px 8px',
    // backgroundColor: "red",
  },
};

const isDone = (t: TicketT) => {
  let aux = 0;
  t.dues.forEach((d) => {
    if (d.payDues > aux) aux = d.payDues;
  });
  if (aux >= t.duesLimit) return true;
  else return false;
};
