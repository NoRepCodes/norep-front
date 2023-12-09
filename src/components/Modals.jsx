import moment from "moment";
import { duration } from "moment/moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { createEvent, plusTeams, updateResults, updateWods } from "../api/events.api";
import "../sass/table.sass";

let idd = 0;

const ModalHeader = ({ title = "", close }) => {
  return (
    <div className="header">
      <p>{title}</p>
      <Cross close={close} />
    </div>
  );
};

const Cross = ({ close }) => {
  return (
    <svg
      onClick={close}
      width={24}
      height={24}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
    </svg>
  );
};

const LabelInput = ({ label, name, ph = false, ...props }) => {
  return (
    <div className="InputLabel">
      <p>{label}</p>
      <input {...props} name={name} placeholder={ph ? ph : label} />
    </div>
  );
};

const ArrayInput = ({ label, ocArr, value, index }) => {
  const text = (e) => {
    ocArr(e.target.value, index);
  };
  return (
    <div className="InputLabel">
      <p>{label}</p>
      <input type="text" onChange={text} value={value} />
    </div>
  );
};

const Modal = ({ children, title, close }) => {
  return (
    <div className="blackscreen">
      <div className="modal">
        <ModalHeader title={title} close={close} />
        <div className="modal_ctn">{children}</div>
      </div>
    </div>
  );
};

// export const CreateEventModal = ({ close, update }) => {
//   const [inputs, setInputs] = useState({
//     name: "",
//     since: "",
//     until: "",
//     place: "",
//     categories: [],
//   });
//   const onChange = (e) => {
//     const att = e.target.getAttribute("name");
//     let value = e.target.value;
//     setInputs((prev) => ({ ...prev, [att]: value }));
//   };

//   const plusCategory = () => {
//     setInputs({ ...inputs, categories: [...inputs.categories, ""] });
//   };

//   const ocArr = (value, index) => {
//     let aux = [...inputs.categories];
//     aux[index] = value;
//     setInputs({ ...inputs, categories: aux });
//   };

//   const confirm = () => {
//     if(inputs.categories.length !== 0){
//       update(inputs);
//     }
//   };

//   return (
//     <Modal title="Crear Evento" close={close}>
//       <LabelInput label="Nombre" name="name" {...{ onChange }} />
//       <LabelInput label="Inicio" name="since" type="date" {...{ onChange }} />
//       <LabelInput label="Cierre" name="until" type="date" {...{ onChange }} />
//       <LabelInput label="Ubicacion" name="place" {...{ onChange }} />
//       {inputs.categories.map((item, index) => (
//         <ArrayInput
//           label={`Categoria ${index + 1}`}
//           ocArr={ocArr}
//           key={index}
//           value={item}
//           index={index}
//         />
//       ))}
//       <div className="plus_category" onClick={plusCategory}>
//         <p>Añadir categoria</p>
//       </div>
//       <div className="btn" onClick={confirm}>
//         <p>Confirmar</p>
//       </div>
//     </Modal>
//   );
// };

export const WodsModal = ({ close, update }) => {
  const [inputs, setInputs] = useState([]);

  const plusWod = (wod_type) => {
    let info = {
      name: "",
      time_cap: "",
      amount_cap: "",
      amount_type: "",
      wod_type,
    };
    if (wod_type === 1) {
      info = { ...info, amount_cap: null, amount_type: "Reps" };
    } else if (wod_type === 2) {
      info = { ...info, amount_type: "Reps" };
    } else if (wod_type === 3) {
      info = { ...info, amount_cap: null, amount_type: "Reps" };
    }

    setInputs([...inputs, info]);
  };

  const set = (value, att, index) => {
    let aux = [...inputs];
    aux[index][att] = value;
    setInputs(aux);
  };

  const confirm = () => {
    update(inputs);
    // console.log(inputs);
  };

  const cAMRAP = () => plusWod(1);
  const cFORTIME = () => plusWod(2);
  const cRM = () => plusWod(3);

  return (
    <Modal title="Añadir Wods" close={close}>
      {inputs.map((item, index) => {
        if (item.wod_type === 1) {
          return <InputAMRAP set={set} item={item} key={index} index={index} />;
        } else if (item.wod_type === 2) {
          return (
            <InputFORTIME set={set} item={item} key={index} index={index} />
          );
        } else if (item.wod_type === 3) {
          return <InputRM set={set} item={item} key={index} index={index} />;
        }
      })}
      {/* <InputRM set={set} /> */}
      <div className="wod_type_btns">
        <p onClick={cAMRAP}>AMRAP</p>
        <p onClick={cFORTIME}>FORTIME</p>
        <p onClick={cRM}>RM</p>
      </div>
      {inputs.length > 0 && (
        <div className="btn" onClick={confirm}>
          <p>Confirmar</p>
        </div>
      )}
    </Modal>
  );
};

