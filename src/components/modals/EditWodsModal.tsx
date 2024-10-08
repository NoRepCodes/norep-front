//@ts-ignore
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { updateWods } from "../../api/event.api";
//@ts-ignore
// import {  } from "./EditTeamsModal";
import {
  CategoriesSelect,
  convTime,
  InputsWOD,
  Modal,
  InputWodT,
} from "./ModalTools";
import { Context } from "../Context";
import { ResultContext } from "../results/ResultContx";
import { Wod_T, WodAmount_T } from "../../types/event.t";

const blankwod: InputWodT = {
  amount_cap: "0",
  amount_type: "Reps",
  name: "",
  time_cap: "00:00:00",
  wod_type: "AMRAP",
  category_id: "",
};

const rType = (wt: string) => {
  if (wt === "AMRAP") return "FORTIME";
  else if (wt === "FORTIME") return "RM";
  else if (wt === "RM") return "CIRCUITO";
  else if (wt === "CIRCUITO") return "NADO";
  else if (wt === "NADO") return "AMRAP";
};

const transformTimecap = (wds: any) =>
  wds.map((w: any) => ({
    ...w,
    time_cap: moment.utc(w.time_cap * 1000).format("HH:mm:ss"),
    results: [],
  }));
const EditWodsModal = ({ close }: { close: () => void }) => {
  const { event, category, wods, setWods } = useContext(ResultContext);
  const { setMsg } = useContext(Context);
  const [load, setLoad] = useState(false);
  const [newWods, setNewWods] = useState<InputWodT[]>([]);
  // const [newWods, setNewWods] = useState<InputWodT[]>(wods ? transformTimecap(wods) : []);
  const [toDelete, setToDelete] = useState<string[]>([]);

  useEffect(() => {
    setNewWods(wods ? transformTimecap(wods) : []);
  }, [category]);

  // if (!wods) return <div className="blackscreen"></div>;

  const click = async () => {
    let nw: ValidateWodT[] = newWods.map((item) => {
      return {
        ...item,
        amount_cap:
          typeof item.amount_cap === "string"
            ? parseInt(item.amount_cap)
            : item.amount_cap,
        time_cap: convTime(item.time_cap ?? ""),
      };
    });
    const validation = validate(nw);
    if (typeof validation === "string")
      return setMsg({
        msg: validation,
        type: "warning",
        open: true,
      });
    setLoad(true);
    const categories = event?.categories.map((c) => c._id);
    const { status, data } = await updateWods({
      wods: nw,
      toDelete,
      categories,
    });
    setLoad(false);
    if (status === 200) {
      // data.splice(data.length - 1, 1);
      setMsg({
        open: true,
        msg: "Wods actualizados con exito!",
        type: "success",
      });
      setWods(data);
      close();
    } else {
      setMsg({
        open: true,
        msg: data.msg,
        type: "error",
      });
    }
  };

  const pushNewWod = () => {
    if (!category) return 0;
    setNewWods((prev) => [...prev, { ...blankwod, category_id: category._id }]);
  };

  const handleName = (value: any, index: number) => {
    const aux = newWods.map((w, i) => {
      if (i === index) return { ...w, name: value };
      else return w;
    });
    setNewWods(aux);
  };
  const handleTime = (value: any, index: number) => {
    const aux = newWods.map((w, i) => {
      if (i === index) return { ...w, time_cap: value };
      else return w;
    });
    setNewWods(aux);
  };
  const handleReps = (value: any, index: number) => {
    const aux = newWods.map((w, i) => {
      if (i === index) return { ...w, amount_cap: value };
      else return w;
    });
    setNewWods(aux);
  };
  const handleType = async (wt_val: string, index: number) => {
    let aux: any = newWods.map((w, i) => {
      if (i === index) {
        let wt = rType(wt_val)
        let at:WodAmount_T= "Reps"
        if(wt === 'NADO') at = 'Mts'
        else if (wt === 'RM') at = 'Lbs'
        else if (wt === 'CIRCUITO') at ='Puntos'
        // let at = rType(value) === "RM" ? "Lbs" : "Reps";
        
        return {
          ...blankwod,
          wod_type: wt,
          name: w.name,
          amount_type: at,
          category_id: category?._id,
          _id: w._id,
        };
      } else return w;
    });
    setNewWods(aux);
  };
  const handleAmountType = (value: any, index: number) => {
    let aux = [...newWods];
    // if(aux[index].wod_type === 'NADO') aux[index].amount_type = "Mts" 
    // else if(aux[index].wod_type === 'RM') aux[index].amount_type = "Lbs"
    // else aux[index].amount_type = "Reps"
    aux[index].amount_type = value === "Reps" ? "Lbs" : "Reps";
    setNewWods(aux);
  };

  const minusWod = (index: number) => {
    let aux = [...newWods];
    let aux2 = aux[index]._id;
    if (aux2) setToDelete([...toDelete, aux2]);
    aux.splice(index, 1);
    setNewWods([...aux]);
  };

  return (
    <Modal title="EDITAR RESULTADOS" close={close}>
      {category && <CategoriesSelect />}

      <div className="modal_form">
        {newWods?.map((item, index) => {
          if (category?._id === item.category_id) {
            return (
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
            );
          }
        })}
      </div>
      <div className="mt_auto"></div>
      {/* {error && (
        <p style={{ color: "red", padding: "1em 0px" }}>Error: {error}</p>
      )} */}
      <div className="bottom_ctn">
        <div className="btn_plus_categ" onClick={pushNewWod}>
          <h6>Añadir WOD</h6>
        </div>
        <button className="btn_confirm" onClick={click} disabled={load}>
          {load ? <h6>Editando Wods...</h6> : <h6>Editar WODS</h6>}
        </button>
      </div>
    </Modal>
  );
};

export default EditWodsModal;

type ValidateWodT = {
  amount_cap: number | undefined;
  time_cap: number;
  name: string;
  amount_type: WodAmount_T;
  wod_type: Wod_T;
  category_id: string;
  _id?: string;
  time?: string;
};

const validate = (wods: ValidateWodT[]) => {
  let error: string | undefined = undefined;
  wods.forEach((w) => {
    if (w.name.length < 1)
      return (error = "El nombre de los wods no puede quedar vacío");
    if (w.time_cap && w.time_cap <= 0)
      return (error = "El tiempo limite de los wods no puede quedar vacío");
    if (w.wod_type === "FORTIME") {
      if (w.amount_cap === 0 || (w.amount_cap && w.amount_cap < 1))
        error = 'La "cantidad limite" de los FORTIME no puede quedar vacía';
    }
  });
  return error;
};
