import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { checkTie, order, pos } from "../helpers/TableLogic";

const lbToKg = (lb) => (lb * 0.453592).toFixed(2);
// const kgToLb = (kg)=> (kg * 2.20462).toFixed(2)

const convSeconds = (s) => moment.utc(s * 1000).format("HH:mm:ss");

export const Table = ({ input, event, categ, teams, admin, kg = true }) => {
  const [right, setRight] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    if (teams) {
      (async () => {
        setInfo(await order(teams, event, categ));
      })();
    }
  }, [teams, categ, event]);

  const toggleRight = () => {
    console.log(teams);
    // console.log(info[0].wods[0])
    // console.log(info[1].wods[0])
    // console.log(info)
    // setRight(!right);
  };

  return (
    <div className="table">
      <TableHeader {...{ toggleRight, right, event, categ }} />
      {event && event.updating && !admin ? (
        <h1 className="updating_text">La tabla se está actualizando...</h1>
      ) : (
        <>
          {info.map((team, index) => {
            if (input.length > 0) {
              let regex = new RegExp(input, "i");
              if (regex.test(team.name))
                return (
                  <TableUser
                    key={index}
                    user={team}
                    {...{ right, index, kg }}
                    last={index === info.length - 1 ? true : false}
                    nextUser={info[index + 1] && info[index + 1]}
                  />
                );
            } else {
              return (
                <TableUser
                  key={index}
                  user={team}
                  {...{ right, index, kg }}
                  eventWods={event.categories[categ - 1].wods}
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
export const TableHeader = ({ right, toggleRight, event, categ }) => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const wtf = () => {
    toggleRight();
    // console.log(event.categories[categ - 1]);
  };

  return (
    <div className="table_header" onClick={wtf}>
      <div className="header_names" ref={ref1}>
        {/* <div
          className="header_pa"
          style={{ right: right ? "220px" : "auto" }}
          ref={ref2}
        > */}
        <div className="th_cell th_pos">
          <h1>Posicion</h1>
        </div>
        <div className="th_cell th_name">
          <h1>Nombre</h1>
        </div>
        {event?.categories[categ - 1].wods.map((item, index) => (
          <div className="th_cell" key={index}>
            <h1>{item.name}</h1>
          </div>
        ))}
      </div>
      {/* </div> */}
      <div className="header_points">
        {/* {paWidth > wodsWidth && <Arrow click={toggleRight} right={right} />} */}
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
  right,
  index,
  nextUser = false,
  eventWods,
  kg,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const toggleOpen = () => {
    setOpen(!open);
    // console.log(user)
  };

  const clickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside, true);
    return () => {
      document.removeEventListener("click", clickOutside, true);
    };
  }, []);

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
          {user.wods.map((wod, index) => (
            <div
              className={`tu_cell ${
                checkTie(wod, nextUser.wods, index) ? "tie_bg" : false
              }`}
              key={index}
            >
              {checkTie(wod, nextUser.wods, index) ? (
                <div className="tie">
                  <IIcon />
                </div>
              ) : null}
              {wod === null || !wod.amount || wod.amount === 0 ? (
                <>
                  <h1 className="pos"> </h1>
                  <h1> </h1>
                </>
              ) : (
                <>
                  <h1 className="pos">{pos(wod?.pos)}</h1>
                  <h1>
                    {wod.amount && wod.wod_type === 1
                      ? `(${wod?.amount} ${wod?.amount_type})`
                      : null}
                    {wod.amount && wod.wod_type === 3 ? (
                      <>
                        {!kg
                          ? `(${(wod?.amount).toFixed(2)} ${wod?.amount_type})`
                          : `(${lbToKg(wod?.amount)} Kgs)`}
                      </>
                    ) : null}
                  </h1>
                  {wod.amount && wod.wod_type === 2 && (
                    <>
                      {wod.time < wod.time_cap ? (
                        <h1>{`(${convSeconds(wod?.time)})`}</h1>
                      ) : (
                        <h1>{`(CAP+${wod.amount_cap - wod.amount})`}</h1>
                      )}
                    </>
                  )}
                  {wod.amount && wod.wod_type === 4 && (
                    <>
                      <h1>
                        ({wod?.amount - wod?.penalty}{" "}
                        {eventWods[index]?.amount_type})
                      </h1>
                    </>
                  )}
                </>
              )}
              {/* <h1>{wod.amount && wod.wod_type === 2 && `(${convSeconds(wod?.time)})`}</h1>
              {wod.amount && wod.wod_type === 1
                      (wod.wod_type === 1 || wod.wod_type === 3) &&
                      `(${wod?.amount} ${wod?.amount_type})`}
               */}
            </div>
          ))}
        </div>
        <div className={`tu_points ${last && "no_b"}`}>
          <h1>{user.points}</h1>
          <h1>{user.percent}%</h1>
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
                  <WodInfo {...{ wod, kg }} evntwod={eventWods[index]} />
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
const WodInfo = ({ wod, kg, evntwod }) => {
  return (
    <>
      {/* <h1>{wodName(wod.wod_type)}</h1> */}
      {wod.amount !== 0 && (
        <h1 className="amounts">
          {wodAmount(wod.amount, wod.wod_type, kg,evntwod.amount_type)}
        </h1>
      )}
      {(wod.wod_type === 4 && wod.penalty !== 0) && (
        <h1 className="amounts">
          Penalty: {wod.penalty}
        </h1>
      )}
      {(wod.wod_type === 2 || wod.wod_type === 4) && (
        <h1 className="amounts">Tiempo: {wodTime(wod.time)} min</h1>
      )}
      {wod.tiebrake !== 0 && (
        <h1 className="amounts">Tiebrake: {wodTime(wod.tiebrake)} min</h1>
      )}
    </>
  );
};

const wodName = (wod_type) => {
  if (wod_type === 1) return "AMRAP";
  else if (wod_type === 2) return "FORTIME";
  else if (wod_type === 3) return "RM";
};
const wodAmount = (amount, wod_type, kg,amount_type) => {
  // console.log(wod_type)
  if (wod_type === 1 || wod_type === 2 || wod_type === 4) return amount + " " +amount_type;
  if (wod_type === 3 && kg) return lbToKg(amount) + " Kgs";
  else if (wod_type === 3 && !kg) return amount + " Lbs" ;
};
const wodAmountType = (wod_type, kg) => {
  if (wod_type === 1 || wod_type === 2 || wod_type === 4) return "Reps";
  if (wod_type === 3 && kg) return "Kgs";
  else if (wod_type === 3 && !kg) return "Lbs";
};
const wodTime = (wod_time) => {
  // const minute = Math.floor(wod_time/60)
  // const seconds = wod_time%60 !== 0 ? `:${wod_time%60}` :''
  // return minute+seconds
  return moment.utc(wod_time * 1000).format("mm:ss");
};