export const TeamsModal = ({ close, update }) => {
  const [inputs, setInputs] = useState([]);

  const plusWod = () => {
    setInputs([
      ...inputs,
      {
        points: 0,
        percent: 0,
        name: "",
        box: "",
        wods: [],
      },
    ]);
  };

  const setInfo = (value, att, index) => {
    let aux = [...inputs];
    aux[index][att] = value;
    setInputs(aux);
  };

  const confirm = () => {
    // console.log(inputs)
    update(inputs);
  };
  return (
    <Modal close={close} title="Equipos">
      {inputs.map((item, index) => (
        <TeamInput
          set={setInfo}
          key={index}
          valueN={item}
          valueB={item}
          index={index}
        />
      ))}
      <div className="plus_category" onClick={plusWod}>
        <p>Añadir</p>
      </div>
      {inputs.length > 0 && (
        <div className="btn" onClick={confirm}>
          <p>Confirmar</p>
        </div>
      )}
    </Modal>
  );
};

const TeamInput = ({ set, value, index }) => {
  const text = (e) => {
    const att = e.target.getAttribute("name");
    set(e.target.value, att, index);
  };
  return (
    <div className="team_input">
      <div className="InputLabel">
        <p>Equipo {index + 1}</p>
        <input type="text" onChange={text} value={value} name="name" />
      </div>
      <div className="InputLabel">
        <p>Box {index + 1}</p>
        <input type="text" onChange={text} value={value} name="box" />
      </div>
    </div>
  );
};

const TypeInput = ({ set, item, index }) => {
  // const [type, setType] = useState('Reps')
  const toggleType = () => {
    let auxVal = item.limit_type;
    if (auxVal === "Reps") auxVal = "Lbs";
    else auxVal = "Reps";
    set(auxVal, "limit_type", index);
  };
  const text = (e) => {
    const att = e.target.getAttribute("name");
    set(e.target.value, att, index);
  };
  return (
    <div className="team_input">
      <div className="InputLabel">
        <p>Wod {index + 1}</p>
        <input type="text" onChange={text} value={item.name} name="name" />
      </div>
      <div className="InputLabel">
        <div className="abs_btn" onClick={toggleType}>
          <p>{item.limit_type}</p>
        </div>
        <p>Limite Wod {index + 1}</p>
        <input type="text" onChange={text} value={item.limit} name="limit" />
      </div>
    </div>
  );
};

export const ScoreModal = ({ close, index, teams, wod, update }) => {
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    if (inputs.length === 0) {
      let aux = [];
      console.log(wod.wod_type === 3 ? wod.time_cap : 0);
      teams.forEach((team) => {
        aux.push({
          amount: 0,
          time: wod.wod_type === 3 ? wod.time_cap : 0,
          tiebrake: 0,
          amount_type: wod.amount_type,
          name: team.name,
        });
      });
      setInputs(aux);
    }
  }, []);
  const onChange = (pos, e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    let aux = [...inputs];
    aux[pos][att] = value;
    setInputs(aux);
  };

  const confirm = () => {
    console.log(inputs);
    update(inputs, index - 1);
  };

  if (inputs.length === 0) {
    return null;
  }

  return (
    <Modal title={`Resultados Wod ${index}`} close={close}>
      {inputs.length > 0 && (
        <>
          {teams.map((team, tindex) => (
            <div className="team_input" key={tindex}>
              <div className="InputLabel">
                <div className="abs_btn">
                  <p>{wod.amount_type}</p>
                </div>
                <p>{team.name}</p>
                <input
                  type="text"
                  onChange={(e) => {
                    onChange(tindex, e);
                  }}
                  value={inputs[tindex].amount}
                  name="amount"
                />
              </div>
              {wod.wod_type !== 3 && (
                <div className="InputLabel">
                  <p>Tiempo</p>
                  <input
                    type="text"
                    onChange={(e) => {
                      onChange(tindex, e);
                    }}
                    value={inputs[tindex].time}
                    name="time"
                  />
                </div>
              )}
              <div className="InputLabel">
                <p>Tie Brake</p>
                <input
                  type="text"
                  value={inputs[tindex].tiebrake}
                  onChange={(e) => {
                    onChange(tindex, e);
                  }}
                  name="tiebrake"
                />
              </div>
            </div>
          ))}
        </>
      )}
      <div className="btn" onClick={confirm}>
        <p>Confirmar</p>
      </div>
    </Modal>
  );
};

