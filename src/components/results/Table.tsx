import { AnimatePresence, motion } from "framer-motion";
//@ts-ignore
import moment from "moment";
import {  useEffect, useState } from "react";
import {
  CategoryType,
  EventType,
  ResultType,
  TeamType,
  WodType,
} from "../../types/event.t";
import { mergeTeams, pos } from "../../components/TableLogic";
// import { Context } from "../Context";

const convSeconds = (s: number) => moment.utc(s * 1000).format("HH:mm:ss");

type TableT = {
  input: string;
  event: EventType;
  category: CategoryType | undefined;
  admin: any;
  kg: boolean;
  wods: WodType[] | undefined;
};
const Table = ({ input, event, category, admin, kg, wods }: TableT) => {
  const [teams, setTeams] = useState<TeamType[] | undefined>(undefined);

  useEffect(() => {
    if (event !== undefined && category !== undefined && wods !== undefined) {
      let aux = wods?.filter((w) => w.category_id === category?._id);
      setTeams(mergeTeams(category, aux));
    }
  }, [event, category, wods]);

  const clickTable = () => {
    // console.log(teams)
    // console.log(wods);
    // console.log(category);
  };

  return (
    <div className="table" onClick={clickTable}>
      {category && <TableHeader {...{ wods, category }} />}
      {event?.categories.find((c) => c._id === category?._id)?.updating &&
      !admin ? (
        <h1 className="updating_text">La tabla se está actualizando...</h1>
      ) : (
        <>
          {teams?.map((team, index) => {
            if (input.length > 0) {
              let regex = new RegExp(input, "i");
              if (regex.test(team.name)) {
                return (
                  <TableUser
                    key={team._id}
                    user={team}
                    {...{ index, kg }}
                    last={index === teams.length - 1 ? true : false}
                    wl={wods?.filter((w) => w.category_id === category?._id)?.length ?? 0}
                  />
                );
              }
            } else {
              return (
                <TableUser
                  key={team._id}
                  user={team}
                  {...{ index, kg }}
                  last={index === teams.length - 1 ? true : false}
                  wl={wods?.filter((w) => w.category_id === category?._id)?.length ?? 0}
                />
              );
            }
          })}
        </>
      )}
    </div>
  );
};
type TableHeaderT = { wods: WodType[] | undefined; category: CategoryType };

const TableHeader = ({ wods, category }: TableHeaderT) => {
  // const { setMsg } = useContext(Context);
  // const wodInfo = (w: WodType) => {
  //   // let aux = `
  //   // \n ${w.name}
  //   // ${w.wod_type}
  //   // ${w.amount_cap ?? ""}
  //   // ${w.time_cap ?? ""}
  //   // `;
  // };
  return (
    <div className="table_header">
      <div className="header_names">
        <div className="th_cell th_pos">
          <h1>Posicion</h1>
        </div>
        <div className="th_cell th_name">
          <h1>Nombre</h1>
        </div>
        {wods?.map((w) => {
          if (category._id === w.category_id) {
            return (
              <div
                className="th_cell"
                key={w._id}
                // onClick={() => {
                //   wodInfo(w);
                // }}
              >
                <h1>{w.name}</h1>
              </div>
            );
          }
        })}
        {/* {wods?.map((w) => {
          if (w.category_id === category) return (
            <div className="th_cell" key={w._id}>
              <h1>{w.name}</h1>
            </div>
          )
        })} */}
      </div>
      <div className="header_points">
        <h1>Puntos</h1>
        <div className="line"></div>
        <h1>Total</h1>
      </div>
    </div>
  );
};

