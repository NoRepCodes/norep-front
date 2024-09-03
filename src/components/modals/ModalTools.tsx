//@ts-ignore
import moment from "moment";
import {
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import "../../sass/modals/modalTools.sass";
import { WodType } from "../../types/event.t";
import { ResultContext } from "../results/ResultContx";
// export const ArrayInput = ({ label, ocArr, value, index }) => {

const splitTime = (time: string) => {
  let val = time.split(":");
  val.forEach((num, index) => {
    if (num === "" || num === "0") val[index] = "00";
  });
  return `${val[0]}:${val[1]}:${val[2]}`;
};
export const convTime = (s: string): number =>
  moment.duration(splitTime(s), "HH:mm:ss").asSeconds();

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

type InputArrayT = {
  name?: string;
  label: string;
  value: string;
  update: (x: string, y: number) => void;
  index: number;
  minus?: (x: number) => void;
  onlyNum?: boolean;
};
export const InputArray = ({
  name,
  label,
  value,
  update,
  index,
  minus,
  onlyNum = false,
}: InputArrayT) => {
  const onChangeText = (e: any) => {
    if (onlyNum && !e.target.value.match(/^[0-9]*$/)) return;
    const value = e.target.value;
    update(value, index);
  };
  const remove = () => {
    if (minus) minus(index);
  };
  return (
    <div className="input_label">
      <div className="input_label_top">
        <label>{label}</label>
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

// date example 2024-03-02 YYYY-MM-DD
export const InputDate = ({
  name,
  label,
  value,
  set,
  custom,
}: {
  name: string;
  label: string;
  value: string;
  set?: any;
  custom?: any;
}) => {
  const onChangeText = (e: any) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    if (custom) custom(e.target.value);
    else if (set) set((prev: any) => ({ ...prev, [att]: value }));
  };
  return (
    <div>
      {/* <div className="input_label"> */}
      <label>{label}</label>
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

export const InputLabel = ({
  name,
  label,
  value,
  set,
}: {
  name: string;
  label: string;
  value: string;
  set: any;
}) => {
  const onChangeText = (e: any) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    set((prev: any) => ({ ...prev, [att]: value }));
  };
  return (
    <div className="input_label">
      <label>{label}</label>
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

export const InputTime = ({
  label,
  value,
  update,
  index,
}: {
  label: string;
  value: string;
  update: (z: string, x: number) => void;
  index: number;
}) => {
  const refh = useRef<HTMLInputElement | null>(null);
  const refm = useRef<HTMLInputElement | null>(null);
  const refs = useRef<HTMLInputElement | null>(null);
  const onChangeText = (e: any) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      let val = e.target.value;
      let h = refh.current?.value;
      let m = refm.current?.value;
      let s = refs.current?.value;
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
      <label>{label}</label>
      <div className="input_time">
        <div className="hours">
          <input
            type="text"
            placeholder="hh"
            onChange={onChangeText}
            ref={refh}
            maxLength={2}
            value={value.split(":")[0]}
          />
        </div>
        <h1>:</h1>
        <div className="minutes">
          <input
            type="text"
            placeholder="mm"
            onChange={onChangeText}
            ref={refm}
            maxLength={2}
            value={value.split(":")[1]}
          />
        </div>
        <h1>:</h1>
        <div className="seconds">
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
export const CrossIcon = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
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

const ModalHeader = ({
  title = "",
  close,
}: {
  title: string;
  close: () => void;
}) => {
  return (
    <div className="modal_top">
      <h6>{title}</h6>
      <div className="cross_ctn" onClick={close}>
        <CrossIcon />
      </div>
    </div>
  );
};

type ModalP = PropsWithChildren & {
  title: string;
  close: () => void;
};

export const Modal = ({ children, title, close }: ModalP) => {
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

export type InputWodT = Omit<
  WodType,
  "_id" | "results" | "time_cap" | "amount_cap"
> & {
  _id?: string;
  time_cap?: string;
  time?: string;
  amount_cap?: string;
};
type InputWODT = {
  wod: InputWodT;
  index: number;
  handleName: (z: string, i: number) => void;
  handleTime: (z: string, i: number) => void;
  handleType: (z: string, i: number) => void;
  handleReps: (z: string, i: number) => void;
  handleAmountType: (z: string, i: number) => void;
  minusWod: (i: number) => void;
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
}: InputWODT) => {
  const hType = () => {
    handleType(wod.wod_type, index);
  };
  const haType = () => {
    handleAmountType(wod.amount_type, index);
  };

  // const hTime = (e) => {};

  return (
    <div className="inputs_wod_ctn">
      <div className="title_ctn">
        <h6 className="title1">WOD {index + 1}:</h6>
        <h6 className="title2" onClick={hType}>
          {wod.wod_type}
          {/* {rTypeName(wod.wod_type)} */}
        </h6>
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
          value={wod.time_cap ?? ""}
        />
        {wod.wod_type === "FORTIME" && (
          <InputArray
            label={`${wod.amount_type.toUpperCase()} LIMITE`}
            update={handleReps}
            index={index}
            value={wod.amount_cap ?? ""}
            onlyNum
          />
        )}
        {(wod.wod_type === "FORTIME" || wod.wod_type === "RM") && (
          <button style={{ width: "auto" }}>
            <h5 className="wat_btn" onClick={haType}>
              {wod.amount_type.toUpperCase()}
            </h5>
          </button>
        )}
        {/*
         */}
      </div>
    </div>
  );
};

export const CategoriesSelect = () => {
  const { category, setCategory, event } = useContext(ResultContext);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <div className="categories_select">
      <div className="categories_select_btn" onClick={toggle}>
        {category && <h6>{category.name}</h6>}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path d="M12 21l-12-18h24z" />
        </svg>
      </div>
      {open && (
        <div className="abs_categories_select">
          {event &&
            event.categories.map((categ) => (
              <h6
                key={categ._id}
                onClick={() => {
                  setCategory(categ);
                  toggle();
                }}
              >
                {categ.name}
              </h6>
            ))}
        </div>
      )}
    </div>
  );
};
