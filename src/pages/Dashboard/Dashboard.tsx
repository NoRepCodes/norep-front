import { useNavigate } from "react-router-dom";
import "./dashboard.sass";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { Context } from "../../components/Context";
import { TicketT } from "../../types/tickets.t";
import { approveTicket, getTickets, rejectTicket } from "../../api/admin.api";
//@ts-ignore
import moment from "moment";
import useModal from "../../hooks/useModal";
import { Modal } from "../../components/modals/ModalTools";
const Dashboard = () => {
  const { admin } = useContext(Context);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketT[]>([]);
  const [view, setView] = useState<TicketT | undefined>(undefined);
  const [modal, toggle] = useModal();

  useEffect(() => {
    if (!admin) navigate("/");
  }, [admin]);
  useEffect(() => {
    (async () => {
      const { status, data } = await getTickets();
      if (status === 200) {
        setTickets(data);
      } else {
        alert(data.msg);
      }
    })();
  }, []);

  const openTicket = (t: any) => {
    toggle();
    setView(t);
  };

  return (
    <>
      {modal && view && (
        <TicketModal
          close={toggle}
          title="TICKET"
          ticket={view}
          setTickets={setTickets}
        />
      )}
      <div className="dashnoard_page">
        <h6>SOLICITUDES</h6>
        <div className="cards_ctn">
          {tickets.map((t) => (
            <TicketCard ticket={t} key={t._id} openTicket={openTicket} />
          ))}
        </div>
      </div>
    </>
  );
};
export default Dashboard;

const TicketCard = ({
  ticket,
  openTicket,
}: {
  ticket: TicketT;
  openTicket: (t: any) => void;
}) => {
  return (
    <div
      className="ticket_card"
      onClick={() => {
        openTicket(ticket);
      }}
    >
      <p className="tc_name">{ticket.name}</p>
      <div className="info">
        <p>Fecha: {getDate(ticket.createdAt)}</p>
        <p>Evento: {ticket.event}</p>
        <p>Categoria: {ticket.category}</p>
      </div>
      <div className="tc_abs">
        <p>{getDone(ticket)}</p>
      </div>
    </div>
  );
};
const getDone=(t:TicketT)=>{
  let aux = 0
  t.dues.forEach(d => {
    if(d.payDues > aux) aux = d.payDues 
  });
  if(aux >= t.duesLimit) return "✅"
  else return "⏳"
}
const getDone2=(t:TicketT)=>{
  let aux = 0
  t.dues.forEach(d => {
    if(d.payDues > aux) aux = d.payDues 
  });
  return `${aux}/${t.duesLimit}`
}
const getDate = (date: any) => {
  return moment(date).format("DD-MM-YYYY");
};
type TicketModalP = PropsWithChildren & {
  close: () => void;
  title: string;
  ticket: TicketT;
  setTickets: React.Dispatch<React.SetStateAction<TicketT[]>>;
};
const TicketModal = ({ close, title, ticket, setTickets }: TicketModalP) => {
  const { setMsg } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);

  const conf = async () => {
    // console.log(ticket);
    setLoad2(true)
    const {status,data} = await approveTicket(ticket)
    setLoad2(false)
    if(status === 200){
      close()
      setMsg({
        open:true,
        type:'success',
        msg:'Ticket aceptado!'
      })
      setTickets(data)
    }else setMsg({
      open:true,
      type:'error',
      msg:data.msg
    })
  };
  const rej = async () => {
    setLoad(true);
    const { status, data } = await rejectTicket(ticket);
    setLoad(false);
    if (status === 200) {
      close();
      setMsg({
        open: true,
        type: "success",
        msg: "Ticket rechazado exitosamente",
      });
      setTickets(data);
    } else
      setMsg({
        open: true,
        type: "error",
        msg: data.msg,
      });
  };

  return (
    <Modal {...{ close, title }}>
      <div className="ticket_modal">
        {ticket.dues.map((d, i) => (
          <div key={i} className="verify_pay" >
            <h6>COMPROBANTE DE PAGO {i + 1} :</h6>
            <a href={d.secure_url} target="blank">
              <img src={d.secure_url} alt="capture" />
            </a>
            <h6>NRO. TRANSFERENCIA:</h6>
            <p>{d.transf}</p>
          </div>
        ))}
        <h6>INTEGRANTES:</h6>
        {ticket.users.map((user) => (
          <p key={user._id}>{user.name}</p>
        ))}
        <h6>Número de contacto:</h6>
        <p>{ticket.phone}</p>
        <h6>Cuotas pagadas:</h6>
        <p>{getDone2(ticket)}</p>
        <div className="ticket_buttons">
          <button onClick={rej} className="btn_reject">
            {load ? "Rechazando..." : "Rechazar"}
          </button>
          <button onClick={conf}>{load2 ? "Verificando..." : "Aceptar"}</button>
        </div>
      </div>
    </Modal>
  );
};
