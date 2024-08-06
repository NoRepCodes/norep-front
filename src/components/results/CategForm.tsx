import { useContext, useEffect, useRef, useState } from "react";
import "../../pages/Results/categForm.sass";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";
import { CategoryType, EventType } from "../../types/event.t";
import { checkUsers, pushTicket, registerTicket } from "../../api/user.api";
//@ts-ignore
import moment from "moment";
// const cardrex = /^[0-9]{5,9}$/gm;
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

const resetCategForm = {
  name: "",
  category_id: "",
  captain: "",
  payDues: "",
  card_2: "",
  card_3: "",
  card_4: "",
  transf: "",
};
const CategForm = ({
  category,
  event,
  setCategory,
}: {
  category?: CategoryType;
  event: EventType;
  setCategory: React.Dispatch<CategoryType>;
}) => {
  const { user, setMsg } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);

  // const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState({ ...resetCategForm });
  const [inputs2, setInputs2] = useState({
    transf: "",
    payDues: "",
  });
  const [image, setImage] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement | null>(null);
  const clickInputImg = () => ref?.current?.click();
  const handleFile = async (e: any) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      if (typeof base64 === "string") {
        setImage(base64);
      }
    }
  };
  const [image2, setImage2] = useState<string | undefined>();
  const ref2 = useRef<HTMLInputElement | null>(null);
  const clickInputImg2 = () => ref2?.current?.click();
  const handleFile2 = async (e: any) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      if (typeof base64 === "string") {
        setImage2(base64);
      }
    }
  };

  const navigate = useNavigate();
  const toggle = () => {
    if (!user) navigate("/login");
    // else if (category?.filter?.limit && category.slots < category.filter.limit)
    // setOpen(!open);
    else setOpen(!open);
  };
  const toggle2 = () => {
    if (!user) navigate("/login");
    // else if (category?.filter?.limit && category.slots < category.filter.limit)
    // setOpen(!open);
    else setOpen2(!open2);
  };
  const ocNone = () => 0;
  const ocName = (e: any) => setInputs({ ...inputs, name: e.target.value });
  const ocTransf = (e: any) => setInputs({ ...inputs, transf: e.target.value });
  const ocCard2 = (e: any) => setInputs({ ...inputs, card_2: e.target.value });
  const ocCard3 = (e: any) => setInputs({ ...inputs, card_3: e.target.value });
  const ocCard4 = (e: any) => setInputs({ ...inputs, card_4: e.target.value });
  const ocDues = (e: any) => {
    let aux = e.target.value;
    let v = aux.charAt(aux.length - 1);
    if (v.match(/^[1-9]$/gm)) {
      // setInputs({ ...inputs, payDues: v })
      if (parseInt(v) <= event.dues) setInputs({ ...inputs, payDues: v });
    }
  };

  const ocTransf2 = (e: any) =>
    setInputs2({ ...inputs2, transf: e.target.value });
  const ocDues2 = (e: any) => {
    let aux = e.target.value;
    let v = aux.charAt(aux.length - 1);
    if (v.match(/^[1-9]$/gm)) {
      // setInputs({ ...inputs, payDues: v })
      if (parseInt(v) <= event.dues) setInputs2({ ...inputs2, payDues: v });
    }
  };

  useEffect(() => {
    setInputs({ ...inputs, card_2: "", card_3: "", card_4: "" });
  }, [category]);

  const confirm = async () => {
    if (!image)
      setMsg({
        msg: "Anexe un comprobante de pago antes de continuar",
        type: "warning",
        open: true,
      });
    if (user && category && image) {
      setLoad(true);
      const { status: st, data: dt } = await checkUsers(
        user,
        inputs.card_2,
        inputs.card_3,
        inputs.card_4,
        category
      );
      if (st !== 200) {
        setLoad(false);
        setMsg({
          msg: dt.msg,
          type: "warning",
          open: true,
        });
      } else {
        const { status, data } = await registerTicket(
          dt,
          category._id,
          inputs,
          image,
          user.phone
        );
        setLoad(false);
        if (status === 200) {
          setInputs({ ...resetCategForm });
          setCategory({ ...category, slots: category.slots + 1 });
          setOpen(false);
          setMsg({
            msg: "Solicitud registrada con exito!",
            type: "success",
            open: true,
          });
        } else {
          setMsg({
            msg: data.msg,
            type: "warning",
            open: true,
          });
        }
      }
    }
  };

  const confirm2 = async () => {
    if (!image2)
      setMsg({
        msg: "Anexe un comprobante de pago antes de continuar",
        type: "warning",
        open: true,
      });
    else {
      setLoad2(true);
      const { status, data } = await pushTicket(
        user?._id ?? "",
        inputs2,
        image2
      );
      setLoad2(false);
      if (status === 200) {
        setInputs2({
          transf: "",
          payDues: "",
        });
        setOpen2(false);
        setMsg({
          msg: "Comprobante de pago enviado con éxito! Un administrador verificará los datos y se le notificará mediante un correo electrónico.",
          type: "success",
          open: true,
        });
      } else {
        setMsg({
          msg: data.msg,
          type: "warning",
          open: true,
        });
      }
    }
  };
  return (
    <div className="categ_form">
      <div>
        <h6 className="cf_title">{event.name.toUpperCase()}</h6>
        <div className="h6_line" />
      </div>
      <div className="dates_ctn">
        <DateBox date={event.since} />
        <DateBox date={event.until} />
      </div>

      {open2 ? null : (
        <button className="inscription_btn" onClick={toggle}>
          {open ? <h6>REGRESAR</h6> : <h6>INSCRIBIRSE</h6>}
        </button>
      )}
      {open || event.dues <= 1 ? null : (
        <button className="inscription_btn" onClick={toggle2}>
          {open2 ? <h6>REGRESAR</h6> : <h6>PAGAR CUOTA</h6>}
        </button>
      )}
      {!open && !open2 ? <CategInfo {...{ category, event }} /> : null}
      {!open ? null : (
        <div className="form">
          {category?.filter?.amount && category?.filter?.amount > 1 ? (
            <FormCage
              label="NOMBRE DEL EQUIPO:"
              oc={ocName}
              value={inputs.name}
            />
          ) : null}
          <FormCage
            label="CATEGORIA:"
            oc={ocNone}
            value={category?.name.toUpperCase() ?? ""}
            disabled
          />
          <FormCage
            label="C.I CAPITÁN:"
            oc={ocNone}
            value={user?.card_id ?? ""}
            disabled
          />
          {(category?.filter?.amount ?? 0) >= 2 && (
            <FormCage
              label="C.I 2DO ATLETA:"
              oc={ocCard2}
              value={inputs.card_2}
            />
          )}
          {(category?.filter?.amount ?? 0) >= 3 && (
            <FormCage
              label="C.I 3ER ATLETA:"
              oc={ocCard3}
              value={inputs.card_3}
            />
          )}
          {(category?.filter?.amount ?? 0) >= 4 && (
            <FormCage
              label="C.I 4TO ATLETA:"
              oc={ocCard4}
              value={inputs.card_4}
            />
          )}
          <input
            type="file"
            style={{ display: "none" }}
            ref={ref}
            onChange={handleFile}
          />
          <div className="file_cage" onClick={clickInputImg}>
            {image ? (
              <img src={image} alt="x" />
            ) : (
              <>
                <CameraIcon />
                <h6>COMPROBANTE DE PAGO</h6>
              </>
            )}
          </div>
          <FormCage
            label="NRO. TRANSFERENCIA:"
            oc={ocTransf}
            value={inputs.transf}
          />
          <FormCage
            label={`CUOTAS A PAGAR. (MAX ${event.dues})`}
            oc={ocDues}
            value={inputs.payDues}
          />
          {/* {error && <ErrorText text={error} />} */}

          <button className="btn_confirm" onClick={confirm} disabled={load}>
            {load ? "VERIFICANDO DATOS..." : "INSCRIBIRSE"}
          </button>
        </div>
      )}
      {!open2 ? null : (
        <div className="form">
          <FormCage
            label="CATEGORIA:"
            oc={ocNone}
            value={category?.name.toUpperCase() ?? ""}
            disabled
          />
          <FormCage
            label="C.I CAPITÁN:"
            oc={ocNone}
            value={user?.card_id ?? ""}
            disabled
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={ref2}
            onChange={handleFile2}
          />
          <div className="file_cage" onClick={clickInputImg2}>
            {image2 ? (
              <img src={image2} alt="x" />
            ) : (
              <>
                <CameraIcon />
                <h6>COMPROBANTE DE PAGO</h6>
              </>
            )}
          </div>
          <FormCage
            label="NRO. TRANSFERENCIA:"
            oc={ocTransf2}
            value={inputs2.transf}
          />
          <FormCage
            label={`NRO. DE CUOTA A PAGAR. (MAX ${event.dues})`}
            oc={ocDues2}
            value={inputs2.payDues}
          />

          <button className="btn_confirm" onClick={confirm2} disabled={load2}>
            {load2 ? "VERIFICANDO DATOS..." : "ENVIAR COMPROBANTE"}
          </button>
        </div>
      )}
    </div>
  );
};

