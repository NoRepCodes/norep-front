import { Dispatch, useState } from "react";
import { ArwIcon, StrongIcon } from "../PartnersSvg";

import corner from "../../images/corner.png";
import Table from "./Table";
//@ts-ignore
import moment from "moment";
import { CategoryType, EventType, WodType } from "../../types/event.t";

const convertDate = (date: number) => moment.unix(date).format("DD, MMM");

type ResultInfoT = {
  input: string;
  event: EventType;
  category: CategoryType | undefined;
  // teams:TeamType,
  setInput: Dispatch<string>;
  setCategory: Dispatch<CategoryType>;
  admin: any;
  kg: boolean;
  wods: WodType[] | undefined;
};
const ResultInfo = ({
  input,
  event,
  category,
  // teams,
  setInput,
  setCategory,
  admin,
  kg,
  wods,
}: ResultInfoT) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const onChangeText = (e: any) => {
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
          {/* <h1>Individuales</h1>
          <h1>2023 - Final</h1> */}
        </div>
        <div className="ri_header_bot">
          <div className="rhb_left">
            <h1>{event?.place}</h1>
            <h1 className="ri_date">
              {typeof event.since === "number" &&
              typeof event.until === "number"
                ? `${convertDate(event?.since)} - ${convertDate(event?.since)}`
                : ""}
            </h1>
          </div>
        </div>
      </div>

      <>  {/** THIS IS RESPONSIVE */}
        <div className="user_input">
          <input
            type="text"
            placeholder="Buscar participantes..."
            value={input}
            onChange={onChangeText}
            id="searchbar_team_input_mobile"
          />
        </div>
        <div style={{ position: "relative" }}>
          <div className="resp_categories_ctn" onClick={toggle}>
            {event ? (
              <p>
                {event.categories.find((c) => c._id === category?._id)?.name}
              </p>
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
                event.categories.map((categ) => (
                  <p
                    key={categ._id}
                    onClick={() => {
                      setCategory(categ);
                      toggle();
                    }}
                  >
                    {categ.name}
                  </p>
                ))}
            </div>
          )}
        </div>
      </>
      <Table {...{ input, event, category, admin, kg, wods }} />
    </div>
  );
};

export default ResultInfo;
