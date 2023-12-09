import React, { useEffect } from "react";
import { Banner } from "../components/Banner";
import eventcard from "../images/EC.png";
// import heroimg from "../images/h1.png";
import heroimg from "../images/hero.png";
import "../sass/home.sass";
import "../sass/calendar.sass";
import { getEventsHome } from "../api/events.api";
import { useState } from "react";
import moment from "moment";
import "moment/dist/locale/es";
import { useContext } from "react";
import { Context } from "../components/Context";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Home = () => {
  const {events,time} = useContext(Context)

  const click = () => {
    // console.log(moment().locale("es"));
    // let aux = moment.unix(events[0].until).format("DD, MMM.")
    // console.log(time);
  };

  return (
    <div className="Home">
      <div className="hero_info_ctn" id="NOREP" >
        <h6>
          #<span>TEAM</span> NO REP
        </h6>
        {/* <p>Conoce acerca del equipo y nuestra mision</p>
        <div className="more_info">
          <p>Mas informacion</p>
        </div> */}
        <img src={heroimg} alt="heroimg" className="heroimg" />
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
          {events.map((event) => {
            let days = moment.unix(event.until).diff(time, "days");
            if (days <= 7 && days >= 0) {
              return <EventCard key={event._id} event={event} />;
            }
          })}
          {/* <EventCard />
          <EventCard /> */}
        </div>
        <div className="event_cell cards_cells">
          <EventTimeText text="PRÓXIMAS" />
          {events.map((event) => {
            let days = moment.unix(event.until).diff(time, "days");
            if (days > 7) {
              return <EventCard key={event._id} event={event} />;
            }
          })}
          {/* <EventCard />
          <EventCard />
          <EventCard /> */}
        </div>
      </div>
      <Calendar {...{ events, time }} />
      <Banner />
    </div>
  );
};

export default Home;

const EventTimeText = ({ text }) => {
  return (
    <div className="ett">
      <h5>{text}</h5>
    </div>
  );
};

const offevent = {
  name: "FITGAMES",
  since: 1701595869,
  until: 1704288686,
};
const convertDate = (date) => moment.unix(date).format("DD, MMM");

export const EventCard = ({ event = offevent }) => {
  return (
    <HashLink className="event_card" to={`/resultados/${event._id}#top`} >
      {/* <img src={eventcard} alt="" /> */}
      <img src={event.image_url} alt="portada" />
      <div className="ec_info">
        <h1 className="ec_date">
          {convertDate(event.since)} - {convertDate(event.until)}
        </h1>
        <div className="ec_info_mid">
          <h1>{event.name}</h1>
          {/* <h1>{event.place}</h1> */}
          <h1>{event.categories[0]?.name}</h1>
          <h1>{event.categories[1]?.name}</h1>
        </div>
        <div>
          <h1 className="ec_mi">Mas informacion</h1>
        </div>
      </div>
    </HashLink>
  );
};

const getMonths = (time) => {
  return [
    moment(time).add(-3, "M").format("MM-YYYY"),
    moment(time).add(-2, "M").format("MM-YYYY"),
    moment(time).add(-1, "M").format("MM-YYYY"),
    moment(time).format("MM-YYYY"),
    moment(time).add(1, "M").format("MM-YYYY"),
    moment(time).add(2, "M").format("MM-YYYY"),
  ];
};
const getMonthsNames = (time) => {
  return [
    moment(time).add(-3, "M").format("MMM").replace(".", "").toUpperCase(),
    moment(time).add(-2, "M").format("MMM").replace(".", "").toUpperCase(),
    moment(time).add(-1, "M").format("MMM").replace(".", "").toUpperCase(),
    moment(time).format("MMM").replace(".", "").toUpperCase(),
    moment(time).add(1, "M").format("MMM").replace(".", "").toUpperCase(),
    moment(time).add(2, "M").format("MMM").replace(".", "").toUpperCase(),
  ];
};

const Calendar = ({ events, time }) => {
  const [months, setMonths] = useState([]);
  const [epm, setEpm] = useState([]);

  useEffect(() => {
    setMonths(getMonthsNames());
    setEpm(getMonths());
  }, [events]);

  const click = () => {};

  return (
    <div className="calendar" id="Calendar" >
      <h6 className="title" onClick={click}>
        CALENDARIO
      </h6>
      <p className="subtitle">Competencias que cubrimos</p>
      <div className="calendar_ctn">
        {months.map((row, index) => (
          <CalendarRow day={row} key={index}>
            {events.map((event, index2) => {
              if (epm[index] === moment.unix(event.since).format("MM-YYYY")) {
                return <CalendarCard event={event} key={index2} />;
              }
            })}
          </CalendarRow>
        ))}
      </div>
    </div>
  );
};

const CalendarRow = ({ day, children }) => {
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

const convertDateIM = (date) => moment.unix(date).format("DD");
const CalendarCard = ({ event }) => {
  return (
    <HashLink className="calendar_card" to={`/resultados/${event?._id}#top`} >
      <div className="cc_top">
        <h1 className="cc_title">{event.name}</h1>
        <h1 className="cc_categ">{event.categories[0]?.name}</h1>
        <h1 className="cc_date">{event.categories[1]?.name}</h1>
      </div>
      <div className="cc_bot">
        <h1>Ver Tabla</h1>
        <p className="cc_date2" >{convertDateIM(event.since)} - {convertDateIM(event.until)}</p>
      </div>
    </HashLink>
  );
};
