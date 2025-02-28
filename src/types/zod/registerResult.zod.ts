import { z } from "zod";
import { CategFields, ResultFields, ResultSchema, TeamFields, WodFields } from "../event";

// export const newWod = () => getDefaults(ResultSchema);
export const rSchema = z.object({
  results: z.array(ResultSchema).default([]),
});
export type rFields = z.infer<typeof rSchema>;

export const getDefaultResults = (wods:WodFields,category:CategFields) =>{
  let aux:ResultFields[] = []
  category.teams.forEach((t)=>{
    let resultExist = wods.results.find((r)=> r.team_id === t._id)
    if(resultExist) {
      const users:string[] = []
      resultExist.users.forEach(u => {
        //@ts-ignore
        if(typeof u === 'object') users.push(u._id)
        else users.push(u)
      });
      aux.push({...resultExist,users})
    }
    else aux.push(returnDefaulResult(t))
  })
  return aux
}

const returnDefaulResult = (team:TeamFields)=>{
  return {
    _id:undefined,
    team_id:team._id,
    users:team.users??[],
    time: 0,
    tiebrake: 0,
    penalty: 0,
    amount: 0,
  }
}

