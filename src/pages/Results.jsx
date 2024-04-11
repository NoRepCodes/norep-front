import React, { useContext, useEffect, useState } from "react";
import "../sass/results.sass";
import "../sass/tables.sass";
import eventimg from "../images/EC.png";
import pf1 from "../images/arw.png";
import pf2 from "../images/pf2.png";
import pf3 from "../images/pf3.png";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import { Banner } from "../components/Banner";
import { Context } from "../components/Context";
import { findTeams, toggleUpdating } from "../api/events.api";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { HamburguerMenu } from "../components/Header";
import { UpdateEventModal } from "../components/modals/UpdateEventModal";
import { ArwIcon, StrongIcon } from "../components/PartnersSvg";
import { EditWodsModal } from "../components/modals/EditWodsModal";
import { EditTeamsModal } from "../components/modals/EditTeamsModal";
import { EditResultsModal } from "../components/modals/EditResultsModal";
import ResultAside from "../components/results/ResultAside";
import ResultInfo from "../components/results/ResultInfo";

const ww = window.innerWidth;
const wh = window.innerHeight;

const blankResults = {
  amount: 0,
  tiebrake: 0,
  time: 0,
  penalty: 0,
};

export const Results = () => {
  let { _id } = useParams();
  const { events, setEvents, admin } = useContext(Context);
  const [event, setEvent] = useState(null);
  const [categ, setCateg] = useState(1);
  const [teams, setTeams] = useState(null);
  const [input, setInput] = useState("");

  const [kg, setKg] = useState(false);

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
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const toggleUpdateEventModal = () => {
    setUpdateEventModal(!updateEventModal);
  };

  useEffect(() => {
    if (events && _id) {
      (async () => {
        let aux = events.find((ev) => ev._id === _id);
        if (aux && (aux.accesible || admin)) {
          setEvent(aux);
        }
      })();
    }
  }, [events]);
  // }, [event,events]);

  useEffect(() => {
    if (event) {
      (async () => {
        // await resetTeams();
        if (!teams) {
          await resetTeams();
        }
      })();
    }
  }, [event, categ]);

  const resetTeams = async () => {
    const { status, data } = await findTeams(event._id);
    if (status === 200) {
      setTeams(data)
      // let wl = event.categories[categ - 1].wods.length;
      // let aux = [...data];
      // aux.forEach((team, i1) => {
      //   for (let i = 0; i < wl; i++) {
      //     if (team.wods[i] === undefined) aux[i1].wods[i] = { ...blankResults };
      //   }
      // });
      // setTeams(aux);
    }
  };

  const click = () => {
    // order2Improve(event, teams);
  };

  if (event === null)
    return (
      <div className="error_page">
        <h6>404</h6>
        <p>Página no encontrada :(</p>
      </div>
    );

  const toggleUpdate = async () => {
    return new Promise(async (resolve, reject) => {
      const { status, data } = await toggleUpdating(event._id, !event.updating);
      if (status === 200) {
        setEvent((prev) => ({ ...prev, updating: !event.updating }));
        resolve(true);
      } else {
        reject(false);
      }
    });
  };

  const hamFunctions = {
    toggleWodsM,
    toggleTeamModal,
    toggleResuM,
    toggleUpdateEventModal,
    toggleUpdate,
    updating: event ? event.updating : null,
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
          teamsValue={teams}
          {...{ event, categ, set: setTeams, setCateg }}
        />
      )}
      {updateEventModal && (
        <UpdateEventModal
          close={toggleUpdateEventModal}
          {...{ event, categ, setEvents, resetTeams, events }}
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
              <HamburguerBtns {...hamFunctions} />
            </>
          )}
        </div>
        <div className="results_ctn">
          <ResultAside
            {...{ input, setInput, event, categ, setCateg, kg, setKg }}
          />
          <ResultInfo
            {...{ input, event, categ, setCateg, teams, setInput, admin, kg }}
          />
        </div>
        <div className="partners_resposive">
          <div className="p_img_ctn">
            <StrongIcon />
          </div>
          <div className="p_img_ctn">
            <ArwIcon />
          </div>
        </div>
      </div>
      <Banner />
    </>
  );
};




