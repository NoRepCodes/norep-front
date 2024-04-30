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

export const EditResultsModal = ({ close, event, cindex, teams, setTeams }) => {
  const [windex, setWindex] = useState(null);
  const [load, setLoad] = useState(false);
  const [list, setList] = useState([]);

  const chooseWod = (index) => {
    setWindex(index);
  };

  const click = async () => {
    setLoad(true);
    let newList = list.map((item) => {
      if (item.wt === 3) {
        return {
          ...item,
          time: convTime(item.time),
          tiebrake: item.tiebrake,
          penalty: parseInt(item.penalty),
          amount: parseInt(item.amount),
        };
      } else {
        return {
          ...item,
          time: convTime(item.time),
          tiebrake: convTime(item.tiebrake),
          penalty: parseInt(item.penalty),
          amount: parseInt(item.amount),
        };
      }
    });

    const { status, data } = await updateResults(newList, windex);
    setLoad(false);
    if (status === 200) {
      let wl = event.categories[cindex].wods.length;
      let oldTeams = [...teams];
      data.forEach((team, i1) => {
        for (let i = 0; i < wl; i++) {
          if (team.wods[i] === undefined)
            data[i1].wods[i] = { ...blankResults, penalty: 0 };
        }
        oldTeams.forEach((ot, ot_index) => {
          if (team._id === ot._id) {
            oldTeams[ot_index] = team;
          }
        });
      });
      setTeams(oldTeams);
      close();
    } else {
      alert(data.msg);
    }
  };

  useEffect(() => {
    try {
      if (windex !== null) {
        let aux = teams.filter(
          (t) => t.category_id === event.categories[cindex]._id
        );
        let selecWod = event.categories[cindex].wods[windex];
        let wt = selecWod.wod_type;
        let infoTeams = aux.map((t, i) => {
          if (t.wods[windex] === undefined) {
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
              penalty: t.wods[windex].penalty,
            };
          }
        });
        setList(infoTeams);
      }
    } catch (error) {
      // console.log(error);
    }
  }, [windex]);

  const goBack = () => {
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
            wods={event.categories[cindex].wods}
            chooseWod={chooseWod}
            teams={teams}
          />
        ) : (
          <UsersList {...{ event, cindex, teams, windex, list, setList }} />
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

const UsersList = ({ event, cindex, windex, list, setList }) => {
  const hReps = (value, index) => {
    if (value.match(/^[0-9]*$/)) {
      const aux = list.map((t, i) => {
        if (i === index) return { ...t, amount: value };
        else return t;
      });
      setList(aux);
    }
  };
  const hTiebrake = (value, index) => {
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
    if (value.match(/^[0-9]*$/)) {
      const aux = list.map((t, i) => {
        if (i === index) return { ...t, penalty: value };
        else return t;
      });
      setList(aux);
    }
  };

  return (
    <div className="users_list">
      <h6>
        {event.categories[cindex].wods[windex].name} -{" "}
        {getWodTypeName(event.categories[cindex].wods[windex].wod_type)}
      </h6>
      {list.map((user, i) => (
        <RU_Input
          key={user._id}
          user={user}
          wod_type={user.wt}
          {...{
            event,
            cindex,
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
  cindex,
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
        <InputArray
          label={ru_wod_type(wod_type)}
          value={user.amount}
          update={hReps}
          index={index}
        />

        {(wod_type === 2 || wod_type === 4) && (
          <InputTime
            label="TIEMPO"
            value={user.time}
            update={hTime}
            index={index}
          />
        )}
        <InputTime
          label="TIEBRAKE"
          value={user.tiebrake}
          update={hTiebrake}
          index={index}
        />

        {/* {wod_type === 3 && (
          <InputArray
            label="TIEBRAKE"
            value={user.tiebrake}
            update={hTiebrake}
            index={index}
          />
        )} */}
        {wod_type === 4 && (
          <InputArray
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

const getWodTypeName = (wod_type) => {
  switch (wod_type) {
    case 1:
      return "AMRAP";
    case 2:
      return "FORTIME";
    case 3:
      return "RM";
    case 4:
      return "CIRCUITO";
    default:
      return "";
  }
};