const FormCage = ({
  label,
  oc,
  value,
  disabled,
}: {
  label: string;
  oc: (e: any) => void;
  value: string;
  disabled?: boolean;
}) => {
  return (
    <div className="form_cage">
      <label htmlFor="">{label}</label>
      <input type="text" onChange={oc} value={value} disabled={disabled} />
    </div>
  );
};

const DateBox = ({ date }: { date: string }) => {
  return (
    <div className="date_box">
      <h6 className="date_box_day">{moment(date).format("DD")}</h6>
      <h6 className="date_box_month">
        {getMonthName(moment(date).format("MM"))}
      </h6>
    </div>
  );
};

const getMonthName = (s: string) => {
  // console.log(s);
  switch (s) {
    case "01":
      return "ENERO";
    case "02":
      return "FEBRERO";
    case "03":
      return "MARZO";
    case "04":
      return "ABRIL";
    case "05":
      return "MAYO";
    case "06":
      return "JUNIO";
    case "07":
      return "JULIO";
    case "08":
      return "AGOSTO";
    case "09":
      return "SEPTIEMBRE";
    case "10":
      return "OCTUBRE";
    case "11":
      return "NOVIEMBRE";
    case "12":
      return "DICIEMBRE";
    default:
      return "";
    // case '12': return 'ENERO'
  }
};

