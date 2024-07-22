import { useContext, useState } from "react";
import "./register.sass";
import { registerUser } from "../../api/user.api";
import logo from "../../images/black.png";
import { Context } from "../../components/Context";
import { useNavigate } from "react-router-dom";

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
  const {setUser} = useContext(Context)
  const [load, setLoad] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState<InputT>({
    name: "",
    pass: "",
    conf: "",
    email: "",
    card_id: "",
    birth: "",
    box: "",
    phone: "",
    genre: "",
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
  const ocGenre = (e: any) => setInputs({ ...inputs, genre: e.target.value });
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
    setError(undefined)
    const validation = validate(inputs);
    if (validation) return setError(validation);
    setLoad(true)
    const { status, data } = await registerUser(inputs);
    setLoad(false)
    if (status === 200) {
      setUser(data)
      navigate("/")
    } else {
      setError(data.msg);
    }
  };

  return (
    <div className="register_page">
      <div className="form">
        <h6>REGISTRATE</h6>
        {error&&<p>{error}</p>}
        <FormCage oc={ocName} label="NOMBRE Y APELLIDO:" />
        <FormCage oc={ocEmail} label="CORREO:" />
        <FormCage secure oc={ocPass} label="CONTRASEÑA:" />
        <FormCage secure oc={ocConf} label="CONFIRMAR CONTRASEÑA:" />
        <FormCageDate oc={ocBirth} label="FECHA DE NACIMIENTO:" />
        {/* <FormCage oc={ocGenre} label="GENERO:" /> */}
        <div className="form_cage">
          <label>GÉNERO</label>
          <select onChange={ocGenre} >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <div className="line" />
        </div>
        <FormCage oc={ocCard} label="C.IDENTIFICACION:" />
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

        <button onClick={confirm}>{load?"REGISTRANDO...":"REGISTRATE"}</button>
        <img src={logo} alt="logo" />
      </div>
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
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
  // else if(inpt) return 'YYYYY'
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
}: {
  label: string;
  oc: (e: any) => void;
  secure?: boolean;
}) => {
  return (
    <div className="form_cage">
      <label htmlFor="">{label}</label>
      <input type="date" onChange={oc} />
      <div className="line" />
    </div>
  );
};
