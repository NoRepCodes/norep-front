import { useState } from "react";
import { editTeams } from "../../api/events.api";
import { CrossIcon } from "./ModalTools";

export const EditTeamsModal = ({ close, event, categ, teamsValue, set }) => {
  const [load, setLoad] = useState(false);
  const [teams, setTeams] = useState(teamsValue ? teamsValue : []);
  const [toDelete, setToDelete] = useState([]);

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
    const filtredTeams = [];
    teams.forEach((t, index) => {
      if (!t._id) filtredTeams.push(t)
    });
    setLoad(true);
    const { status, data } = await editTeams(
      event._id,
      event.categories[categ - 1]._id,
      filtredTeams,
      toDelete
    );
    setLoad(false);
    if (status === 200) {
      let aux = teams.map((t, index) => {
        if (!toDelete.includes(t._id)) return t;
      });
      set([...aux, ...data]);
      close();
    }else {
      alert(data.msg)
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
        <div className="plus_teams_ctn">
          {teams.map((t, i) => (
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
          ))}
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
