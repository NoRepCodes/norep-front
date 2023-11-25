import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  CreateEventModal,
  TeamsModal,
  WodsModal,
  ScoreModal,
} from "../components/modals";
import "../sass/home.sass";

const offEvent = {
  name: "Evento Prediseñado",
  date: "2024/2/31",
  place: "Is going to be in a good place, for sure",
  categories: [
    { name: "Novato", wods: [{
      name:'Wod 1',
      limit:150,
      limit_type:'Reps',
    },{
      name:'Wod 2',
      limit:240,
      limit_type:'Reps',
    },{
      name:'Wod 3',
      limit:190,
      limit_type:'Reps',
    },{
      name:'Wod 4',
      limit:300,
      limit_type:'Reps',
    }] },
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
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 2",
      box: "Box2",
      wods: [
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 3",
      box: "Box3",
      wods: [
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
      ],
    },
    {
      points: 0,
      percent: 0,
      name: "Team 4",
      box: "Box4",
      wods: [
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
        {
          amount: 0,
          amount_type: null,
          tiebrake:0,
        },
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
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  const delEvent = () => {
    setEvent(false)
    setTeams([])
    setCateg(0)
  };
  const generateE = () => {
    setEvent(offEvent)
    setTeams(offTeams)
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
        team.wods.push({ amount: 0, amount_type: null, tiebrake: 0 });
      });
      console.log((team.points = 0));
    });
    setTeams(aux);
  };

  const updateScores = (data, index) => {
    closeS();
    let aux = [...teams];
    aux[categ].forEach((team) => {
      let fi = data.findIndex((elm) => elm.name === team.name);
      let info = {
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
            <p>Fecha: {event.date}</p>
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
                  <p key={index}>{wod.name},</p>
                ))}
              </div>
              <div className="wods_ctn">
                <p>Wods Caps: </p>
                {event.categories[categ].wods.map((wod, index) => (
                  <p key={index}>{wod.limit},</p>
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
  }, [teams,categ]);

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
              {wod.amount} {wod.amount_type}
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
  // console.log(teams);

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
        tiebrake: team.wods[i]?.tiebrake ? team.wods[i].tiebrake : 0,
        percent: team.wods[i]?.percent ? team.wods[i].percent : 0,
      });
    });
  }
  ////// APPLY POINTS AND PERCENT
  wodsData.forEach((wod, windex) => {
    wod.sort((a, b) => {
      if (a.amount < b.amount) return 1;
      else if (a.amount > b.amount) return -1;
      if (a.amount === b.amount) {
        if (a.tiebrake > b.tiebrake) return 1;
        else if (a.tiebrake < b.tiebrake) return -1;
      }
    });
    let limit = parseInt(event.categories[categ].wods[windex].limit);
    wod.forEach((team, index) => {
      if (team.amount !== 0) {
        team.percent = (team.amount * 100) / limit;
        if (index === 0) {
          team.points = 100;
        } else {
          if (team.amount === wod[index - 1].amount) {
            team.points = wod[index - 1].points;
            team.percent = wod[index - 1].percent - 0.02;
          } else {
            team.points = ppw * (teams.length - index);
            // team.percent = ppw * (teams.length - index);
          }
        }
      }
    });
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

  teams.sort((a, b) => b.percent - a.percent);

  // console.log(teams);
  return teams;
  // return [];
};
