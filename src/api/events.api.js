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
    return await axios.post(`${url}findTeams`, { event_id }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}


export const createEvent = async (inputs, categ, base64) => {
    // console.log(formData)
    let categories = categ.map((c, i) => ({ name: c, wods: [] }))
    return await axios.post(`${url}createEvent`, { ...inputs, categories, base64 }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const updateWods = async (event_id, category_id, wods) => {
    return await axios.post(`${url}updateWods`, { event_id, category_id, wods }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const plusTeams = async (event_id, category_id, teams)=>{
    return await axios.post(`${url}addTeams`, { event_id, category_id, teams }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}

export const updateResults = async(teams,wod_index)=>{
    return await axios.post(`${url}addWods`, { teams,wod_index }).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}