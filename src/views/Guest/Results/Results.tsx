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
import { TeamType } from "../../../types/table.t";
import { IconLoad } from "../../../components/Icons";
import Table from "../../../components/results/Table";

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
  // const [wodInfo, setWodInfo] = useState<WodFields | undefined>(undefined);
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
      <div className="results" id="top">
        <BtnBack />
        <div className="results_ctn">
          <ResultAside {...values} />
          <EventHeader {...values}>
            {/**CATEG FORM */}
            {category ? <Table {...values} {...{ wods, category }} /> : null}
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
