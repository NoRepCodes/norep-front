import { useContext } from "react";
import Context from "../../../helpers/UserContext";
import { EvnSchema } from "../../../types/event";
import "../Event/adminEvent.sass";
import EvnDetails from "../../../components/EventUtils/EvnDetails";
import { getDefaults } from "../../../types/zod";

const CreateEvent = () => {
  //   const isFocused = useIsFocused();
  const { setMsg } = useContext(Context);
  return (
    <div className="adminEvent_page">
      <h6 style={{ fontSize: 48, marginBottom: 32 }}>CREAR EVENTO</h6>
      <EvnDetails {...{ event: getDefaults(EvnSchema), setMsg }} defaultOpen />
    </div>
  );
};

export default CreateEvent;
