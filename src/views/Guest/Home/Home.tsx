import { useEffect } from "react";
import { Banner } from "../../../components/Banner";
import heroimg from "../../../images/hero.jpg";
import "./home.sass";
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getEvents } from "../../../api/api_guest";
import { EvnFields } from "../../../types/event";
import { convertDate, todayIso } from "../../../helpers/date";
import { Calendar } from "./Calendar";
import { HashLink } from "react-router-hash-link";
import Context from "../../../helpers/UserContext";

const Home = () => {
  const { setMsg } = useContext(Context);
  const [events, setEvents] = useState<EvnFields[] | undefined>(undefined);

  useEffect(() => {
    if (events === undefined) {
      (async () => {
        const { status, data } = await getEvents();
        if (status === 200) setEvents(data);
        else setMsg({ type: "error", text: data.msg });
      })();
    }
  }, []);

  return (
    <div className="Home">
      <div className="hero_info_ctn" id="NOREP">
        <h6>
          #<span>TEAM</span> NO REP
        </h6>
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
          {events?.map((event) => {
            const since = todayIso(0, event.since);
            const until = todayIso(0, event.until);
            const t = todayIso();
            if (t >= since && t <= until) {
              return <EventCard key={event._id} event={event} />;
            } else return null;
          })}
        </div>
        <div className="event_cell cards_cells">
          <EventTimeText text="PRÓXIMAS" />
          {events?.map((event) => {
            const since = todayIso(-7, event.since);
            const until = todayIso(-7, event.until);
            const t = todayIso();
            console.log(t,since,until);
            if (t >= since && t <= until) {
              return <EventCard key={event._id} event={event} />;
            } else return null;
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

export const EventCard = ({
  event,
  admin,
}: {
  event: EvnFields;
  admin?: boolean;
}) => {
  const { adminData } = useContext(Context);
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
      {admin ? (
        //@ts-ignore
        <HashLink className="event_card" to={`/dashboard/${event._id}#`}>
          <EventCardInfo />
        </HashLink>
      ) : (
        <>
          {event.accesible || adminData ? (
            //@ts-ignore
            <HashLink
              className="event_card"
              to={`/resultados/${event._id}#top`}
            >
              <EventCardInfo />
            </HashLink>
          ) : (
            <div className="event_card">
              <EventCardInfo />
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
