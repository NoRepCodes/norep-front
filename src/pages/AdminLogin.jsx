import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/events.api";
import { Context } from "../components/Context";
import "../sass/admin.sass";


export const AdminLogin = () => {
  const { setAdmin } = useContext(Context);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false)
  const [inputs, setInputs] = useState({
    username: "",
    pass: "",
  });

  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    setInputs({ ...inputs, [att]: value });
  };

  const confirm = async () => {
    
    setLoad(true)
    const {status,data} = await loginAdmin(inputs.username,inputs.pass)
    setLoad(false)
    if (status === 200) {
      localStorage.setItem('adm', JSON.stringify(data));
      setAdmin(data);
      navigate("/");
    }else{
      alert(data.msg)
    }
  };

  return (
    <div className="admin">
      <div className="form_ctn">
        <h6>INICIAR SESION</h6>
        <input
          type="text"
          className="user_inpt"
          placeholder="Usuario"
          onChange={onChangeText}
          name="username"
        />
        <input
          type="password"
          className="pass_inpt"
          placeholder="Contraseña"
          onChange={onChangeText}
          name="pass"
        />
        <button className="btn" onClick={confirm} disabled={load} >
          {load ? 'Cargando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
};
