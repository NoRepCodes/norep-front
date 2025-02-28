import { useContext, useState } from "react";
import "./recoverPassword.sass";
import { useNavigate } from "react-router-dom";
import Context, { MsgT } from "../../../helpers/UserContext";
import { changePassword, getEmailExist } from "../../../api/api_guest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "../../../types/zod";
import Input, { BtnPrimary, BtnSecondary } from "../../../components/Input";
import {
  ViewFadeStatic,
  ViewSlide,
  ViewSlideRight,
} from "../../../components/AnimatedLayouts";

const recoverSchema = z.object({
  email: z.coerce.string().email(),
});
type RecoverFields = z.infer<typeof recoverSchema>;

const codeSchema = z.object({
  code: z.string().max(6),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});
type CodeFields = z.infer<typeof codeSchema>;
function getCode() {
  return Math.round(Math.random() * (999999 - 100000) + 100000).toString();
}

const RecoverPassword = () => {
  const { setMsg } = useContext(Context);
  const [values, setValues] = useState<
    { code?: string; email?: string } | undefined
  >(undefined);

  return (
    <div className="recoveryPass_page">
      <div className="register_bg" />
      <div className="form">
        <h5 style={{ fontSize: 24 }}>Recuperación de Contraseña</h5>

        {!values ? (
          <EmailPage {...{ setMsg, setValues }} />
        ) : (
          <CodePage {...{ setMsg, values }} />
        )}
      </div>
    </div>
  );
};

const EmailPage = ({
  setMsg,
  setValues,
}: {
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
  setValues: (x: any) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverFields>({
    resolver: zodResolver(recoverSchema),
    defaultValues: { email: "" },
  });

  const confirm = async (d: any) => {
    let aux = getCode();
    setLoading(true);
    const { status, data } = await getEmailExist(d.email, aux);
    setLoading(false);
    if (status === 200)
      setValues({
        code: aux,
        email: d.email,
      });
    else {
      setMsg({
        text: data.msg,
        type: "error",
      });
    }
  };
  return (
    <>
      <ViewSlide className="fadeView" key={1}>
        <p>
          Ingresa el correo electronico con el que te haz registrado, y te
          enviaremos un código para reiniciar tu contraseña.
        </p>
        <Input
          name="email"
          {...{ errors, control }}
          label="Correo"
          ph="ejemplo@correo.com"
        />
      </ViewSlide>
      <ViewFadeStatic key={3} className="btn_ctn">
        <BtnSecondary
          onPress={handleSubmit(confirm)}
          text="Continuar"
          bg="#181818"
          color="#F1FF48"
          loading={loading}
        />
      </ViewFadeStatic>
    </>
  );
};

const CodePage = ({
  setMsg,
  values,
}: {
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
  values?: { code?: string; email?: string };
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CodeFields>({
    resolver: zodResolver(codeSchema),
  });

  const returnLogin = () => navigate("/login");

  const confirm = async (d: any) => {
    if (!values || !values.email || !values.code) return null;
    if (d.password !== d.confirmPassword)
      setMsg({
        type: "error",
        text: "Las contraseñas no coinciden",
      });
    if (d.code !== values.code)
      return setError("root", { message: "Código Incorrecto" });
    setLoading(true);
    const { status, data } = await changePassword(values.email, d.password);
    setLoading(false);
    if (status === 200) {
      setMsg({
        type: "success",
        text: "Contraseña Actualizada!",
        onClose: ()=>{returnLogin()},
      });
    } else
      setMsg({
        type: "error",
        text: data.msg,
      });
  };
  return (
    <>
      <ViewSlideRight className="fadeView" key={2}>
        <p style={{ marginBottom: 12 }}>
          Ingrsa el código que se ha enviado a tu correo junto a la nueva
          contraseña
        </p>
        <Input
          {...{ control, errors }}
          label="Código"
          name="code"
          ph="123456"
        />
        <Input
          {...{ control, errors }}
          label="Contraseña"
          name="password"
          ph="********"
        />
        <Input
          {...{ control, errors }}
          label="Confirmar Contraseña"
          name="confirmPassword"
          ph="********"
        />
      </ViewSlideRight>
      <ViewFadeStatic key={4} className="btn_ctn">
        <BtnPrimary
          onPress={handleSubmit(confirm)}
          text="Registrarse"
          loading={loading}
        />
      </ViewFadeStatic>
    </>
  );
};

export default RecoverPassword;
