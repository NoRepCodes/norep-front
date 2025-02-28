import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { ArwIcon, StrongIcon } from "../PartnersSvg";

import corner from "../../images/corner.png";
import { SwitchLeftIcon, SwitchRightIcon } from "../Icons";
import { CategFields, EvnFields } from "../../types/event";
import { convertDate } from "../../helpers/date";
type EventHeaderT = {
  event: EvnFields;
  category?: CategFields;
  setCategory: Dispatch<SetStateAction<CategFields | undefined>>;
  searchBar: string;
  setSearchBar: Dispatch<SetStateAction<string>>;
  kg: boolean;
  setKg: Dispatch<SetStateAction<boolean>>;
};
const EventHeader = ({
  children,
  ...props
}: PropsWithChildren & EventHeaderT) => {
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
          <img
            src={props.event.secure_url}
            alt="banner"
            className="resp_ri_img"
          />
          <h1 className="ri_title">{props.event.name}</h1>
        </div>
        <div className="ri_header_bot">
          <div className="rhb_left">
            <h1>{props.event.place}</h1>
            <h1 className="ri_date">
              {`${convertDate(props.event.since)} - ${convertDate(
                props.event.until
              )}`}
            </h1>
          </div>
        </div>
      </div>

      <ResponsiveInfo {...props} />
      {children}
    </div>
  );
};

const ResponsiveInfo = ({
  event,
  category,
  setCategory,
  searchBar,
  setSearchBar,
  kg,
  setKg,
}: EventHeaderT) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const onChangeText = (e: any) => {
    setSearchBar(e.target.value);
  };
  return (
    <>
      <div className="user_input">
        <input
          type="text"
          placeholder="Buscar participantes..."
          value={searchBar}
          onChange={onChangeText}
          id="searchbar_team_input_mobile"
        />
      </div>
      <div style={{ position: "relative", display: "flex" }}>
        <div className="resp_categories_ctn" onClick={toggle}>
          {event ? (
            <p>
              {
                event.categories.find(
                  (c: CategFields) => c._id === category?._id
                )?.name
              }
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
              event.categories.map((categ: CategFields) => (
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
        <div
          className={!kg ? "lb_btn resp_kg" : "kg_btn resp_kg"}
          onClick={() => {
            setKg(!kg);
          }}
        >
          <h6>{!kg ? "Lbs" : "Kgs"}</h6>
          {!kg ? <SwitchLeftIcon /> : <SwitchRightIcon />}
        </div>
      </div>
    </>
  );
};

export default EventHeader;
