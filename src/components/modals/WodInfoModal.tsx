import { AnimatePresence, motion } from "framer-motion";
import { IconCross } from "../Icons";
import { useContext } from "react";
import { ResultContext } from "../results/ResultContx";
import "../../sass/modals/wodInfoModal.sass";
//@ts-ignore
import moment from "moment";

const resTime = (time: number) => moment.utc(time * 1000).format("mm:ss");

export const WodInfoModal = () => {
  const { wodInfo, setWodInfo } = useContext(ResultContext);
  console.log(wodInfo);
  return (
    <AnimatePresence>
      {wodInfo && (
        <motion.div
          className="blackscreen blackscreenOver"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal_ctn wod_info_modal_ctn"
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.3 }}
          >
            <div className="wod_info_modal">
              <div
                className="wim_cross"
                onClick={() => {
                  setWodInfo(undefined);
                }}
              >
                <IconCross size={16} />
              </div>
              <h6>{wodInfo.name}</h6>
              <p>{wodInfo.wod_type}</p>
              {wodInfo.time_cap && wodInfo.time_cap > 0 ? (
                <p>TIEMPO LIMITE: {resTime(wodInfo.time_cap)}</p>
              ) : null}
              {wodInfo.amount_cap && wodInfo.amount_cap > 0 ? (
                <p>
                  {wodInfo.amount_type.toUpperCase()} LIMITE:{" "}
                  {wodInfo.amount_cap}
                </p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
