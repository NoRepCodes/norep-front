import { RegisterFields } from "../types/register";
import { catchError, url } from "./url";
import axios from "axios";


export const login = async (data: any) => {
  return await axios
    .post(`${url}login`, data)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const registerUser = async (data: RegisterFields) => {
  return await axios
    .post(`${url}registerUser`, data)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const getEvents = async () => {
  return await axios
    .get(`${url}getEvents`)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const getEventTable = async (_id: string) => {
  return await axios
    .get(`${url}getEventTable?_id=${_id}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const getLatestEvent = async () => {
  return await axios
    .get(`${url}getLatestEvent`)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const getEmailExist = async (email: string, code: string) => {
  return await axios
    .get(`${url}getEmailExist?email=${email}&code=${code}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const changePassword = async (email: string, password: string) => {
  return await axios
    .post(`${url}changePassword`, { email, password })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const getVersion = async ({
  cacheAdmin,
  cacheUser,
}: {
  cacheAdmin?: string|null;
  cacheUser?: string|null;
}) => {
  return await axios
    .post(`${url}version`, { cacheAdmin, cacheUser })
    .then((res) => res)
    .catch((err) => catchError(err));
};

// const AxiosUrl = async ({url,method,params}:{url:string,method:string,params?:string})=>{
//   return await axios
//   .get(`${url}getEventTable?_id=${_id}`)
//   .then((res) => {
//     return res;
//   })
//   .catch((err) => {
//     return catchError(err);
//   });
// }
