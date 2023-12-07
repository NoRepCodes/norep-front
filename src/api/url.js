export const url = "http://norep-back.vercel.app/" 
// export const url = "http://192.168.1.111:4000/" 


/// Funcion general para el catch error que se usa en TODAS las peticiones 
export const catchError = async (err) => {
    /// Error
    if (err.response) {
        // console.log(err.response)
        // return { data: { msg: "No se ha contactado con el servidor" } }
        return { data: err.response.data, status: err.response.status }
        /// Error de mala conexion
    } else if (err.request) {
        // console.log(err.request)
        return { data: { msg: "No se ha contactado con el servidor, revise su conexion a internet y vuelva a intentarlo" } }
        /// Error inesperado
    } else {
        // console.log("Error", err.message)
        return { data: { msg: "Ha ocurrido un error inesperado, intente nuevamente" } }
    }
}

/**
 * @use 'var' as v

.table
  display: flex
  flex-direction: column
  width: 100%
  height: 70vh
  // background-color: red

  .table_header
    display: flex
    flex-direction: row
    width: 100%
    min-height: calc( 4em + 1px )
    border-right: 1px solid #181818
    background-color: red

//     .header_wods
//       display: flex
//       flex-direction: row
//       outline: 1px solid v.$fourth
//       margin: 1px
//       width: calc( 100% - 220px )
//       height: calc( 100% - 2px )
//       position: relative
//       overflow: hidden
//       .header_pa
//         gap: 1em
//         position: absolute
//         display: flex
//         flex-direction: row
//         height: 100%
//         // width: 100%
//         align-items: center
//         padding-left: 1.5em
//         // padding-right: 0em
//         // background-color: red
//         // right: auto
//         // right: 0px !important
//         h1
//           font-size: .8em
//           font-weight: bold

//     .header_points
//       width: 220px
//       height: calc( 100% - 2px )
//       margin-top: 1px
//       display: flex
//       flex-direction: row
//       justify-content: space-evenly
//       align-items: center
//       position: relative
//       // background-color: green
//       .line
//         height: 50%
//         width: 1px
//         background-color: v.$fourth
//       h1
//         font-size: .9em
//       .btn_abs
//         position: absolute
//         left: -1.25rem
//         width: calc(2.5rem - 1px)
//         height: calc(2.5rem - 1px)
//         border-radius: 100%
//         display: flex
//         align-items: center
//         justify-content: center
//         box-sizing: border-box
//         border: 1px solid v.$fourth
//         background-color: #fff

// .th_cell
//   // width: 120px
//   min-width: 135px
//   box-sizing: border-box
//   display: flex
//   height: 100%
//   align-items: center
//   h1
//     font-size: .8em
//     font-weight: bold
//     text-align: center
//     width: 100%
// .th_pos,.tu_pos
//   width: auto !important
//   min-width: 70px !important
// .th_name,.tu_name
//   width: 150px 
//   h1
//     text-align: left !important

// .users_ctn
//   // background-color: red
//   margin: 1px
//   margin-top: 0px
//   min-height: 50vh
//   width: calc( 100% - 1px )
//   padding-bottom: 3em
//   // height: 70vh
//   border-right: 1px solid #181818
//   border-bottom: 1px solid #181818
//   overflow: scroll
//   // outline: 1px solid v.$fourth

// .table_user
//   display: flex
//   flex-direction: row
//   height: 4em
//   padding: 0px 1.5em
//   box-sizing: border-box
//   width: 100%
//   .tu_ctn
//     position: relative
//     width: calc( 100% - calc( 219px - 1.5em ) )
//     height: 100%
//     overflow: hidden
//     box-sizing: border-box
//     border-bottom: 1px solid #181818
//     // background-color: red
//     .tu_pa
//       position: absolute
//       display: flex
//       flex-direction: row
//       align-items: center
//       height: 100%
//       gap: 1em

//       h1
//         font-size: .8em
//         text-align: center
//         width: 100%

//   .tu_points
//     width: calc( 220px - 1.5em )
//     border-left: 1px solid #181818
//     height: calc( 4em - 1px )
//     display: flex
//     flex-direction: row
//     justify-content: space-evenly
//     align-items: center
//     position: relative
//     // background-color: green
//     border-bottom: 1px solid #181818
//     .tu_points_pa
//       position: absolute
//       width: calc( 100% + 1.5em )
//       height: 100%
//       left: 0px
//       display: flex
//       flex-direction: row
//       align-items: center

//       h1
//         font-size: .8em
//         width: 50%
//         text-align: center

// .tu_cell
//   // width: 120px
//   min-width: 135px
//   box-sizing: border-box
//   display: flex
//   flex-direction: column
//   height: 100%
//   align-items: center
//   justify-content: center
//   gap: .3em
//   .pos
//     font-weight: bold

// .users_ctn
//   scrollbar-width: none
//   -ms-overflow-style: none
//   &::-webkit-scrollbar
//     display: none

// .no_b
//   border-bottom: 1px solid #eeeeee00 !important

// .rotate
//   transform: rotate(180deg)

// @media screen and (width < 1000px)

//   .header_pa
//     padding-left: 0em !important

//   .table_user
//     padding: 0px .5em

//   .tu_cell,.tu_cell,.th_cell,.tu_name
//     h1
//       font-size: 10px !important


//   .th_cell,.tu_cell
//     min-width: 0px !important
//     width: 80px !important
    
//   .tu_name,.th_name
//     width: 120px  !important

//   .header_points
//     width: 150px !important
//     h1
//       font-size: 12px !important
//   .header_wods
//     width: calc(100% - 150px) !important

//   .tu_points
//     width: calc(150px - .5em) !important

//   .tu_points_pa 
//     width: calc( 100% + .5em ) !important
//   .tu_ctn
//     width: calc(100% - calc(149px - .5em)) !important

//   .btn_abs
//     display: none !important


/// here go code

import React, { useContext, useEffect, useState } from "react";
import "../sass/results.sass";
import "../sass/tables.sass";
import eventimg from "../images/EC.png";
import corner from "../images/corner.png";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import { Banner } from "../components/Banner";
import { Context } from "../components/Context";
import { findTeams } from "../api/events.api";
import moment from "moment";

export const Results = () => {
  let { _id } = useParams();
  const { events } = useContext(Context);
  const [event, setEvent] = useState(null);
  const [categ, setCateg] = useState(1);
  const [teams, setTeams] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (events && _id) {
      (async () => {
        let aux = events.find((ev)=>ev._id === _id)
        setEvent(aux);
      })();
    }
  }, [events]);

  useEffect(() => {
    if (event) {
      (async () => {
        const { status, data } = await findTeams(event._id);
        if (status === 200) {
          setTeams(data);
        }
      })();
    }
  }, [event]);

  const click = () => {
    // console.log(event)
    // console.log(categ)
    // console.log(state);
  };

  return (
    <>
      <div className="results" onClick={click} id="top" >
        <Link className="back_btn_ctn" to="/eventos">
          <h1>
            Regresar a <span>EVENTOS</span>
          </h1>
        </Link>
        <div className="results_ctn">
          <ResultAside {...{ input, setInput, event, categ, setCateg }} />
          <ResultInfo {...{ input, event, categ, teams }} />
        </div>
      </div>
      <Banner />
    </>
  );
};

const ResultAside = ({ event, categ, setCateg, input, setInput }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const onChangeText = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="results_aside">
      <div className="ra_event">
        <img src={eventimg} alt="" />
        <div className="categ_ctn">
          <h6>CATEGORIAS</h6>
          <div className="categ_dropdown" onClick={toggle}>
            {event ? (
              <p>{event.categories[categ - 1].name}</p>
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
                      setCateg(index + 1);
                      toggle();
                    }}
                  >
                    {categ.name}
                  </p>
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="user_input">
        <input
          type="text"
          placeholder="Buscar Participantes"
          value={input}
          onChange={onChangeText}
        />
      </div>
      <img src={eventimg} alt="patrocinante" className="partner" />
    </div>
  );
};
const convertDate = (date) => moment.unix(date).format("DD, MMM");
const ResultInfo = ({ input, event, categ, teams }) => {
  return (
    <div className="results_info">
      <div className="ri_header">
        <div className="ri_header_top">
          <img src={corner} alt="corner" className="corner" />
          <img src={eventimg} alt="banner" className="resp_ri_img" />
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
      <div className="resp_categories_ctn"></div>
      <Table {...{ input, event, categ, teams }} />
    </div>
  );
};

const Table = ({ input, event, categ, teams }) => {
  const [right, setRight] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    if (teams) {
      setInfo(order(teams, event, categ));
    }
  }, [teams, categ]);

  const toggleRight = () => {
    // console.log(info);
    setRight(!right);
  };

  return (
    <div className="table">
      <TableHeader {...{ toggleRight, right }} />
      {/* <div className="users_ctn">
        {info.map((team, index) => {
          if (input.length > 0) {
            let regex = new RegExp(input, "i");
            if (regex.test(team.name))
              return (
                <TableUser
                  key={index}
                  user={team}
                  {...{ right, index }}
                  last={index === info.length - 1 ? true : false}
                />
              );
          } else {
            return (
              <TableUser
                key={index}
                user={team}
                {...{ right, index }}
                last={index === info.length - 1 ? true : false}
              />
              );
            }
          })}
      </div> }
      </div>
      );
    };
    const wods = [
      "Los perdidos",
      "Zumaque 1A",
      "Zumaque 1B",
      "Vitico Davalillo",
      "Tumbarrancho",
    ];
    const TableHeader = ({ right, toggleRight }) => {
      const [wodsWidth, setWodsWidth] = useState(0);
      const [paWidth, setPaWidth] = useState(0);
      const ref1 = useRef(null);
      const ref2 = useRef(null);
    
      const wtf = () => {
        console.log(wodsWidth);
        console.log(paWidth);
      };
    
      useEffect(() => {
        const handleResize = () => {
          setWodsWidth(ref1.current.offsetWidth);
          // console.log(ref1.current.offsetWidth);
        };
        setPaWidth(ref2.current.offsetWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
    
      return (
        <div className="table_header" onClick={wtf}>
          <div className="header_wods" ref={ref1}>
            <div
              className="header_pa"
              style={{ right: right ? "0px" : "auto" }}
              ref={ref2}
            >
              <div className="th_cell th_pos">
                <h1>Posicion</h1>
              </div>
              <div className="th_cell th_name">
                <h1>Nombre</h1>
              </div>
              {wods.map((item, index) => (
                <div className="th_cell" key={index}>
                  <h1>{item}</h1>
                </div>
              ))}
            </div>
          </div>
          <div className="header_points">
            {paWidth > wodsWidth && <Arrow click={toggleRight} right={right} />}
            <h1>Puntos</h1>
            <div className="line"></div>
            <h1>Total</h1>
          </div>
        </div>
      );
    };
    
    const Arrow = ({ click, right }) => {
      return (
        <div className="btn_abs" onClick={click}>
          <svg
            className={right ? "rotate" : "_"}
            clipRule="evenodd"
            width="18"
            height="18"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z"
              fillRule="nonzero"
            />
          </svg>
        </div>
      );
    };
    
    const TableUser = ({ user, last = false, right, index }) => {
      // console.log(user)
      // const { pos, name, wod, wod_pos } = user;
      return (
        <div className="table_user">
          <div className={`tu_ctn ${last && "no_b"}`}>
            <div className="tu_pa" style={{ right: right ? "0px" : "auto" }}>
              <div className="tu_pos">
                <h1>{index + 1}</h1>
              </div>
              <div className="tu_name">
                <h1>{user.name}</h1>
              </div>
              {user.wods.map((wod, index) => (
                <div className="tu_cell" key={index}>
                  <h1 className="pos">{pos(wod.pos)}</h1>
                  <h1>
                    ({wod.amount} {wod.amount_type})
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className={`tu_points ${last && "no_b"}`}>
            <div className="tu_points_pa">
              <h1>{user.points}</h1>
              <h1>{user.percent}%</h1>
            </div>
          </div>
        </div>
      );
    };
    
    const testUser = {
      _id: "656c1e2670a59f6cf7bd7dc7",
      name: "Los leones de Merida",
      category_id: "656ed88ad08bf109f6d0c033",
      event_id: "656ed88ad08bf109f6d0c032",
      __v: 0,
      points:120,
      percent:99.99,
      wods: [
        {
          pos:1,
          time: 600,
          tiebrake: 150,
          amount: 210,
          amount_type: "Reps",
          _id: "656fae0b22a8599de817e8a5",
        },
        {
          pos:1,
          time: 600,
          tiebrake: 150,
          amount: 230,
          amount_type: "Reps",
          _id: "656fad94e0b0820380b618df",
        },
      ],
    };
    
    const order = (data, event, categ) => {
      let teams = [];
      data.forEach((item) => {
        if (item.category_id === event.categories[categ - 1]?._id) {
          teams.push(item);
        }
      });
    
      teams.forEach((team) => {
        team.points = 0;
        team.percent = 0;
      });
    
      let wl = event.categories[categ - 1].wods.length;
      let ppw = Math.floor(100 / teams.length);
      let wodsData = [];
    
      ////// PUSH DATA TO WODS DATA (Re arrange)
      for (let i = 0; i < wl; i++) {
        wodsData.push([]);
        teams.forEach((team) => {
          wodsData[i].push({
            name: team.name,
            amount: team.wods[i]?.amount ? team.wods[i].amount : 0,
            time: team.wods[i]?.time ? team.wods[i].time : null,
            amount_type: team.wods[i]?.amount_type
              ? team.wods[i].amount_type
              : null,
            tiebrake: team.wods[i]?.tiebrake ? team.wods[i].tiebrake : 0,
            percent: team.wods[i]?.percent ? team.wods[i].percent : 0,
          });
        });
      }
    
      ////// APPLY POINTS AND PERCENT
      wodsData.forEach((wod, windex) => {
        let ogWod = event.categories[categ - 1].wods[windex];
        if (ogWod.wod_type === 1) {
          AMRAP_points(ogWod, wod, teams.length);
        } else if (ogWod.wod_type === 2) {
          FORTIME_points(ogWod, wod, teams.length);
        } else if (ogWod.wod_type === 3) {
          RM_points(ogWod, wod, teams.length);
        }
      });
      // console.log(teams)
      // console.log(wodsData)
      teams.forEach((team) => {
        wodsData.forEach((wod, windex) => {
          let fi = wod.findIndex((elm) => elm.name === team.name);
          if (team.percent === undefined) team.percent = 0;
          if (wod[fi].points !== undefined) {
            team.points += wod[fi].points;
            team.percent += wod[fi].percent;
            team.wods[windex].pos = wod[fi].pos;
            1;
          }
        });
      });
    
      teams.forEach((team) => {
        team.percent = parseFloat((team.percent / wl).toFixed(3));
      });
    
      TieBreaker(teams);
      return teams;
      // return [];
    };
    
    const AMRAP_points = async (ogWod, wod, tl) => {
      let ppw = Math.floor(100 / tl);
      wod.sort((a, b) => {
        if (a.amount < b.amount) return 1;
        else if (a.amount > b.amount) return -1;
        else if (a.amount === b.amount) {
          if (a.time > b.time) return 1;
          else if (a.time < b.time) return -1;
          else if (a.time === b.time) {
            if (a.tiebrake > b.tiebrake) return 1;
            else if (a.tiebrake < b.tiebrake) return -1;
            else if (a.tiebrake === b.tiebrake) return 0;
          }
        }
      });
    
      // console.log(wod)
      wod.forEach((team, index) => {
        if (team.amount !== 0) {
          if (index === 0) {
            team.percent = 100;
            team.points = 100;
            team.pos = 1;
          } else {
            if (
              team.amount === wod[index - 1].amount &&
              team.time === wod[index - 1].time &&
              team.tiebrake === wod[index - 1].tiebrake
            ) {
              team.points = wod[index - 1].points;
              team.percent = wod[index - 1].percent;
              team.pos = wod[index - 1].pos;
            } else if (team.amount === wod[index - 1].amount) {
              team.points = ppw * (tl - index);
              team.percent = ppw * (tl - index);
              team.pos = index + 1;
              // team.percent = wod[index - 1].percent - 10 / tl;
            } else {
              // team.percent = (team.amount * 100) / wod[0].amount;
              team.percent = ppw * (tl - index);
              team.points = ppw * (tl - index);
              team.pos = index + 1;
            }
          }
        }
      });
    
      // console.log(wod);
    };
    const FORTIME_points = (ogWod, wod, tl) => {
      let ppw = Math.floor(100 / tl);
      wod.sort((a, b) => {
        if (a.amount < b.amount) return 1;
        else if (a.amount > b.amount) return -1;
        else if (a.amount === b.amount) {
          if (a.time > b.time) return 1;
          else if (a.time < b.time) return -1;
          else if (a.time === b.time) {
            if (a.tiebrake > b.tiebrake) return 1;
            else if (a.tiebrake < b.tiebrake) return -1;
            else if (a.tiebrake === b.tiebrake) return 0;
          }
        }
      });
    
      // console.log(wod)
    
      wod.forEach((team, index) => {
        // console.log(wod)
        if (team.amount !== 0) {
          // team.percent = (team.amount * 100) / ogWod.amount_cap
          // console.log(team.percent + team.name)
          if (index === 0) {
            team.percent = 100;
            team.points = 100;
            team.pos = 1;
          } else {
            if (
              team.amount === wod[index - 1].amount &&
              team.time === wod[index - 1].time &&
              team.tiebrake === wod[index - 1].tiebrake
            ) {
              team.points = wod[index - 1].points;
              team.percent = wod[index - 1].percent;
              team.pos = wod[index - 1].pos;
            } else if (team.amount === wod[index - 1].amount) {
              team.points = ppw * (tl - index);
              // team.percent = wod[index - 1].percent - 10 / tl;
              team.percent = ppw * (tl - index);
              team.pos = index + 1;
            } else {
              team.percent = ppw * (tl - index);
              team.points = ppw * (tl - index);
              team.pos = index + 1;
            }
          }
    
          if (team.amount < ogWod.amount_cap) {
            team.amount_type = "Caps +";
            team.amount = ogWod.amount_cap - team.amount;
          }
        }
        // console.log(team.percent + team.name);
        // console.log(team)
      });
    
      // console.log(wod);
    };
    const RM_points = (ogWod, wod, tl) => {
      let ppw = Math.floor(100 / tl);
      wod.sort((a, b) => {
        if (a.amount < b.amount) return 1;
        else if (a.amount > b.amount) return -1;
        else if (a.amount === b.amount) {
          if (a.time > b.time) return 1;
          else if (a.time < b.time) return -1;
          else if (a.time === b.time) {
            if (a.tiebrake > b.tiebrake) return 1;
            else if (a.tiebrake < b.tiebrake) return -1;
            else if (a.tiebrake === b.tiebrake) return 0;
          }
        }
      });
    
      wod.forEach((team, index) => {
        if (team.amount !== 0) {
          if (index === 0) {
            team.percent = 100;
            team.points = 100;
            team.pos = 1;
          } else {
            if (
              team.amount === wod[index - 1].amount &&
              team.time === wod[index - 1].time &&
              team.tiebrake === wod[index - 1].tiebrake
            ) {
              team.points = wod[index - 1].points;
              team.percent = wod[index - 1].percent;
              team.pos = wod[index - 1].pos;
            } else if (team.amount === wod[index - 1].amount) {
              team.points = ppw * (tl - index);
              team.percent = ppw * (tl - index);
              team.pos = index + 1;
              // team.percent = wod[index - 1].percent - 10 / tl;
            } else {
              team.percent = ppw * (tl - index);
              team.points = ppw * (tl - index);
              team.pos = index + 1;
              // console.log(team)
            }
          }
        }
        // console.log(team.percent +" "+ team.name)
      });
    };
    
    const TieBreaker = (teams) => {
      //// TO DO Recorrer equipos y evaluar a todos aquellos que tengan la misma cantidad y sumar los tiebrakes, quien tenga menor tiebrake, tiene mejor rendimiento
    
      // Añadir el total de tiebrake a todos los equipos
      teams.forEach((team) => {
        team.tiebrake_total = 0;
        team.wods.forEach((wod) => {
          team.tiebrake_total += wod.tiebrake;
        });
      });
    
      // Ordenar por prioridad de puntos, en caso de empate, tiebrake
      teams.sort((a, b) => {
        if (a.points < b.points) return 1;
        else if (a.points > b.points) return -1;
        else if (a.points === b.points) {
          if (a.tiebrake_total > b.tiebrake_total) return 1;
          else if (a.tiebrake_total < b.tiebrake_total) return -1;
        }
      });
    
      //Reducir porcentaje en base a la diferencia de tiebrake con el equipo anterior
      teams.forEach((team, index) => {
        if (index !== 0) {
          if (team.points === teams[index - 1].points) {
            let formula =
              (100 -
                (teams[index - 1].tiebrake_total * 100) / team.tiebrake_total) /
              teams.length;
            team.percent = parseFloat((team.percent - formula).toFixed(3));
          }
        }
      });
      teams.sort((a, b) => {
        if (a.percent < b.percent) return 1;
        else if (a.percent > b.percent) return -1;
      });
      // console.log(teams)
    };
    
    const pos = (pos) => {
      switch (pos) {
        case 1:
          return "1ro";
        case 2:
          return "2do";
        case 3:
          return "3ro";
        case 4:
          return "4to";
        case 5:
          return "5to";
        case 6:
          return "6to";
        case 7:
          return "7mo";
        case 8:
          return "8vo";
        case 9:
          return "9no";
        case 10:
          return "10mo";
        case 11:
          return "11mo";
        case 12:
          return "12mo";
        case 13:
          return "13ro";
        case 14:
          return "14to";
        case 15:
          return "15to";
        case 16:
          return "16to";
        case 17:
          return "17ro";
        case 18:
          return "18to";
        case 19:
          return "19to";
        case 20:
          return "20vo";
        case 21:
          return "21ro";
        case 22:
          return "22do";
        case 23:
          return "23ro";
        case 24:
          return "24to";
        case 25:
          return "25to";
        case 26:
          return "26to";
        case 27:
          return "27mo";
        case 28:
          return "28vo";
        case 29:
          return "29no";
        case 30:
          return "30mo";
        case 31:
          return "31ro";
        case 32:
          return "32do";
        case 33:
          return "33ro";
        case 34:
          return "34to";
        case 35:
          return "35to";
    
        default:
          break;
      }
    };
    
 */