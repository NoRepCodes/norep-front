import { useAnimate,motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import pf1 from "../../images/arw.png";

const ww = window.innerWidth;
const wh = window.innerHeight;
const fs = (num) => num * (ww / 100) + num * (wh / 100);


const ResultAside = ({
    event,
    cindex,
    setCindex,
    input,
    setInput,
    kg,
    setKg,
  }) => {
    const [open, setOpen] = useState(false);
    // const ml = useMotionValue(0);
    const [cope, animate] = useAnimate();
    useEffect(() => {
      const ml_fs = fs(12);
      const pamount = event.partners.length * ml_fs - ml_fs;
      const si = setInterval(() => {
        const aux_ml =
          parseInt(
            window.getComputedStyle(cope.current).marginLeft.replace("px", "")
          ) * -1;
        const item_ml = aux_ml === 0 ? 0 : Math.round(aux_ml / ml_fs) * ml_fs;
        const amount = item_ml + fs(12);
        if (Math.round(item_ml) >= Math.round(pamount))
          animate(cope.current, { marginLeft: 0 });
        else animate(cope.current, { marginLeft: -amount });
        // }, 3000);
      }, 10000);
      return () => clearInterval(si);
    }, [event]);
  
    const toggle = () => setOpen(!open);
  
    const onChangeText = (e) => setInput(e.target.value);
  
    return (
      <div className="results_aside">
        <div className="ra_event">
          <img src={event?.secure_url} alt="portada" />
          {/* <img src={eventimg} alt="" /> */}
          <div className="categ_ctn">
            <h6>CATEGORIAS</h6>
            <div className="categ_dropdown" onClick={toggle}>
              {event ? (
                <p>{event.categories[cindex].name}</p>
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
            value={input}
            onChange={onChangeText}
            id="searchbar_team_input"
          />
        </div>
        <div className="partners_carousel">
          <motion.div
            ref={cope}
            className="pc_absolute"
            style={{
              width:
                event?.partners.length === 0
                  ? fs(12)
                  : fs(12) * event.partners.length,
            }}
          >
            {event?.partners.length > 0 ? (
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

          </motion.div>
        </div>
      </div>
    );
  };

export default ResultAside



const SwitchLeftIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M6 18h12c3.311 0 6-2.689 6-6s-2.689-6-6-6h-12.039c-3.293.021-5.961 2.701-5.961 6 0 3.311 2.688 6 6 6zm12-10c-2.208 0-4 1.792-4 4s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4z" />
      </svg>
    );
  };
  const SwitchRightIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M18 18h-12c-3.311 0-6-2.689-6-6s2.689-6 6-6h12.039c3.293.021 5.961 2.701 5.961 6 0 3.311-2.688 6-6 6zm-12-10c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
      </svg>
    );
  };
