import { createContext } from "react";

const Context = createContext<ContextT>({
  userData: undefined,
  setUserData: () => {},
  msg: undefined,
  setMsg: () => {},
  adminData: undefined,
  setAdminData: () => {},
});

export type UserDataT =
  | {
      _id: string;
      name: string;
      email: string;
      shirt: "XS" | "S" | "M" | "L" | "XL" | "XXL";
      birth: string;
      card_id: string;
      phone: string;
      genre: "Masculino" | "Femenino";
      location: {
        country: string;
        state: string;
        city: string;
      };
      box: string;
    }
  | undefined;
type ContextT = {
  userData: UserDataT|undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserDataT|undefined>>;
  msg: MsgT|undefined;
  setMsg: React.Dispatch<React.SetStateAction<MsgT|undefined>>;
  adminData: { username: string; _id: string } | undefined;
  setAdminData: React.Dispatch<
    React.SetStateAction<{ username: string; _id: string } | undefined>
  >;
};

export type MsgT =
  | {
      text: string;
      type: "warning" | "error" | "success";
      onClose?: () => void;
      onConfirm?: () => void;
    }
  | undefined;

export default Context;
