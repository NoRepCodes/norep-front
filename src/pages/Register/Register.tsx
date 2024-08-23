import { useContext, useState } from "react";
import "./register.sass";
import { registerUser } from "../../api/user.api";
import logo from "../../images/black.png";
import { Context } from "../../components/Context";
import { useNavigate } from "react-router-dom";
import useScreen from "../../hooks/useSize";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowTurnBack } from "../../components/Icons";

type InputT = {
  name: string;
  pass: string;
  conf: string;
  email: string;
  card_id: string;
  birth: string;
  phone: string;
  box: string;
  genre: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  shirt: string;
};

const Register = () => {
  const { setUser, setMsg } = useContext(Context);
  // const { inputs, setInputs } = useContext(RegisterContx);
  const [load, setLoad] = useState(false);
  const [next, setNext] = useState(false);
  const { ww} = useScreen();
  const [inputs, setInputs] = useState<InputT>({
    name: "",
    pass: "",
    conf: "",
    email: "",
    card_id: "",
    birth: "",
    box: "",
    phone: "",
    genre: "Masculino",
    location: {
      country: "",
      state: "",
      city: "",
    },
    shirt: "",
  });
  const ocName = (e: any) => setInputs({ ...inputs, name: e.target.value });
  const ocPass = (e: any) => setInputs({ ...inputs, pass: e.target.value });
  const ocConf = (e: any) => setInputs({ ...inputs, conf: e.target.value });
  const ocEmail = (e: any) => setInputs({ ...inputs, email: e.target.value });
  const ocCard = (e: any) => {
    setInputs({ ...inputs, card_id: e.target.value });
  };
  const ocBirth = (e: any) => setInputs({ ...inputs, birth: e.target.value });
  const ocBox = (e: any) => setInputs({ ...inputs, box: e.target.value });
  const ocGenre = (e: any) => {
    console.log(e);
    setInputs({ ...inputs, genre: e.target.value });
  };
  const ocPhone = (e: any) => setInputs({ ...inputs, phone: e.target.value });
  const ocCountry = (e: any) =>
    setInputs({
      ...inputs,
      location: { ...inputs.location, country: e.target.value },
    });
  const ocState = (e: any) =>
    setInputs({
      ...inputs,
      location: { ...inputs.location, state: e.target.value },
    });
  const ocCity = (e: any) =>
    setInputs({
      ...inputs,
      location: { ...inputs.location, city: e.target.value },
    });
  const ocShirt = (e: any) => setInputs({ ...inputs, shirt: e.target.value });
  const navigate = useNavigate();

  const confirm = async () => {
    const validation = validate(inputs);
    if (validation)
      return setMsg({
        msg: validation,
        open: true,
        type: "warning",
      });
    setLoad(true);
    const { status, data } = await registerUser(inputs);
    setLoad(false);
    if (status === 200) {
      setUser(data);
      navigate("/");
      setMsg({
        msg: "Su cuenta ha sido registrada con exito!",
        open: true,
        type: "success",
      });
    } else {
      setMsg({
        msg: data.msg,
        open: true,
        type: "error",
      });
    }
  };

  const continueReg = async () => {
    setNext(true);
  };
  const backReg = async () => {
    setNext(false);
  };

  return (
    <div className="register_page">
      {/* <RegisterContx.Provider value={{inputs,setInputs}} > */}
      <div className="form">
        <div className="counter">
          <p className="counter_title">PASO</p>
          <p className="counter_num">{!next ? "1" : "2"}</p>
        </div>
        {ww > 1000 && next && (
          <div className="arrow_back" onClick={backReg}>
            <ArrowTurnBack />
          </div>
        )}
        <div className="title_progress">
          <h6>REGISTRATE</h6>
        </div>
        <AnimatePresence>
          <>
            {(ww > 1000 && !next) || ww < 1000 ? (
              <motion.div
                className="step_1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormCage oc={ocName} label="NOMBRE Y APELLIDO:" />
                <FormCage oc={ocEmail} label="CORREO:" />
                <FormCage secure oc={ocPass} label="CONTRASEÑA:" />
                <FormCage secure oc={ocConf} label="CONFIRMAR CONTRASEÑA:" />
                <FormCageDate
                  oc={ocBirth}
                  label="FECHA DE NACIMIENTO:"
                  defaultValue="2000-01-01"
                />
                {ww > 1000 && <button onClick={continueReg}>CONTINUAR</button>}
              </motion.div>
            ) : null}

            {(ww > 1000 && next) || ww < 1000 ? (
              <motion.div
                className="step_2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormCage oc={ocCard} label="C.IDENTIFICACION:" />
                <div className="form_cage">
                  <label>GÉNERO</label>
                  <select onChange={ocGenre} value={inputs.genre}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                  <div className="line" />
                </div>
                <div className="location">
                  <FormCage oc={ocCountry} label="PAIS:" />
                  <FormCage oc={ocState} label="ESTADO:" />
                  <FormCage oc={ocCity} label="CIUDAD:" />
                </div>
                <FormCage oc={ocBox} label="CENTRO DE ENTRENAMIENTO:" />
                <div className="shirt">
                  <FormCage oc={ocShirt} label="TALLA FRANELA:" />
                  <FormCage oc={ocPhone} label="TELEFONO:" />
                </div>
                <button onClick={confirm}>
                  {load ? "REGISTRANDO..." : "REGISTRATE"}
                </button>
              </motion.div>
            ) : null}
          </>
        </AnimatePresence>

        {/* <button onClick={confirm}>
          {load ? "REGISTRANDO..." : "REGISTRATE"}
        </button> */}
        <img src={logo} alt="logo" />
      </div>
      {/* </RegisterContx.Provider> */}
    </div>
  );
};

export default Register;
const emailrex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cardrex = /^[0-9]{5,9}$/gm;
const validate = (inpt: InputT) => {
  if (inpt.name.length <= 0) return "Nombre debe tener almenos 2 caracteres";
  else if (!emailrex.test(inpt.email)) return "Formato de correo inválido";
  else if (inpt.pass.length < 6)
    return "La contraseña debe tener almenos 6 caracteres";
  else if (inpt.pass !== inpt.conf) return "Las contraseñas no coinciden";
  else if (!cardrex.test(inpt.card_id)) return "Introduzca una cédula válida";
  else return undefined;
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
};

const FormCage = ({
  label,
  oc,
  secure,
}: {
  label: string;
  oc: (e: any) => void;
  secure?: boolean;
}) => {
  return (
    <div className="form_cage">
      <label htmlFor="">{label}</label>
      <input type={secure ? "password" : "text"} onChange={oc} />
      <div className="line" />
    </div>
  );
};
const FormCageDate = ({
  label,
  oc,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
  oc: (e: any) => void;
  secure?: boolean;
}) => {
  return (
    <div className="form_cage">
      <label htmlFor="">{label}</label>
      <input type="date" onChange={oc} defaultValue={defaultValue} />
      <div className="line" />
    </div>
  );
};
