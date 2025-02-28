import { Dispatch, SetStateAction, useState } from "react";
import pf1 from "../../images/arw.jpg";
import { SwitchLeftIcon, SwitchRightIcon } from "../Icons";
import { CategFields, EvnFields } from "../../types/event";

const ResultAside = ({
  event,
  category,
  setCategory,
  searchBar,
  setSearchBar,
  kg,
  setKg,
}: {
  event: EvnFields;
  category?: CategFields;
  setCategory: Dispatch<SetStateAction<CategFields | undefined>>;
  searchBar: string;
  setSearchBar: Dispatch<SetStateAction<string>>;
  kg: boolean;
  setKg: Dispatch<SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const onChangeText = (e: any) => setSearchBar(e.target.value);

  return (
    <div className="results_aside">
      <div className="ra_event">
        <img src={event?.secure_url} alt="portada" />
        {/* <img src={eventimg} alt="" /> */}
        <div className="categ_ctn">
          <h6>CATEGORIAS</h6>
          <div className="categ_dropdown" onClick={toggle}>
            {category ? (
              <p>{category?.name}</p>
            ) : (
              <p>Selecciona una categoria</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 21l-12-18h24z" />
            </svg>
          </div>
          {open && (
            <div className="abs_categ_dropdown">
              {event &&
                event.categories.map((categ: any) => (
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
        <div
          className={!kg ? "lb_btn" : "kg_btn"}
          onClick={() => {
            setKg(!kg);
          }}
        >
          <h6>{!kg ? "Lbs" : "Kgs"}</h6>
          {!kg ? <SwitchLeftIcon /> : <SwitchRightIcon />}
        </div>
      </div>
      <div className="user_input">
        <input
          type="text"
          placeholder="Buscar Participantes"
          value={searchBar}
          onChange={onChangeText}
          id="searchbar_team_input"
        />
      </div>
      <div className="partners_carousel">
        <div className="pc_absolute">
          <img src={pf1} alt="patrocinanteA" />
        </div>
      </div>
    </div>
  );
};

export default ResultAside;

/**
<motion.div
ref={cope}
          className="pc_absolute"
          style={{
            width: 
            event && event.partners.length < 2
              ? fs(12)
              : fs(12) *
                (event && event.partners.length ? event.partners.length : 1),
          }}
        >
          {event && event.partners.length > 0 ? (
            <>
              {event?.partners.map((p, index) => (
                <img
                  src={p.secure_url}
                  alt={`patrocinante ` + index + 1}
                  key={index}
                />
              ))}
            </>
          ) : (
            <img src={pf1} alt="patrocinanteA" />
            )}
        </motion.div>*/
