import { useState } from "react";
import { editTeams } from "../../api/events.api";
import { CrossIcon } from "./ModalTools";

export const EditTeamsModal = ({
  close,
  event,
  categ,
  setCateg,
  teamsValue,
  set,
}) => {
  const [load, setLoad] = useState(false);
  const [teams, setTeams] = useState(teamsValue ? [...teamsValue] : []);
  const [toDelete, setToDelete] = useState([]);

  const pushTeam = () => {
    setTeams([
      ...teams,
      {
        name: "",
        box: "",
        category_id: event.categories[categ - 1]._id,
        new: true,
      },
    ]);
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
    const filtredTeams = [];
    teams.forEach((t, index) => {
      if (t.category_id === event.categories[categ - 1]._id)
        filtredTeams.push(t);
    });
    // console.log(filtredTeams)
    setLoad(true);
    const { status, data } = await editTeams(
      event._id,
      event.categories[categ - 1]._id,
      filtredTeams,
      toDelete
    );
    setLoad(false);
    if (status === 200) {
      let aux = []
      data.forEach((t, index) => {
        if (t.category_id === event.categories[categ - 1]._id) aux.push(t);
      });
      set([...data]);
      setTeams(aux)
      // close();
    } else {
      alert(data.msg);
    }
  };

  const removeTeam = (index) => {
    let aux = [...teams];
    if (aux[index]._id) {
      let aux2 = [...toDelete, aux[index]._id];
      setToDelete(aux2);
    }
    aux.splice(index, 1);
    setTeams([...aux]);
  };

  return (
    <div className="blackscreen">
      <div className="modal_ctn">
        <div className="modal_top">
          <h6>EDITAR EQUIPOS</h6>
          <div className="cross_ctn" onClick={close}>
            <CrossIcon />
          </div>
        </div>
        <CategoriesSelect {...{ setCateg, categ, event }} />
        <div className="plus_teams_ctn">
          {teams.map((t, i) => {
            if (t.category_id === event.categories[categ - 1]._id) {
              return (
                <div className="plus_team" key={i}>
                  <InputTeam
                    value={t.name}
                    name="name"
                    index={i}
                    update={updateName}
                    label="NOMBRE"
                  />
                  <InputTeam
                    value={t.box}
                    name="box"
                    index={i}
                    update={updateBox}
                    label="BOX"
                  />
                  <div
                    className="plus_team_cross"
                    onClick={() => {
                      removeTeam(i);
                    }}
                  >
                    <CrossIcon />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="mt_auto"></div>
        <div className="bottom_ctn">
          <div className="btn_plus_categ" onClick={pushTeam}>
            <h6>Agregar Equipo</h6>
          </div>
          <button className="btn_confirm" onClick={click} disabled={load}>
            {load ? <h6>Editando Equipos...</h6> : <h6>Editar Equipos</h6>}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputTeam = ({ name, label, value, update, index }) => {
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

const CategoriesSelect = ({ setCateg, categ, event }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <div className="categories_select">
      <div className="categories_select_btn" onClick={toggle}>
        {event && <h6>{event.categories[categ - 1].name}</h6>}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path d="M12 21l-12-18h24z" />
        </svg>
      </div>
      {open && (
        <div className="abs_categories_select">
          {event &&
            event.categories.map((c, index) => (
              <h6
                key={index}
                onClick={() => {
                  setCateg(index + 1);
                  toggle();
                }}
              >
                {c.name}
              </h6>
            ))}
        </div>
      )}
    </div>
  );
};
