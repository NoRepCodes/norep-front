import React, { useState } from 'react'
import { ArwIcon, StrongIcon } from '../PartnersSvg';

import corner from "../../images/corner.png";
import { Table } from './Table';
import moment from 'moment';

const convertDate = (date) => moment.unix(date).format("DD, MMM");
const ResultInfo = ({
    input,
    event,
    cindex,
    teams,
    setInput,
    setCindex,
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
              <p>{event.categories[cindex].name}</p>
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
                      setCindex(index);
                      toggle();
                    }}
                  >
                    {categ.name}
                  </p>
                ))}
            </div>
          )}
        </div>
        <Table {...{ input, event, cindex, teams, admin, kg }} />
      </div>
    );
  };

export default ResultInfo