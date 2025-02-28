import { useEffect } from "react";
import { useState } from "react";
import { Banner } from "../../../components/Banner";
import { EventCard } from "../Home/Home";
import { motion } from "framer-motion";
import { EvnFields } from "../../../types/event";
import { getEvents } from "../../../api/api_guest";
import "./events.sass";

const orderEvents = (a: EvnFields, b: EvnFields) => {
  if (a.since > b.since) return -1;
  else return 1;
};

const EventsList = () => {
  const [events, setEvents] = useState<EvnFields[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const oc = (e: any) => setSearchBar(e.target.value);
  useEffect(() => {
    if (events === undefined) {
      (async () => {
        setLoading(true);
        if(false) console.log(loading);
        const { status, data } = await getEvents();
        setLoading(false);
        if (status === 200) setEvents(data);
      })();
    }
  }, []);

  return (
    <div className="events_ctn" id="eventos">
      <div className="content">
        <div className="search_aside">
          <h6>EVENTOS</h6>
          <p>Calendario de competencias que cubrimos</p>
          <div className="event_input">
            <input
              type="text"
              placeholder="Buscar Equipo"
              value={searchBar}
              onChange={oc}
            />
          </div>
        </div>
        <motion.div
          className="cards_ctn"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {events?.sort(orderEvents).map((event, index) => {
            if (searchBar.length > 0) {
              let bool = false;
              let regex = new RegExp(searchBar, "i");
              event.categories.forEach((c) => {
                c.teams.forEach((t) => {
                  if (regex.test(t.name ?? "")) bool = true;
                });
              });
              if (bool) return <EventCard event={event} key={index} />;
            } else {
              return <EventCard event={event} key={index} />;
            }
          })}
        </motion.div>
      </div>

      <Banner />
    </div>
  );
};

export default EventsList;
