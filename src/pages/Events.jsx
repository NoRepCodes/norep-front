import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { getEventsPlusTeams, searchTeam } from "../api/events.api";
import { Banner } from "../components/Banner";
import "../sass/events.sass";
import { EventCard } from "./Home";
import { motion } from "framer-motion";
import { Context } from "../components/Context";

const orderEvents= (a,b)=>{
  if(a.since > b.since) return -1
  else return 1
}

export const Events = () => {
  const { events } = useContext(Context);
  const [teams, setTeams] = useState(false);
  const [first, setFirst] = useState(false);
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    let tm;
    if (first) {
      tm = setTimeout(() => {
        (async () => {
          const { status, data } = await searchTeam(inputName);
          if (status === 200) {
            setTeams(data);
          }
        })();
      }, 1000);
    }

    setFirst(true);
    return () => {
      clearTimeout(tm);
    };
  }, [inputName]);

  const onChangeText = (e) => {
    setInputName(e.target.value);
  };

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
              value={inputName}
              onChange={onChangeText}
            />
          </div>
          {/* <div className="event_input">
            <input type="date" placeholder="Elige la fecha" />
          </div> */}
        </div>
        <motion.div
          className="cards_ctn"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {events.sort(orderEvents).map((event, index) => {
            if (teams && inputName.length > 0) {
              let regex = new RegExp(inputName, "i");
              let bool = false;
              teams.forEach((t) => {
                if (regex.test(t.name)) {
                  bool = true;
                }
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
