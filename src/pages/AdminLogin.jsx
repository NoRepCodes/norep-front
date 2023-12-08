import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../components/Context";
import "../sass/admin.sass";

const idk = {
  a: "admin2023",
  b: "07122023",
};

export const AdminLogin = () => {
  const { setAdmin } = useContext(Context);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    pass: "",
  });

  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    setInputs({ ...inputs, [att]: value });
  };

  const confirm = () => {
    if (inputs.username === idk.a && inputs.pass === idk.b) {
      setAdmin(true);
      navigate("/");
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
        <div className="btn" onClick={confirm}>
          <p>Ingresar</p>
        </div>
      </div>
    </div>
  );
};
