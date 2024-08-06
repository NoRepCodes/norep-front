import { createContext } from "react";
import { EventType } from "../types/event.t";
import { UserType } from "../types/user.t";

type ContextT = {
  user?: UserType;
  events?: EventType[];
  admin?: any;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserType|undefined>>;
  setEvents: React.Dispatch<React.SetStateAction<EventType[] | undefined>>;
  msg: MsgT;
  setMsg: React.Dispatch<React.SetStateAction<MsgT>>;
};


export type MsgT = {
  type: "none"|"success"|"error"|"warning";
  open?: boolean;
  msg: string;
};

// export const Context = createContext<ContextT>(null)
export const Context = createContext<ContextT>({
  events: undefined,
  admin: undefined,
  user: undefined,
  msg: {
    msg: "",
    open: false,
    type: "none",
  },
  setAdmin: () => {},
  setEvents: () => {},
  setUser: () => {},
  setMsg: () => {},
});
