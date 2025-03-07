import axios from "axios";
import { catchError, url } from "./url";
import { TeamFields, TicketT } from "../types/event";

export const getTeamInfo = async (_id: string) => {
  return await axios
    .get(`${url}getTeamInfo?_id=${_id}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const updateTeamInfo = async (
  team: TeamFields,
  categoryIdToPush?: string
) => {
  return await axios
    .post(`${url}updateTeamInfo`, { team, categoryIdToPush })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const loginAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await axios
    .post(`${url}loginAdmin`, { email, password })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const getAllEventUsers = async (_id: string) => {
  return await axios
    .get(`${url}getAllEventUsers?_id=${_id}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const getTickets = async (categories_id?: string[]) => {
  return await axios
    .post(`${url}getTickets`, { categories_id })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const rejectTicket = async (ticket: TicketT) => {
  return await axios
    .post(`${url}rejectTicket`, { ticket })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const approveTicket = async (ticket: TicketT) => {
  return await axios
    .post(`${url}approveTicket`, { ticket })
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const getUserInfo = async (_id: string) => {
  return await axios
    .get(`${url}getUserInfo?_id=${_id}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const getUserSearch = async (text: string) => {
  return await axios
    .get(`${url}getUserSearch?text=${text}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};
