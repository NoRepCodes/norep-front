// import { catchError, url } from "./url"
// import axios from 'axios'


// export const getEventsHome = async () => {
//     return await axios.get(`${url}getEventsHome`).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }

// export const getEventsPlusTeams = async () => {
//     return await axios.get(`${url}getEventsPlusTeams`).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }
// export const findTeams = async (event_id) => {
//     return await axios.post(`${url}findTeams`, { event_id }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }

// export const updateEvent = async (inputs, categ, image, partners, toDelete, _id, categToDelete) => {
//     let categories = []
//     categories = categ.map((c, i) => ({ name: c.name, wods: c.wods,_id:c._id }))
//     return await axios.post(`${url}updateEvent`, { ...inputs, categories, image, partners, toDelete, _id, categToDelete }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }

// export const deleteEvent = async (event) => {
//     return await axios.post(`${url}deleteEvent`, {event }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }
// export const updateWods = async (event_id, category_id, wods) => {
//     return await axios.post(`${url}updateWods`, { event_id, category_id, wods }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }

// // export const plusTeams = async (event_id, category_id, teams)=>{
// //     return await axios.post(`${url}addTeams`, { event_id, category_id, teams }).then(res => {
// //         return res
// //     }).catch(err => {
// //         return catchError(err)
// //     })
// // }

// export const editTeams = async (event_id, category_id, teams,toDelete) => {
//     return await axios.post(`${url}editTeams`, { event_id, category_id, teams,toDelete }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }

// export const updateResults = async (teams, wod_index) => {
//     return await axios.post(`${url}addWods`, { teams, wod_index }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }
// export const toggleUpdating = async (event_id, state) => {
//     return await axios.post(`${url}toggleUpdating`, { event_id, state }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }
// export const searchTeam = async (searchTeam) => {
//     return await axios.post(`${url}searchTeam`, { searchTeam }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }