//@ts-ignore
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { updateResults } from "../../api/event.api";
import { WodType, ResultType } from "../../types/event.t";
import { InputArrObj } from "./CreateEventModal";

import {
  InputArray,
  InputTime,
  convTime,
  Modal,
  CategoriesSelect,
} from "./ModalTools";
import { ResultContext } from "../results/ResultContx";

const convSeconds = (s: number) => moment.utc(s * 1000).format("HH:mm:ss");

const blankResults = {
  amount: 0,
  tiebrake: 0,
  time: 0,
  penalty: 0,
};

type CustomResT = Omit<ResultType, "_id" | "time" | "tiebrake"> & {
  _id?: string;
  team_name: string;
  time: string;
  tiebrake: string;
};
// type CustomResT = Omit<ResultType, "_id" | "time" | "tiebrake"> & {
//   _id?: string;
//   team_name: string;
//   time: number | string;
//   tiebrake: number | string;
// };

const EditResultsModal = ({ close }: { close: () => void }) => {
  const { event, category, wods, setWods } = useContext(ResultContext);

  // const [searchbar, setSearchbar] = useState("");
  const [w_id, setW_id] = useState<string | undefined>(undefined);
  const [newResults, setNewResults] = useState<CustomResT[]>([]);
  const [load, setLoad] = useState(false);
  // const [list, setList] = useState([]);

  const chooseWod = (_id: string) => {
    setW_id(_id);
  };

  const click = async () => {
    if (w_id === undefined) return;
    console.log(newResults);
    let newList = newResults.map((res) => ({
      ...res,
      time: typeof res.time === "number" ? res.time : convTime(res.time),
      tiebrake:
        res._wod_type === "RM"
          ? parseInt(res.penalty.toString())
          : convTime(res.tiebrake),
      penalty: parseInt(res.penalty.toString()),
      amount: parseFloat(res.amount.toString()),
    }));

    setLoad(true);
    const categories = event?.categories.map((c) => c._id);
    if (!categories) return 0;
    const { status, data } = await updateResults(newList, w_id, categories);
    setLoad(false);
    if (status === 200) {
      // console.log(data);
      setWods(data);
      // setWods((prev) => {
      //   const aux = prev ? [...prev] : [];
      //   aux.forEach((w,i) => {
      //     if (w._id === w_id) {
      //       aux[i]= data
      //     };
      //   });
      //   console.log(aux);
      //   return aux;
      // });
      close();
    } else {
      alert(data.msg);
    }
    //   if (status === 200) {
    //     let wl = event.categories[cindex].wods.length;
    //     let oldTeams = [...teams];
    //     data.forEach((team, i1) => {
    //       for (let i = 0; i < wl; i++) {
    //         if (team.wods[i] === undefined)
    //           data[i1].wods[i] = { ...blankResults, penalty: 0 };
    //       }
    //       oldTeams.forEach((ot, ot_index) => {
    //         if (team._id === ot._id) {
    //           oldTeams[ot_index] = team;
    //         }
    //       });
    //     });
    //     setTeams(oldTeams);
    //     close();
    //   } else {
    //     alert(data.msg);
    //   }
  };

  const goBack = () => {
    setW_id(undefined);
  };

  useEffect(() => {
    setW_id(undefined);
  }, [category]);
  useEffect(() => {
    if (wods && w_id) {
      let teams = category ? [...category.teams] : [];
      let copyWod = wods.find((w) => w._id === w_id);

      const newRes = teams.map((team) => {
        const res = copyWod?.results.find((r) => r.team_id === team._id);
        if (res) {
          return {
            ...res,
            team_name: team.name,
            // time: convSeconds(aux.time),
            _wod_type: copyWod?.wod_type,
            _amount_type: copyWod?.amount_type,
            tiebrake:
              copyWod?.wod_type === "RM"
                ? res?.tiebrake
                : convSeconds(res?.tiebrake ?? 0),
            time:
              copyWod?.wod_type === "FORTIME" ||
              copyWod?.wod_type === "CIRCUITO"
                ? convSeconds(res?.time ?? 0)
                : copyWod?.time_cap,
          };
        } else {
          return {
            ...blankResults,
            team_id: team._id,
            _id: undefined,
            team_name: team.name,
            _wod_type: copyWod?.wod_type,
            _amount_type: copyWod?.amount_type,
            tiebrake: copyWod?.wod_type === "RM" ? "0" : "00:00:00",
            time:
              copyWod?.wod_type === "FORTIME" ||
              copyWod?.wod_type === "CIRCUITO"
                ? "00:00:00"
                : convSeconds(copyWod?.time_cap ?? 0),
          };
        }
      });
      setNewResults(newRes);
    } else setNewResults([]);
  }, [w_id]);

  return (
    <Modal close={close} title="EDITAR RESULTADOS">
      {category && <CategoriesSelect />}
      {w_id === undefined ? (
        <SelectWod wods={wods} chooseWod={chooseWod} />
      ) : (
        <UsersList
          {...{
            event,
            category,
            wod: wods?.find((w) => w._id === w_id),
            newResults,
            setNewResults,
          }}
        />
      )}
      <div className="mt_auto"></div>
      <div className="bottom_ctn">
        {w_id !== undefined && (
          <div className="btn_plus_categ" onClick={goBack}>
            <h6>Regresar</h6>
          </div>
        )}
        <button className="btn_confirm" onClick={click} disabled={load}>
          {load ? <h6>Editando Resultados...</h6> : <h6>Editar Resultados</h6>}
        </button>
      </div>
    </Modal>
  );
};
type UserList = {
  wod?: WodType;
  newResults: CustomResT[];
  setNewResults: React.Dispatch<React.SetStateAction<CustomResT[]>>;
};
const UsersList = ({
  // event,
  // category,
  wod,
  newResults,
  setNewResults,
}: UserList) => {
  // const hReps = (value, index) => {
  //   if (value.match(/^[0-9]*\.?[0-9]*$/)) {
  //     const aux = list.map((t, i) => {
  //       if (i === index) return { ...t, amount: value };
  //       else return t;
  //     });
  //     setList(aux);
  //   }
  // };
  const hTiebrake = (value: any, index: number) => {
    const aux = newResults.map((t, i) => {
      if (i === index) return { ...t, tiebrake: value };
      else return t;
    });
    setNewResults(aux);
  };
  const hTime = (value: any, index: number) => {
    const aux = newResults.map((r, i) => {
      if (i === index) return { ...r, time: value };
      else return r;
    });
    setNewResults(aux);
  };
  // const hPenalty = (value, index) => {
  //   if (value.match(/^[0-9]*$/)) {
  //     const aux = list.map((t, i) => {
  //       if (i === index) return { ...t, penalty: value };
  //       else return t;
  //     });
  //     setList(aux);
  //   }
  // };

  return (
    <div className="users_list">
      <h6>
        {wod?.name} - {wod?.wod_type}
      </h6>
      {newResults?.map((result, index) => (
        <RU_Input
          key={index}
          {...{
            result,
            index,
            setNewResults,
            hTime,
            // hReps,
            hTiebrake,
            // hPenalty,
          }}
        />
      ))}
    </div>
  );
};

type RU_InputT = {
  result: CustomResT;
  // hReps,
  hTime: (value: any, index: number) => void;
  hTiebrake: (value: any, index: number) => void;
  // hTiebrake,
  // hPenalty,
  setNewResults: React.Dispatch<React.SetStateAction<CustomResT[]>>;
  index: number;
};
const RU_Input = ({
  result,
  // hReps,
  hTime,
  hTiebrake,
  // hPenalty,
  setNewResults,
  index,
}: RU_InputT) => {
  return (
    <div className="ru_ctn">
      <h5>{result.team_name}</h5>
      <div className="ru_inputs">
        <InputArrObj
          name="amount"
          label={result._amount_type}
          set={setNewResults}
          index={index}
          value={result.amount}
        />
        {(result._wod_type === "FORTIME" ||
          result._wod_type === "CIRCUITO") && (
          <InputTime
            index={index}
            update={hTime}
            label="TIEMPO"
            value={result.time}
          />
        )}
        {result._wod_type === "RM" ? (
          <InputArray
            label="Tiebrake"
            value={result.tiebrake}
            update={hTiebrake}
            index={index}
          />
        ) : (
          <InputTime
            label="TIEBRAKE"
            value={result.tiebrake}
            update={hTiebrake}
            index={index}
          />
        )}

        {result._wod_type === "CIRCUITO" && (
          <InputArrObj
            name="penalty"
            label="PENALTY"
            set={setNewResults}
            index={index}
            value={result.penalty}
          />
        )}
      </div>
    </div>
  );
};

type SelectWodT = {
  wods?: WodType[];
  chooseWod: (_id: string) => void;
};
const SelectWod = ({ wods, chooseWod }: SelectWodT) => {
  return (
    <div className="select_wod">
      <h6>Selecciona un WOD</h6>
      <div className="wod_list">
        {wods?.map((w, i) => (
          <div
            className="select_wod_item"
            key={i}
            onClick={() => {
              chooseWod(w._id);
            }}
          >
            <h6>{w.name}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditResultsModal;