const InputAMRAP = ({ set, index }) => {
  const onChange = (e) => {
    const att = e.target.getAttribute("name");
    let value = e.target.value;
    set(value, att, index);
  };
  return (
    <div className="inp_amrap_ctn">
      <LabelInput
        label={`AMRAP: Wod ${index + 1}`}
        name="name"
        {...{ onChange }}
        ph="Nombre"
      />
      <LabelInput label="Tiempo limite" name="time_cap" {...{ onChange }} />
    </div>
  );
};
const InputFORTIME = ({ set, index }) => {
  const onChange = (e) => {
    const att = e.target.getAttribute("name");
    let value = e.target.value;
    set(value, att, index);
  };
  return (
    <div className="inp_amrap_ctn">
      <LabelInput
        label={`FORTIME: Wod ${index + 1}`}
        name="name"
        {...{ onChange }}
        ph="Nombre"
      />
      <LabelInput label="Tiempo limite" name="time_cap" {...{ onChange }} />
      <LabelInput
        label="Repeticiones limite"
        name="amount_cap"
        {...{ onChange }}
      />
    </div>
  );
};
const InputRM = ({ set, index }) => {
  const [t, setT] = useState("Reps");
  const onChange = (e) => {
    const att = e.target.getAttribute("name");
    let value = e.target.value;
    set(value, att, index);
  };

  useEffect(() => {
    set(t, "amount_type", index);
  }, [t]);

  const toggleType = () => {
    if (t === "Reps") setT("Lbs");
    else if (t === "Lbs") setT("Reps");
  };

  return (
    <div className="inp_amrap_ctn">
      <LabelInput
        label={`RM: Wod ${index + 1}`}
        name="name"
        {...{ onChange }}
        ph="Nombre"
      />
      <LabelInput label="Tiempo limite" name="time_cap" {...{ onChange }} />
      <p>Tipo de cantidad:</p>
      <div className="btn_toggle_type" onClick={toggleType}>
        <p>{t}</p>
      </div>
    </div>
  );
};

export const CreateEventModal = ({ close, setEvents }) => {
  const [image, setImage] = useState("");
  const [load, setLoad] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    place: "",
    until: "",
    since: "",
  });

  const [categories, setCategories] = useState([]);

  const confirm = async () => {
    if (image && categories.length > 0) {
      const { status, data } = await createEvent(inputs, categories, image);
      if (status === 200) {
        setEvents(prev=>[...prev,data])
        close();
      }
    }
  };

  const plusCateg = () => {
    setCategories([...categories, []]);
  };
  const updateCateg = (value, index) => {
    let aux = [...categories];
    aux[index] = value;
    setCategories(aux);
  };

  const handleFile = async (e) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      setImage(base64);
    }
  };
  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>CREAR EVENTO</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        <div className="img_ctn">
          <label htmlFor="img">IMAGEN</label>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={handleFile}
          />
        </div>
        <div className="cem_form">
          <InputLabel
            name="name"
            label="NOMBRE"
            set={setInputs}
            value={inputs.name}
          />
          <InputLabel
            name="place"
            label="UBICACION"
            set={setInputs}
            value={inputs.place}
          />
          <InputDate
            name="since"
            label="FECHA INICIO"
            set={setInputs}
            value={inputs.since}
          />
          <InputDate
            name="until"
            label="FECHA CIERRE"
            set={setInputs}
            value={inputs.until}
          />
          {categories.map((categ, index) => (
            <InputArray
              name={`categ ${index + 1}`}
              label={`Categoría ${index + 1}`}
              update={updateCateg}
              value={categ}
              index={index}
              key={index}
            />
          ))}
        </div>
        <div className="bottom_ctn">
          <div className="btn_plus_categ" onClick={plusCateg}>
            <h6>Añadir categorias</h6>
          </div>
          <button className="btn_confirm" onClick={confirm} disabled={load}>
            {load ? <h6>Creando Evento...</h6> : <h6>Crear Evento</h6>}
          </button>
        </div>
      </div>
    </div>
  );
};

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
const CrossIcon = () => {
  return (
    <svg
      width={32}
      height={32}
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
    </svg>
  );
};

