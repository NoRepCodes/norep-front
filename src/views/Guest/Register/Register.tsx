import { useContext, useEffect, useState } from "react";
import "./register.sass";
import logo from "../../../images/black.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Ionicons } from "../../../components/Icons";
import Context from "../../../helpers/UserContext";
import { registerUser } from "../../../api/api_guest";
import { useForm } from "react-hook-form";
import {
  registerField,
  registerField2,
  RegisterFields,
  registerSchema,
} from "../../../types/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDefaults } from "../../../types/zod";
import Input, { BtnPrimary, BtnSecondary } from "../../../components/Input";
import {
  ViewFadeStatic,
  ViewSlide,
  ViewSlideRight,
} from "../../../components/AnimatedLayouts";

const registerDefaults = getDefaults(registerSchema);
const Register = () => {
  const { setUserData, setMsg } = useContext(Context);
  const [next, setNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaults,
  });

  const nextPress = () => setNext(true);

  const confirm = async (values: RegisterFields) => {
    setLoading(true);
    const { status, data } = await registerUser(values);
    setLoading(false);
    if (status === 200) {
      setUserData(data);
      setMsg({
        type: "success",
        text: "Cuenta creada con éxito!",
        onClose: () => navigate("/"),
      });
    } else {
      setError("root", { message: data.msg });
    }
  };

  useEffect(() => {
    const { name, card_id, email, password, confirmPassword, birth } = errors;
    if (name || card_id || email || password || confirmPassword || birth) {
      setNext(false);
    }
  }, [errors]);

  return (
    <div className="register_page">
      <div className="register_bg" />
      <div className="form">
        <BtnBack {...{ next, setNext }} />
        <img src={logo} alt="norep_logo" />
        <h6>REGISTRATE</h6>
        <div className="steps_ctn">
          <div className="step" />
          <div className="step" style={{ opacity: next ? 1 : 0.5 }} />
        </div>
        {!next ? (
          <SideLeft {...{ control, errors, nextPress }} />
        ) : (
          <SideRight {...{ control, errors, handleSubmit, confirm, loading }} />
        )}
      </div>
    </div>
  );
};

const BtnBack = ({ next, setNext }: { next: boolean; setNext: any }) => {
  return (
    <AnimatePresence>
      {!next ? null : (
        <ViewFadeStatic
          className="back_btn"
          onClick={() => {
            setNext(false);
          }}
        >
          <Ionicons name="chevron-back-outline" />
        </ViewFadeStatic>
      )}
    </AnimatePresence>
  );
};

const SideLeft = ({ control, errors, nextPress }: any) => {
  return (
    <>
      <ViewSlide className="fadeView" key={1}>
        {registerField.map((itm, i) => (
          <Input {...{ control, errors }} {...itm} key={i} />
        ))}
      </ViewSlide>
      <ViewFadeStatic key={3} className="btn_ctn">
        <BtnSecondary
          onPress={nextPress}
          text="Continuar"
          bg="#181818"
          color="#fff"
        />
      </ViewFadeStatic>
    </>
  );
};

const SideRight = ({ control, errors, handleSubmit, confirm,loading }: any) => {
  return (
    <>
      <ViewSlideRight className="fadeView" key={2}>
        {registerField2.map((itm, i) => (
          <Input {...{ control, errors }} {...itm} key={i} />
        ))}
      </ViewSlideRight>
      <ViewFadeStatic key={4} className="btn_ctn">
        <BtnPrimary onPress={handleSubmit(confirm)} text="Registrarse" loading={loading} />
      </ViewFadeStatic>
    </>
  );
};

export default Register;
