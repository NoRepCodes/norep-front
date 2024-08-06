import { TeamType } from "../types/event.t"
import { catchError, url } from "./url"
import axios from 'axios'

// export const createEvent = async (data: any) => {
export const createEvent = async (data: any) => {
    // let partners = partn === null ? [] : partn
    // let categories = []
    // categories = categ.map((c, i) => ({ name: c, wods: [] }))
    // return await axios.post(`${url}createEvent`, { ...inputs, categories, base64: img[0], partners }).then(res => {
    return await axios.post(`${url}createEvent`, data).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const updateEvent = async (data: any) => {
    return await axios.post(`${url}updateEvent`, data).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

type updateWodsDataT = {
    wods: {
        _id?: string,
        name: string,
        time_cap?: number,
        amount_cap?: number,
        amount_type: "Lbs" | "Puntos" | "Reps",
        wod_type: "AMRAP" | 'FORTIME' | "RM" | "CIRCUITO",
        category_id: string
        // index: number,
    }[],
    toDelete: string[]
}
export const updateWods = async (data: updateWodsDataT) => {
    return await axios.post(`${url}updateWods`, data).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const updateResults = async (results:any,wod_id:string) => {
    return await axios.post(`${url}updateResults`, {results,wod_id}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const updateTeams = async (teams:TeamType[],category_id:string) => {
    return await axios.post(`${url}updateTeams`, {teams,category_id}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const toggleUpdating = async (category_id:string, state:boolean) => {
    return await axios.post(`${url}toggleUpdating`, { category_id, state }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}