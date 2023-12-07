import React, { useEffect } from "react";
import { useState } from "react";
import { getEventsPlusTeams } from "../api/events.api";
import { Banner } from "../components/Banner";
import "../sass/events.sass";
import { EventCard } from "./Home";

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);

  const [inputName, setInputName] = useState("");

  useEffect(() => {
    (async () => {
      const { status, data } = await getEventsPlusTeams();
      if (status === 200) {
        setEvents(data[0]);
        setTeams(data[1]);
      }
    })();
  }, []);

  const onChangeText = (e) => {
    setInputName(e.target.value);
  };

  return (
    <div className="events_ctn" id="eventos" >
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
        <div className="cards_ctn">
          {events.map((event, index) => {
            if (inputName.length > 0) {
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
        </div>
      </div>

      <Banner />
    </div>
  );
};
