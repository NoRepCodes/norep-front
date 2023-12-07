import { catchError, url } from "./url"
import axios from 'axios'


export const getEventsHome = async () => {
    return await axios.get(`${url}getEventsHome`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const getEventsPlusTeams = async () => {
    return await axios.get(`${url}getEventsPlusTeams`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const findTeams = async (event_id) => {
    return await axios.post(`${url}findTeams`,{event_id}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

