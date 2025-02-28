import { useContext, useState } from "react";
import "./login.sass";
import logo from "../../../images/white.png";
import { useNavigate } from "react-router-dom";
import Context from "../../../helpers/UserContext";
import { useForm } from "react-hook-form";
import { z } from "../../../types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../../../api/api_guest";
import { loginAdmin } from "../../../api/api_admin";
import Input, { BtnPrimary } from "../../../components/Input";

const loginSchema = z.object({
  email: z.coerce.string().email(),
  password: z.string().min(6),
  remember: z.boolean().default(false),
});
type loginFields = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUserData, setAdminData, setMsg } = useContext(Context);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const confirm = async (values: loginFields) => {
    values.email = values.email.toLocaleLowerCase();
    if (values.email.split("@")[1] === "admin.com") {
      logAdmin(values);
    } else logUser(values);
  };

  const logUser = async (values: loginFields) => {
    setLoading(true);
    const { status, data } = await login(values);
    setLoading(false);
    if (status === 200) {
      if (values.remember) localStorage.setItem("@user_session", data._id);
      setUserData(data);
      navigate("/");
    } else setMsg({ type: "error", text: data.msg });
    // } else setError("root", { message: data.msg });
  };
  const logAdmin = async (values: loginFields) => {
    setLoading(true);
    const { status, data } = await loginAdmin(values);
    setLoading(false);
    if (status === 200) {
      if (values.remember) localStorage.setItem("@admin_session", data._id);
      setAdminData(data);
      navigate("/");
    } else setMsg({ type: "error", text: data.msg });
    // } else setError("root", { message: data.msg });
  };

  const gotoRegister = () => {
    navigate("/registro");
  };

  const goRecoveryPass = () => {
    navigate("/recuperarContraseña");
  };


  return (
    <div className="login_page">
      <div className="gradient" />
      <div className="form">
        <img src={logo} alt="logo" />
        <Input {...{ control, errors }} name="email" ph="Correo" />
        <Input {...{ control, errors }} name="password" ph="Contraseña" hidePass />
        <Input
          {...{ control, errors }}
          mode="checkbox"
          name="remember"
          label="Recordarme"
        />
        <div style={{marginTop:'auto'}} />
        <BtnPrimary onPress={handleSubmit(confirm)} loading={loading} text="Iniciar Sesión" />
        <p className="register_text" onClick={gotoRegister}>
          Aún no tienes una cuenta? <span>Regístrate ahora!</span>
        </p>
        <p className="forgotten_pass" onClick={goRecoveryPass} >Contraseña Olvidada?</p>
      </div>
    </div>
  );
};

export default Login;
