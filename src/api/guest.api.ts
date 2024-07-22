import { catchError, url } from "./url"
import axios from 'axios'



export const getEvents = async () => {
    return await axios.get(`${url}getEvents`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const getEventPlusWods = async (_id: string) => {
    return await axios.get(`${url}getEventPlusWods?_id=${_id}`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const getLatestEvent = async () => {
    return await axios.get(`${url}getLatestEvent`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const getWods = async (categories: string[]) => {
    return await axios.post(`${url}getWods`, {categories}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}