const HamburguerBtns = ({
  toggleWodsM,
  toggleTeamModal,
  toggleResuM,
  toggleUpdate,
  toggleUpdateEventModal,
  updating,
}) => {
  const [open, setOpen] = useState(false);
  const [upd, setUpd] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const toggleTab = async () => {
    setUpd(true);
    await toggleUpdate();
    setUpd(false);
  };
  const hbaAnimate = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
    // onMouseLeave:()=>{setOpen(false)}
  };
  return (
    <div className="hamburguerBtns">
      <HamburguerMenu onClick={toggleOpen} openMenu={open} />
      <AnimatePresence>
        {open && (
          <motion.div className="hb_absolute_ctn" {...hbaAnimate}>
            <div className="hba_item" onClick={toggleUpdateEventModal}>
              <h1>Editar Evento</h1>
            </div>
            <div className="hba_item" onClick={toggleWodsM}>
              <h1>Editar Wods</h1>
            </div>
            <div className="hba_item" onClick={toggleTeamModal}>
              <h1>Editar Equipos</h1>
            </div>
            <div className="hba_item" onClick={toggleResuM}>
              <h1>Editar Resultados</h1>
            </div>
            <button className="hba_item" onClick={toggleTab} disabled={upd}>
              {upd ? (
                <h1>Actualizando...</h1>
              ) : (
                <>
                  {updating ? <h1>Mostrando Res.</h1> : <h1>Ocultando Res.</h1>}
                  {updating ? <EyeIcon /> : <EyeCloseIcon />}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
    </svg>
  );
};
const EyeCloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z" />
    </svg>
  );
};


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

let teamAux = [
  {
    _id: "",
    name: "",
    category_id: "",
    event_id: "",
    box: "",
    wods: [
      {
        amount: 0,
        amount_type: "",
        time: 0,
        tiebrake: 0,
        penalty: 0,
      },
    ],
  },
];

export const order2Improve = async (eventx = evAux, data = teamAux) => {
  console.log(data)
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
          w._results.push(t.wods[windex]);
        }
      });
      // Order results by wod_type and values
      if (w.wod_type === 4) w._results.sort((a, b) => circuitSort(a, b));
      else w._results.sort((a, b) => wodSort(a, b));

      // tr = team result
      // apply points to team results and share amount_type
      w._results.forEach((tr, tr_index) => {
        // put CAPS + on for time (w.amount_type === 2)
        if (w.wod_type === 2 && w.time_cap === tr.time)
          tr._amount_type = "CAPS +";
        else tr._amount_type = w.amount_type;
        applyPoints(tr, tr_index, w, w._results.length);
      });
    });
  });

  // plus every point and tiebrake
  teams.forEach((t) => {
    t.wods.forEach((w) => {
      t._points += w.points;
      t._tiebrake_total += w.tiebrake;
    });
    let perc = parseFloat((t._points / t.wods.length).toFixed(3));
    if (Number.isNaN(perc)) {
      t._percent = 0;
    } else {
      t._percent = perc;
    }
  });

  const categTeams = event.categories.map((c) => []);
  event.categories.forEach((c, cindex) => {
    teams.forEach((t) => {
      if (t.category_id === c._id) categTeams[cindex].push(t);
    });
  })
  // console.log(categTeams)
  return categTeams
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

const circuitSort = (a, b) => {
  if (a.time > b.time) return 1;
  else if (a.time < b.time) return -1;
  else if (a.time === b.time) {
    if (a.tiebrake > b.tiebrake) return 1;
    else if (a.tiebrake < b.tiebrake) return -1;
    else if (a.tiebrake === b.tiebrake) return 0;
  }
};

const applyPoints = (tr, index, wod) => {
  let tl = wod._results.length;
  // ppw = points per wod
  let ppw = Math.floor(100 / tl);
  // Make sure that there are values, cheking time
  if (tr.time !== 0) {
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
        tr.tiebrake === prev.tiebrake
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
