import { UserDataT } from "../helpers/UserContext";
import { CategFields } from "../types/event";
import { PushDueFields, TicketFields } from "../types/zod/registerTicket.zod";
import { UpdateUserFields } from "../types/zod/registerUser.zod";
import { catchError, url } from "./url";
import axios from "axios";


export const updateUserInfo = async (data: UpdateUserFields) => {
  return await axios
    .post(`${url}updateUserInfo`, data)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const checkUsers = async (
  category: CategFields,
  captain: UserDataT,
  card_2?: string,
  card_3?: string,
  card_4?: string
) => {
  console.log('wtf?????');
  return await axios
    .post(`${url}checkUsers`, { captain, card_2, card_3, card_4, category })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const registerTicket = async (users: any, values: TicketFields,category_id:string) => {
  let fixValues = { ...values,category_id };
  let aux = values.users.map((u) => u.card_id);
  //@ts-ignore
  fixValues.users = aux;

  return await axios
    .post(`${url}registerTicket`, { users, values: fixValues })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const pushTicket = async (values: PushDueFields) => {
  return await axios
    .post(`${url}pushTicket`, values)
    .then((res) => res)
    .catch((err) => catchError(err));
};
