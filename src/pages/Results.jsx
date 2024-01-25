import React, { useContext, useEffect, useState } from "react";
import "../sass/results.sass";
import "../sass/tables.sass";
import eventimg from "../images/EC.png";
import corner from "../images/corner.png";
import arw from "../images/arw.png";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import { Banner } from "../components/Banner";
import { Context } from "../components/Context";
import { findTeams, toggleUpdating } from "../api/events.api";
import moment from "moment";
import {
  EditResultsModal,
  EditTeamsModal,
  EditWodsModal,
} from "../components/Modals";

import p1 from "../images/p1.png";
import p2 from "../images/p2.png";
import p3 from "../images/p3.png";
import { motion } from "framer-motion";

export const Results = () => {
  let { _id } = useParams();
  const { events, setEvents, admin } = useContext(Context);
  const [event, setEvent] = useState(null);
  const [categ, setCateg] = useState(1);
  const [teams, setTeams] = useState(null);
  const [input, setInput] = useState("");

  const [wodsModal, setWodsModal] = useState(false);
  const toggleWodsM = () => {
    setWodsModal(!wodsModal);
  };
  const [resuModal, setResuModal] = useState(false);
  const toggleResuM = () => {
    setResuModal(!resuModal);
  };

  const [teamModal, setTeamModal] = useState(false);
  const toggleTeamModal = () => {
    setTeamModal(!teamModal);
  };

  useEffect(() => {
    if (events && _id) {
      (async () => {
        let aux = events.find((ev) => ev._id === _id);
        console.log(aux);
        setEvent(aux);
      })();
    }
  }, [events]);

  useEffect(() => {
    if (event) {
      (async () => {
        const { status, data } = await findTeams(event._id);
        if (status === 200) {
          setTeams(data);
        }
      })();
    }
  }, [event]);

  const click = () => {
    // console.log(event)
    // console.log(categ)
    // console.log(state);
    // console.log(teams)
  };

  if (event === null)
    return (
      <>
        <p>no data</p>
      </>
    );

  const toggleUpdate = async () => {
    const { data, status } = await toggleUpdating(event._id, event.updating);
    console.log(data);
    console.log(status);
    if (status === 200) {
      setEvent((prev) => ({ ...prev, updating: !event.updating }));
    }
  };

  return (
    <>
      {wodsModal && (
        <EditWodsModal
          close={toggleWodsM}
          {...{ event, categ, setEvents, events }}
        />
      )}
      {resuModal && (
        <EditResultsModal
          close={toggleResuM}
          {...{ event, categ, teams, setTeams }}
        />
      )}
      {teamModal && (
        <EditTeamsModal
          close={toggleTeamModal}
          {...{ event, categ, set: setTeams }}
        />
      )}
      <div className="results" onClick={click} id="top">
        <div className="btns_ctn">
          <Link className="back_btn_ctn" to="/eventos">
            <h1>
              Regresar a <span>EVENTOS</span>
            </h1>
          </Link>
          {admin && (
            <>
              <div className="wods_btn" onClick={toggleWodsM}>
                <h1>Editar Wods</h1>
              </div>
              <div className="teams_btn" onClick={toggleTeamModal}>
                <h1>Añadir Equipos</h1>
              </div>
              <div className="results_btn" onClick={toggleResuM}>
                <h1>Editar Resultados</h1>
              </div>
              <div className="results_btn" onClick={toggleUpdate}>
                {event && !event.updating ? (
                  <h1>Mostrar Resultados</h1>
                ) : (
                  <h1>Ocultar Resultados</h1>
                )}
              </div>
            </>
          )}
        </div>
        <div className="results_ctn">
          <ResultAside {...{ input, setInput, event, categ, setCateg }} />
          <ResultInfo {...{ input, event, categ, setCateg, teams, setInput,admin }} />
        </div>
        <div className="partners_resposive">
          <div className="p_img_ctn">
            <img src={p1} alt="p1" />
          </div>
          <div className="p_img_ctn">
            <img src={p2} alt="p2" />
          </div>
          <div className="p_img_ctn">
            <img src={p3} alt="p3" />
          </div>
        </div>
      </div>
      <Banner />
    </>
  );
};

