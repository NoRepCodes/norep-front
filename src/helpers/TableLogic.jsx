let evAux = {
  categories: [
    {
      _id: "",
      name: "",
      wods: [
        {
          name: "",
          time_cap: 0,
          amount_cap: 0,
          amount_type: "",
          wod_type: 0,
          _results: [],
        },
      ],
    },
  ],
};

const emptyWodResult = {
  amount: 0,
  amount_type: "",
  time: 0,
  tiebrake: 0,
  penalty: 0,
};
let teamAux = [
  {
    _id: "",
    name: "",
    category_id: "",
    event_id: "",
    box: "",
    wods: [emptyWodResult],
  },
];

export const order = async (eventx = evAux, data = teamAux) => {
  // iterate values to avoid reflecting the real variables
  let event = { ...eventx };
  let teams = [...data];
  /// Insert ghost values on teams
  teams.forEach((team) => {
    team._points = 0;
    team._percent = 0;
    team._tiebrake_total = 0;
  });

  // For each category and for each wod, distribute wods teams
  // and sort, apply _points + _amount_type
  event.categories.forEach((c) => {
    c.wods.forEach((w, windex) => {
      // reset results
      w._results = [];
      // Push team wods result into category wod
      teams.forEach((t) => {
        if (t.category_id === c._id) {
          // if the wod is empty, put ghost results there, otherwise, put real values
          if (t.wods[windex] === null) t.wods[windex] = { ...emptyWodResult };
          w._results.push(t.wods[windex]);
        }
      });
      // Order results by wod_type and values
      if (w.wod_type === 4) w._results.sort((a, b) => circuitSort(a, b));
      else w._results.sort((a, b) => wodSort(a, b));

      // tr = team result
      // apply points to team results and share amount_type
      w._results.forEach((tr, tr_index) => {
        if (tr === undefined) tr = { ...emptyWodResult };
        // put CAP+ on for time if its: FORTIME & time exceed without cap amount
        if (
          w.wod_type === 2 &&
          w.time_cap === tr.time &&
          w.amount_cap > tr.amount
        ) {
          tr._amount_left = w.amount_cap - tr.amount;
          tr._amount_type = "CAP+";
        } else tr._amount_type = w.amount_type;
        applyPoints(tr, tr_index, w, w._results.length);
      });
    });
  });

  // plus every point and tiebrake
  teams.forEach((t) => {
    t.wods.forEach((w) => {
      // verify that wod exist
      if (w !== null) {
        // verify that wod points exist to avoid NaN
        t._points += w.points ? w.points : 0;
        t._tiebrake_total += w.tiebrake;
      }
    });
    let perc = parseFloat((t._points / t.wods.length).toFixed(3));
    if (Number.isNaN(perc)) {
      t._percent = 0;
    } else {
      t._percent = perc;
    }
  });
  // order teams per percent and _total_tie_brakes
  teams.sort((a, b) => tieBrakeSort(a, b));

  // split teams into categories
  const categTeams = event.categories.map((c) => []);
  event.categories.forEach((c, cindex) => {
    teams.forEach((t) => {
      if (t.category_id === c._id) categTeams[cindex].push(t);
    });
  });

  // apply formula for those with the same points to reduce percent
  categTeams.forEach((c) => {
    c.forEach((team, index) => {
      if (index !== 0 && team._points === c[index - 1]._points) {
        let formula = 0;
        let ttt = team._tiebrake_total === 0 ? 1 : team._tiebrake_total;
        // separate formula in case of small teams amount
        if (c.length >= 5) {
          // if(true){
          //ORIGINAL FORMULA, IDK
          formula =
            (100 - (c[index - 1]._tiebrake_total * 100) / ttt) / c.length;
        } else {
          formula = (c[index - 1]._tiebrake_total / ttt) * 0.1;
        }
        if (Number.isNaN(formula)) {
          team._percent = 0;
        } else {
          team._percent = parseFloat(
            (c[index - 1]._percent - formula).toFixed(3)
          );
        }
      }
    });
  });

  return categTeams;
};

const wodSort = (a, b) => {
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
};

const circuitSort = (a, b) => {
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
};

const tieBrakeSort = (a, b) => {
  if (a._points < b._points) return 1;
  else if (a._points > b._points) return -1;
  else if (a._points === b._points) {
    if (a._tiebrake_total > b._tiebrake_total) return 1;
    else if (a._tiebrake_total < b._tiebrake_total) return -1;
  }
};

const applyPoints = (tr, index, wod) => {
  let tl = wod._results.length;
  // ppw = points per wod
  let ppw = Math.floor(100 / tl);
  // Make sure that there are values, cheking time
  if (tr.time !== 0 || tr.amount !== 0) {
    // if the team_result is the first one, put him 100% and points
    if (index === 0) {
      tr.percent = 100;
      tr.points = 100;
      tr.pos = 1;
      // if the tr is not the first one, continue
    } else {
      const prev = wod._results[index - 1];
      // if EVERYTHING is the same as the previous tr
      if (
        tr.amount === prev.amount &&
        tr.time === prev.time &&
        tr.tiebrake === prev.tiebrake &&
        tr.penalty === prev.penalty
        // put the same values as the previous tr
      ) {
        tr.points = prev.points;
        tr.percent = prev.percent;
        tr.pos = prev.pos;

        // if amounts aren't the same as previous tr
        // place points and percent in base of ppw
      } else {
        tr.percent = ppw * (tl - index);
        tr.points = ppw * (tl - index);
        tr.pos = index + 1;
      }
    }
  }
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

////ORIGINAL FORMULA, IDK
// formula =
// (100 - (c[index - 1]._tiebrake_total * 100) / team._total_tiebrake) /
// c.length;