type TableUserT = {
  user: TeamType;
  last: boolean;
  index: number;
  kg: boolean;
  wl: number;
};
const TableUser = ({ user, last = false, index, kg, wl }: TableUserT) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="table_user_ctn">
      <motion.div
        className="table_user"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        onClick={toggleOpen}
      >
        <div className={`tu_ctn ${last && "no_b"}`}>
          <div className="tu_pos">
            <h1>{index + 1}</h1>
          </div>
          <div className="tu_name">
            <h1>{user.name}</h1>
          </div>
          {user._results?.map((result, index) => {
            return (
              <div
                className={`tu_cell ${result._tie_winner ? "tie_bg" : false}`}
                key={index}
              >
                {result._tie_winner && (
                  <div className="tie">
                    <IIcon />
                  </div>
                )}
                {result.time === 0 && result.amount === 0 ? (
                  <>
                    <h1 className="pos"> </h1>
                    <h1> </h1>
                  </>
                ) : (
                  <>
                    <h1 className="pos">{pos(result?._pos)}</h1>
                    {result._wod_type === "AMRAP" && (
                      <Values_AMRAP {...{ result }} />
                    )}
                    {result._wod_type === "FORTIME" && (
                      <Values_FORTIME {...{ result }} />
                    )}
                    {result._wod_type === "RM" && (
                      <Values_RM {...{ result }} kg={kg} />
                    )}
                    {result._wod_type === "CIRCUITO" && (
                      <Values_CIRCUIT {...{ result }} />
                    )}
                  </>
                )}
              </div>
            );
          })}
          <EmptySlots
            wl={wl ?? 0}
            res={user._results ? user._results.length : 0}
          />
          {/* {Array.from(
            Array(
              wl && user._results && wl > user._results.length
                ? wl - user._results.length
                : 0
            ).keys()
          ).map((_) => (
            <EmptySpace />
          ))}*/}
        </div>
        <div className={`tu_points ${last && "no_b"}`}>
          <h1>{user._points}</h1>
          <h1>{user._percent}%</h1>
        </div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="wods_display"
            initial={{ height: 0, paddingTop: 0 }}
            animate={{
              height: "calc(5.5vw + 5.5vh)",
              paddingTop: "calc(1.1vw + 1.1vh)",
            }}
            exit={{ height: 0, paddingTop: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user._results?.map((result, index) => {
              return (
                <div key={index} className="wods_display_item">
                  <h1>{result._wod_name}</h1>
                  <ResultCard {...{ result, kg }} />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptySpace = () => {
  return (
    <div className="tu_cell empty_slot">
      <p></p>
    </div>
  );
};

const IIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
    >
      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 18h-2v-8h2v8zm-1-12.25c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25-1.25-.56-1.25-1.25.56-1.25 1.25-1.25z" />
    </svg>
  );
};

type ResultCardT = { result: ResultType; kg: boolean };
const ResultCard = ({ result, kg }: ResultCardT) => {
  return (
    <>
      {(result._wod_type === "AMRAP" || result._wod_type === "FORTIME") && (
        <h1 className="amounts">
          {result.amount}
          {result._amount_type === "CAP+" ? "Reps" : result._amount_type}
        </h1>
      )}
      {result._wod_type === "CIRCUITO" && (
        <h1 className="amounts">
          {result.amount - result.penalty} {result._amount_type}
        </h1>
      )}
      {result._wod_type === "RM" && (
        <h1 className="amounts">{lbOrKg(result.amount, kg)}</h1>
      )}
      {result.time !== 0 && (
        <h1 className="amounts">Tiempo: {resTime(result.time)} min</h1>
      )}
      {result._wod_type === "CIRCUITO" && result.penalty !== 0 && (
        <h1 className="amounts">Penalty: {result.penalty}</h1>
      )}
      {result.tiebrake !== 0 && (
        <h1 className="amounts">Tiebrake: {resTime(result.tiebrake)} min</h1>
      )}
    </>
  );
};

const resTime = (time: number) => moment.utc(time * 1000).format("mm:ss");

type ValuesT = { result: ResultType };
const Values_AMRAP = ({ result }: ValuesT) => {
  return (
    <h1>
      ({result.amount} {result._amount_type})
    </h1>
  );
};
const Values_FORTIME = ({ result }: ValuesT) => {
  return (
    <>
      {result._amount_type === "CAP+" ? (
        <h1>(CAP+{result._amount_left})</h1>
      ) : (
        // <h1>(CAP+ 0)</h1>
        <h1>({convSeconds(result?.time)})</h1>
      )}
    </>
  );
};

const Values_RM = ({ result, kg }: { result: ResultType; kg: boolean }) => {
  if (result._amount_type === "Reps") {
    return <h1>({result.amount} Reps)</h1>;
  } else return <h1>({lbOrKg(result.amount, kg)})</h1>;
};
const Values_CIRCUIT = ({ result }: ValuesT) => {
  return <h1>({result?.amount - result?.penalty})</h1>;
};

const lbOrKg = (amount: number, isKg: boolean) => {
  if (isKg) return `${(amount * 0.453592).toFixed(2)} Kgs`;
  else return `${amount.toFixed(2)} Lbs`;
};

export default Table;

const EmptySlots = ({ wl, res }: { wl: number; res: number }) => {
  const [amount, setAmount] = useState([]);
  useEffect(() => {
    let aux: any = [];
    console.log(wl - res);
    // console.log(res);
    for (let i = 0; i < wl - res; i++) {
      aux.push(i);
    }
    // console.log(aux);
    setAmount(aux);
  }, [wl, res]);

  return (
    <>
      {amount.map((v) => (
        <EmptySpace key={v} />
      ))}
    </>
  );
};
// const returnEmpty = (left: number) => {
//   let aux = [];
//   for (let i = 0; i < left; i++) {
//     aux.push(EmptySpace);
//   }
//   return aux;
// };
