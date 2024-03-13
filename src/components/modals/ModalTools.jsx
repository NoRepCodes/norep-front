import moment from "moment";
import { useRef } from "react";
import "../../sass/modals/modalTools.sass";
// export const ArrayInput = ({ label, ocArr, value, index }) => {

const splitTime = (time)=>{
  let val = time.split(":")
    val.forEach((num,index) => {
      if(num === ''||num==='0') val[index] = '00'
    });
    return `${val[0]}:${val[1]}:${val[2]}` 
}
export const convTime = (s) => moment.duration(splitTime(s), "HH:mm:ss").asSeconds();
//   const text = (e) => {
//     ocArr(e.target.value, index);
//   };
//   return (
//     <div className="InputLabel">
//       <p>{label}</p>
//       <input type="text" onChange={text} value={value} />
//     </div>
//   );
// };

export const InputArray = ({ name, label, value, update, index, minus }) => {
  const onChangeText = (e) => {
    const value = e.target.value;
    update(value, index);
  };
  const remove = () => {
    minus(index);
    // console.log("test");
  };
  return (
    <div className="input_label">
      <div className="input_label_top">
        <label htmlFor={name}>{label}</label>
        {minus && (
          <div onClick={remove}>
            <CrossIcon />
          </div>
        )}
      </div>
      <input
        type="text"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

// date example 2024-03-02 yyyy-mm-dd
export const InputDate = ({ name, label, value, set }) => {
  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    console.log(value);
    set((prev) => ({ ...prev, [att]: value }));
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        type="date"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

export const InputLabel = ({ name, label, value, set }) => {
  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    set((prev) => ({ ...prev, [att]: value }));
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

export const InputTime = ({ name, label, value, update, index }) => {
  const refh = useRef(null);
  const refm = useRef(null);
  const refs = useRef(null);
  const onChangeText = (e) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      let val = e.target.value;
      let h = refh.current.value;
      let m = refm.current.value;
      let s = refs.current.value;
      if (e.target === refh.current) {
        update(`${val}:${m}:${s}`, index);
      } else if (e.target === refm.current) {
        update(`${h}:${val}:${s}`, index);
      } else if (e.target === refs.current) {
        update(`${h}:${m}:${val}`, index);
      }
    }
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <div className="input_time">
        <input
          type="text"
          placeholder="hh"
          onChange={onChangeText}
          ref={refh}
          maxLength={2}
          value={value.split(":")[0]}
        />
        <h1>:</h1>
        <input
          type="text"
          placeholder="mm"
          onChange={onChangeText}
          ref={refm}
          maxLength={2}
          value={value.split(":")[1]}
        />
        <h1>:</h1>
        <input
          type="text"
          placeholder="ss"
          onChange={onChangeText}
          ref={refs}
          maxLength={2}
          value={value.split(":")[2]}
        />
      </div>
    </div>
  );
};

// const ModalHeader = ({ title = "", close }) => {
//     return (
//       <div className="header">
//         <p>{title}</p>
//         <Cross close={close} />
//       </div>
//     );
//   };
export const CrossIcon = () => {
  return (
    <svg
      width={32}
      height={32}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
    </svg>
  );
};

const ModalHeader = ({ title = "", close }) => {
  return (
    <div className="modal_top">
      <h6>{title}</h6>
      <div className="cross_ctn" onClick={close}>
        <CrossIcon />
      </div>
    </div>
  );
};

export const Modal = ({ children, title, close }) => {
  return (
    <div className="blackscreen">
      <div className="modal">
        {/* <ModalHeader title={title} close={close} /> */}
        <div className="modal_ctn">
          <ModalHeader {...{ title, close }} />
          {children}
        </div>
      </div>
    </div>
  );
};

export const InputsWOD = ({
  wod,
  index,
  handleName,
  handleTime,
  handleType,
  handleReps,
  handleAmountType,
  minusWod,
}) => {
  const hType = () => {
    handleType(wod.wod_type, index);
  };
  const haType = () => {
    handleAmountType(wod.amount_type, index);
  };

  const hTime = (e) => {
    console.log(e);
  };

  return (
    <div className="inputs_wod_ctn">
      <div className="title_ctn">
      <h6 className="title1" >
        WOD {index + 1}: 
      </h6>
      <h6 className="title2" onClick={hType}>{rTypeName(wod.wod_type)}</h6>
      </div>
      <div className="inputs_wod_form">
        <InputArray
          label="NOMBRE"
          update={handleName}
          index={index}
          value={wod.name}
          minus={minusWod}
        />
        <InputTime
          label="TIEMPO LIMITE"
          update={handleTime}
          index={index}
          value={wod.time_cap}
        />
        {wod.wod_type === 2 && (
          <InputArray
            label={`${wod.amount_type.toUpperCase()} LIMITE`}
            update={handleReps}
            index={index}
            value={wod.amount_cap}
            minus={false}
          />
        )}
        {(wod.wod_type === 2 || wod.wod_type === 3) && (
          <h5 className="wat_btn" onClick={haType}>{wod.amount_type.toUpperCase()}</h5>
        )}
        {wod.wod_type === 4 && <h5>PUNTOS</h5>}
      </div>
    </div>
  );
};

const rTypeName = (num) => {
  if (num === 1) return "AMRAP";
  else if (num === 2) return "FORTIME";
  else if (num === 3) return "RM";
  else if (num === 4) return "CIRCUITO";
};
