import { CategoryType, ResultType, TeamType, WodType } from "../types/event.t";

type SortType = ((a: ResultType, b: ResultType) => number)
const wodSort: SortType = (a, b) => {
  if (a.amount < b.amount) return 1;
  else if (a.amount > b.amount) return -1;
  else if (a.amount === b.amount) {
    if (a.time > b.time) return 1;
    else if (a.time < b.time) return -1;
    else if (a.time === b.time) {
      if (a.tiebrake > b.tiebrake) {
        // here the tie winner indicator
        b._tie_winner = true;
        return 1;
      } else if (a.tiebrake < b.tiebrake) {
        a._tie_winner = true;
        return -1;
      } else if (a.tiebrake === b.tiebrake) return 0;
    }
  }
  return 0
};

const circuitSort: SortType = (a, b) => {
  let aa = a.amount - a.penalty;
  let bb = b.amount - b.penalty;
  if (aa < bb) return 1;
  else if (aa > bb) return -1;
  else if (aa === bb) {
    if (a.time > b.time) return 1;
    else if (a.time < b.time) return -1;
    else if (a.time === b.time) {
      if (a.tiebrake > b.tiebrake) {
        // here the tie winner indicator
        b._tie_winner = true;
        return 1;
      } else if (a.tiebrake < b.tiebrake) {
        a._tie_winner = true;
        return -1;
      } else if (a.tiebrake === b.tiebrake) return 0;
    }
  }
  return 0
};


const applyPoints = (tr: ResultType, index: number, wod: WodType, category: CategoryType | undefined) => {
  let tl = category?.teams.length ?? 1;
  // ppw = points per wod
  let ppw = Math.floor(100 / tl);
  // Make sure that there are values, cheking time
  if (tr.time !== 0 || tr.amount !== 0) {
    // find the index of the team to update later + check that points and percent values exist
    const team = category?.teams.find(t => t._id === tr.team_id)
    if (!team) return console.warn("Team Not Found Table.tsx")
    team._points = team._points ?? 0
    team._tie_total = team._tie_total ? team._tie_total + tr.tiebrake : tr.tiebrake
    tr._wod_type = wod.wod_type
    tr._amount_type = wod.amount_type
    tr._wod_name = wod.name

    // if fortime, put CAPS
    if (wod.wod_type === 'FORTIME') {
      if (tr.time >= (wod.time_cap ?? 0)) {
        tr._amount_type = 'CAP+'
        tr._amount_left = (wod.amount_cap ?? 0) - tr.amount
      }
    }

    if(wod.wod_type === 'NADO') {
      if(tr.amount === wod.amount_cap){
         tr._amount_type = 'CAP+'
      }
    }


    // if the team_result is the first one, put him 100% and points
    if (index === 0) {
      team._points += 100
      tr._points = 100;
      tr._pos = 1;
      // if the tr is not the first one, continue
    } else {
      const prev = wod.results[index - 1];
      // if EVERYTHING is the same as the previous tr
      if (
        tr.amount === prev.amount &&
        tr.time === prev.time &&
        tr.tiebrake === prev.tiebrake &&
        tr.penalty === prev.penalty
        // put the same values as the previous tr
      ) {
        team._points += prev._points ?? 0
        tr._points = prev._points;
        tr._pos = prev._pos;

        // if amounts aren't the same as previous tr
        // place points in base of ppw
      } else {
        team._points += ppw * (tl - index)
        tr._points = ppw * (tl - index);
        tr._pos = index + 1;
      }
    }
    // once all point thing is done, percent
    team._percent = team._points
  }
}

