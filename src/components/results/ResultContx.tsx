import { createContext } from "react";
import { CategoryType, EventType, WodType } from "../../types/event.t";
// import { UserType } from "../types/user.t";

type ContextT = {
  event: EventType | undefined;
  setEvent: React.Dispatch<React.SetStateAction<EventType | undefined>>;
  category: CategoryType | undefined;
  setCategory: React.Dispatch<React.SetStateAction<CategoryType | undefined>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  kg: boolean | undefined;
  setKg: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  wods: WodType[] | undefined;
  setWods: React.Dispatch<React.SetStateAction<WodType[] | undefined>>;
  wodInfo: WodType | undefined;
  setWodInfo: React.Dispatch<React.SetStateAction<WodType | undefined>>;
};

// export type MsgT = {
//   type: "none"|"success"|"error"|"warning"|"text";
//   open?: boolean;
//   msg: string;
// };

// export const Context = createContext<ContextT>(null)
export const ResultContext = createContext<ContextT>({
    event:undefined,
    setEvent:()=>{},
    category:undefined,
    setCategory:()=>{},
    input:"",
    setInput:()=>{},
    kg:undefined,
    setKg:()=>{},
    wods:undefined,
    setWods:()=>{},
    wodInfo:undefined,
    setWodInfo:()=>{}
});
