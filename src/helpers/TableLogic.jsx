export const order = async (data, event, categ) => {
  let teams = [];
  data.forEach((item) => {
    if (item.category_id === event.categories[categ - 1]?._id) {
      teams.push(item);
    }
  });

  teams.forEach((team) => {
    team.points = 0;
    team.percent = 0;
    team.tiebrake_total = 0;
  });

  let wl = event.categories[categ - 1].wods.length;
  let ppw = Math.floor(100 / teams.length);
  let wodsData = [];

  ////// PUSH DATA TO WODS DATA (Re arrange)
  for (let i = 0; i < wl; i++) {
    wodsData.push([]);
    teams.forEach((team) => {
      wodsData[i].push({
        name: team.name,
        amount: team.wods[i]?.amount ? team.wods[i].amount : 0,
        time: team.wods[i]?.time ? team.wods[i].time : null,
        amount_type: team.wods[i]?.amount_type
          ? team.wods[i].amount_type
          : null,
        tiebrake: team.wods[i]?.tiebrake ? team.wods[i].tiebrake : 0,
        percent: team.wods[i]?.percent ? team.wods[i].percent : 0,
      });
    });
  }

  ////// APPLY POINTS AND PERCENT
  wodsData.forEach((wod, windex) => {
    let ogWod = event.categories[categ - 1].wods[windex];
    if (ogWod.wod_type === 1) {
      AMRAP_points(ogWod, wod, teams.length);
    } else if (ogWod.wod_type === 2 || ogWod.wod_type === 4) {
      FORTIME_points(ogWod, wod, teams.length);
    } else if (ogWod.wod_type === 3) {
      RM_points(ogWod, wod, teams.length);
    }
  });
  /// AMOUNT TYPES
  teams.forEach((team) => {
    wodsData.forEach((wod, windex) => {
      let ogWod = event.categories[categ - 1].wods[windex];
      let fi = wod.findIndex((elm) => elm.name === team.name);
      if (team.percent === undefined) team.percent = 0;
      if (wod[fi].points !== undefined) {
        team.points += wod[fi].points;
        team.percent += wod[fi].percent;
        team.wods[windex].pos = wod[fi].pos;
        team.wods[windex].amount_type = wod[fi].amount_type;
        team.wods[windex].wod_type = ogWod.wod_type;
        if (ogWod.wod_type === 2) {
          team.wods[windex].time_cap = ogWod.time_cap;
          team.wods[windex].amount_cap = ogWod.amount_cap;
        }
        // if(wod[fi].amount_type === 2){

        // }
        // team.wods[windex].amount = wod[fi].amount_type;
      }
    });
  });
  teams.forEach((team) => {
    let perc = parseFloat((team.percent / wl).toFixed(3));
    if (Number.isNaN(perc)) {
      team.percent = 0;
    } else {
      team.percent = perc;
    }
  });

  if (teams[0]?.percent !== 0) {
    TieBreaker(teams);
    // console.log('or here?')
  }
  teams.forEach((team) => {
    let last = wodsData.length - team.wods.length;
    for (let i = 0; i < last; i++) {
      team.wods.push({});
    }
  });
  return teams;
  // return [];
};

export const AMRAP_points = async (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => wodSort(a, b));

  // console.log(wod)
  wod.forEach((team, index) => {
    wodForeach(team, index, wod, tl,ppw);
  });

  // console.log(wod);
};
export const FORTIME_points = (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => wodSort(a, b));

  /// ppw = points per wods
  wod.forEach((team, index) => {
    wodForeach(team, index, wod, tl,ppw);
  });

  // console.log(wod);
};
export const RM_points = (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => wodSort(a, b));

  wod.forEach((team, index) => {
    wodForeach(team, index, wod, tl,ppw);
  });
};

export const TieBreaker = (teams) => {
  //// TO DO Recorrer equipos y evaluar a todos aquellos que tengan la misma cantidad y sumar los tiebrakes, quien tenga menor tiebrake, tiene mejor rendimiento

  // Añadir el total de tiebrake a todos los equipos
  teams.forEach((team) => {
    team.tiebrake_total = 0;
    team.wods.forEach((wod) => {
      if ( wod !== null && wod.tiebrake !== undefined ) {
        team.tiebrake_total += wod.tiebrake;
      }
    });
  });

  // Ordenar por prioridad de puntos, en caso de empate, tiebrake
  teams.sort((a, b) => {
    if (a.points < b.points) return 1;
    else if (a.points > b.points) return -1;
    else if (a.points === b.points) {
      if (a.tiebrake_total > b.tiebrake_total) return 1;
      else if (a.tiebrake_total < b.tiebrake_total) return -1;
    }
  });

  //Reducir porcentaje en base a la diferencia de tiebrake con el equipo anterior
  teams.forEach((team, index) => {
    if (index !== 0) {
      if (team.points === teams[index - 1].points) {
        let formula =
          (100 -
            (teams[index - 1].tiebrake_total * 100) / team.tiebrake_total) /
          teams.length;
        if (Number.isNaN(formula)) {
          team.percent = 0;
        } else {
          team.percent = parseFloat((team.percent - formula).toFixed(3));
        }
      }
    }
  });
  teams.sort((a, b) => {
    if (a.percent < b.percent) return 1;
    else if (a.percent > b.percent) return -1;
  });
  // console.log(teams)
};

export const pos = (pos) => {
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

export const checkTie = (wod, nextWod, index) => {
  if (nextWod) {
    if (
      wod !== null &&
      wod.amount !== 0 &&
      wod.amount === nextWod[index].amount &&
      wod.time === nextWod[index].time &&
      wod.tiebrake !== 0 &&
      wod.tiebrake !== nextWod[index].tiebrake
    ) {
      return true;
      // return "tie"
    }
    // console.log(wod)
    // console.log(nextWod[index])
    // console.log(index)
  } else {
    return false;
  }
};

const wodSort = (a, b) => {
  if (a.amount < b.amount) return 1;
  else if (a.amount > b.amount) return -1;
  else if (a.amount === b.amount) {
    if (a.time > b.time) return 1;
    else if (a.time < b.time) return -1;
    else if (a.time === b.time) {
      if (a.tiebrake > b.tiebrake) return 1;
      else if (a.tiebrake < b.tiebrake) return -1;
      else if (a.tiebrake === b.tiebrake) return 0;
    }
  }
};

const wodForeach = (team, index, wod, tl,ppw) => {
  if (team.amount !== 0) {
    if (index === 0) {
      team.percent = 100;
      team.points = 100;
      team.pos = 1;
    } else {
      if (
        team.amount === wod[index - 1].amount &&
        team.time === wod[index - 1].time &&
        team.tiebrake === wod[index - 1].tiebrake
      ) {
        team.points = wod[index - 1].points;
        team.percent = wod[index - 1].percent;
        team.pos = wod[index - 1].pos;
      } else if (team.amount === wod[index - 1].amount) {
        team.points = ppw * (tl - index);
        team.percent = ppw * (tl - index);
        team.pos = index + 1;
        // team.percent = wod[index - 1].percent - 10 / tl;
      } else {
        team.percent = ppw * (tl - index);
        team.points = ppw * (tl - index);
        team.pos = index + 1;
        // console.log(team)
      }
    }
  }
  // console.log(team.percent +" "+ team.name)
};
