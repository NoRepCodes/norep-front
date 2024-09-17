import { useContext, useState } from "react";
import "./login.sass";
import logo from "../../images/white.png";
import { login } from "../../api/user.api";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../components/Context";

const Login = () => {
  const { setUser, admin, setAdmin, setMsg } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [input, setInput] = useState({
    email: "",
    pass: "",
  });

  const ocEmail = (e: any) => setInput({ ...input, email: e.target.value });
  const ocPass = (e: any) => setInput({ ...input, pass: e.target.value });
  const navigate = useNavigate();

  const confirm = async () => {
    if (admin)
      return setMsg({
        msg: "Cierre sesion como administrador antes de iniciar sesion",
        open: true,
        type: "warning",
      });
    setLoad(true);
    const { status, data } = await login(input);
    setLoad(false);
    if (status === 200) {
      if (input.email[0] === "@") {
        localStorage.setItem("adm", JSON.stringify(data));
        setAdmin(true);
      } else {
        localStorage.setItem("@user", JSON.stringify(data));
        setUser(data);
      }
      navigate("/");
    } else {
      setMsg({
        msg: data.msg,
        type: "error",
        open: true,
      });
    }
  };

  return (
    <div className="login_page">
      <div className="form">
        <img src={logo} alt="logo" />
        <input
          type="text"
          onChange={ocEmail}
          value={input.email}
          placeholder="Correo"
        />
        <input
          type="password"
          onChange={ocPass}
          value={input.pass}
          placeholder="Contraseña"
        />
        <div className="btns_ctn">
          <button onClick={confirm}>
            {load ? "INICIANDO SESION..." : "INICIAR SESION"}
          </button>
          <Link to="/registro">REGISTRATE</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
