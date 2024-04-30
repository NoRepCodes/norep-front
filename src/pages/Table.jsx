import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { order, pos } from "../../helpers/TableLogic";

const convSeconds = (s) => moment.utc(s * 1000).format("HH:mm:ss");

export const Table = ({ input, event, cindex, teams, admin, kg = true }) => {
  const [info, setInfo] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (event !== null && teams !== null) {
      (async () => {
        setData(await order(event, teams));
      })();
    }
  }, [event, teams]);

  useEffect(() => {
    if (data) {
      setInfo([...data[cindex]]);
    }
  }, [data, cindex]);

  const testClick = () => {};

  return (
    <div className="table">
      <TableHeader {...{ testClick, event, cindex }} />
      {event && event.updating && !admin ? (
        <h1 className="updating_text">La tabla se está actualizando...</h1>
      ) : (
        <>
          {info.map((team, index) => {
            // if there is something in the search bar, filtred it
            if (input.length > 0) {
              let regex = new RegExp(input, "i");
              if (regex.test(team.name))
                return (
                  <TableUser
                    key={team._id}
                    user={team}
                    {...{ index, kg }}
                    eventWods={event.categories[cindex].wods}
                    last={index === info.length - 1 ? true : false}
                    nextUser={info[index + 1] && info[index + 1]}
                  />
                );
            } else {
              return (
                <TableUser
                  key={team._id}
                  user={team}
                  {...{ index, kg }}
                  eventWods={event.categories[cindex].wods}
                  last={index === info.length - 1 ? true : false}
                  nextUser={info[index + 1] && info[index + 1]}
                />
              );
            }
          })}
        </>
      )}
    </div>
  );
};
export const TableHeader = ({ testClick, event, cindex }) => {
  const ref1 = useRef(null);

  const wtf = () => {
    testClick();
  };

  return (
    <div className="table_header" onClick={wtf}>
      <div className="header_names" ref={ref1}>
        <div className="th_cell th_pos">
          <h1>Posicion</h1>
        </div>
        <div className="th_cell th_name">
          <h1>Nombre</h1>
        </div>
        {event?.categories[cindex].wods.map((item, index) => (
          <div className="th_cell" key={index}>
            <h1>{item.name}</h1>
          </div>
        ))}
      </div>
      <div className="header_points">
        <h1>Puntos</h1>
        <div className="line"></div>
        <h1>Total</h1>
      </div>
    </div>
  );
};
export const TableUser = ({
  user,
  last = false,
  index,
  nextUser = false,
  eventWods,
  kg,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const toggleOpen = () => {
    setOpen(!open);
  };

  //   const clickOutside = (event) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       setOpen(false);
  //     }
  //   };

  //   useEffect(() => {
  //     document.addEventListener("click", clickOutside, true);
  //     return () => {
  //       document.removeEventListener("click", clickOutside, true);
  //     };
  //   }, []);

  return (
    <div className="table_user_ctn" ref={ref}>
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
          {user.wods.map((wod, index) => {
            let wod_type = eventWods[index]?.wod_type;
            return (
              <div
                className={`tu_cell ${wod._tie_winner ? "tie_bg" : false}`}
                key={index}
              >
                {wod._tie_winner && (
                  <div className="tie">
                    <IIcon />
                  </div>
                )}
                {wod.time === 0 && wod.amount === 0 ? (
                  <>
                    <h1 className="pos"> </h1>
                    <h1> </h1>
                  </>
                ) : (
                  <>
                    <h1 className="pos">{pos(wod?.pos)}</h1>
                    {wod_type === 1 && <Values_AMRAP wod={wod} />}
                    {wod_type === 2 && <Values_FORTIME wod={wod} />}
                    {wod_type === 3 && <Values_RM wod={wod} kg={kg} />}
                    {wod_type === 4 && <Values_CIRCUIT wod={wod} />}
                  </>
                )}
              </div>
            );
          })}
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
              height: "calc(5vw + 5vh)",
              paddingTop: "calc(1.1vw + 1.1vh)",
            }}
            exit={{ height: 0, paddingTop: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user.wods.map((wod, index) => {
              return (
                <div key={index} className="wods_display_item">
                  <h1>{eventWods[index].name}</h1>
                  <WodInfo
                    {...{ wod, kg }}
                    wt={eventWods[index]?.wod_type}
                    eventWod={eventWods[index]}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
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
/// WODS GUIDE 1=AMRAP 2=FORTIME 3=RM 4=CIRCUIT
const WodInfo = ({ wod, kg, wt, eventWod }) => {
  return (
    <>
      {(wt === 1 || wt === 2) && (
        <h1 className="amounts">
          {wod.amount} {eventWod.amount_type}
        </h1>
      )}
      {wt === 3 && <h1 className="amounts">{lbOrKg(wod.amount, kg)}</h1>}
      {wod.time !== 0 && (
        <h1 className="amounts">Tiempo: {wodTime(wod.time)} min</h1>
      )}
      {wt === 4 && wod.penalty !== 0 && (
        <h1 className="amounts">Penalty: {wod.penalty}</h1>
      )}
      {wod.tiebrake !== 0 && (
        <h1 className="amounts">Tiebrake: {wodTime(wod.tiebrake)} min</h1>
      )}
    </>
  );
};

const wodTime = (time) => moment.utc(time * 1000).format("mm:ss");

const Values_AMRAP = ({ wod }) => {
  return (
    <h1>
      ({wod.amount} {wod._amount_type})
    </h1>
  );
};
const Values_FORTIME = ({ wod }) => {
  return (
    <>
      {wod._amount_type === "CAP+" ? (
        <h1>(CAP+{wod._amount_left})</h1>
      ) : (
        <h1>({convSeconds(wod?.time)})</h1>
      )}
    </>
  );
};
const lbOrKg = (amount, isKg) => {
  if (isKg) return `${(amount * 0.453592).toFixed(2)} Kgs`;
  else return `${amount.toFixed(2)} Lbs`;
};
const Values_RM = ({ wod, kg }) => {
  if (wod._amount_type === "Reps") {
    return <h1>({wod.amount} Reps)</h1>;
  }else return <h1>({lbOrKg(wod.amount, kg)})</h1>
};
const Values_CIRCUIT = ({ wod }) => {
  return <h1>({convSeconds(wod?.time)})</h1>;
};
