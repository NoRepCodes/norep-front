import React, { useContext, useEffect, useState } from "react";
import "../sass/results.sass";
import "../sass/tables.sass";
import eventimg from "../images/EC.png";
import corner from "../images/corner.png";
import pf1 from "../images/arw.png";
import pf2 from "../images/pf2.png";
import pf3 from "../images/pf3.png";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import { Banner } from "../components/Banner";
import { Context } from "../components/Context";
import { findTeams, toggleUpdating } from "../api/events.api";
import moment from "moment";
import // EditResultsModal,
// EditTeamsModal,
"../components/Modals";

import p1 from "../images/p1.png";
import p2 from "../images/p2.png";
import p3 from "../images/p3.png";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { order, pos } from "../helpers/TableLogic";
import { Table } from "./Table";
import { HamburguerMenu } from "../components/Header";
import { UpdateEventModal } from "../components/modals/UpdateEventModal";
import { ArwIcon, StrongIcon } from "../components/PartnersSvg";
import { EditWodsModal } from "../components/modals/EditWodsModal";
import { EditTeamsModal } from "../components/modals/EditTeamsModal";
import { EditResultsModal } from "../components/modals/EditResultsModal";
// import UpdateEventM from "../components/modals/UpdateEventM";

const ww = window.innerWidth;
const wh = window.innerHeight;
const fs = (num) => num * (ww / 100) + num * (wh / 100);

const isObjEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
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
    // console.log('is working?')
    // console.log(event.categories[categ - 1])
    const { status, data } = await findTeams(event._id);
    if (status === 200) {
      let wl = event.categories[categ - 1].wods.length;
      let aux = [...data];
      aux.forEach((team, i1) => {
        for (let i = 0; i < wl; i++) {
          // console.log(team.wods[i])
          if (team.wods[i] === undefined) aux[i1].wods[i] = { ...blankResults };
        }
      });
      // console.log(aux);
      setTeams(aux);
    }
  };

  const click = () => {
    // console.log(teams[0].category_id)
    // console.log(event.categories[categ - 1])
  };

  if (event === null)
    return (
      <div className="error_page">
        <h6>404</h6>
        <p>Página no encontrada :(</p>
      </div>
    );

  const toggleUpdate = async () => {
    // console.log(event);
    // setEvent({...event,updating:!event.updating});
    return new Promise(async (resolve, reject) => {
      const { status, data } = await toggleUpdating(event._id, !event.updating);
      if (status === 200) {
        setEvent((prev) => ({ ...prev, updating: !event.updating }));
        resolve(true);
      } else {
        reject(false);
      }
      // setTimeout(() => {
      //   setEvent((prev) => ({ ...prev, updating: !event.updating }));
      //   resolve(true);
      // }, 2000);
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
          {...{ event, categ, set: setTeams,setCateg }}
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

const ResultAside = ({
  event,
  categ,
  setCateg,
  input,
  setInput,
  kg,
  setKg,
}) => {
  const [open, setOpen] = useState(false);
  // const ml = useMotionValue(0);
  const [cope, animate] = useAnimate();
  useEffect(() => {
    const ml_fs = fs(12);
    const pamount = event.partners.length * ml_fs - ml_fs;
    const si = setInterval(() => {
      const aux_ml =
        parseInt(
          window.getComputedStyle(cope.current).marginLeft.replace("px", "")
        ) * -1;
      const item_ml = aux_ml === 0 ? 0 : Math.round(aux_ml / ml_fs) * ml_fs;
      const amount = item_ml + fs(12);
      if (Math.round(item_ml) >= Math.round(pamount))
        animate(cope.current, { marginLeft: 0 });
      else animate(cope.current, { marginLeft: -amount });
      // }, 3000);
    }, 10000);
    return () => clearInterval(si);
  }, [event]);

  const toggle = () => setOpen(!open);

  const onChangeText = (e) => setInput(e.target.value);

  return (
    <div className="results_aside">
      <div className="ra_event">
        <img src={event?.secure_url} alt="portada" />
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
        <div
          className={!kg ? "lb_btn" : "kg_btn"}
          onClick={() => {
            setKg(!kg);
          }}
        >
          <h6>{!kg ? "Lbs" : "Kgs"}</h6>
          {!kg ? <SwitchLeftIcon /> : <SwitchRightIcon />}
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
      <div className="partners_carousel">
        <motion.div
          ref={cope}
          className="pc_absolute"
          style={{
            width:
              event?.partners.length === 0
                ? fs(12)
                : fs(12) * event.partners.length,
          }}
        >
          {event?.partners.length > 0 ? (
            <>
              {event?.partners.map((p, index) => (
                <img
                  src={p.secure_url}
                  alt={`patrocinante ` + index + 1}
                  key={index}
                />
              ))}
            </>
          ) : (
            <img src={pf1} alt="patrocinanteA" />
          )}

          {/* <img src={pf1} alt="patrocinanteA" />
          <img src={pf2} alt="patrocinanteB" />
          <img src={pf3} alt="patrocinanteC" /> */}
        </motion.div>
      </div>
    </div>
  );
};
const ResultInfo = ({
  input,
  event,
  categ,
  teams,
  setInput,
  setCateg,
  admin,
  kg,
}) => {
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
            <StrongIcon />
          </div>
          <div className="p_img_ctn">
            <ArwIcon />
          </div>
        </div>
        <div className="ri_header_top">
          <img src={corner} alt="corner" className="corner" />
          <img src={event?.secure_url} alt="banner" className="resp_ri_img" />
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
      <Table {...{ input, event, categ, teams, admin, kg }} />
    </div>
  );
};

const convertDate = (date) => moment.unix(date).format("DD, MMM");

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
    // setTimeout(() => {
    //   // toggleUpdate();
    //   setUpd(false)
    // }, 5000);
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
      {/* {open?
      <div>a</div>
      :<div>b</div>
      } */}
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

const SwitchLeftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path d="M6 18h12c3.311 0 6-2.689 6-6s-2.689-6-6-6h-12.039c-3.293.021-5.961 2.701-5.961 6 0 3.311 2.688 6 6 6zm12-10c-2.208 0-4 1.792-4 4s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4z" />
    </svg>
  );
};
const SwitchRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path d="M18 18h-12c-3.311 0-6-2.689-6-6s2.689-6 6-6h12.039c3.293.021 5.961 2.701 5.961 6 0 3.311-2.688 6-6 6zm-12-10c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
    </svg>
  );
};
