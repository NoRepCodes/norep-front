import { PropsWithChildren, useEffect } from "react";
import { Banner } from "../../components/Banner";
// import eventcard from "../images/EC.png";
// import heroimg from "../images/h1.png";
import heroimg from "../../images/hero.jpg";
import "./home.sass";
import "./calendar.sass";
// import { getEventsHome } from "../api/events.api";
import { useState } from "react";
//@ts-ignore
import moment from "moment";
import "moment/dist/locale/es";
import { useContext } from "react";
import { Context } from "../../components/Context";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
//@ts-ignore
import { HashLink } from "react-router-hash-link";
import { EventType } from "../../types/event.t";
import { getEvents } from "../../api/guest.api";

const Home = () => {
  const { events, setEvents } = useContext(Context);

  const click = () => {
    // console.log(moment.unix(1715460797).diff(new Date(), "days"))
    console.log(events);
  };

  useEffect(() => {
    if (events === undefined) {
      (async () => {
        const { status, data } = await getEvents();
        if (status === 200) setEvents(data);
      })();
    }
  }, []);

  return (
    <div className="Home">
      <div className="hero_info_ctn" id="NOREP">
        <h6 onClick={click}>
          #<span>TEAM</span> NO REP
        </h6>
        <img src={heroimg} alt="heroimg" className="heroimg" />
        {/* <p>Conoce acerca del equipo y nuestra mision</p>
        <div className="more_info">
          <p>Mas informacion</p>
        </div> */}
      </div>

      <div className="home_content">
        <div className="event_cell first_cell">
          <h6 className="big_text">EVENTOS</h6>
          <p className="short_text">
            calendario de competencias <br />
            que cubrimos
          </p>
          <Link className="more_info" to="eventos">
            <p>Mas informacion</p>
          </Link>
        </div>
        <div className="event_cell cards_cells">
          <EventTimeText text="EN CURSO" />
          {events?.map((event) => {
            let days = moment.unix(event.until).diff(new Date(), "days");
            if (days <= 7 && days >= 0) {
              return <EventCard key={event._id} event={event} />;
            }
            // return <EventCard key={event._id} event={event} />;
          })}
        </div>
        <div className="event_cell cards_cells">
          <EventTimeText text="PRÓXIMAS" />
          {events?.map((event) => {
            let days = moment.unix(event.until).diff(new Date(), "days");
            if (days > 7) {
              return <EventCard key={event._id} event={event} />;
            }
            // return <EventCard key={event._id} event={event} />;
          })}
        </div>
      </div>
      <Calendar {...{ events }} />
      <Banner />
    </div>
  );
};

export default Home;

const EventTimeText = ({ text }: { text: string }) => {
  return (
    <div className="ett">
      <h5>{text}</h5>
    </div>
  );
};

const convertDate = (date: string) => moment(date).format("DD, MMM");

export const EventCard = ({ event }: { event: EventType }) => {
  const { admin } = useContext(Context);
  const EventCardInfo = () => {
    return (
      <>
        <img src={event.secure_url} alt="portada" />
        <div className="ec_info">
          <h1 className="ec_date">
            {convertDate(event.since)} - {convertDate(event.until)}
          </h1>
          <div className="ec_info_mid">
            <h1 className="ec_name">{event.name}</h1>
            <h1>{event.categories[0]?.name}</h1>
            <h1>{event.categories[1]?.name}</h1>
            {/* {event.categories.length > 1 && <h1>{event.categories[1]?.name}</h1>} */}
          </div>
          <div>
            <h1 className="ec_mi">Mas informacion</h1>
          </div>
        </div>
      </>
    );
  };
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {event.accesible || admin ? (
        <HashLink className="event_card" to={`/resultados/${event._id}#top`}>
          <EventCardInfo />
        </HashLink>
      ) : (
        <div className="event_card">
          <EventCardInfo />
        </div>
      )}
    </motion.div>
  );
};

const getMonths = () => {
  return [
    moment().add(-3, "M").format("MM-YYYY"),
    moment().add(-2, "M").format("MM-YYYY"),
    moment().add(-1, "M").format("MM-YYYY"),
    moment().format("MM-YYYY"),
    moment().add(1, "M").format("MM-YYYY"),
    moment().add(2, "M").format("MM-YYYY"),
  ];
};
const getMonthsNames = () => {
  return [
    moment().add(-3, "M").format("MMM").replace(".", "").toUpperCase(),
    moment().add(-2, "M").format("MMM").replace(".", "").toUpperCase(),
    moment().add(-1, "M").format("MMM").replace(".", "").toUpperCase(),
    moment().format("MMM").replace(".", "").toUpperCase(),
    moment().add(1, "M").format("MMM").replace(".", "").toUpperCase(),
    moment().add(2, "M").format("MMM").replace(".", "").toUpperCase(),
  ];
};

const Calendar = ({ events }: { events?: EventType[] }) => {
  const [months, setMonths] = useState<string[]>([]);
  const [epm, setEpm] = useState<string[]>([]);

  useEffect(() => {
    setMonths(getMonthsNames());
    setEpm(getMonths());
  }, [events]);

  const click = () => {};

  return (
    <div className="calendar" id="Calendar">
      <h6 className="title" onClick={click}>
        CALENDARIO
      </h6>
      <p className="subtitle">Competencias que cubrimos</p>
      <div className="calendar_ctn">
        {months.map((row, index) => (
          <CalendarRow day={row} key={index}>
            {events?.map((event, index2) => {
              if (epm[index] === moment(event.since).format("MM-YYYY")) {
                return <CalendarCard event={event} key={index2} />;
              }
            })}
          </CalendarRow>
        ))}
      </div>
    </div>
  );
};
type CalendarRowT = PropsWithChildren & {
  day: string;
};
const CalendarRow = ({ day, children }: CalendarRowT) => {
  return (
    <div className="calendar_row">
      <h6>{day}</h6>
      <hr />
      <div className="calendar_cards_ctn">
        {children}
        <div className="test"></div>
      </div>
    </div>
  );
};

const convertDateIM = (date: string) => moment(date).format("DD");
const CalendarCard = ({ event }: { event: EventType }) => {
  const { admin } = useContext(Context);
  const CalendarCardInfo = () => {
    return (
      <>
        <div className="cc_top">
          <h1 className="cc_title">{event.name}</h1>
          <h1 className="cc_categ">{event.categories[0]?.name}</h1>
          {event.categories.length > 1 && (
            <h1 className="cc_categ">{event.categories[1]?.name}</h1>
          )}
          {/* <h1 className="cc_categ">{event.categories[1]?.name}</h1> */}
        </div>
        <div className="cc_bot">
          <h1>Ver Tabla</h1>
          <p className="cc_date">
            {convertDateIM(event.since)} - {convertDateIM(event.until)}
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      {event.accesible || admin ? (
        <HashLink
          className="calendar_card"
          to={`/resultados/${event?._id}#top`}
        >
          <CalendarCardInfo />
        </HashLink>
      ) : (
        <div
          className="calendar_card"
        >
          <CalendarCardInfo />
        </div>
      )}
    </>
  );
};
