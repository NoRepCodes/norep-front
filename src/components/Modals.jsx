import React, { useEffect } from "react";
import { useState } from "react";
import "../sass/modals.sass";

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

export const CreateEventModal = ({ close, update }) => {
  const [inputs, setInputs] = useState({
    name: "",
    since: "",
    until: "",
    place: "",
    categories: [],
  });
  const onChange = (e) => {
    const att = e.target.getAttribute("name");
    let value = e.target.value;
    setInputs((prev) => ({ ...prev, [att]: value }));
  };

  const plusCategory = () => {
    setInputs({ ...inputs, categories: [...inputs.categories, ""] });
  };

  const ocArr = (value, index) => {
    let aux = [...inputs.categories];
    aux[index] = value;
    setInputs({ ...inputs, categories: aux });
  };

  const confirm = () => {
    if(inputs.categories.length !== 0){
      update(inputs);
    }
  };

  return (
    <Modal title="Crear Evento" close={close}>
      <LabelInput label="Nombre" name="name" {...{ onChange }} />
      <LabelInput label="Inicio" name="since" type="date" {...{ onChange }} />
      <LabelInput label="Cierre" name="until" type="date" {...{ onChange }} />
      <LabelInput label="Ubicacion" name="place" {...{ onChange }} />
      {inputs.categories.map((item, index) => (
        <ArrayInput
          label={`Categoria ${index + 1}`}
          ocArr={ocArr}
          key={index}
          value={item}
          index={index}
        />
      ))}
      <div className="plus_category" onClick={plusCategory}>
        <p>Añadir categoria</p>
      </div>
      <div className="btn" onClick={confirm}>
        <p>Confirmar</p>
      </div>
    </Modal>
  );
};

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
      console.log(wod.wod_type === 3 ?wod.time_cap:0)
      teams.forEach((team) => {
        aux.push({
          amount: 0,
          time:wod.wod_type === 3 ?wod.time_cap:0,
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
    console.log(inputs)
    update(inputs, index - 1);
  };

  if(inputs.length === 0){
    return null
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