const ResultAside = ({ event, categ, setCateg, input, setInput }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const onChangeText = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="results_aside">
      <div className="ra_event">
        <img src={event?.image_url} alt="portada" />
        {/* <img src={eventimg} alt="" /> */}
        <div className="categ_ctn">
          <h6>CATEGORIAS</h6>
          <div className="categ_dropdown" onClick={toggle}>
            {event ? (
              <p>{event.categories[categ - 1].name}</p>
            ) : (
              <p>Selecciona una categoria</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 21l-12-18h24z" />
            </svg>
          </div>
          {open && (
            <div className="abs_categ_dropdown">
              {event &&
                event.categories.map((categ, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setCateg(index + 1);
                      toggle();
                    }}
                  >
                    {categ.name}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="user_input">
        <input
          type="text"
          placeholder="Buscar Participantes"
          value={input}
          onChange={onChangeText}
        />
      </div>
      <img src={arw} alt="patrocinante" className="partner" />
    </div>
  );
};
const convertDate = (date) => moment.unix(date).format("DD, MMM");
const ResultInfo = ({ input, event, categ, teams, setInput, setCateg,admin }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const onChangeText = (e) => {
    setInput(e.target.value);
  };
  return (
    <div className="results_info">
      <div className="ri_header">
        <div className="partners">
          <div className="p_img_ctn">
            <img src={p1} alt="p1" />
          </div>
          <div className="p_img_ctn">
            <img src={p2} alt="p2" />
          </div>
          <div className="p_img_ctn">
            <img src={p3} alt="p3" />
          </div>
        </div>
        <div className="ri_header_top">
          <img src={corner} alt="corner" className="corner" />
          <img src={event?.image_url} alt="banner" className="resp_ri_img" />
          <h1 className="ri_title">{event?.name}</h1>
          <h1>Individuales</h1>
          <h1>2023 - Final</h1>
        </div>
        <div className="ri_header_bot">
          <div className="rhb_left">
            <h1>{event?.place}</h1>
            <h1 className="ri_date">
              {convertDate(event?.since)} - {convertDate(event?.until)}
            </h1>
          </div>
        </div>
      </div>
      <div className="user_input">
        <input
          type="text"
          placeholder="Buscar participantes..."
          value={input}
          onChange={onChangeText}
        />
      </div>
      <div style={{ position: "relative" }}>
        <div className="resp_categories_ctn" onClick={toggle}>
          {event ? (
            <p>{event.categories[categ - 1].name}</p>
          ) : (
            <p>Selecciona una categoria</p>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
          >
            <path d="M12 21l-12-18h24z" />
          </svg>
        </div>
        {open && (
          <div className="abs_resp_categ_dropdown">
            {event &&
              event.categories.map((categ, index) => (
                <p
                  key={index}
                  onClick={() => {
                    setCateg(index + 1);
                    toggle();
                  }}
                >
                  {categ.name}
                </p>
              ))}
          </div>
        )}
      </div>
      <Table {...{ input, event, categ, teams,admin }} />
    </div>
  );
};

const Table = ({ input, event, categ, teams,admin }) => {
  const [right, setRight] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    if (teams) {
      (async () => {
        setInfo(await order(teams, event, categ));
      })();
    }
  }, [teams, categ]);

  const toggleRight = () => {
    // console.log(info[0].wods[0])
    // console.log(info[1].wods[0])
    // console.log(info)
    // setRight(!right);
  };

  return (
    <div className="table" >
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
                    {...{ right, index }}
                    last={index === info.length - 1 ? true : false}
                    nextUser={info[index + 1] && info[index + 1]}
                  />
                );
            } else {
              return (
                <TableUser
                  key={index}
                  user={team}
                  {...{ right, index }}
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
const wods = ["Los perdidos", "Zumaque 1A", "Zumaque 1B", "Vitico Davalillo"];
const TableHeader = ({ right, toggleRight, event, categ }) => {
  const [wodsWidth, setWodsWidth] = useState(0);
  const [paWidth, setPaWidth] = useState(0);
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const wtf = () => {
    toggleRight();
    // console.log(event.categories[categ - 1]);
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWodsWidth(ref1.current.offsetWidth);
  //     // console.log(ref1.current.offsetWidth);
  //   };
  //   setPaWidth(ref2.current.offsetWidth);
  //   handleResize();
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

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
const convSeconds = (s) => moment.utc(s * 1000).format("HH:mm:ss");
const Arrow = ({ click, right }) => {
  return (
    <div className="btn_abs" onClick={click}>
      <svg
        className={right ? "rotate" : "_"}
        clipRule="evenodd"
        width="18"
        height="18"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
          fillRule="nonzero"
        />
      </svg>
    </div>
  );
};
/// TABLE USER
const TableUser = ({ user, last = false, right, index, nextUser = false }) => {
  return (
    <motion.div className="table_user" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.7}}  >
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
            {wod.amount === 0 ? (
              <>
                <h1 className="pos"> </h1>
                <h1> </h1>
              </>
            ) : (
              <>
                <h1 className="pos">{pos(wod?.pos)}</h1>
                <h1>
                  {wod.amount &&
                    (wod.wod_type === 1 || wod.wod_type === 3) &&
                    `(${wod?.amount} ${wod?.amount_type})`}
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
              </>
            )}
            {/* <h1>{wod.amount && wod.wod_type === 2 && `(${convSeconds(wod?.time)})`}</h1> */}
          </div>
        ))}
      </div>
      <div className={`tu_points ${last && "no_b"}`}>
        <h1>{user.points}</h1>
        <h1>{user.percent}%</h1>
      </div>
    </motion.div>
  );
};

const testUser = {
  _id: "656c1e2670a59f6cf7bd7dc7",
  name: "Los leones de Merida",
  category_id: "656ed88ad08bf109f6d0c033",
  event_id: "656ed88ad08bf109f6d0c032",
  __v: 0,
  points: 120,
  percent: 99.99,
  wods: [
    {
      pos: 1,
      time: 600,
      tiebrake: 150,
      amount: 210,
      amount_type: "Reps",
      _id: "656fae0b22a8599de817e8a5",
    },
    {
      pos: 1,
      time: 600,
      tiebrake: 150,
      amount: 230,
      amount_type: "Reps",
      _id: "656fad94e0b0820380b618df",
    },
    {},
    {},
  ],
};

const order = async (data, event, categ) => {
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
    } else if (ogWod.wod_type === 2) {
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

const AMRAP_points = async (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => {
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
  });

  // console.log(wod)
  wod.forEach((team, index) => {
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
          // team.percent = (team.amount * 100) / wod[0].amount;
          team.percent = ppw * (tl - index);
          team.points = ppw * (tl - index);
          team.pos = index + 1;
        }
      }
    }
  });

  // console.log(wod);
};
const FORTIME_points = (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => {
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
  });

  // console.log(wod)

  wod.forEach((team, index) => {
    // console.log(wod)
    if (team.amount !== 0) {
      // team.percent = (team.amount * 100) / ogWod.amount_cap
      // console.log(team.percent + team.name)
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
          // team.percent = wod[index - 1].percent - 10 / tl;
          team.percent = ppw * (tl - index);
          team.pos = index + 1;
        } else {
          team.percent = ppw * (tl - index);
          team.points = ppw * (tl - index);
          team.pos = index + 1;
        }
      }

      if (team.amount < ogWod.amount_cap) {
        team.amount_type = "Caps +";
        team.amount = ogWod.amount_cap - team.amount;
      }
    }
    // console.log(team.percent + team.name);
    // console.log(team)
  });

  // console.log(wod);
};
const RM_points = (ogWod, wod, tl) => {
  let ppw = Math.floor(100 / tl);
  wod.sort((a, b) => {
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
  });

  wod.forEach((team, index) => {
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
  });
};

const TieBreaker = (teams) => {
  //// TO DO Recorrer equipos y evaluar a todos aquellos que tengan la misma cantidad y sumar los tiebrakes, quien tenga menor tiebrake, tiene mejor rendimiento

  // Añadir el total de tiebrake a todos los equipos
  teams.forEach((team) => {
    team.tiebrake_total = 0;
    team.wods.forEach((wod) => {
      if (wod.tiebrake !== undefined) {
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

const pos = (pos) => {
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

const checkTie = (wod, nextWod, index) => {
  if (nextWod) {
    if (
      wod.amount !== 0 &&
      wod.amount === nextWod[index].amount &&
      wod.time === nextWod[index].time
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