const InputLabel = ({ name, label, value, set }) => {
  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    set((prev) => ({ ...prev, [att]: value }));
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};
const InputDate = ({ name, label, value, set }) => {
  const onChangeText = (e) => {
    const att = e.target.getAttribute("name");
    const value = e.target.value;
    set((prev) => ({ ...prev, [att]: value }));
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        type="date"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};
const InputTime = ({ name, label, value, update, index }) => {
  const onChangeText = (e) => {
    update(e.target.value, index);
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        step={1}
        type="time"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

const InputArray = ({ name, label, value, update, index }) => {
  const onChangeText = (e) => {
    const value = e.target.value;
    update(value, index);
  };
  return (
    <div className="input_label">
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        onChange={onChangeText}
        value={value}
      />
    </div>
  );
};

const IconLoad = ({ size = "20", color = "#fff" }) => {
  return (
    <svg
      className="icon_load"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="2.4"
        cy="12"
        r="2.4"
        transform="rotate(-90 2.4 12)"
        fill={color}
        fillOpacity="0.8"
      />
      <circle
        cx="12.0001"
        cy="21.6001"
        r="2.4"
        transform="rotate(-90 12.0001 21.6001)"
        fill={color}
        fillOpacity="0.6"
      />
      <circle
        cx="21.6"
        cy="12"
        r="2.4"
        transform="rotate(-90 21.6 12)"
        fill={color}
        fillOpacity="0.4"
      />
      <circle
        cx="12.0001"
        cy="2.4"
        r="2.4"
        transform="rotate(-90 12.0001 2.4)"
        fill="#191919"
      />
      <circle
        cx="5.21174"
        cy="18.7882"
        r="2.4"
        transform="rotate(-45 5.21174 18.7882)"
        fill={color}
        fillOpacity="0.7"
      />
      <circle
        cx="18.7882"
        cy="18.7883"
        r="2.4"
        transform="rotate(-45 18.7882 18.7883)"
        fill={color}
        fillOpacity="0.5"
      />
      <circle
        cx="18.7882"
        cy="5.21178"
        r="2.4"
        transform="rotate(-45 18.7882 5.21178)"
        fill={color}
        fillOpacity="0.3"
      />
      <circle
        cx="5.21174"
        cy="5.21178"
        r="2.4"
        transform="rotate(-45 5.21174 5.21178)"
        fill={color}
        fillOpacity="0.9"
      />
    </svg>
  );
};
const blankwod = {
  amount_cap: 0,
  amount_type: "Reps",
  name: "",
  time_cap: '00:00:00',
  wod_type: 1,
};
export const EditWodsModal = ({ close, event, categ,setEvents,events }) => {
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
        time_cap: moment.duration(item.time_cap, "HH:mm:ss").asSeconds(),
      };
    });
    const { status, data } = await updateWods(
      event._id,
      event.categories[categ - 1]._id,
      newWods
    );
    setLoad(false);
    if (status === 200) {
      let newEvents = events.map((ev,i)=>{
        if(ev._id === event._id){
          return data
        }else{
          return ev
        }
      })
      setEvents(newEvents)
      // console.log(data)
      close();
      console.log("YAY");
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
      if (i === index)
        return { ...blankwod, wod_type: rType(value), name: w.name };
      else return w;
    });
    setWods(aux);
  };
  const handleAmountType = (value, index) => {
    let aux = [...wods];
    aux[index].amount_type = value === "Reps" ? "Lbs" : "Reps";
    setWods(aux);
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
          <div className="btn_plus_categ" onClick={removeLastWod}>
            <h6>Eliminar Ultimo WOD</h6>
          </div>
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? <h6>Editando Wods...</h6> : <h6>Editar WODS</h6>}
          </button>
        </div>
      </div>
    </div>
  );
};
const wtf2 = ["a", "b", "c", "d", "e"];
// const InputsWOD_AMRAP = ({handleName,handleTime,handleType}) => {
//   return (
//     <div className="inputs_wod_ctn">
//       <h6 className="title">WOD 1: AMRAP</h6>
//       <div className="inputs_wod_form">
//         <InputLabel label="NOMBRE" />
//         <InputTime label="TIEMPO LIMITE" />
//       </div>
//     </div>
//   );
// };
// const InputsWOD_FORTIME = ({handleName,handleTime,handleType,handleReps}) => {
//   return (
//     <div className="inputs_wod_ctn">
//       <h6 className="title">WOD 2: FORTIME</h6>
//       <div className="inputs_wod_form">
//         <InputLabel label="NOMBRE" />
//         <InputTime label="TIEMPO LIMITE" />
//         <InputLabel label="REPS LIMITE" />
//       </div>
//     </div>
//   );
// };
// const InputsWOD_RM = ({handleName,handleTime,handleType}) => {
//   return (
//     <div className="inputs_wod_ctn">
//       <h6 className="title">WOD 3: RM</h6>
//       <div className="inputs_wod_form">
//         <InputLabel label="NOMBRE" />
//         <InputTime label="TIEMPO LIMITE" />
//       </div>
//     </div>
//   );
// };

