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
};

// export const Context = createContext<ContextT>(null)
export const Context = createContext<ContextT>({
  events: undefined,
  admin: undefined,
  user: undefined,
  setAdmin: () => {},
  setEvents: () => {},
  setUser: () => {},
});