const applyFormula = (t: TeamType, i: number, copyWods: WodType[], copyCategory: CategoryType) => {
  const perc = parseFloat(((t._points ?? 0) / copyWods.length).toFixed(3))

  if (Number.isNaN(perc)) {
    t._percent = 0;
  } else {
    t._percent = perc;
  }

  let enemy = copyCategory.teams[i - 1]
  if (i !== 0 && t._points === enemy._points) {
    let formula = 0
    const ttt = t._tie_total ?? 1
    // separate
    if (copyCategory.teams.length >= 5) {
      formula = (100 - ((enemy._tie_total ?? 1) * 100) / ttt) / copyCategory.teams.length
    } else {
      formula = ((enemy._tie_total ?? 1) / ttt) * 0.1
    }
    if (Number.isNaN(formula) || copyWods.length === 0) {
      t._percent = 0;
    } else {
      t._percent = parseFloat(
        ((enemy._percent ?? 0) - formula).toFixed(3)
      );
      if (t._percent < 0) t._percent = 0
    }
  }
}
export const mergeTeams = (category: CategoryType, wods: WodType[]) => {

  if (category === undefined) return []
  const copyCategory: CategoryType = JSON.parse(JSON.stringify(category))

  // Sort wod results
  const copyWods = wods ? wods.map(w => {
    let aux = w.results.map((r) => ({ ...r, _points: 0 }))
    let aux2 = { ...w, results: aux }
    if (aux2.wod_type === "CIRCUITO") aux2.results.sort((a, b) => circuitSort(a, b))
    else aux2.results.sort((a, b) => wodSort(a, b))
    return aux2
  }) : []

  // Apply points
  copyWods.forEach(w => {
    w.results.forEach((r, index) => {
      applyPoints(r, index, w, copyCategory)
    });
  });

  //sort to apply percent
  copyCategory.teams.sort((a,b)=>{
    if((a._points??0) < (b._points??0)) return 1
    else if ((a._points??0) > (b._points??0)) return -1
    else {
      if((a._tie_total??0) < (b._tie_total??0)) return -1
      else if((a._tie_total??0) > (b._tie_total??0)) return 1
      else return 0
    }
  })
  
  
  // Apply percent
  copyCategory?.teams.forEach((t, i) => {
    applyFormula(t, i, copyWods, copyCategory)
  })
  // Push wod results into teams
  copyWods.forEach((w) => {
    w.results.forEach(r => {
      const t = copyCategory.teams.find(t => t._id === r.team_id)
      if (t) {
        if (t._results === undefined) t._results = []
        t._results.push(r)
      }
    });
  })
  // console.log(copyWods)
  copyCategory.teams.sort((a,b)=>{
    if((a._percent??0) < (b._percent??0)) return 1
    else if((a._percent??0) > (b._percent??0)) return -1
    else return 0
  })
  return [...copyCategory.teams]
}

export const pos = (pos:number|undefined) => {
  switch (pos) {
    case 1:
      return "1ro";
    case 2:
      return "2do";
    case 3:
      return "3ro";
    case 4:
      return "4to";
    case 5:
      return "5to";
    case 6:
      return "6to";
    case 7:
      return "7mo";
    case 8:
      return "8vo";
    case 9:
      return "9no";
    case 10:
      return "10mo";
    case 11:
      return "11mo";
    case 12:
      return "12mo";
    case 13:
      return "13ro";
    case 14:
      return "14to";
    case 15:
      return "15to";
    case 16:
      return "16to";
    case 17:
      return "17ro";
    case 18:
      return "18to";
    case 19:
      return "19to";
    case 20:
      return "20vo";
    case 21:
      return "21ro";
    case 22:
      return "22do";
    case 23:
      return "23ro";
    case 24:
      return "24to";
    case 25:
      return "25to";
    case 26:
      return "26to";
    case 27:
      return "27mo";
    case 28:
      return "28vo";
    case 29:
      return "29no";
    case 30:
      return "30mo";
    case 31:
      return "31ro";
    case 32:
      return "32do";
    case 33:
      return "33ro";
    case 34:
      return "34to";
    case 35:
      return "35to";

    default:
      break;
  }
};

// ////ORIGINAL FORMULA, IDK
// // formula =
// // (100 - (c[index - 1]._tiebrake_total * 100) / team._total_tiebrake) /
// // c.length;
