import React, { useContext, useEffect, useState } from "react";
import "../sass/results.sass";
import "../sass/tables.sass";
import { Link, useParams } from "react-router-dom";
import { Banner } from "../components/Banner";
import { Context } from "../components/Context";
import { findTeams, toggleUpdating } from "../api/events.api";

import { AnimatePresence, motion } from "framer-motion";
import { HamburguerMenu } from "../components/Header";
import { UpdateEventModal } from "../components/modals/UpdateEventModal";
import { ArwIcon, StrongIcon } from "../components/PartnersSvg";
import { EditWodsModal } from "../components/modals/EditWodsModal";
import { EditTeamsModal } from "../components/modals/EditTeamsModal";
import { EditResultsModal } from "../components/modals/EditResultsModal";
import ResultAside from "../components/results/ResultAside";
import ResultInfo from "../components/results/ResultInfo";
const body = document.getElementById('body');

const showScroll = ()=> body.style.overflow = 'auto'
const hideScroll = ()=> body.style.overflow = 'hidden'

export const Results = () => {
  let { _id } = useParams();
  const { events, setEvents, admin } = useContext(Context);
  const [event, setEvent] = useState(false);
  // cindex = category index
  const [cindex, setCindex] = useState(0);
  const [teams, setTeams] = useState(null);
  const [input, setInput] = useState("");

  const [kg, setKg] = useState(false);

  const [wodsModal, setWodsModal] = useState(false);
  const toggleWodsM = () => {
    if(wodsModal) showScroll()
    else hideScroll()
    setWodsModal(!wodsModal);
  };
  const [resuModal, setResuModal] = useState(false);
  const toggleResuM = () => {
    if(resuModal) showScroll()
    else hideScroll()
    setResuModal(!resuModal);
  };

  const [teamModal, setTeamModal] = useState(false);
  const toggleTeamModal = () => {
    if(teamModal) showScroll()
    else hideScroll()
    setTeamModal(!teamModal);
  };
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const toggleUpdateEventModal = () => {
    if(updateEventModal) showScroll()
    else hideScroll()
    setUpdateEventModal(!updateEventModal);
  };

  useEffect(() => {
    if (events && _id) {
      (async () => {
        let aux = events.find((ev) => ev._id === _id);
        if (aux && (aux.accesible || admin)) {
          setEvent(aux);
        }else {
          setEvent(undefined);
        }
      })();
    }
  }, [events]);

  useEffect(() => {
    if (event) {
      (async () => {
        if (!teams) {
          await resetTeams();
        }
      })();
    }
  }, [event]);

  const resetTeams = async () => {
    const { status, data } = await findTeams(event._id);
    if (status === 200) {
      setTeams(data);
    } 
  };

  const click = () => {
    // order2Improve(event, teams);
  };

  // To do, this...
  if (event === false) return <div className="error_page" />;
  else if (event === undefined) {
    return (
      <div className="error_page">
        <h6>404</h6>
        <p>Evento no encontrado :(</p>
      </div>
    );
  }

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
          {...{ event, cindex, setEvents, events,setCindex }}
        />
      )}
      {resuModal && (
        <EditResultsModal
          close={toggleResuM}
          {...{ event, cindex, teams, setTeams }}
        />
      )}
      {teamModal && (
        <EditTeamsModal
          close={toggleTeamModal}
          teamsValue={teams}
          {...{ event, cindex, set: setTeams, setCindex }}
        />
      )}
      {updateEventModal && (
        <UpdateEventModal
          close={toggleUpdateEventModal}
          {...{ event, cindex, setEvents, resetTeams, events }}
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
            {...{ input, setInput, event, cindex, setCindex, kg, setKg }}
          />
          <ResultInfo
            {...{ input, event, cindex, setCindex, teams, setInput, admin, kg }}
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
