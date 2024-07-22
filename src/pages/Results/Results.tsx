import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Banner } from "../../components/Banner";
// import { findTeams, toggleUpdating } from "../../api/events.api";

import { AnimatePresence, motion } from "framer-motion";
import { HamburguerMenu } from "../../components/Header";
import { ArwIcon, StrongIcon } from "../../components/PartnersSvg";
import useModal from "../../hooks/useModal";
import EditWodsModal from "../../components/modals/EditWodsModal";
import EditTeamsModal from "../../components/modals/EditTeamsModal";
import EditResultsModal from "../../components/modals/EditResultsModal";
import ResultAside from "../../components/results/ResultAside";
import ResultInfo from "../../components/results/ResultInfo";
import "./results.sass";
import "./tables.sass";
import {
  CategoryType,
  EventType,
  TeamType,
  WodType,
} from "../../types/event.t";
import { Context } from "../../components/Context";
import { getEventPlusWods, getWods } from "../../api/guest.api";
import EventModal from "../../components/modals/CreateEventModal";
import CategForm from "../../components/results/CategForm";

const Results = () => {
  const { _id } = useParams();
  const { events, admin } = useContext(Context);
  // MODALS WITH HOOKS
  const [teamM, toggleTeamM] = useModal();
  const [resM, toggleResM] = useModal();
  const [updateEvtM, toggleUpdateEvtM] = useModal();
  const [wodsM, toggleWodsM] = useModal();
  // EVENT STATES
  const [event, setEvent] = useState<EventType | undefined>(undefined);
  const [category, setCategory] = useState<CategoryType | undefined>(undefined);
  const [input, setInput] = useState("");
  const [kg, setKg] = useState<boolean | undefined>(false);
  const [wods, setWods] = useState<WodType[] | undefined>(undefined);

  // const [teams, setTeams] = useState<TeamType|undefined>(undefined);

  useEffect(() => {
    if (!_id) return setKg(undefined);
    else if (events) {
      // check if there is an event with that _id
      const aux = events.find((ev) => ev._id === _id);
      if (aux && (aux.accesible || admin)) {
        (async () => {
          setEvent(aux);
          setCategory(aux.categories[0]);
          if (wods !== undefined) return; // <== this to remove
          const categories = aux.categories.map((c) => c._id);
          const { status, data } = await getWods(categories);
          if (status === 200) setWods(data);
        })();
      } else setKg(undefined);
    } else if (events === undefined) {
      (async () => {
        const { status, data } = await getEventPlusWods(_id);
        if (status === 200) {
          const thisEvent = data.events.find((ev: any) => ev._id === _id);
          setCategory(thisEvent.categories[0]);
          setWods(data.wods);
          setEvent(thisEvent);
        } else setKg(undefined);
      })();
    }
  }, [events]);

  const click = () => {
    // toggleWodsM()
  };

  // // To do, this...
  if (kg === undefined) {
    return (
      <div className="error_page">
        <h6>404</h6>
        <p>Evento no encontrado :(</p>
      </div>
    );
  } else if (event === undefined) return <div className="error_page" />;

  const toggleUpdate = async () => {
    // return new Promise(async (resolve, reject) => {
    //   const { status, data } = await toggleUpdating(event._id, !event.updating);
    //   if (status === 200) {
    //     setEvent((prev) => ({ ...prev, updating: !event.updating }));
    //     resolve(true);
    //   } else {
    //     reject(false);
    //   }
    // });
  };

  const hamFunctions = {
    toggleWodsM,
    toggleTeamM,
    toggleResM,
    toggleUpdateEvtM,
    toggleUpdate,
    updating: false,
    // updating: event ? event.updating : null,
  };

  return (
    <>
      {updateEvtM && <EventModal close={toggleUpdateEvtM} {...{ event }} />}
      {wodsM && (
        <EditWodsModal
          close={toggleWodsM}
          {...{
            event,
            setEvent,
            category,
            setCategory,
            setWods,
            wods: wods?.filter((w) => w.category_id === category?._id),
          }}
        />
      )}
      {resM && (
        <EditResultsModal
          close={toggleResM}
          {...{
            wods: wods?.filter((w) => w.category_id === category?._id),
            category,
            setCategory,
            event,
            setWods,
          }}
        />
      )}

      {teamM && (
        <EditTeamsModal
          close={toggleTeamM}
          {...{ event, category, setCategory }}
        />
      )}

      <div className="results" onClick={click} id="top">
        <div className="btns_ctn">
          <Link className="back_btn_ctn" to="/eventos">
            <h1>
              Regresar a <span>EVENTOS</span>
            </h1>
          </Link>
          {/* {true && ( */}
          {admin && (
            <>
              <HamburguerBtns
                {...hamFunctions}
                manual_teams={event.manual_teams}
              />
            </>
          )}
        </div>
        <div className="results_ctn">
          <ResultAside
            {...{ input, setInput, event, category, setCategory, kg, setKg }}
          />
          {/* {new Date(event.since) <= new Date() ? ( */}
          { admin? (
            <ResultInfo
              {...{
                input,
                event,
                category,
                setCategory,
                setInput,
                admin,
                kg,
                wods,
              }}
            />
          ) : (
            <CategForm {...{category,event}} />
          )}
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

type HambBtnType = {
  toggleWodsM: () => void;
  toggleTeamM: () => void;
  toggleResM: () => void;
  // toggleUpdate: () => void,
  toggleUpdateEvtM: () => void;
  updating?: boolean;
  manual_teams?: boolean;
};

const HamburguerBtns = ({
  toggleWodsM,
  toggleTeamM,
  toggleResM,
  toggleUpdateEvtM,
  // toggleUpdate,
  manual_teams,
  updating,
}: HambBtnType) => {
  const [open, setOpen] = useState(false);
  const [upd, setUpd] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const toggleTab = async () => {
    // setUpd(true);
    // await toggleUpdate();
    // setUpd(false);
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
            <div className="hba_item" onClick={toggleUpdateEvtM}>
              <h1>Editar Evento</h1>
            </div>
            <div className="hba_item" onClick={toggleWodsM}>
              <h1>Editar Wods</h1>
            </div>
            {manual_teams && (
              <div className="hba_item" onClick={toggleTeamM}>
                <h1>Editar Equipos</h1>
              </div>
            )}
            <div className="hba_item" onClick={toggleResM}>
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

export default Results;
