import { useEffect } from "react";
import { MsgT } from "./Context";

import {  IconCheckCircle, IconErrorHex, IconWarningHex } from "./Icons";
import { motion } from "framer-motion";

const body = document.getElementById('body');
const showScroll = () => { if (body) body.style.overflow = 'auto' }
const hideScroll = () => { if (body) body.style.overflow = 'hidden' }

const MsgModal = ({
  setMsg,
  msg,
}: {
  msg: MsgT;
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
}) => {

  useEffect(() => {
    if(msg.open){
      hideScroll()
    }else showScroll() 

    return ()=>{showScroll()}
  }, [msg.open])
  

  const close = () => {
    setMsg({
      msg: "",
      open: false,
      type: "none",
    });
  };

  const MM_Sucess = () => {
    return (
      <>
        <IconCheckCircle color="#4BB543" size={48} />
        <p>{msg.msg}</p>
        <button onClick={close}>Continuar</button>
      </>
    );
  };
  const MM_Error = () => {
    return (
      <>
        <IconErrorHex color="#D0342C" size={48} />
        <p>{msg.msg}</p>
        <button onClick={close}>Continuar</button>
      </>
    );
  };
  const MM_Warning = () => {
    return (
      <>
        <IconWarningHex size={48} />
        <p>{msg.msg}</p>
        <button onClick={close}>Continuar</button>
      </>
    );
  };

  return (
    <motion.div
      className="blackscreen blackscreenOver"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal_ctn msg_modal_ctn"
        initial={{ scale: 0.3 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.3 }}
      >
        {msg.type === "success" && <MM_Sucess />}
        {msg.type === "error" && <MM_Error />}
        {msg.type === "warning" && <MM_Warning />}
      </motion.div>
    </motion.div>
  );
};

export default MsgModal