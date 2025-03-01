import { useContext } from "react";
import { EvnFields } from "../../../types/event";
import "./calendar.sass";
import { convertDate, months, todaySplit } from "../../../helpers/date";
import Context from "../../../helpers/UserContext";
import { HashLink } from "react-router-hash-link";

const thisMonth = parseInt(todaySplit()[1]);
const minus = (n: number) => {
  let baseNum = 0;
  if (thisMonth < 3 && n < 0) baseNum = 12;
  let result = baseNum + n;
  return result;
};

const monthsArr = [
  minus(-3),
  minus(-2),
  minus(-1),
  minus(0),
  minus(1),
  minus(2),
];

const getMonth = (d: string) => {
  return parseInt(d.split("-")[1]) - 1;
};

export const Calendar = ({ events }: { events?: EvnFields[] }) => {
  if (!events) return null;
  return (
    <div className="calendar" id="Calendar">
      <h6 className="title">CALENDARIO</h6>
      <p className="subtitle">Competencias que cubrimos</p>
      <div className="calendar_ctn">
        {monthsArr.map((month, index) => {
          const monthsEvents = events.filter(
            (e: any) => getMonth(e.since) === month
          );
          return (
            <CalendarRow month={month} key={index} events={monthsEvents} />
          );
        })}
      </div>
    </div>
  );
};
const CalendarRow = ({
  month,
  events,
}: {
  month: number;
  events: EvnFields[];
}) => {
  return (
    <div className="calendar_row">
      <h6> {months[month]?.toUpperCase()??""}</h6>
      <hr />
      <div className="calendar_cards_ctn">
        {events.map((e) => (
          <CalendarCard key={e._id} event={e} />
        ))}
        {/* <div className="test"></div> */}
      </div>
    </div>
  );
};

const CalendarCard = ({ event }: { event: EvnFields }) => {
  const { adminData } = useContext(Context);
  const CalendarCardInfo = () => {
    return (
      <>
        <div className="cc_top">
          <h1 className="cc_title">{event.name}</h1>
          <h1 className="cc_categ">{event.categories[0]?.name}</h1>
          {event.categories.length > 1 && (
            <h1 className="cc_categ">{event.categories[1]?.name}</h1>
          )}
          {/* <h1 className="cc_categ">{event.categories[1]?.name}</h1> */}
        </div>
        <div className="cc_bot">
          <h1>Ver Tabla</h1>
          <p className="cc_date">
            {convertDate(event.since)} - {convertDate(event.until)}
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      {event.accesible || adminData ? (
        //@ts-ignore
        <HashLink
          className="calendar_card"
          to={`/resultados/${event?._id}#top`}
        >
          <CalendarCardInfo />
        </HashLink>
      ) : (
        <div className="calendar_card">
          <CalendarCardInfo />
        </div>
      )}
    </>
  );
};
