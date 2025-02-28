import { useContext, useEffect } from "react";

import { Ionicons } from "./Icons";
import { AnimatePresence, motion } from "framer-motion";
import Context from "../helpers/UserContext";
import { disableScroll, enableScroll } from "../helpers/scrollControl";
import { BtnPrimary, BtnSecondary } from "./Input";

const MsgModal = () => {
  const { msg, setMsg } = useContext(Context);

  useEffect(() => {
    if (msg) disableScroll();
    else enableScroll();
    return () => enableScroll();
  }, [msg]);

  const close = () => {
    setMsg(() => {
      if (msg?.onClose) msg.onClose();
      return undefined;
    });
  };
  const confirm = () => {
    setMsg(() => {
      if (msg?.onConfirm) msg.onConfirm();
      return undefined;
    });
  };
  return (
    <AnimatePresence>
      {!msg ? null : (
        <motion.div
          className="blackscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="blackscreenOver">
            <motion.div
              className="modal_ctn msg_modal_ctn"
              initial={{ scale: 0.3 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.3 }}
            >
              {msg.type === "warning" ? (
                <Ionicons
                  size={58}
                  name="alert-circle-outline"
                  color="#181818"
                />
              ) : null}
              {msg.type === "error" ? (
                <Ionicons size={58} name="warning" color="red" />
              ) : null}
              {msg.type === "success" ? (
                <Ionicons size={58} name="checkmark-circle" color="green" />
              ) : null}
              <p>{msg.text}</p>
              <div className="modal_btns_ctn">
                <BtnSecondary onPress={close} text="Regresar" bg='#181818' color="#fff"  />
                {msg?.onConfirm ? <BtnPrimary onPress={confirm} text="Confirmar"  /> : null}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MsgModal;
