import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  CreateEventModal,
  TeamsModal,
  WodsModal,
  ScoreModal,
} from "../components/Modals";
import "../sass/home.sass";

const offEvent = {
  name: "Evento Prediseñado",
  since: "2024/2/31",
  until: "2024/4/31",
  place: "Is going to be in a good place, for sure",
  categories: [
    {
      name: "Novato",
      wods: [
        {
          name: "Wod 1",
          time_cap: 800,
          amount_cap: 230,
          amount_type: "Reps",
          wod_type: 1,
        },
        {
          name: "Wod 2",
          time_cap: 1500,
          amount_cap: 230,
          amount_type: "Reps",
          wod_type: 2,
        },
        {
          name: "Wod 3",
          time_cap: 500,
          amount_cap: null,
          amount_type: "Reps",
          wod_type: 3,
        },
        {
          name: "Wod 2",
          time_cap: 1800,
          amount_cap: 360,
          amount_type: "Reps",
          wod_type: 2,
        },
      ],
    },
    { name: "Avanzado", wods: [] },
  ],
  // teams:[['Equpo1',"Equpo2"],[]]
};

const offTeams = [
  [
    {
      points: 0,
      percent: 0,
      name: "Team 1",
      box: "Box1",
      wods: [
        { time: 0, amount: 75, amount_type: null, tiebrake: 0 },
        { time: 1310, amount: 230, amount_type: null, tiebrake: 450 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 2",
      box: "Box2",
      wods: [
        { time: 0, amount: 92, amount_type: null, tiebrake: 0 },
        { time: 1500, amount: 180, amount_type: null, tiebrake: 650 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 3",
      box: "Box3",
      wods: [
        { time: 0, amount: 65, amount_type: null, tiebrake: 0 },
        { time: 1500, amount: 229, amount_type: null, tiebrake: 415 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 4",
      box: "Box 4",
      wods: [
        { time: 0, amount: 77, amount_type: null, tiebrake: 0 },
        { time: 1311, amount: 230, amount_type: null, tiebrake: 440 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 5",
      box: "Box 5",
      wods: [
        { time: 0, amount: 97, amount_type: null, tiebrake: 0 },
        { time: 1313, amount: 230, amount_type: null, tiebrake: 438 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
        { time: 0, amount: 0, amount_type: null, tiebrake: 0 },
      ],
    },
  ],
];

function Home() {
  const [theme, setTheme] = useState("dark");
  const [eventModal, setEventModal] = useState(false);
  const [wodModal, setWodModal] = useState(false);
  const [teamModal, setTeamModal] = useState(false);
  const [scoreModal, setScoreModal] = useState(false);
  const [event, setEvent] = useState(false);
  const [teams, setTeams] = useState([]);
  const [categ, setCateg] = useState(0);

  const toggle = () => {
    // console.log(event.categories[0].wods);
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  const delEvent = () => {
    setEvent(false);
    setTeams([]);
    setCateg(0);
  };
  const generateE = () => {
    setEvent(offEvent);
    setTeams(offTeams);
  };
  const openE = () => setEventModal(!eventModal);
  const openW = () => setWodModal(!wodModal);
  const openT = () => setTeamModal(!teamModal);
  const openS = (index) => setScoreModal(index);
  const closeS = () => setScoreModal(false);

  const update = (data) => {
    let aux = [];
    // let aux2 = [...event.teams, []];
    // aux2.push([]);
    data.categories.forEach((item) => {
      aux.push({ name: item, wods: [] });
    });
    openE();
    setEvent({ ...data, categories: aux });
  };

  const selectCateg = (name) => {
    setCateg(name);
  };

  const updateWod = (data) => {
    openW();
    let aux = [...event.categories];
    aux[categ].wods = data;
    setEvent({ ...event, categories: aux });
  };
  const updateTeams = (data) => {
    openT();
    let aux = [...teams];
    aux[categ] = [...data];
    aux[categ].forEach((team) => {
      event.categories[categ].wods.forEach((elm) => {
        team.wods.push({ time: 0, amount: 0, amount_type: null, tiebrake: 0 });
      });
    });
    setTeams(aux);
  };

  const updateScores = (data, index) => {
    closeS();
    let aux = [...teams];
    aux[categ].forEach((team) => {
      let fi = data.findIndex((elm) => elm.name === team.name);
      let info = {
        time: data[fi] ? parseInt(data[fi].time) : 0,
        amount: parseInt(data[fi].amount),
        tiebrake: parseInt(data[fi].tiebrake),
        amount_type: data[fi].amount_type,
      };
      team.wods[index] = info;
    });
    setTeams(aux);
  };

  return (
    <div className={`home_ctn ${theme}`}>
      {eventModal && <CreateEventModal close={openE} update={update} />}
      {wodModal && <WodsModal close={openW} update={updateWod} />}
      {teamModal && <TeamsModal close={openT} update={updateTeams} />}
      {scoreModal && (
        <ScoreModal
          close={closeS}
          index={scoreModal}
          teams={teams[categ]}
          wod={event.categories[categ].wods[scoreModal - 1]}
          update={updateScores}
        />
      )}
      <div className="ctn">
        <Moon set={toggle} />
        {!event ? (
          <>
            <Btn text="Crear Evento" action={openE} />
            <Btn text="Generar Evento" action={generateE} />
          </>
        ) : (
          <>
            <Btn text="Eliminar Evento" action={delEvent} />
            <p className="event_name">{event.name}</p>
            <p>Inicio: {event.since}</p>
            <p>Cierre: {event.until}</p>
            <p>Lugar: {event.place}</p>

            <div className="categ_ctn">
              {event.categories.map((item, index) => (
                <div
                  onClick={() => {
                    selectCateg(index);
                  }}
                  className={`categ_btn ${index === categ && "categ_active"}`}
                  key={index}
                >
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
            {event.categories[categ].wods.length > 0 && (
              <>
                <div className="wods_ctn">
                  <p>Wods: </p>
                  {event.categories[categ].wods.map((wod, index) => (
                    <p key={index}>
                      {wod.name} {w_o_d(wod.wod_type)} ,
                    </p>
                  ))}
                </div>
                <div className="wods_ctn">
                  <p>Wods Time caps: </p>
                  {event.categories[categ].wods.map((wod, index) => (
                    <p key={index}>{wod.time_cap},</p>
                  ))}
                </div>
                <div className="wods_ctn">
                  <p>Wods Reps caps: </p>
                  {event.categories[categ].wods.map((wod, index) => (
                    <p key={index}>
                      {wod.amount_cap === null ? 0 : wod.amount_cap},
                    </p>
                  ))}
                </div>
              </>
            )}
            {teams[categ] && teams[categ].length > 0 && (
              <div className="wods_ctn">
                <p>Equipos: </p>
                {teams[categ].map((item, index) => (
                  <p key={index}>{item.name},</p>
                ))}
              </div>
            )}
          </>
        )}

        {event && teams[categ] && event.categories[categ].wods.length > 0 && (
          <div className="small_btns_ctn">
            {event.categories[categ].wods.map((wod, index) => (
              <BtnSmall
                text={`Resultados Wod ${index + 1}`}
                action={openS}
                key={index}
                index={index}
              />
            ))}
          </div>
        )}
        {event && event.categories[categ].wods.length === 0 && (
          <Btn text="Añadir Wods" action={openW} />
        )}

        {event && !teams[categ] && <Btn text="Añadir Equipos" action={openT} />}

        {event && teams[categ] && (
          <>
            <p className="event_name">Resultados</p>
            <Table event={event} teams={teams} categ={categ} />
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

const Moon = ({ set }) => {
  return (
    <svg
      onClick={set}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12zm2 0c0-5.514 4.486-10 10-10v20c-5.514 0-10-4.486-10-10z" />
    </svg>
  );
};

const Btn = ({ text, action }) => {
  return (
    <div className="btn_home" onClick={action}>
      <p>{text}</p>
    </div>
  );
};
const BtnSmall = ({ text, action, index }) => {
  let onClick = () => {
    action(index + 1);
  };
  return (
    <div className="btn_small" onClick={onClick}>
      <p>{text}</p>
    </div>
  );
};

const Table = ({ event, categ, teams }) => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    setInfo(order(teams[categ], event, categ));
  }, [teams, categ]);

  return (
    <div className="table">
      <div className="table_ctn">
        <p className="th">Position</p>
        <p className="th">Equipo</p>
        <p className="th">Box</p>
        {event.categories[categ].wods.map((wod, index) => (
          <p className="th" key={index}>
            {wod.name}
          </p>
        ))}
        <p className="th">Puntos</p>
        <p className="th">Porcentaje</p>
      </div>

      {info.map((item, index) => (
        <div className="table_ctn" key={index}>
          <p className="th">{index + 1}</p>
          <p className="th">{item.name}</p>
          <p className="th">{item.box}</p>
          {item.wods.map((wod, indexW) => (
            <p className="th" key={indexW}>
              {event.categories[categ].wods[indexW] &&
              event.categories[categ].wods[indexW].wod_type === 2 ? (
                <>
                  {wod.amount !== 0 &&
                  wod.amount <
                    event.categories[categ].wods[indexW].amount_cap ? (
                    <>
                      {`CAPS+ ${
                        event.categories[categ].wods[indexW].amount_cap -
                        wod.amount
                      } `}
                    </>
                  ) : (
                    <>
                      {wod.amount} {wod.amount_type}
                    </>
                  )}
                </>
              ) : (
                <>
                  {wod.amount} {wod.amount_type}
                </>
              )}
            </p>
          ))}
          <p className="th">{JSON.stringify(item.points)}</p>
          <p className="th">{item.percent}%</p>
        </div>
      ))}
    </div>
  );
};

const order = (data, event, categ) => {
  let teams = [];
  data.forEach((item) => {
    teams.push(item);
  });

  teams.forEach((team) => {
    team.points = 0;
    team.percent = 0;
  });

  let wl = event.categories[categ].wods.length;
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
    let ogWod = event.categories[categ].wods[windex];
    if (ogWod.wod_type === 1) {
      AMRAP_points(ogWod, wod, teams.length);
    } else if (ogWod.wod_type === 2) {
      FORTIME_points(ogWod, wod, teams.length);
    } else if (ogWod.wod_type === 3) {
      RM_points(ogWod, wod, teams.length);
    }
  });


  teams.forEach((team) => {
    wodsData.forEach((wod) => {
      let fi = wod.findIndex((elm) => elm.name === team.name);
      if (team.percent === undefined) team.percent = 0;
      if (wod[fi].points !== undefined) {
        team.points += wod[fi].points;
        team.percent += wod[fi].percent;
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

const w_o_d = (num) => {
  switch (num) {
    case 1:
      return "AMRAP";
    case 2:
      return "FORTIME";
    case 3:
      return "RM";
      break;

    default:
      break;
  }
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
      } else {
        if (
          team.amount === wod[index - 1].amount &&
          team.time === wod[index - 1].time &&
          team.tiebrake === wod[index - 1].tiebrake
        ) {
          team.points = wod[index - 1].points;
          team.percent = wod[index - 1].percent;
        } else if (team.amount === wod[index - 1].amount) {
          team.points = ppw * (tl - index);
          team.percent = ppw * (tl - index);
          // team.percent = wod[index - 1].percent - 10 / tl;
        } else {
          // team.percent = (team.amount * 100) / wod[0].amount;
          team.percent = ppw * (tl - index);
          team.points = ppw * (tl - index);
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
      } else {
        if (
          team.amount === wod[index - 1].amount &&
          team.time === wod[index - 1].time &&
          team.tiebrake === wod[index - 1].tiebrake
        ) {
          team.points = wod[index - 1].points;
          team.percent = wod[index - 1].percent;
        } else if (team.amount === wod[index - 1].amount) {
          team.points = ppw * (tl - index);
          // team.percent = wod[index - 1].percent - 10 / tl;
          team.percent = ppw * (tl - index);
        } else {
          team.percent = ppw * (tl - index);
          team.points = ppw * (tl - index);
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
      } else {
        if (
          team.amount === wod[index - 1].amount &&
          team.time === wod[index - 1].time &&
          team.tiebrake === wod[index - 1].tiebrake
        ) {
          team.points = wod[index - 1].points;
          team.percent = wod[index - 1].percent;
        } else if (team.amount === wod[index - 1].amount) {
          team.points = ppw * (tl - index);
          team.percent = ppw * (tl - index);
          // team.percent = wod[index - 1].percent - 10 / tl;
        } else {
          team.percent = ppw * (tl - index);
          team.points = ppw * (tl - index);
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
  teams.forEach(team => {
    team.tiebrake_total = 0
    team.wods.forEach(wod=>{
      team.tiebrake_total += wod.tiebrake
    })
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
  teams.forEach((team,index)=>{
    if(index !== 0 ){
      if(team.points === teams[index-1].points){
        let formula = (100 - (teams[index-1].tiebrake_total * 100) / team.tiebrake_total) / teams.length
        console.log(formula)
        team.percent = parseFloat((team.percent - formula).toFixed(3))
      }
    }
  })
  teams.sort((a, b) => {
    if (a.percent < b.percent) return 1;
    else if (a.percent > b.percent) return -1
  });
  console.log(teams)
};

/*
  Generalmente el timepo se caba antes que las reps
  Por ende, evaluar reps o peso antes del tiempo

  Añadir las fehcas

  Amrap (Al registrar : Tiempo y Reps) 
     en 10 mins tienes q hacer la maxima repeticion de rondas 
     en X{Tiempo} hicieron Y{Reps}
  Fortime (Al registrar: Tiempo y Reps)
    en 10 mins terminar todo
    en X{Tiempo} hicieron Y{Reps} si faltaron, se colocan CAPS+
    (En caso de que los equipos tengan 100% de rendimiento, si terminan todo, alli se evalua el tiempo y luego el tiebrake)
  RM (Al registrar: peso o repeticiones) 
    Maximo peso en 10 mins 
    X{Peso/Reps} en Y{Tiempo} (el tiempo se evalua en el wod para saber el rendimiento)

    Evaluar tiempo en cuanto a segundos no a numero, ya que menor tiempo mayor prioridad

    Actualizar wods, categorias, y usuarios
    Los usuarios no pueden ver los wods


    Restar porcentaje = a cantidad de equipos , 100 / cantidad de equipos




    //// Ejemplo de Circuito
    218 time cap

    pen 1min timecap 18+1 214reps 0.12 + 214 (por aqui va)

    207 reps sin pen 

    201 sin pen

    Ultimo wods con penalizacion, el ejercicio va a ocupar un porcentaje en base a todos los ejercicios, si hay penalizacion, se va a calculcar el ejercicio que se penaliza por la cantida de reps

    En caso de empatar todo HASTA EL TIEBRAKE , alli si colocarle la misma cantidad de puntos
    porcentaje igual a los puntos HASTA QUE haya empate de varios equipos

    que los wods se vean luego de la fecha limite, cargar el DATE desde el servidor
*/
