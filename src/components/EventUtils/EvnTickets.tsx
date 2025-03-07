import { useState } from 'react'
import Dropdown from '../Dropdown';
import { getTickets } from '../../api/api_admin';
import { TicketT } from '../../types/event';

const EvnTickets = ({ categories_id }: { categories_id: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tickets, setTickets] = useState<TicketT[] | undefined>(undefined);
    const [ticketInfo, setTicketInfo] = useState<TicketT | undefined>(undefined);
  
    const cleanTicket = () => {
      setTicketInfo(undefined);
    };

    if(false) console.log(tickets,ticketInfo,cleanTicket,categories_id);
  
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

      </Dropdown>
  )
}

export default EvnTickets