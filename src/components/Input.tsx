import {
  Controller,
  FieldErrors,
  UseControllerProps,
  UseFieldArrayRemove,
} from "react-hook-form";
import { IconLoad, Ionicons } from "./Icons";
import { useRef, useState } from "react";
import { ViewFadeStatic } from "./AnimatedLayouts";
import { AnimatePresence } from "framer-motion";
import useScreen from "../hooks/useSize";
import { convSeconds } from "../helpers/date";

type KeyS = { [key: string]: any };

function accessDeepProp(obj: any, path: string) {
  if (!path) return obj;
  const properties = path.split(".");
  const leftover = properties.shift();
  if (leftover === undefined || obj[leftover] === undefined) return obj[path];
  return accessDeepProp(obj[leftover], properties.join("."));
}

const Input = <K extends KeyS>({
  options = [],
  errors,
  mode = "text",
  width = "100%",
  ...props
}: UseControllerProps<K> & {
  width?: string | number;
  hidePass?: boolean;
  multiline?: boolean;
  ph?: string;
  options?: string[];
  errors: FieldErrors<K>;
  mode?: "text" | "date" | "checkbox" | "image" | "select" | "time";
  label?: string;
  remove?: UseFieldArrayRemove;
  index?: number;
  isDisabled?: boolean;
}) => {
  const { ww } = useScreen();
  const msg = accessDeepProp(errors, props.name)?.message;
  return (
    <div style={{ width: ww < 800 ? "100%" : width }}>
      <Controller
        {...props}
        render={({ field: { onChange, value } }) => {
          if (mode === "text")
            return <InputBase {...{ ...props, onChange, value }} />;
          if (mode === "checkbox")
            return <CheckBox {...{ ...props, onChange, value }} />;
          if (mode === "date")
            return <InputDate {...{ ...props, onChange, value }} />;
          if (mode === "select")
            return <InputSelect {...{ ...props, onChange, value, options }} />;
          if (mode === "time")
            return <InputTime {...{ ...props, onChange, value }} />;
          if (mode === "image")
            return <InputImage {...{ ...props, onChange, value, options }} />;
          else return <div />;
        }}
      />
      {msg && typeof msg === "string" && (
        <p style={{ color: "red", marginTop: 6, fontSize: 14 }}>{msg}</p>
      )}
    </div>
  );
};

export default Input;

type InputT = {
  hidePass?: boolean;
  label?: string;
  ph?: string;
  value?: string;
  onChange: (t: any) => void;
  isDisabled?: boolean;
};

export const InputBase = ({
  label,
  ph,
  value,
  onChange,
  isDisabled,
  hidePass,
}: InputT) => {
  return (
    <div className="input_item">
      {label ? <label style={{ width: "100%" }}>{label}</label> : null}
      <input
        // style={{backgroundColor:'#fff'}}
        placeholder={ph}
        {...{ value, onChange }}
        disabled={isDisabled}
        type={hidePass ? "password" : "text"}
      />
    </div>
  );
};

type ConvertBase64T = (file: Blob) => Promise<string | ArrayBuffer | null>;
const convertBase64: ConvertBase64T = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export const InputImage = ({ label, value, onChange }: InputT) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const clickInputImg = () => ref?.current?.click();

  const handleFile = async (e: any) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      if (typeof base64 === "string") {
        onChange(base64);
      }
    }
  };

  return (
    <div className="input_item">
      {label ? <label style={{ width: "100%" }}>{label}</label> : null}
      <div
        style={{
          width: 200,
          height: 200,
          cursor: "pointer",
          border: "1px solid #181818",
        }}
        onClick={clickInputImg}
      >
        {value ? <img src={value} style={{ width: 200, height: 200 }} /> : null}
      </div>
      <input
        style={{ display: "none" }}
        ref={ref}
        type="file"
        name="img"
        accept="image/*"
        onChange={handleFile}
      />
    </div>
  );
};
export const InputTime = ({
  label,
  ph,
  value,
  onChange,
  isDisabled,
}: InputT) => {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    // let aux = convSeconds(parseInt(value ?? "0"));
    setOpen(!open);
  };
  // const onChange = () => {};
  const onCancel = () => setOpen(false);

  return (
    <div className="input_item input_time_ctn">
      {label ? <label style={{ width: "100%" }}>{label}</label> : null}
      <div className="input_time" onClick={onClick}>
        <p>{convSeconds(parseInt(value ?? "0"))}</p>
      </div>
      {open ? (
        <InputTimeModal {...{ value: value, onChange, onCancel }} />
      ) : null}
    </div>
  );
};
const InputTimeModal = ({
  value = "0",
  onChange,
  onCancel,
}: {
  value?: string;
  onChange: any;
  onCancel: any;
}) => {
  const [time, setTime] = useState({
    hh: convSeconds(parseInt(value)).split(":")[0],
    mm: convSeconds(parseInt(value)).split(":")[1],
    ss: convSeconds(parseInt(value)).split(":")[2],
  });
  const refh = useRef<HTMLInputElement | null>(null);
  const refm = useRef<HTMLInputElement | null>(null);
  const refs = useRef<HTMLInputElement | null>(null);
  const onChangeText = (e: any) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      if (e.target.value.length > 2) return undefined;
      let val = e.target.value;
      if (e.target === refh.current) {
        setTime({ ...time, hh: val });
      } else if (e.target === refm.current) {
        setTime({ ...time, mm: val });
      } else if (e.target === refs.current) {
        setTime({ ...time, ss: val });
      }
    }
  };
  const onConfirm = () => {
    const hh = parseInt(time.hh) * 3600;
    const mm = parseInt(time.mm) * 60;
    const ss = parseInt(time.ss);
    onChange(hh + mm + ss);
    onCancel();
  };

  return (
    <div className="input_time_modal">
      <input
        type="text"
        placeholder="HH"
        value={time.hh}
        onChange={onChangeText}
        ref={refh}
      />
      <p style={{ color: "#fff" }}>:</p>
      <input
        type="text"
        placeholder="MM"
        value={time.mm}
        onChange={onChangeText}
        ref={refm}
      />
      <p style={{ color: "#fff" }}>:</p>
      <input
        type="text"
        placeholder="SS"
        value={time.ss}
        onChange={onChangeText}
        ref={refs}
      />
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{ backgroundColor: "#fff" }}
          className="input_time_modal_btn"
          onClick={onConfirm}
        >
          <Ionicons name="checkmark-outline" size={18} color="#181818" />
        </div>
        <div className="input_time_modal_btn" onClick={onCancel}>
          <Ionicons name="close-outline" size={18} />
        </div>
      </div>
    </div>
  );
};

