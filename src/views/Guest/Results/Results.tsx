import "./results.sass";
import "./tables.sass";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Banner } from "../../../components/Banner";
import { ArwIcon, StrongIcon } from "../../../components/PartnersSvg";
import ResultAside from "../../../components/results/ResultAside";
import EventHeader from "../../../components/results/EventHeader";
// import CategForm from "../../../components/results/CategForm";
import Context from "../../../helpers/UserContext";
import { ViewFadeStatic } from "../../../components/AnimatedLayouts";
import { getEventTable } from "../../../api/api_guest";
import { CategFields, EvnFields, WodFields } from "../../../types/event";
import { IconLoad, Ionicons } from "../../../components/Icons";
import Table from "../../../components/results/Table";
import { AnimatePresence, motion } from "framer-motion";
import { BtnSecondary, Line } from "../../../components/Input";
import { IoniconNameT } from "../../../types/ionicons";
import { convSeconds } from "../../../helpers/date";

const Results = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const { setMsg, adminData, userData } = useContext(Context);
  const [event, setEvent] = useState<EvnFields | undefined>(undefined);
  const [wods, setWods] = useState<WodFields[] | undefined>(undefined);
  const [category, setCategory] = useState<CategFields | undefined>(undefined);
  const [kg, setKg] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  // MODALS
  const [wodInfo, setWodInfo] = useState<WodFields | undefined>(undefined);
  // const [teamInfo, setTeamInfo] = useState<TeamType | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!_id) return undefined;
      setLoading(true);
      const { status, data } = await getEventTable(_id);
      setLoading(false);
      if (status === 200) {
        setEvent(data.event);
        setCategory(data.event.categories ? data.event.categories[0] : []);
        setWods(data.wods);
        let aux2: string[] = [];
        const serverToday = new Date(data.date).valueOf();
        const eventUntil = new Date(data.event.register_time.until).valueOf();
        if (adminData || serverToday > eventUntil) return setPage(1);
        else if (!userData) return setPage(2);
        else if (userData && data.event) {
          if (data.event.categories) {
            data.event.categories.forEach((c: any) => {
              c.teams.forEach((t: any) => {
                t.users?.forEach((u: any) => {
                  if (typeof u === "string") aux2.push(u);
                  //@ts-ignore
                  else if (typeof u === "object") aux2.push(u._id);
                });
              });
            });
          }
          if (aux2.includes(userData._id)) return setPage(1);
          else return setPage(2);
        }
      } else {
        setMsg({
          type: "error",
          text: data.msg,
          onClose: () => navigate(-1),
        });
      }
    })();
  }, []);

  if (loading)
    return (
      <ViewFadeStatic style={{ paddingTop: 42 }}>
        <IconLoad />
      </ViewFadeStatic>
    );
  if (!event || !wods || page === 0) return undefined;

  const values = {
    category,
    event,
    kg,
    searchBar,
    setCategory,
    setKg,
    setSearchBar,
  };

  return (
    <>
      <WodModal {...{ wodInfo, setWodInfo }} />
      <div className="results" id="top">
        <BtnBack />
        <div className="results_ctn">
          <ResultAside {...values} />
          <EventHeader {...values}>
            {/**CATEG FORM */}
            {category ? (
              <Table {...values} {...{ wods, category, setWodInfo }} />
            ) : null}
          </EventHeader>
        </div>
        <PartenrsResponsive />
      </div>
      <Banner />
    </>
  );
};

export default Results;

const PartenrsResponsive = () => {
  return (
    <div className="partners_resposive">
      <div className="p_img_ctn">
        <StrongIcon />
      </div>
      <div className="p_img_ctn">
        <ArwIcon />
      </div>
    </div>
  );
};

const BtnBack = () => {
  return (
    <div className="btns_ctn">
      <Link className="back_btn_ctn" to="/eventos">
        <h1>
          Regresar a <span>EVENTOS</span>
        </h1>
      </Link>
    </div>
  );
};

const WodModal = ({
  wodInfo,
  setWodInfo,
}: {
  wodInfo?: WodFields;
  setWodInfo: React.Dispatch<React.SetStateAction<WodFields | undefined>>;
}) => {
  return (
    <AnimatePresence>
      {!wodInfo ? null : (
        <motion.div
          className="blackscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="blackscreenOver">
            <motion.div
              className="modal_ctn msg_modal_ctn"
              style={{
                minHeight: 200,
                alignItems: "flex-start",
                padding: "1.5em",
                justifyContent: "flex-start",
                position: "relative",
                paddingBottom: 64,
                overflow: "hidden",
              }}
              initial={{ scale: 0.3 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.3 }}
            >
              <h6 style={{ fontSize: 24, color: "#181818" }}>
                WOD - {wodInfo.name}
              </h6>
              {!wodInfo.description ? null : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <h6 style={{ color: "#181818" }}>Descripcion</h6>
                    <Line />
                  </div>
                  <p style={{color:'#181818CC',marginTop:-6,marginBottom:6,fontSize:14}} >{wodInfo.description}</p>
                </>
              )}

              <InfoItem
                icon_name="information-circle"
                label="Tipo de Wod:"
                value={wodInfo.wod_type}
              />
              {wodInfo.time_cap ? (
                <InfoItem
                  icon_name="time"
                  label="Tiempo:"
                  value={convSeconds(wodInfo.time_cap)}
                />
              ) : null}
              {wodInfo.amount_cap ? (
                <InfoItem
                  icon_name="flag"
                  label="Objectivo:"
                  value={`${wodInfo.amount_cap.toString()} ${
                    wodInfo.amount_type
                  }`}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  left: 0,
                }}
              >
                <BtnSecondary
                  text="Cerrar"
                  bg="#181818"
                  color="#fff"
                  onPress={() => setWodInfo(undefined)}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoItem = ({
  label,
  value,
  icon_name,
  scale = 1,
  multiline,
}: {
  label: string;
  value?: string | number;
  icon_name: IoniconNameT;
  scale?: number;
  multiline?: boolean;
}) => {
  if (!value) return null;
  return (
    <div
      style={{
        flexDirection: "row",
        gap: 12,
        alignItems: multiline ? undefined : "center",
        // backgroundColor: "red",
        width: "100%",
        display: "flex",
      }}
    >
      <div style={{ minWidth: 24 }}>
        <Ionicons name={icon_name} size={20 * scale} color="black" />
      </div>
      <p style={{ fontSize: 12 * scale, fontFamily: "RobotoMedium" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 12 * scale,
          fontFamily: "Roboto",
          color: "#181818D9",
          flex: 1,
          textAlign: "right",
          // backgroundColor: "red",
        }}
      >
        {value}
      </p>
    </div>
  );
};
