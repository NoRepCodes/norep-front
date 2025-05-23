import { useContext, useEffect, useState } from "react";
import Context from "../../helpers/UserContext";
import { EvnFields, WodFields } from "../../types/event";
import { TeamType } from "../../types/table.t";
import { getEventTable } from "../../api/api_guest";
import { useNavigate, useParams } from "react-router-dom";
import { ViewFadeStatic } from "../../components/AnimatedLayouts";
import { IconLoad } from "../../components/Icons";
import { ReactCSS, Text, v, View, ViewCtn } from "../../components/UI";
import { monthsLarge, todaySplit } from "../../helpers/date";
import EventTable from "./EventTable";
import InscriptionDetail from "./InscriptionDetails";
import InscriptionTeam from "./InscriptionTeam";
import DuesPayment from "./DuesPayment";
import useScreen from "../../hooks/useSize";
import "./tables.sass";

const Event = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const { setMsg } = useContext(Context);
  //@ts-ignore
  const [event, setEvent] = useState<EvnFields | undefined>(wtf);
  const [wods, setWods] = useState<WodFields[] | undefined>([]);
  // MODALS
  const [wodInfo, setWodInfo] = useState<WodFields | undefined>(undefined);
  const [teamInfo, setTeamInfo] = useState<TeamType | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  if(false) console.log(wodInfo);
  if(false) console.log(teamInfo);

  useEffect(() => {
    if (!_id) return () => {};
    (async () => {
      setLoading(true);
      const { status, data } = await getEventTable(_id);
      setLoading(false);
      if (status === 200) {
        setEvent(data.event);
        setWods(data.wods);

        const serverToday = new Date(data.date).valueOf();
        const eventUntil = new Date(data.event.register_time.until).valueOf();
        if (serverToday > eventUntil) setPage(1);
        else setPage(2);
        console.log(data.event);
      } else {
        setMsg({
          type: "error",
          text: data.msg,
          onClose: () => navigate(-1),
        });
      }
    })();
  }, []);
  
  const {ww} =useScreen()

//   const pressBack = () => {
//     if (page <= 2) navigate(-1);
//     else setPage(2);
//   };
  if (loading)
    return (
      <ViewFadeStatic style={{ height:'85vh',justifyContent:'center',width:'100%',display:'flex' }}>
        <IconLoad />
      </ViewFadeStatic>
    );
  if (!event || !wods || page === 0) return <ViewFadeStatic style={{minHeight:'90vh'}} />;

  

  return (
    <>
      <ViewCtn style={{minHeight:'90vh',padding:ww>1000?24:0}} >
        <ViewFadeStatic style={st.ctn} >
          <TopEvent {...{event,ww}} />
          {page === 1 ? (
            <EventTable {...{ event, wods, setWodInfo, setTeamInfo }} />
          ) : null}
          {page === 2 ? <InscriptionDetail {...{ event, setPage,ww }} /> : null}
          {page === 3 ? (
            <InscriptionTeam {...{ event, setPage, setEvent }} />
          ) : null}
          {page === 4 ? <DuesPayment {...{ event, setPage }} /> : null}
        </ViewFadeStatic>
      </ViewCtn>
    </>
  );
};

export default Event;

const TopEvent = ({ event,ww }: { event: EvnFields,ww:number }) => {
  return (
    <View style={st.top}>
      <View style={{ width: ww>1000?240:140, height: ww>1000?240:140, backgroundColor: "#181818" }}>
        <img
          // contentFit="contain"
          // contentPosition="center"
          style={{ height: "100%" }}
          src={event.secure_url}
        />
      </View>
      <View
        style={{
          backgroundColor: "white",
          padding: 12,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontFamily: "Roboto", fontWeight: "bold"}}>
            {event.name}
          </Text>
          <View style={{ height: 5, backgroundColor: v.prime }} />
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <DateBox sDate={event.since} />
          <DateBox sDate={event.until} />
        </View>
      </View>
    </View>
  );
};

const DateBox = ({ sDate = "" }) => {
  return (
    <View
      style={{
        backgroundColor: v.prime,
        padding: "12px 8px",
        borderRadius: 6,
        minWidth: 52,
        gap: 4,
      }}
    >
      <Text style={{ fontFamily: "Anton", fontSize: 24, textAlign: "center" }}>
        {todaySplit(sDate)[2]}
      </Text>
      <Text
        style={{
          fontFamily: "Anton",
          fontSize: 12,
          textAlign: "center",
          marginTop: -2,
        }}
      >
        {/* {(months[parseInt(todaySplit(sDate)[1]) - 1]).toUpperCase()} */}
        {monthsLarge[parseInt(todaySplit(sDate)[1]) - 1]}
      </Text>
    </View>
  );
};

