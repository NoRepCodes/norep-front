import moment from "moment";
import { useEffect, useState } from "react";
import { updateResults } from "../../api/events.api";
import { CrossIcon, InputArray, InputTime, convTime } from "./ModalTools";

const convSeconds = (s) => moment.utc(s * 1000).format("HH:mm:ss");

const blankResults = {
  amount: 0,
  tiebrake: 0,
  time: 0,
  penalty: 0,
};

export const EditResultsModal = ({ close, event, categ, teams, setTeams }) => {
  const [windex, setWindex] = useState(null);
  const [load, setLoad] = useState(false);
  const [list, setList] = useState([]);

  const chooseWod = (index) => {
    // console.log(teams)
    setWindex(index);
  };

  const click = async () => {
    setLoad(true);
    let newList = list.map((item) => {
      console.log(item);
      if (item.wod_type === 1 || item.wod_type === 2) {
        return {
          ...item,
          time: convTime(item.time),
          tiebrake: convTime(item.tiebrake),
          penalty: convTime(item.penalty),
          amount: parseInt(item.amount),
        };
      } else {
        return {
          ...item,
          time: convTime(item.time),
          tiebrake: convTime(item.tiebrake),
          penalty: convTime(item.penalty),
          amount: parseInt(item.amount),
        };
      }
    });

    // console.log(newList)
    const { status, data } = await updateResults(newList, windex);
    setLoad(false);
    if (status === 200) {
      let wl = event.categories[categ - 1].wods.length;
      let aux = [...data];
      aux.forEach((team, i1) => {
        for (let i = 0; i < wl; i++) {
          // console.log(team.wods[i])
          if (team.wods[i] === undefined) aux[i1].wods[i] = { ...blankResults };
        }
      });
      setTeams(aux);
      close();
      // console.log(aux);
      // setTeams(data);
    } else {
      alert(data.msg);
    }
    // console.log(newList)
  };

  useEffect(() => {
    if (windex !== null) {
      let aux = teams.filter(
        (t) => t.category_id === event.categories[categ - 1]._id
      );
      // aux = aux.filter(
      //   (t) =>
      //     windex === 0 ||
      //     (t.wods[windex - 1].amount !== 0 &&
      //       t.wods[windex - 1].amount !== undefined)
      // );
      let selecWod = event.categories[categ - 1].wods[windex];
      let wt = selecWod.wod_type;
      let infoTeams = aux.map((t, i) => {
        if (
          // t.wods[windex].amount === undefined ||
          // t.wods[windex].amount === 0
          false
        ) {
          return {
            ...blankResults,
            _id: t._id,
            name: t.name,
            amount_type: selecWod.amount_type,
            tiebrake: wt === 3 ? 0 : "00:00:00",
            time:
              wt === 2 || wt === 4
                ? "00:00:00"
                : convSeconds(selecWod.time_cap),
            wt,
          };
        } else {
          return {
            ...t.wods[windex],
            _id: t._id,
            name: t.name,
            wt,
            tiebrake:
              wt === 3
                ? t.wods[windex].tiebrake
                : convSeconds(t.wods[windex].tiebrake),
            time: convSeconds(t.wods[windex].time),
            penalty: convSeconds(t.wods[windex].penalty),
          };
        }
      });
      // console.log(infoTeams);
      setList(infoTeams);
    }
  }, [windex]);

  useEffect(() => {
    // console.log(teams)
  }, []);

  const goBack = () => {
    console.log(teams);
    // let aux = 0
    // teams.forEach(t => {
    //   if(t.wods.length > aux) aux = t.wods.length
    // });
    // console.log(aux)
    setWindex(null);
  };

  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>EDITAR RESULTADOS</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        {windex === null ? (
          <SelectWod
            wods={event.categories[categ - 1].wods}
            chooseWod={chooseWod}
            teams={teams}
          />
        ) : (
          <UsersList {...{ event, categ, teams, windex, list, setList }} />
        )}
        <div className="mt_auto"></div>
        <div className="bottom_ctn">
          {windex !== null && (
            // {windex !== null && (
            <div className="btn_plus_categ" onClick={goBack}>
              <h6>Regresar</h6>
            </div>
          )}
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? (
              <h6>Editando Resultados...</h6>
            ) : (
              <h6>Editar Resultados</h6>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersList = ({ event, categ, windex, list, setList }) => {
  const hReps = (value, index) => {
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, amount: value };
      else return t;
    });
    setList(aux);
  };
  const hTiebrake = (value, index) => {
    // console.log(value)
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, tiebrake: value };
      else return t;
    });
    setList(aux);
  };
  const hTime = (value, index) => {
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, time: value };
      else return t;
    });
    setList(aux);
  };
  const hPenalty = (value, index) => {
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, penalty: value };
      else return t;
    });
    setList(aux);
  };

  return (
    <div className="users_list">
      <h6>{event.categories[categ - 1].wods[windex].name}</h6>
      {list.map((user, i) => (
        <RU_Input
          key={user._id}
          user={user}
          wod_type={user.wt}
          {...{
            event,
            categ,
            windex,
            hReps,
            hTime,
            hTiebrake,
            hPenalty,
            index: i,
          }}
        />
      ))}
    </div>
  );
};

