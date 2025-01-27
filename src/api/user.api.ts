import { CategoryType } from "../types/event.t";
import { UserType } from "../types/user.t";
import { catchError, url } from "./url";
import axios from "axios";

export const registerUser = async (data: any) => {
  return await axios
    .post(`${url}registerUser`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};
export const login = async (data: any) => {
  return await axios
    .post(`${url}login`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};
export const checkUsers = async (
  captain: UserType,
  card_2: string,
  card_3: string,
  card_4: string,
  category: CategoryType
) => {
  return await axios
    .post(`${url}checkUsers`, { captain, card_2, card_3, card_4, category })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};
export const registerTicket = async (
  users: any,
  category_id: string,
  inputs: any,
  image: string,
  phone: string,
  username?:string,
) => {
  const i = {...inputs}
  if(users.length < 2) i.name = username
  console.log(phone);
  return await axios
    .post(`${url}registerTicket`, { users, category_id, inputs:i, image, phone })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};
export const pushTicket = async (captain_id: string,inputs:any,img:any) => {
  return await axios
    .post(`${url}pushTicket`, { captain_id,...inputs,img })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};
