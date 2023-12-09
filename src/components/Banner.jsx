import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../sass/header.sass";
import { Context } from "./Context";

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const Banner = () => {
  const { events } = useContext(Context);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    if (events) {
      (async () => {
        let aux = events;
        if(events.length > 0){
          aux.sort((a, b) => {
            if (moment(a.updatedAt).unix() > moment(b.updatedAt).unix())
              return -1;
            else return 1;
          });
          aux[0].categories.sort((a, b) => {
            if (moment(a.updatedAt).unix() > moment(b.updatedAt).unix())
              return -1;
            else return 1;
          });
          // console.log(aux)
          setLatest(aux[0]);
        }
      })();
    }
  }, [events]);

  const test = ()=>{
    console.log(latest)
  }

  return (
    <HashLink className="slider_ctn" to={`/resultados/${latest?._id}#top`}  >
      <div className="slider" onClick={test} >
        {latest && (
          <>
            {list.map((item) => (
              <Info key={item} latest={latest} />
            ))}
          </>
        )}
      </div>
    </HashLink>
  );
};

const Info = ({latest}) => {
  return (
    <div className="slider__slide">
      <NR />
      <p className="update_text">ÚLTIMA ACTUALIZACION</p>
      <Katana />
      <p className="name_event">{latest.name} - {latest.categories[0].name}</p>
    </div>
  );
};

const NR = () => {
  return (
    <svg
      style={{ height: "100%" }}
      viewBox="0 0 45 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.8 30H0V0.0252444H7.8V0.0839367L7.93309 0L18.6 17.2286V0.0252444H26.4L32.1 0.00972871C32.1 0.00972871 37.95 -0.444479 41.7 4.85413C45.45 11.061 40.8 17.4193 40.8 17.4193L45 29.9845H37.2L26.4 30H18.6H7.8Z"
        fill="#181818"
      />
    </svg>
  );
};

const Katana = () => {
  return (
    <svg
      width="68"
      height="24"
      viewBox="0 0 68 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.44741 0.56828C1.6567 0.321181 0.815379 0.76187 0.56828 1.55259C0.321181 2.3433 0.76187 3.18462 1.55259 3.43172L2.44741 0.56828ZM65.5526 23.4317C66.3433 23.6788 67.1846 23.2381 67.4317 22.4474C67.6788 21.6567 67.2381 20.8154 66.4474 20.5683L65.5526 23.4317ZM66.4474 3.43172C67.2381 3.18462 67.6788 2.3433 67.4317 1.55259C67.1846 0.76187 66.3433 0.321181 65.5526 0.56828L66.4474 3.43172ZM1.55259 20.5683C0.76187 20.8154 0.321181 21.6567 0.56828 22.4474C0.815379 23.2381 1.6567 23.6788 2.44741 23.4317L1.55259 20.5683ZM1.55259 3.43172L16.5685 8.1242L17.4634 5.26076L2.44741 0.56828L1.55259 3.43172ZM16.5685 8.1242L51.3373 18.9894L52.2321 16.126L17.4634 5.26076L16.5685 8.1242ZM51.3373 18.9894L65.5526 23.4317L66.4474 20.5683L52.2321 16.126L51.3373 18.9894ZM16.9326 2.0418L15.5876 6.23428L18.4442 7.15069L19.7892 2.9582L16.9326 2.0418ZM15.5876 6.23428L14.5266 9.5418L17.3832 10.4582L18.4442 7.15069L15.5876 6.23428ZM51.589 13.5124L50.3661 17.0701L53.2032 18.0453L54.4261 14.4876L51.589 13.5124ZM50.3661 17.0701L49.183 20.5124L52.02 21.4876L53.2032 18.0453L50.3661 17.0701ZM65.5526 0.56828L50.5366 5.26076L51.4315 8.1242L66.4474 3.43172L65.5526 0.56828ZM50.5366 5.26076L15.7679 16.126L16.6627 18.9894L51.4315 8.1242L50.5366 5.26076ZM15.7679 16.126L1.55259 20.5683L2.44741 23.4317L16.6627 18.9894L15.7679 16.126ZM48.2108 2.9582L49.5558 7.15069L52.4124 6.23428L51.0674 2.0418L48.2108 2.9582ZM49.5558 7.15069L50.6168 10.4582L53.4734 9.5418L52.4124 6.23428L49.5558 7.15069ZM13.5739 14.4876L14.7968 18.0453L17.6339 17.0701L16.411 13.5124L13.5739 14.4876ZM14.7968 18.0453L15.98 21.4876L18.817 20.5124L17.6339 17.0701L14.7968 18.0453Z"
        fill="#181818"
      />
    </svg>
  );
};