const ru_wod_type = (wod_type) => {
  if (wod_type === 4) return "PUNTOS";
  else if (wod_type === 3) return "LBS";
  else return "REPS";
};

const RU_Input = ({
  user,
  wod_type,
  windex,
  event,
  categ,
  hReps,
  hTime,
  hTiebrake,
  hPenalty,
  index,
}) => {
  return (
    <div className="ru_ctn">
      <h5>{user.name}</h5>
      <div className="ru_inputs">
        {wod_type !== 4 && (
          <InputArray
            label={ru_wod_type(wod_type)}
            value={user.amount}
            update={hReps}
            index={index}
          />
        )}

        {(wod_type === 2 || wod_type === 4) && (
          <InputTime
            label="TIEMPO"
            value={user.time}
            update={hTime}
            index={index}
          />
        )}
        {(wod_type === 1 || wod_type === 2 || wod_type === 4) && (
          <InputTime
            label="TIEBRAKE"
            value={user.tiebrake}
            update={hTiebrake}
            index={index}
          />
        )}
        {wod_type === 3 && (
          <InputArray
            label="TIEBRAKE"
            value={user.tiebrake}
            update={hTiebrake}
            index={index}
          />
        )}
        {wod_type === 4 && (
          <InputTime
            label="PENALTY"
            value={user.penalty}
            update={hPenalty}
            index={index}
          />
        )}
      </div>
    </div>
  );
};

const SelectWod = ({ wods, chooseWod, teams }) => {
  return (
    <div className="select_wod">
      <h6>Selecciona un WOD</h6>
      <div className="wod_list">
        {wods.map((w, i) => (
          <div
            className="select_wod_item"
            key={i}
            onClick={() => {
              chooseWod(i);
            }}
          >
            <h6>{w.name}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

const fillInputs = () => {};

/**
 * 
 * (() => {
    if (windex !== null) {
      let aux = teams.filter(
        (t) => t.category_id === event.categories[categ - 1]._id
      );
      let selecWod = event.categories[categ - 1].wods[windex];
      let wt = selecWod.wod_type;
      let infoTeams = aux.map((t, i) => {
        if (t.wods[windex].amount === undefined) {
          // let at = selecWod.amount_type;
          return {
            ...blankResults,
              _id: t._id,
              name: t.name,
              amount_type: selecWod.amount_type,
              tiebrake: wt === 3 ? 0 : "00:00:00",
              time: wt === 2 || wt === 4 ? '00:00:00':convSeconds(selecWod.time_cap) ,
              wt,
          }
          // if (wt === 1) {
          //   return {
          //     ...blankResults,
          //     _id: t._id,
          //     name: t.name,
          //     amount_type: at,
          //     tiebrake: "00:00:00",
          //     time: convSeconds(selecWod.time_cap),
          //     wt,
          //   };
          // } else if (wt === 2 || wt === 4) {
          //   return {
          //     ...blankResults,
          //     _id: t._id,
          //     name: t.name,
          //     amount_type: at,
          //     tiebrake: "00:00:00",
          //     time: "00:00:00",
          //     wt,
          //   };
          // } else if (wt === 3) {
          //   return {
          //     ...blankResults,
          //     _id: t._id,
          //     name: t.name,
          //     amount_type: at,
          //     tiebrake: 0,
          //     time: convSeconds(selecWod.time_cap),
          //     wt,
          //   };
          // }
        } else {
          return {
            ...t.wods[windex],
            _id: t._id,
            name: t.name,
            wt,
            tiebrake:
              wt === 3
                ? t.wods[windex].tiebrake
                : convSeconds(t.wods[windex].tiebrake),
            time: convSeconds(t.wods[windex].time),
          };
        }
      });
      // console.log(infoTeams);
      setList(infoTeams);
    }
  }, [windex]);
 */
