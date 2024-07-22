import { catchError, url } from "./url";
import axios from "axios";

export const loginAdmin = async (username: string, password: string) => {
  return await axios
    .post(`${url}loginAdmin`, { username, password })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};


export const getTickets = async () => {
    return await axios.get(`${url}getTickets`).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const approveTicket = async (ticket:any) => {
    return await axios.post(`${url}approveTicket`,{ticket}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
export const rejectTicket = async (ticket:any) => {
    return await axios.post(`${url}rejectTicket`,{ticket}).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}
// export const searchTeam = async (searchTeam) => {
//     return await axios.post(`${url}searchTeam`, { searchTeam }).then(res => {
//         return res
//     }).catch(err => {
//         return catchError(err)
//     })
// }