export const InputSelect = ({
  label,
  ph = "",
  value,
  onChange,
  options,
}: InputT & { options: string[] }) => {
  const [open, setOpen] = useState(false);

  const onPress = (e: any) => {
    onChange(e.target.value);
    setOpen(false);
  };

  const mouseLeave = () => {
    // if (open) setOpen(false);
  };

  return (
    <div
      className="input_item"
      style={{ position: "relative" }}
      onMouseLeave={mouseLeave}
    >
      {label ? <label style={{ width: "100%" }}>{label}</label> : null}
      <div
        className="input_item input_select"
        style={{ zIndex: 300, cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        {value ? <p>{value}</p> : <p>{ph}</p>}
        <Ionicons name="caret-down-outline" size={16} />
      </div>
      <AnimatePresence>
        {open ? (
          <ViewFadeStatic className="input_select_dropdown">
            {options.map((o, i) => (
              <option onClick={onPress} key={i} value={o}>
                {o}
              </option>
            ))}
          </ViewFadeStatic>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
const InputDate = ({ label, ph, value, onChange, isDisabled }: InputT) => {
  const ref = useRef(null);
  const onClick = () => {
    //@ts-ignore
    ref.current.showPicker();
  };

  return (
    <div className="input_item">
      {label ? <label style={{ width: "100%" }}>{label}</label> : null}
      <div className="input_date" onClick={onClick}>
        <p>{value ?? ph}</p>
        <input
          style={{ height: 0, border: 0, width: 0 }}
          {...{ value, onChange, ref }}
          disabled={isDisabled}
          type="date"
        />
      </div>
    </div>
  );
};

export const CheckBox = ({
  label,
  value,
  onChange,
  isDisabled,
  loading,
}: {
  isDisabled?: boolean;
  label?: string;
  value: boolean;
  onChange: (b: boolean) => void;
  loading?: boolean;
}) => {
  const press = () => {
    if (isDisabled || loading) return null;
    else onChange(!value);
  };
  return (
    <button onClick={press} className="checkbox_input_ctn">
      <label>{label}</label>
      {loading ? null : (
        <>
          {!value ? (
            <div className="checkbox">
              <Ionicons name="square-outline" />
            </div>
          ) : (
            <div className="checkbox">
              <Ionicons name="checkbox" />
            </div>
          )}
        </>
      )}
    </button>
  );
};

export const BtnPrimary = ({
  onPress,
  loading,
  isDisabled,
  text,
}: {
  onPress: any;
  isDisabled?: boolean;
  loading?: boolean;
  text: string;
}) => {
  return (
    <button
      onClick={onPress}
      disabled={isDisabled || loading ? true : false}
      className="btn_primary"
    >
      {loading ? <IconLoad /> : text}
    </button>
  );
};
export const BtnSecondary = ({
  onPress,
  loading,
  isDisabled,
  text,
  bg = "#fff",
  color = "#181818",
  b_color = "#181818",
}: {
  onPress: any;
  isDisabled?: boolean;
  loading?: boolean;
  text: string;
  bg?: string;
  color?: string;
  b_color?: string;
}) => {
  return (
    <button
      onClick={onPress}
      disabled={isDisabled || loading ? true : false}
      className="btn_primary"
      style={{
        backgroundColor: bg,
        color,
        borderColor: b_color,
      }}
    >
      {loading ? <IconLoad /> : text}
    </button>
  );
};

export const Subtitle = ({ text, fs = 16 }: { text: string; fs?: number }) => {
  return (
    <p className="subtitle_tsx" style={{ fontFamily: "Anton", fontSize: fs }}>
      {text}
    </p>
  );
};

export const Line = () => (
  <div
    style={{
      height: 1,
      width: "100%",
      backgroundColor: "#181818A6",
      marginTop: 12,
      marginBottom: 12,
    }}
  ></div>
);