const InputsWOD = ({
  wod,
  index,
  handleName,
  handleTime,
  handleType,
  handleReps,
  handleAmountType,
}) => {
  const hType = () => {
    handleType(wod.wod_type, index);
  };
  const haType = () => {
    handleAmountType(wod.amount_type, index);
  };

  const hTime = (e) => {
    console.log(e);
  };

  return (
    <div className="inputs_wod_ctn">
      <h6 className="title" onClick={hType}>
        WOD {index + 1}: {rTypeName(wod.wod_type)}
      </h6>
      <div className="inputs_wod_form">
        <InputArray
          label="NOMBRE"
          update={handleName}
          index={index}
          value={wod.name}
        />
        <InputTime
          label="TIEMPO LIMITE"
          update={handleTime}
          index={index}
          value={wod.time_cap}
        />
        {wod.wod_type === 2 && (
          <InputArray
            label={`${wod.amount_type.toUpperCase()} LIMITE`}
            update={handleReps}
            index={index}
            value={wod.amount_cap}
          />
        )}
        {wod.wod_type === 2 && (
          <h5 onClick={haType}>{wod.amount_type.toUpperCase()}</h5>
        )}
      </div>
    </div>
  );
};

const rType = (num) => {
  if (num === 1) return 2;
  else if (num === 2) return 3;
  else if (num === 3) return 1;
};
const rTypeName = (num) => {
  if (num === 1) return "AMRAP";
  else if (num === 2) return "FORTIME";
  else if (num === 3) return "RM";
};

const convSeconds = (s)=>moment.utc(s * 1000).format("HH:mm:ss")
const convTime = (s)=>moment.duration(s, "HH:mm:ss").asSeconds()

