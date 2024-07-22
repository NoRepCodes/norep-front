import { useContext, useEffect, useRef, useState } from "react";
import "../../pages/Results/categForm.sass";
import { Context } from "../Context";
import { useNavigate } from "react-router-dom";
import { CategoryType, EventType } from "../../types/event.t";
import { checkUsers, registerTicket } from "../../api/user.api";
const cardrex = /^[0-9]{5,9}$/gm;
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

const CategForm = ({
  category,
  event,
}: {
  category?: CategoryType;
  event: EventType;
}) => {
  const { user } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState({
    name: "",
    category_id: "",
    captain: "",
    card_2: "",
    card_3: "",
    card_4: "",
    transf: "",
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

  const navigate = useNavigate();
  const toggle = () => {
    if (!user) navigate("/login");
    // else if (category?.filter?.limit && category.slots < category.filter.limit)
    // setOpen(!open);
    else setOpen(!open);
  };
  const ocNone = () => 0;
  const ocName = (e: any) => setInputs({ ...inputs, name: e.target.value });
  const ocTransf = (e: any) => setInputs({ ...inputs, transf: e.target.value });
  const ocCard2 = (e: any) => setInputs({ ...inputs, card_2: e.target.value });
  const ocCard3 = (e: any) => setInputs({ ...inputs, card_3: e.target.value });
  const ocCard4 = (e: any) => setInputs({ ...inputs, card_4: e.target.value });

  useEffect(() => {
    setInputs({ ...inputs, card_2: "", card_3: "", card_4: "" });
  }, [category]);

  const confirm = async () => {
    if(!image) setError("Anexe un comprobante de pago antes de continuar")
    if (user && category && image) {
      setError(undefined);
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
        setError(dt.msg);
      } else {
        const {status,data} = await registerTicket(dt,category._id,inputs,image,user.phone)
        setLoad(false)
        if(status === 200){
          alert("Ticket registrado con exito!")
        }else{
          setError(data.msg)
        }
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
        <DateBox date={event.since} />
      </div>

      <button className="inscription_btn" onClick={toggle}>
        {open ? <h6>REGRESAR</h6> : <h6>INSCRIBIRSE</h6>}
      </button>
      {!open ? (
        <div className="cf_info">
          <p>
            MODALIDAD:
            {(category?.filter?.amount ?? 1) <= 1 ? "INDIVIDUAL" : "EQUIPOS"}
          </p>
          {category?.filter?.limit ? (
            <p>
              CUPOS DISPONIBLES:
              {(category?.filter?.limit ?? 0) - (category?.slots ?? 0)}
            </p>
          ) : (
            <p>CUPOS DISPONIBLES</p>
          )}
          <p>APERTURA DE INSCRIPCIONES: {event.register_time.since}</p>
          <p>CIERRE DE INSCRIPCIONES: {event.register_time.until}</p>
          <p>COSTO: {category?.price}$</p>
          {category?.filter?.age_min ? <p>EDAD MÍNIMA: {category?.filter?.age_min}</p>:null}
          {category?.filter?.age_max ? <p>EDAD MÁXIMA: {category?.filter?.age_max}</p>:null}
          {category?.filter?.female ? <p>PERTICIPANTES FEMENINAS POR EQUIPO: {category?.filter?.female}</p>:null}
          {category?.filter?.male ? <p>PERTICIPANTES MASCULINOS POR EQUIPO: {category?.filter?.male}</p>:null}
          
          
        </div>
      ) : (
        <div className="form">
          <FormCage
            label="NOMBRE DEL EQUIPO:"
            oc={ocName}
            value={inputs.name}
          />
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
          {error && <ErrorText text={error} />}

          <button className="btn_confirm" onClick={confirm}>
            
            {load?"VERIFICANDO DATOS...":"INSCRIBIRSE"}
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
      <h6 className="date_box_day">07</h6>
      <h6 className="date_box_month">SEPTIEMBRE</h6>
    </div>
  );
};

const ErrorText = ({ text }: { text: string }) => {
  return (
    <div className="error_cage">
      <InfoIcon />
      <p>{text}</p>
    </div>
  );
};

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
const InfoIcon = () => {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="red"
    >
      <path
        d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 8c-.414 0-.75.336-.75.75v5.5c0 .414.336.75.75.75s.75-.336.75-.75v-5.5c0-.414-.336-.75-.75-.75zm-.002-3c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"
        fillRule="nonzero"
      />
    </svg>
  );
};