// const ErrorText = ({ text }: { text: string }) => {
//   return (
//     <div className="error_cage">
//       <InfoIcon />
//       <p>{text}</p>
//     </div>
//   );
// };

export default CategForm;

const CameraIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="#959595"
    >
      <path d="M5 5h-3v-1h3v1zm8 5c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm11-4v15h-24v-15h5.93c.669 0 1.293-.334 1.664-.891l1.406-2.109h8l1.406 2.109c.371.557.995.891 1.664.891h3.93zm-19 4c0-.552-.447-1-1-1-.553 0-1 .448-1 1s.447 1 1 1c.553 0 1-.448 1-1zm13 3c0-2.761-2.239-5-5-5s-5 2.239-5 5 2.239 5 5 5 5-2.239 5-5z" />
    </svg>
  );
};
// const InfoIcon = () => {
//   return (
//     <svg
//       clipRule="evenodd"
//       fillRule="evenodd"
//       strokeLinejoin="round"
//       strokeMiterlimit="2"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//       fill="red"
//     >
//       <path
//         d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"
//         fillRule="nonzero"
//       />
//     </svg>
//   );
// };

const CategInfo = ({
  category,
  event,
}: {
  category?: CategoryType;
  event: EventType;
}) => {
  if (!category) return null;

  const { filter, slots, price } = category;
  const { amount, limit, male, female, age_min, age_max } = filter ?? {};

  return (
    <div className="cf_info">
      <div className="label_info">
        <p className="p_label idk02">MODALIDAD</p>
        <div className="idk01">
          <p className="p_info">
            {(amount ?? 1) <= 1 ? "INDIVIDUAL" : "EQUIPOS"}
          </p>
          {male ? <p className="p_info"> - {male} HOMBRES</p> : null}
          {female ? <p className="p_info"> - {female} MUJERES</p> : null}
        </div>
      </div>
      {limit ? (
        <LabelInfo
          label="CUPOS DISPONIBLES:"
          info={((limit ?? 0) - (slots ?? 0)).toString() + " CUPOS"}
        />
      ) : null}
      <LabelInfo
        label="APERTURA DE INSCRIPCIONES"
        info={event.register_time.since}
      />
      <LabelInfo
        label="CIERRE DE INSCRIPCIONES"
        info={event.register_time.until}
      />
      <LabelInfo label="COSTO" info={`${price}$`} />
      {event.dues ? (
        <LabelInfo label="CUOTAS" info={event.dues.toString() + " CUOTAS"} />
      ) : null}
      {age_min ? (
        <LabelInfo label="EDAD MÍNIMA" info={age_min.toString() + " AÑOS"} />
      ) : null}
      {age_max ? (
        <LabelInfo label="EDAD MÁXIMA" info={age_max.toString() + " AÑOS"} />
      ) : null}
    </div>
  );
};

const LabelInfo = ({ label, info }: { label: string; info: string }) => {
  return (
    <div className="label_info">
      <p className="p_label">{label}</p>
      <p className="p_info">{info}</p>
    </div>
  );
};