export const EditResultsModal = ({ close, event, categ, teams,setTeams }) => {
  const [windex, setWindex] = useState(null);
  const [load, setLoad] = useState(false);
  const [list, setList] = useState([]);

  const chooseWod = (index) => {
    setWindex(index);
  };

  const click = async () => {
    // console.log(event.categories[categ - 1].wods[windex].wod_type);
    // console.log(teams[0].wods[0]);
    setLoad(true);
    let newList = list.map((item) => {
      return {
        ...item,
        time: convTime(item.time),
        tiebrake: convTime(item.tiebrake),
        amount: parseInt(item.amount),
      };
    });
    const {status,data} = await updateResults(newList,windex)
    setLoad(false)
    if(status === 200){
      setTeams(data)
      close()
    }
    // console.log(newList)
  };

  useEffect(() => {
    if(windex !== null){
      let aux = teams.filter(
        (t) => t.category_id === event.categories[categ - 1]._id
      );
      let selecWod = event.categories[categ - 1].wods[windex]
      let wt = selecWod.wod_type
      let infoTeams = aux.map((t, i) => {
        if (t.wods[windex].amount === undefined) {
          let at = selecWod.amount_type;
          if(wt === 1 || wt === 3){
            return { ...blankResults, _id: t._id, name: t.name, amount_type: at,tiebrake:'00:00:00',time:convSeconds(selecWod.time_cap),wt }
          }
          else if (wt===2){
            return { ...blankResults, _id: t._id, name: t.name, amount_type: at,tiebrake:'00:00:00',time:'00:00:00',wt };
          }
        } else {
          return { ...t.wods[windex], _id: t._id, name: t.name,wt,tiebrake:convSeconds(t.wods[windex].tiebrake),time:convSeconds(t.wods[windex].time)};
        }
      });
      console.log(infoTeams);
      setList(infoTeams);
    }
  }, [windex]);

  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>EDITAR RESULTADOS</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        {windex === null ? (
          <SelectWod
            wods={event.categories[categ - 1].wods}
            chooseWod={chooseWod}
          />
        ) : (
          <UsersList {...{ event, categ, teams, windex,list, setList }} />
        )}
        <div className="mt_auto"></div>
        <div className="bottom_ctn">
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? (
              <h6>Editando Resultados...</h6>
            ) : (
              <h6>Editar Resultados</h6>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectWod = ({ wods, chooseWod }) => {
  return (
    <div className="select_wod">
      <h6>Selecciona un WOD</h6>
      <div className="wod_list">
        {wods.map((w, i) => (
          <div
            className="select_wod_item"
            key={i}
            onClick={() => {
              chooseWod(i);
            }}
          >
            <h6>{w.name}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};
const blankResults = {
  amount: 0,
  tiebrake: 0,
  time: 0,
};
//moment.duration(item.time_cap, "HH:mm:ss").asSeconds()
//moment.utc(w.time_cap * 1000).format("HH:mm:ss")
const UsersList = ({ event, categ, windex,list, setList }) => {
  
  

  const hReps = (value,index)=>{
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, amount: value };
      else return t;
    });
    setList(aux);
  }
  const hTiebrake = (value,index)=>{
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, tiebrake: value };
      else return t;
    });
    setList(aux);
  }
  const hTime = (value,index)=>{
    const aux = list.map((t, i) => {
      if (i === index) return { ...t, time: value };
      else return t;
    });
    setList(aux);
  }

  return (
    <div className="users_list">
      <h6 >{event.categories[categ - 1].wods[windex].name}</h6>
      {list.map((user, i) => (
        <RU_Input
          key={user._id}
          user={user}
          wod_type={user.wt}
          {...{ event, categ, windex,hReps,hTime,hTiebrake,index:i }}
        />
      ))}
    </div>
  );
};

const RU_Input = ({ user, wod_type, windex, event, categ,hReps,hTime,hTiebrake,index }) => {
  return (
    <div className="ru_ctn">
      <h5>{user.name}</h5>
      <div className="ru_inputs">
        <InputArray label="REPS" value={user.amount} update={hReps} index={index} />
        {wod_type === 2 && <InputTime label="TIEMPO" value={user.time} update={hTime} index={index} />}
        <InputTime label="TIEBRAKE" value={user.tiebrake} update={hTiebrake} index={index} />
      </div>
    </div>
  );
};

export const EditTeamsModal = ({ close, event, categ,set }) => {
  const [load, setLoad] = useState(false);
  const [teams, setTeams] = useState([]);

  const pushTeam = () => {
    setTeams([...teams, { name: "", box: "" }]);
  };

  const updateName = (value, index) => {
    const aux = teams.map((t, i) => {
      if (i === index) return { ...t, name: value };
      else return t;
    });
    setTeams(aux);
  };
  const updateBox = (value, index) => {
    const aux = teams.map((t, i) => {
      if (i === index) return { ...t, box: value };
      else return t;
    });
    setTeams(aux);
  };

  const click = async () => {
    // console.log(set)
    // set([])
    setLoad(true)
    const {status,data} = await plusTeams(event._id,event.categories[categ-1]._id,teams)
    setLoad(false)
    if(status === 200){
      set(prev=>[...prev,...data])
      close()
    }
  };


  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>AÑADIR EQUIPOS</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        <div className="plus_teams_ctn">
          {teams.map((t, i) => (
            <div className="plus_team" key={i}>
              <InputArray index={i} update={updateName} label="NOMBRE" />
              <InputArray index={i} update={updateBox} label="BOX" />
            </div>
          ))}
        </div>
        <div className="mt_auto"></div>
        <div className="bottom_ctn">
          <div className="btn_plus_categ" onClick={pushTeam}>
            <h6>Agregar Equipo</h6>
          </div>
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? <h6>Añadiendo Equipos...</h6> : <h6>Añadir Equipos</h6>}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlusTeamsList = ({ teams }) => {
  return <div className="plus_teams_"></div>;
};
