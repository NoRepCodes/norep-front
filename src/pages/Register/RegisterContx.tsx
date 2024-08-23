import { createContext } from "react";

type ContextT = {
  inputs: InputT;
  setInputs: React.Dispatch<React.SetStateAction<InputT>>;
};
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
let initialVal = {
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
};

// export const Context = createContext<ContextT>(null)
export const RegisterContx = createContext<ContextT>({
  inputs: initialVal,
  setInputs: () => {},
});
