// import { Banner } from "../../../components/Banner";
import { useParams } from "react-router-dom";
import { IconLoad, Ionicons } from "../../../components/Icons";
import { InfoItem, InfoLabel } from "../../../components/Info";
import { useContext, useEffect, useState } from "react";
import { getUserInfo } from "../../../api/api_admin";
import Context, { UserDataT } from "../../../helpers/UserContext";
import { useForm } from "react-hook-form";
import {
  editUserSchema,
  UpdateUserFields,
  userUpdateField,
  userUpdateField2,
} from "../../../types/zod/registerUser.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserInfo } from "../../../api/api_user";
import Input, { BtnSecondary } from "../../../components/Input";

const Profile = () => {
  const { _id } = useParams();

  const { userData, setMsg, adminData } = useContext(Context);
  const [userInfo, setUserInfo] = useState<UserDataT>(undefined);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      // if (userData && userData._id === _id) {
      //   setUserInfo(userData);
      // }

      if (userData) return setUserInfo(userData);
      setLoading(true);
      const { status, data } = await getUserInfo(_id ?? "");
      setLoading(false);
      if (status === 200) {
        setUserInfo(data);
      } else setMsg({ type: "error", text: data.msg });
    })();
  }, []);

  return (
    <>
      <div className="min-h-[550px] md:min-h-[450px] pb-8">
        {loading && !userData ? (
          <div className="flex justify-center h-full">
            <IconLoad />
          </div>
        ) : null}
        {userInfo || (userInfo && adminData) ? (
          <>
            <TopDisplay
              {...{ edit, setEdit, userInfo, _id, userData, adminData }}
            />
            {!edit ? (
              <BottomDisplay {...{ userInfo }} />
            ) : (
              <BottomInputs
                {...{ userInfo, setUserInfo, setEdit, adminData }}
              />
            )}
          </>
        ) : null}
      </div>
      {/* <Banner /> */}
    </>
  );
};

export default Profile;
const TopDisplay = ({
  edit,
  setEdit,
  userInfo,
  _id,
  userData,
  adminData,
}: {
  userInfo: UserDataT;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  _id?: string;
  userData: UserDataT;
  adminData: { username: string; _id: string } | undefined;
}) => {
  return (
    <div className="h-25 bg-fourth flex justify-center ">
      <div className="w-80 h-20 -mb-4 self-end flex items-end gap-6 md:w-150">
        <UserIcon />
        <p className="font-medium font-Roboto mb-6 text-white text-xl">
          {userInfo ? userInfo.name : ""}
        </p>
        {(userData && _id && userData._id === _id) || adminData ? (
          <div
            className="mb-6 ml-auto cursor-pointer"
            onClick={() => setEdit(!edit)}
          >
            {edit ? (
              <Ionicons name="close-circle-outline" color="#fff" size={24} />
            ) : (
              <Ionicons name="pencil-outline" color="#fff" size={24} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
const scale = 1;
const BottomDisplay = ({ userInfo }: { userInfo: NonNullable<UserDataT> }) => {
  return (
    <div className="flex justify-center py-4 ">
      <div className="w-150 -mb-4 flex items-center gap-6 flex-col md:flex-row">
        <div className="flex-1 flex flex-col gap-3 min-w-80">
          <InfoLabel label="Info. Personal" />
          <InfoItem
            Icon={IconCard}
            value={userInfo._id}
            icon_name="idk"
            label="Cedula"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.genre}
            icon_name="male-female"
            label="Genero"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.shirt}
            icon_name="shirt"
            label="Talla"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.birth}
            icon_name="calendar"
            label="Nacimiento"
            {...{ scale }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-3 min-w-80">
          <InfoLabel label="Info. Personal" />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.box}
            icon_name="barbell"
            label="Box"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.phone}
            icon_name="call"
            label="Nro.Telefonico"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={userInfo.email}
            icon_name="mail"
            label="Correo"
            {...{ scale }}
          />
          <InfoItem
            Icon={Ionicons}
            value={`${userInfo.location.country} - ${userInfo.location.state} - ${userInfo.location.city}`}
            icon_name="compass"
            label="Ubicacion"
            {...{ scale }}
          />
        </div>
      </div>
    </div>
  );
};

const BottomInputs = ({
  userInfo,
  setUserInfo,
  setEdit,
  adminData,
}: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserDataT;
  setUserInfo: React.Dispatch<React.SetStateAction<UserDataT>>;
  adminData: { username: string; _id: string } | undefined;
}) => {
  const { setMsg, userData, setUserData } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFields>({
    resolver: zodResolver(editUserSchema),
    defaultValues: userInfo,
  });

  const confirm = async (dta: UpdateUserFields) => {
    setLoading(true);
    const { status, data } = await updateUserInfo(dta);
    setLoading(false);
    if (status === 200) {
      if (userData) setUserData(data);
      setUserInfo(data);
      setEdit(false);
      setMsg({
        type: "success",
        text: "Perfil actualizado con éxito!",
      });
    } else setMsg({ type: "error", text: data.msg });
  };

  return (
    <div className="flex justify-center py-4 flex-col items-center">
      <div className="w-full -mb-4 flex items-center  gap-6 flex-col md:flex-row md:max-w-170 md:items-start">
        <div className="flex-1 flex flex-col gap-3 min-w-80">
          <InfoLabel label="Info. Personal" />
          <Input
            {...{ control, errors }}
            key={98}
            label="Cédula"
            ph="Ej: 22657819"
            name="card_id"
            isDisabled={adminData ? false : true}
          />
          {userUpdateField.map((itm, i) => (
            <Input {...{ control, errors }} key={i} {...itm} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3 min-w-80">
          <InfoLabel label="Info. Contacto" />
          <Input
            {...{ control, errors }}
            label="Email"
            ph="ejemplo@gmail.com"
            name="email"
            isDisabled={adminData ? false : true}
            key={99}
          />
          {userUpdateField2.map((itm, i) => (
            <Input {...{ control, errors }} key={i} {...itm} />
          ))}
        </div>
      </div>
      <div className="md:w-170 md:flex md:justify-end">
        <div className="flex mt-16 w-80 gap-4 md:self-end ">
          <BtnSecondary onPress={() => reset()} text="Cancelar" />
          <BtnSecondary
            bg="#9747FF"
            color="#fff"
            onPress={handleSubmit(confirm)}
            text="Confirmar"
            font_weigth={400}
            isDisabled={!isDirty || loading}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      viewBox="0 0 24 24"
      className="fill-[#d1d1d1] bg-white rounded-[100px] p-1 "
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-3.123 0-5.914-1.441-7.749-3.69.259-.588.783-.995 1.867-1.246 2.244-.518 4.459-.981 3.393-2.945-3.155-5.82-.899-9.119 2.489-9.119 3.322 0 5.634 3.177 2.489 9.119-1.035 1.952 1.1 2.416 3.393 2.945 1.082.25 1.61.655 1.871 1.241-1.836 2.253-4.628 3.695-7.753 3.695z" />
    </svg>
  );
};

const IconCard = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d="M528 32H48C21.5 32 0 53.5 0 80v16h576V80c0-26.5-21.5-48-48-48zM0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V128H0v304zm352-232c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zM176 192c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM67.1 396.2C75.5 370.5 99.6 352 128 352h8.2c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h8.2c28.4 0 52.5 18.5 60.9 44.2 3.2 9.9-5.2 19.8-15.6 19.8H82.7c-10.4 0-18.8-10-15.6-19.8z" />
    </svg>
  );
};
