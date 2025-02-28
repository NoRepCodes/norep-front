import axios from "axios";
import { EvnFields, ResultFields, WodFields } from "../types/event";
import { catchError, url } from "./url";
import { ManualTeamFields } from "../types/zod/registerManualTeam.zod";

const removePartners = (p: any) => {
  if (p) {
    if (p[2]?.secure_url === undefined && p[2]?.public_id === undefined)
      p.splice(2, 1);
    if (p[1]?.secure_url === undefined && p[1]?.public_id === undefined)
      p.splice(1, 1);
    if (p[0]?.secure_url === undefined && p[0]?.public_id === undefined)
      p.splice(0, 1);
  }
};
export const createEvent = async (e: EvnFields) => {
  const event = { ...e };
  removePartners(event.partners);

  // const data = { ...event, categories: JSON.stringify(event.categories) };
  // console.log(data);
  return await axios
    .post(`${url}createEvent`, { ...event })
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const updateEvent = async (e: EvnFields) => {
  const event = { ...e };
  removePartners(event.partners);

  return await axios
    .post(`${url}updateEvent`, event)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const deleteEvent = async (_id: string, public_id: string) => {
  return await axios
    .delete(`${url}deleteEvent?_id=${_id}&public_id=${public_id}`)
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const updateWods = async (
  wods: WodFields[],
  toDelete: string[],
  categories: string[]
) => {
  return await axios
    .post(`${url}updateWods`, { wods, toDelete, categories })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const updateResults = async (
  wod_id: string,
  results: ResultFields[],
  categories: string[]
) => {
  return await axios
    .post(`${url}updateResults`, { wod_id, results, categories })
    .then((res) => res)
    .catch((err) => catchError(err));
};
export const toggleUpdating = async (category_id: string, state: boolean) => {
  return await axios
    .post(`${url}toggleUpdating`, { category_id, state })
    .then((res) => res)
    .catch((err) => catchError(err));
};

export const updateTeams = async (
  { teams }: ManualTeamFields,
  category_id: string,
  toDelete: string[]
) => {
  return await axios
    .post(`${url}updateTeams`, { teams, category_id })
    .then((res) => res)
    .catch((err) => catchError(err));
};