const st: ReactCSS = {
  ctn: {
    width: "100%",
    maxWidth:'100vw',
    alignSelf: "center",
    position: "relative",
    alignItems: "center",
    marginTop: 12,
  },
  top: {
    flexDirection: "row",
    // borderBottomColor: "#181818",
    // borderWidth: 1,
    border: "1px solid #181818",
    width: "100%",
  },
};

const wtf = {
  "register_time": {
      "since": "2024-08-01",
      "until": "2024-10-26"
  },
  "details": "",
  "_id": "66b4e80393c333245f375286",
  "name": "Zunfest 2024",
  "since": "2024-11-08",
  "until": "2024-11-09",
  "place": "Club Ítalo Cabimas",
  "dues": 3,
  "secure_url": "https://res.cloudinary.com/dtdgl3ajp/image/upload/v1723131904/qdnaijmbkgzauxieiggr.png",
  "public_id": "qdnaijmbkgzauxieiggr",
  "accesible": true,
  "partners": [],
  "categories": [
      {
          "teams": [
              {
                  "users": [
                      {
                          "_id": "66db373a2e9ec7761c77d9df",
                          "name": "Daniel Martinez ",
                          "card_id": "31996237"
                      },
                      {
                          "_id": "66e301c23e05ac6fccd2a420",
                          "name": "CARLOS ALFONZO",
                          "card_id": "23865974"
                      },
                      {
                          "_id": "66db3b932e9ec7761c77da9f",
                          "name": "Victoria gallo ",
                          "card_id": "33103017"
                      }
                  ],
                  "name": "Strength Team ",
                  "_id": "66e9e7e758540427ad440fed"
              },
              {
                  "users": [
                      {
                          "_id": "66f1840accbc8205e1a9575b",
                          "name": "Robinson González",
                          "card_id": "28670131"
                      },
                      {
                          "_id": "66f188d00a8ea73a29114280",
                          "name": "Mauricio Quintero",
                          "card_id": "26175688"
                      },
                      {
                          "_id": "66f18ccd0a8ea73a2911430b",
                          "name": "Haranza Hernandez",
                          "card_id": "18945091"
                      }
                  ],
                  "name": "NutraTeam",
                  "_id": "66f456e3f0d31e7223d47a65"
              },
              {
                  "users": [
                      {
                          "_id": "66f1a257e172fc9a873844de",
                          "name": "Doriana yedra",
                          "card_id": "30278140"
                      },
                      {
                          "_id": "66f1bf4298efa597b0786063",
                          "name": "Rigoberto Alastre ",
                          "card_id": "30571354"
                      },
                      {
                          "_id": "66f1aa27de7e712bef6dc18e",
                          "name": "Jose romero",
                          "card_id": "26708278"
                      }
                  ],
                  "name": "BoosterFit Moons",
                  "_id": "66fb5acac7e22430f1e1e058"
              },
              {
                  "users": [
                      {
                          "_id": "66f98b4e8e1677028ff2bd4e",
                          "name": "Gabriel López ",
                          "card_id": "30573562"
                      },
                      {
                          "_id": "66f98bd68e1677028ff2bd59",
                          "name": "Angelica Ramos ",
                          "card_id": "33035411"
                      },
                      {
                          "_id": "66fac6182bd4a57d40b468f0",
                          "name": "Francisco Díaz ",
                          "card_id": "33474810"
                      }
                  ],
                  "name": "Team force",
                  "_id": "66fb5b68fcf135fdce96c190"
              },
              {
                  "users": [
                      {
                          "_id": "66faf898c7e515b84e9cbe4d",
                          "name": "MARIA CARRASCO",
                          "card_id": "17648216"
                      },
                      {
                          "_id": "66fafb7443a744e71bcac462",
                          "name": "Paul Galea ",
                          "card_id": "17825730"
                      },
                      {
                          "_id": "66fb03dccc9455cad239954d",
                          "name": "Carlos Olivares ",
                          "card_id": "14954415"
                      }
                  ],
                  "name": "P´JODER",
                  "_id": "66fb5b7efcf135fdce96c1d4"
              },
              {
                  "users": [
                      {
                          "_id": "66fafaa9c7e515b84e9cbe71",
                          "name": "Elliot Tineo",
                          "card_id": "32275325"
                      },
                      {
                          "_id": "66fafdee43a744e71bcac469",
                          "name": "Samuel Reyes ",
                          "card_id": "33584137"
                      },
                      {
                          "_id": "66faf955c7e515b84e9cbe53",
                          "name": "Ellimar Tineo",
                          "card_id": "33599538"
                      }
                  ],
                  "name": "HWPO",
                  "_id": "66fb5b85fcf135fdce96c1f6"
              },
              {
                  "users": [
                      {
                          "_id": "670dbc1251678c964606e4cd",
                          "name": "Orlando Silva",
                          "card_id": "14257869"
                      },
                      {
                          "_id": "670dbbe317939bf665927ff1",
                          "name": "Alida Rodríguez",
                          "card_id": "25449139"
                      },
                      {
                          "_id": "670dbbad51678c964606e4c7",
                          "name": "Johandry Villalobos",
                          "card_id": "19680048"
                      }
                  ],
                  "name": "MUSPELHEIM",
                  "_id": "670dbc9051678c964606e520"
              },
              {
                  "users": [
                      {
                          "_id": "66f4179a84e63b2989679310",
                          "name": "Víctor Arrieta ",
                          "card_id": "33373067"
                      },
                      {
                          "_id": "66f418dc15b087e42b8f4a9f",
                          "name": "Shiloh Diaz ",
                          "card_id": "33373965"
                      },
                      {
                          "_id": "66f42cea3c864d8140094677",
                          "name": "José Acacio",
                          "card_id": "30086465"
                      }
                  ],
                  "name": "Elite program ",
                  "_id": "671ec4ca3761c7cc1f239e75"
              },
              {
                  "users": [
                      {
                          "_id": "66f756d51457911a485a4ff8",
                          "name": "Carlos Tovar ",
                          "card_id": "27045629"
                      },
                      {
                          "_id": "66f831464a7f6a5d66c23b0a",
                          "name": "Daniela Vilchez",
                          "card_id": "31060180"
                      },
                      {
                          "_id": "66f832ab4a7f6a5d66c23b18",
                          "name": "José Hernández ",
                          "card_id": "28435742"
                      }
                  ],
                  "name": "Tonning Training A ",
                  "_id": "671ec4dc3761c7cc1f239ec5"
              },
              {
                  "users": [
                      {
                          "_id": "66f86861dff13b9b9700f6fe",
                          "name": "Barbara Rivero",
                          "card_id": "24953766"
                      },
                      {
                          "_id": "66faae0d2074de041b23b939",
                          "name": "Rolando mota",
                          "card_id": "24953987"
                      },
                      {
                          "_id": "66fac4f43b2a82587af2dbab",
                          "name": "Luis Felipe Capielo ",
                          "card_id": "15850658"
                      }
                  ],
                  "name": "TEAM ZUNFORCE",
                  "_id": "671ec50c3761c7cc1f239f11"
              },
              {
                  "users": [
                      {
                          "_id": "66faeefb38d6b643ad2500c1",
                          "name": "Estefany Ruz",
                          "card_id": "25669798"
                      },
                      {
                          "_id": "66fb055ecc9455cad2399564",
                          "name": "Carlos Salazar ",
                          "card_id": "21430497"
                      },
                      {
                          "_id": "66fb065dc7e515b84e9cbeba",
                          "name": "Miguel Viloria ",
                          "card_id": "28059387"
                      }
                  ],
                  "name": "Ni Tan Novatos",
                  "_id": "671ec5403761c7cc1f239f5c"
              },
              {
                  "users": [
                      {
                          "_id": "66fb1aa86fcf67e7a5eed8ca",
                          "name": "Adalberto Faria",
                          "card_id": "25613733"
                      },
                      {
                          "_id": "66fb3adef33380622249b3c4",
                          "name": "Angel Eduardo Lugo",
                          "card_id": "18807362"
                      },
                      {
                          "_id": "66fb4571f33380622249b4d6",
                          "name": "Yennifer Gallardo ",
                          "card_id": "15850568"
                      }
                  ],
                  "name": "CABICARNES",
                  "_id": "671ec5543761c7cc1f239fa6"
              },
              {
                  "users": [
                      {
                          "_id": "66f49c1832191be45ca6e275",
                          "name": "María Duno ",
                          "card_id": "31966215"
                      },
                      {
                          "_id": "66f49cf632191be45ca6e286",
                          "name": "Andres Castillo",
                          "card_id": "31059385"
                      },
                      {
                          "_id": "66f49fef2f5bf80d94537be4",
                          "name": "Oscar Betancourt ",
                          "card_id": "28103178"
                      }
                  ],
                  "name": "No doubt",
                  "_id": "671ec6033761c7cc1f239fef"
              },
              {
                  "users": [
                      {
                          "_id": "66eaccfb046080ed5cac2ca5",
                          "name": "Barbara Villalobos",
                          "card_id": "30187629"
                      },
                      {
                          "_id": "66d66a902fb3a01ccd27c9ae",
                          "name": "gabriel chirinos ",
                          "card_id": "33373337"
                      },
                      {
                          "_id": "66eae0b7951a5bb7cd1a4c6a",
                          "name": "Sebastián Vera",
                          "card_id": "32035160"
                      }
                  ],
                  "name": "Más café que leche",
                  "_id": "671ec955efe51ccd26cf0b3d"
              },
              {
                  "users": [
                      {
                          "_id": "66f0ace67cea0a5ada3b0c8f",
                          "name": "Ana Ochoa ",
                          "card_id": "31833910"
                      },
                      {
                          "_id": "66eae0b8951a5bb7cd1a4c6e",
                          "name": "Javison Valero ",
                          "card_id": "31340187"
                      },
                      {
                          "_id": "66ee3b684cc1313c8c76a90d",
                          "name": "Fabio niño",
                          "card_id": "33371734"
                      }
                  ],
                  "name": "Lin Kuei ",
                  "_id": "671ec968efe51ccd26cf0b80"
              },
              {
                  "users": [
                      {
                          "_id": "66f367c2da42843451aa59dd",
                          "name": "Jose Rodriguez ",
                          "card_id": "34023845"
                      },
                      {
                          "_id": "66f60f0efab71efcdc0c86df",
                          "name": "Vanessa Santeliz",
                          "card_id": "32120115"
                      },
                      {
                          "_id": "66f35a57f97811e18b23c42c",
                          "name": "Samuel Abou",
                          "card_id": "32508907"
                      }
                  ],
                  "name": "Dumb and Dumbells ",
                  "_id": "671ec9d19e877721b0f4fb8a"
              },
              {
                  "users": [
                      {
                          "_id": "66f876aeefe6a751cd5ec396",
                          "name": "Madeleine Yajure",
                          "card_id": "20622712"
                      },
                      {
                          "_id": "66f890cad89ed53cea0002fe",
                          "name": "César Briñez",
                          "card_id": "12466818"
                      },
                      {
                          "_id": "66f87bcaae06b968fd131fa6",
                          "name": "Victor graterol ",
                          "card_id": "17188737"
                      }
                  ],
                  "name": "The Wod Fathers ",
                  "_id": "671eca019e877721b0f4fc46"
              },
              {
                  "users": [
                      {
                          "_id": "66faacdb2074de041b23b928",
                          "name": "Yair Bracho",
                          "card_id": "31966175"
                      },
                      {
                          "_id": "66faab652074de041b23b914",
                          "name": "Neibelyn castillo",
                          "card_id": "18065957"
                      },
                      {
                          "_id": "66faad3d2074de041b23b932",
                          "name": "Eduardo Acosta ",
                          "card_id": "30250900"
                      }
                  ],
                  "name": "Morenos Gosén",
                  "_id": "671eca079e877721b0f4fc83"
              },
              {
                  "users": [
                      {
                          "_id": "67086d860c7ee219a42ce3e4",
                          "name": "Lerwin Salazar",
                          "card_id": "28103400"
                      },
                      {
                          "_id": "66d2fb0b01deffdb02f80e09",
                          "name": "Arianna Medina ",
                          "card_id": "31833906"
                      },
                      {
                          "_id": "67086d4b0c7ee219a42ce3d3",
                          "name": "Ángel Naranjo",
                          "card_id": "20621991"
                      }
                  ],
                  "name": "LOS ELITE",
                  "_id": "671eca669e877721b0f4fcde"
              },
              {
                  "users": [
                      {
                          "_id": "66fb2587fc66df5d22ff7a9b",
                          "name": "Jesus Barrios ",
                          "card_id": "29819195"
                      },
                      {
                          "_id": "66fb25ddfc66df5d22ff7aa0",
                          "name": "Michel Medina",
                          "card_id": "20257331"
                      },
                      {
                          "_id": "66fb2c6c3146ef8f1a7ca9a2",
                          "name": "Noelvi graterol ",
                          "card_id": "21211211"
                      }
                  ],
                  "name": "Arepita con todo",
                  "_id": "67212dcd2c52a2bc25b34aaa"
              },
              {
                  "users": [
                      {
                          "_id": "66ee0fbb5edabce97bcb3852",
                          "name": "Josehp Ramírez ",
                          "card_id": "32119311"
                      },
                      {
                          "_id": "66fb0bc2a51e0a63e988128a",
                          "name": "Alexis Yari",
                          "card_id": "26318484"
                      },
                      {
                          "_id": "66fb045dc7e515b84e9cbea7",
                          "name": "Yasmin abou",
                          "card_id": "32508910"
                      }
                  ],
                  "name": "Team berserker",
                  "_id": "672e0faa970d1c89cea654db"
              },
              {
                  "users": [
                      {
                          "_id": "66f70f7e3c7704c2ddc83daa",
                          "name": "Ana Escalona",
                          "card_id": "32384659"
                      },
                      {
                          "_id": "66fc70c5053c62cfa5f15802",
                          "name": "Juan Leal ",
                          "card_id": "28103321"
                      },
                      {
                          "_id": "66fc6dcf31eb9fb792bedb5e",
                          "name": "Hector Miquilena ",
                          "card_id": "25486707"
                      }
                  ],
                  "name": "black and white",
                  "_id": "672e0fc2970d1c89cea65587"
              },
              {
                  "users": [
                      {
                          "_id": "66fca6b308800fe5353779e0",
                          "name": "GUILLERMO CASTRO",
                          "card_id": "27603671"
                      },
                      {
                          "_id": "66fcb7a3ebd25d8de7a0bb27",
                          "name": "VICTORIA FONTANA",
                          "card_id": "30549153"
                      },
                      {
                          "_id": "66fcb8efebd25d8de7a0bb35",
                          "name": "AMADO TORREALBA",
                          "card_id": "27931340"
                      }
                  ],
                  "name": "TNT",
                  "_id": "672e0fd6970d1c89cea65656"
              },
              {
                  "users": [
                      {
                          "_id": "66fd419172083b3f4065b9fd",
                          "name": "Jose Ruz",
                          "card_id": "31902472"
                      },
                      {
                          "_id": "66bbfcfe8c1ea81621dc0383",
                          "name": "Madelayne Acosta",
                          "card_id": "32684204"
                      },
                      {
                          "_id": "66fca68c08800fe5353779dc",
                          "name": "orlando ballestero ",
                          "card_id": "32034773"
                      }
                  ],
                  "name": "GOHAN",
                  "_id": "672e0ff8970d1c89cea65710"
              },
              {
                  "users": [
                      {
                          "_id": "66fd74d7437502bc3ad5b043",
                          "name": "Humberto carrizo",
                          "card_id": "27511389"
                      },
                      {
                          "_id": "66fd7db2c4132b5c745538b6",
                          "name": "Royner Reyna ",
                          "card_id": "31497823"
                      },
                      {
                          "_id": "66fd7ef16501347c1a58c6c3",
                          "name": "María salas",
                          "card_id": "29599631"
                      }
                  ],
                  "name": "Dos atletas y medio",
                  "_id": "672e0fff970d1c89cea65746"
              }
          ],
          "name": "Novato",
          "updating": false,
          "price": 105,
          "slots": 25,
          "filter": {
              "limit": 25,
              "amount": 3,
              "male": 2,
              "female": 1,
              "age_min": 0,
              "age_max": 0,
              "_id": "66b4e80393c333245f375288"
          },
          "_id": "66b4e80393c333245f375287",
          "createdAt": "2024-08-22T19:11:00.106Z",
          "updatedAt": "2025-02-28T21:22:30.190Z"
      },
      {
          "teams": [
              {
                  "users": [
                      {
                          "_id": "66facf793f4d60767a5cda75",
                          "name": "Adriana Cabrera",
                          "card_id": "30573493"
                      },
                      {
                          "_id": "66fae879215355baed1ed9af",
                          "name": "Alejandro Jota",
                          "card_id": "30061101"
                      },
                      {
                          "_id": "66fae7a9fb2eeaba5633835f",
                          "name": "Jorge Reyes",
                          "card_id": "16586838"
                      }
                  ],
                  "name": "Ojeda Box",
                  "_id": "66fb5b72fcf135fdce96c1b2"
              },
              {
                  "users": [
                      {
                          "_id": "66fb26b6fc66df5d22ff7aad",
                          "name": "Eduardo Parra ",
                          "card_id": "26092005"
                      },
                      {
                          "_id": "66fb19156fcf67e7a5eed8bd",
                          "name": "Anthony Valbuena ",
                          "card_id": "23443233"
                      },
                      {
                          "_id": "66fb0538cc9455cad239955f",
                          "name": "Nathaly Rincón ",
                          "card_id": "25342140"
                      }
                  ],
                  "name": "Una arepa y dos café",
                  "_id": "66fc0ff2b9d216dc024ed830"
              },
              {
                  "users": [
                      {
                          "_id": "66fc262c74370c2c7af8a0d5",
                          "name": "Angel Velásquez ",
                          "card_id": "25700300"
                      },
                      {
                          "_id": "66fc257174370c2c7af8a0c2",
                          "name": "Ivana Saez ",
                          "card_id": "27758876"
                      },
                      {
                          "_id": "66fc24d0aedf087c37244fa4",
                          "name": "Daniel Alfonzo ",
                          "card_id": "26912935"
                      }
                  ],
                  "name": "ADI",
                  "_id": "671ec6add940f05c90026bdb"
              },
              {
                  "users": [
                      {
                          "_id": "66fb4d8adbfb900ed5d1f1cf",
                          "name": "juan mercado",
                          "card_id": "31902721"
                      },
                      {
                          "_id": "66fac0e56a19e13ba50b6ba8",
                          "name": "Sabrina Torres",
                          "card_id": "29570912"
                      },
                      {
                          "_id": "66fb59c0c7e22430f1e1e032",
                          "name": "Enrique Farias",
                          "card_id": "31966433"
                      }
                  ],
                  "name": "team jester ",
                  "_id": "671ec6efd940f05c90026c24"
              },
              {
                  "users": [
                      {
                          "_id": "66ea1f903fe9b88e92bddcaa",
                          "name": "Jesus Cumare",
                          "card_id": "30187256"
                      },
                      {
                          "_id": "66eb1717515ff22e6e4a9b39",
                          "name": "María Gil ",
                          "card_id": "29901814"
                      },
                      {
                          "_id": "66ec3f6b97e12535e0467067",
                          "name": "Wilmer Hernandez ",
                          "card_id": "15849845"
                      }
                  ],
                  "name": "BoosterFit Scalades",
                  "_id": "671ec945efe51ccd26cf0af9"
              },
              {
                  "users": [
                      {
                          "_id": "66f5ceaacbafdf9c6fb874d0",
                          "name": "Dana Gonzalez",
                          "card_id": "31833941"
                      },
                      {
                          "_id": "66ce3efe80d012945e1c32f4",
                          "name": "Marcos Liscano ",
                          "card_id": "27691089"
                      },
                      {
                          "_id": "66d10295260ceb071931ea1e",
                          "name": "Lucho Antequera ",
                          "card_id": "28483676"
                      }
                  ],
                  "name": "Team Kaizen",
                  "_id": "671ec9e49e877721b0f4fbc9"
              },
              {
                  "users": [
                      {
                          "_id": "66f7636a6d470560cf70423f",
                          "name": "Victor Cordero",
                          "card_id": "30364967"
                      },
                      {
                          "_id": "66f7658e6d470560cf70424e",
                          "name": "Jessica Melean ",
                          "card_id": "27315308"
                      },
                      {
                          "_id": "66f7665a28fefe97e8210ef1",
                          "name": "José Zacarías ",
                          "card_id": "21428978"
                      }
                  ],
                  "name": "Toning training ",
                  "_id": "671ec9f69e877721b0f4fc08"
              },
              {
                  "users": [
                      {
                          "_id": "670401bb95f8c940cadec018",
                          "name": "David Vargas",
                          "card_id": "27849180"
                      },
                      {
                          "_id": "67040116d7af745258e04891",
                          "name": "Henry Boscán",
                          "card_id": "20834589"
                      },
                      {
                          "_id": "66ff54418dfbe4fc542afbac",
                          "name": "Dulcy Rincón ",
                          "card_id": "25816242"
                      }
                  ],
                  "name": "Full Excusa",
                  "_id": "671ecc139e877721b0f4fd7d"
              },
              {
                  "users": [
                      {
                          "_id": "66fc196e6ea8ecaab50c2700",
                          "name": "Hugo Andara ",
                          "card_id": "27910417"
                      },
                      {
                          "_id": "66fb12d7c705d8ea08f4ccad",
                          "name": "Rocío Brito ",
                          "card_id": "19750250"
                      },
                      {
                          "_id": "66fc180425e1f827d2dbae01",
                          "name": "Victor Sánchez ",
                          "card_id": "15077174"
                      }
                  ],
                  "name": "TEAM 8AM",
                  "_id": "67212dd52c52a2bc25b34ae5"
              },
              {
                  "users": [
                      {
                          "_id": "66cd247ee2aeaf3abf7c3210",
                          "name": "Orlando Boada",
                          "card_id": "31283295"
                      },
                      {
                          "_id": "66faf832c7e515b84e9cbe47",
                          "name": "Sofía Romero",
                          "card_id": "30423444"
                      },
                      {
                          "_id": "66faf9ad43a744e71bcac456",
                          "name": "Daniel J Pacheco ",
                          "card_id": "28059174"
                      }
                  ],
                  "name": "Gaticas",
                  "_id": "672e0fa4970d1c89cea654a0"
              },
              {
                  "users": [
                      {
                          "_id": "66f0b650828e42a3223cb7ba",
                          "name": "Arianny Chacin",
                          "card_id": "30086928"
                      },
                      {
                          "_id": "66fc45907077311fc940f1ed",
                          "name": "Cristian Muñoz",
                          "card_id": "30278365"
                      },
                      {
                          "_id": "66cdb293cc15ce1eebfe863b",
                          "name": "Frankelly Acevedo ",
                          "card_id": "20256677"
                      }
                  ],
                  "name": "Dreamers",
                  "_id": "672e0fb9970d1c89cea6554f"
              },
              {
                  "users": [
                      {
                          "_id": "66fc838b6eb3a9df89638746",
                          "name": "Aliana leal ",
                          "card_id": "21555244"
                      },
                      {
                          "_id": "66fc881df88b2546789455c6",
                          "name": "César Jose",
                          "card_id": "28696766"
                      },
                      {
                          "_id": "66fc84c46eb3a9df8963874c",
                          "name": "Alexander talavera",
                          "card_id": "31670385"
                      }
                  ],
                  "name": "Maracol",
                  "_id": "672e0fc8970d1c89cea655be"
              },
              {
                  "users": [
                      {
                          "_id": "66eeaf178d2f4bf21b83435c",
                          "name": "Enmanuel sibada ",
                          "card_id": "26023929"
                      },
                      {
                          "_id": "66fc97c1bcc098dc6c81bf01",
                          "name": "Luis Fernando ",
                          "card_id": "24486370"
                      },
                      {
                          "_id": "66fb5ca5c7e22430f1e1e0a5",
                          "name": "Johana Porras",
                          "card_id": "27691339"
                      }
                  ],
                  "name": "ultra antojosos ",
                  "_id": "672e0fcf970d1c89cea6561f"
              },
              {
                  "users": [
                      {
                          "_id": "67086aea0c7ee219a42ce399",
                          "name": "Ricardo Torres",
                          "card_id": "20742212"
                      },
                      {
                          "_id": "66ff06dd0361bc7ae0db327b",
                          "name": "Simón Bracho ",
                          "card_id": "31140851"
                      },
                      {
                          "_id": "67086be70c7ee219a42ce3a1",
                          "name": "Rita Gutiérrez",
                          "card_id": "24370299"
                      }
                  ],
                  "name": "CRYOTERAPIA",
                  "_id": "672e1009970d1c89cea657b0"
              },
              {
                  "users": [
                      {
                          "_id": "66cd3d55af6afb60e8767a6e",
                          "name": "Cruz Eliezer",
                          "card_id": "16794733"
                      },
                      {
                          "_id": "66d129420a0d1e6b36b58ddd",
                          "name": "Adafel Quevedo ",
                          "card_id": "19311140"
                      },
                      {
                          "_id": "672e3aa237276ca95816aff2",
                          "name": "Isabel Cedeño",
                          "card_id": "23469259"
                      }
                  ],
                  "name": "Rockys’ Strong",
                  "_id": "672e3b5539d7de92b78636be"
              }
          ],
          "name": "Escalado",
          "updating": false,
          "price": 105,
          "slots": 20,
          "filter": {
              "limit": 20,
              "amount": 3,
              "male": 2,
              "female": 1,
              "age_min": 0,
              "age_max": 0,
              "_id": "66b4e80393c333245f37528a"
          },
          "_id": "66b4e80393c333245f375289",
          "createdAt": "2024-08-22T19:11:00.106Z",
          "updatedAt": "2024-11-09T14:47:57.475Z"
      },
      {
          "teams": [
              {
                  "users": [
                      {
                          "_id": "66ce363b667f80ef0f1fbcf0",
                          "name": "Daniel Mavarez ",
                          "card_id": "30278202"
                      },
                      {
                          "_id": "66f4b11a3d7e7e6a00a52eb9",
                          "name": "Maria Esperanza Lima ",
                          "card_id": "31966540"
                      },
                      {
                          "_id": "66f4b3047a69d0b10d298794",
                          "name": "Nolberto Nava ",
                          "card_id": "26912815"
                      }
                  ],
                  "name": "Thunderbolts ",
                  "_id": "672e0f9e970d1c89cea65465"
              },
              {
                  "users": [
                      {
                          "_id": "66fb3b3bf33380622249b3d0",
                          "name": "Luis Perales ",
                          "card_id": "21045908"
                      },
                      {
                          "_id": "66fb3d56f33380622249b427",
                          "name": "Dayana Lopez",
                          "card_id": "26914933"
                      },
                      {
                          "_id": "66fb47afb3d72bb48514f375",
                          "name": "Deyvi Chirinos",
                          "card_id": "26716088"
                      }
                  ],
                  "name": "TEAM REFORZADO",
                  "_id": "672e0fb1970d1c89cea65516"
              },
              {
                  "users": [
                      {
                          "_id": "670869ce0c7ee219a42ce35a",
                          "name": "Paola Cobis",
                          "card_id": "23762740"
                      },
                      {
                          "_id": "670869850c7ee219a42ce356",
                          "name": "José Ricardo León",
                          "card_id": "23854720"
                      },
                      {
                          "_id": "670869360c7ee219a42ce352",
                          "name": "Alejandro Talavera",
                          "card_id": "28091408"
                      }
                  ],
                  "name": "Destilando Veneno",
                  "_id": "672e1004970d1c89cea6577c"
              },
              {
                  "users": [
                      {
                          "_id": "67114a8313b8d9b9b257c5b8",
                          "name": "Melissa Ferrer",
                          "card_id": "17951742"
                      },
                      {
                          "_id": "67114a57c1fa12b2c54623b1",
                          "name": "José Daniel Hurtado",
                          "card_id": "28198296"
                      },
                      {
                          "_id": "67114a21c1fa12b2c54623a0",
                          "name": "Iván Delgado",
                          "card_id": "20454696"
                      }
                  ],
                  "name": "I Human",
                  "_id": "672e100e970d1c89cea657e4"
              },
              {
                  "users": [
                      {
                          "_id": "66fdfebe59ab756653e0799a",
                          "name": "Jesus Portillo ",
                          "card_id": "26318895"
                      },
                      {
                          "_id": "66fe013e8c8d6bfa6507e98c",
                          "name": "Maria Valero",
                          "card_id": "30502589"
                      },
                      {
                          "_id": "66fe92a093d44e406920a1c9",
                          "name": "José Chirinos ",
                          "card_id": "30816754"
                      }
                  ],
                  "name": "The Big Team",
                  "_id": "672e1012970d1c89cea65818"
              },
              {
                  "users": [
                      {
                          "_id": "672e37bf37276ca95816af55",
                          "name": "Jorge Echeverry",
                          "card_id": "84477342"
                      },
                      {
                          "_id": "672e380637276ca95816af59",
                          "name": "Bretnny Reyes",
                          "card_id": "27750845"
                      },
                      {
                          "_id": "672e383eff07a0f331f758c8",
                          "name": "Jhoiker Aguirre",
                          "card_id": "31575242"
                      }
                  ],
                  "name": "NODO",
                  "_id": "672e395039d7de92b78636bc"
              },
              {
                  "users": [
                      {
                          "_id": "66fd57def4cec06ef85e5a81",
                          "name": "Enmanuel piña",
                          "card_id": "24369690"
                      },
                      {
                          "_id": "66fd84f1bca3e804c1391561",
                          "name": "Daniela Reyes",
                          "card_id": "28040682"
                      },
                      {
                          "_id": "672e3c0637276ca95816b058",
                          "name": "Daniel Chirinos",
                          "card_id": "24954269"
                      }
                  ],
                  "name": "Galleta María Y Café",
                  "_id": "672e3c4339d7de92b78636bf"
              },
              {
                  "name": "Strong Endurance",
                  "users": [
                      {
                          "_id": "672e3d5f0c276d013ae7fee5",
                          "name": "Julio Marin",
                          "card_id": "26550041"
                      },
                      {
                          "_id": "66ce56ddabf9558319be87a5",
                          "name": "Yrevelis Melean",
                          "card_id": "26716913"
                      }
                  ],
                  "_id": "672ea32e86c850b97652998e"
              }
          ],
          "name": "Avanzado",
          "updating": false,
          "price": 105,
          "slots": 5,
          "filter": {
              "limit": 5,
              "amount": 3,
              "male": 2,
              "female": 1,
              "age_min": 0,
              "age_max": 0,
              "_id": "66b4e80393c333245f37528c"
          },
          "_id": "66b4e80393c333245f37528b",
          "createdAt": "2024-08-22T19:11:00.107Z",
          "updatedAt": "2024-11-09T16:22:48.766Z"
      }
  ],
  "manual_teams": false,
  "createdAt": "2024-08-08T15:45:07.054Z",
  "updatedAt": "2025-02-28T21:22:30.190Z",
  "__v": 3
}