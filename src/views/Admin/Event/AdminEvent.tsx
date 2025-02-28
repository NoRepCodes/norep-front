import { useContext, useEffect, useState } from "react";
import Context from "../../../helpers/UserContext";
import { EvnFields, WodFields } from "../../../types/event";
import { TeamType } from "../../../types/table.t";
import { useParams } from "react-router-dom";
import { getEventTable } from "../../../api/api_guest";
import "./adminEvent.sass";
import EvnDetails from "../../../components/EventUtils/EvnDetails";
import EvnWods from "../../../components/EventUtils/EvnWods";
import EvnResults from "../../../components/EventUtils/EvnResults";
import EvnTable from "../../../components/EventUtils/EvnTable";

const AdminEvent = () => {
  //   const isFocused = useIsFocused();
  const { setMsg } = useContext(Context);
  const [event, setEvent] = useState<EvnFields | undefined>(undefined);
  const [wods, setWods] = useState<WodFields[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // MODALS
  const [wodInfo, setWodInfo] = useState<WodFields | undefined>(undefined);
  const [teamInfo, setTeamInfo] = useState<TeamType | undefined>(undefined);
  if(false) console.log(wodInfo);
  if(false) console.log(teamInfo);

  const { _id } = useParams();

  const update = async () => {
    setLoading(true);
    const { status, data } = await getEventTable(_id ?? "");
    setLoading(false);
    if (status === 200) {
      setEvent(data.event);
      setWods(data.wods ?? []);
    } else {
      setMsg({ type: "error", text: data.msg });
    }
  };

  useEffect(() => {
    update();
  }, []);
  return (
    <div className="adminEvent_page">
      <h6 style={{ fontSize: 48, marginBottom: 32 }}>EVENTO - {event?.name}</h6>
      {event && wods && !loading ? (
        <>
          <EvnDetails {...{ event, setMsg, setEvent }} />
          <EvnWods
            {...{ wods, setMsg, setWods, categories: event.categories }}
          />
          <EvnResults
            {...{ wods, setMsg, setWods, categories: event.categories }}
          />
          <EvnTable {...{ event, wods, setWodInfo, setTeamInfo, setEvent }} />
        </>
      ) : null}
    </div>
  );
};

export default AdminEvent;
