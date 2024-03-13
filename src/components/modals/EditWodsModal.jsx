import moment from "moment";
import { useEffect, useState } from "react";
import { updateWods } from "../../api/events.api";
import { convTime, CrossIcon, InputsWOD } from "./ModalTools";

const blankwod = {
  amount_cap: 0,
  amount_type: "Reps",
  name: "",
  time_cap: "00:00:00",
  wod_type: 1,
};

const rType = (num) => {
  if (num === 1) return 2;
  else if (num === 2) return 3;
  else if (num === 3) return 4;
  else if (num === 4) return 1;
};

export const EditWodsModal = ({ close, event, categ, setEvents, events }) => {
  const [load, setLoad] = useState(false);
  const [wods, setWods] = useState(false);
  useEffect(() => {
    let aux = event.categories[categ - 1].wods.map((w, i) => {
      return {
        ...w,
        time_cap: moment.utc(w.time_cap * 1000).format("HH:mm:ss"),
      };
    });
    // console.log(aux)
    setWods(aux);
  }, []);

  if (!wods) return <div className="blackscreen"></div>;

  const click = async () => {
    setLoad(true);
    let newWods = wods.map((item) => {
      return {
        ...item,
        time_cap: convTime(item.time_cap),
      };
    });
    const { status, data } = await updateWods(
      event._id,
      event.categories[categ - 1]._id,
      newWods
    );
    setLoad(false);
    if (status === 200) {
      let newEvents = events.map((ev, i) => {
        if (ev._id === event._id) {
          return data;
        } else {
          return ev;
        }
      });
      setEvents(newEvents);
      // console.log(data)
      close();
    }
  };

  const pushNewWod = () => {
    setWods([...wods, { ...blankwod }]);
  };
  const removeLastWod = () => {
    let aux = [...wods];
    setWods(aux.slice(0, -1));
  };

  const handleName = (value, index) => {
    const aux = wods.map((w, i) => {
      if (i === index) return { ...w, name: value };
      else return w;
    });
    setWods(aux);
  };
  const handleTime = (value, index) => {
    const aux = wods.map((w, i) => {
      if (i === index) return { ...w, time_cap: value };
      else return w;
    });
    setWods(aux);
  };
  const handleReps = (value, index) => {
    const aux = wods.map((w, i) => {
      if (i === index) return { ...w, amount_cap: value };
      else return w;
    });
    setWods(aux);
  };
  const handleType = async (value, index) => {
    let aux = wods.map((w, i) => {
      if (i === index){
        let at = rType(value) === 4 ? 'Puntos' : 'Reps'
        return { ...blankwod, wod_type: rType(value), name: w.name,amount_type:at };
      }
      else return w;
    });
    setWods(aux);
  };
  const handleAmountType = (value, index) => {
    let aux = [...wods];
    // console.log(value)
    // console.log(aux[index])
    aux[index].amount_type = value === "Reps" ? "Lbs" : "Reps";
    setWods(aux);
  };

  const minusWod = (index) => {
    // let index = 0;
    let aux = [...wods];
    aux.splice(index, 1);
    setWods([...aux]);
  };

  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>EDITAR WODS</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        <div className="modal_form">
          {wods?.map((item, index) => (
            <InputsWOD
              key={index}
              wod={item}
              {...{
                index,
                handleName,
                handleTime,
                handleType,
                handleReps,
                handleAmountType,
                minusWod,
              }}
            />
          ))}
          {/* {wods?.map((item,index)=>{
              if(item.wod_type === 1) return <InputsWOD_AMRAP key={index} wod={item} {...{handleName,handleTime,handleType}} />
              else if(item.wod_type === 2) return <InputsWOD_FORTIME key={index} wod={item} {...{handleName,handleTime,handleType,handleReps}} />
              else if(item.wod_type === 3) return <InputsWOD_RM key={index} wod={item} {...{handleName,handleTime,handleType}} />
            })} */}
        </div>
        <div className="mt_auto"></div>
        <div className="bottom_ctn">
          <div className="btn_plus_categ" onClick={pushNewWod}>
            <h6>Añadir WOD</h6>
          </div>
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? <h6>Editando Wods...</h6> : <h6>Editar WODS</h6>}
          </button>
          {/* <div className="btn_plus_categ" onClick={removeLastWod}>
            <h6>Eliminar Ultimo WOD</h6>
          </div> */}
        </div>
      </div>
    </div>
  );
};
