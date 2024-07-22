import { useContext, useState } from "react";
import { CategoryType, EventType, TeamType } from "../../types/event.t";
import { CategoriesSelect, CrossIcon, Modal } from "./ModalTools";
import { updateTeams } from "../../api/event.api";
import { Context } from "../Context";

type EditTeamsModal = {
  close: () => void;
  category?: CategoryType;
  setCategory: React.Dispatch<React.SetStateAction<CategoryType | undefined>>;
  event: EventType;
};

const EditTeamsModal = ({
  category,
  setCategory,
  event,
  close,
}: EditTeamsModal) => {
  const { setEvents } = useContext(Context);
  const [teams, setTeams] = useState<TeamType[]>(category?.teams ?? []);
  const [load, setLoad] = useState(false);

  const updateName = (index: number, value: string) => {
    let aux = [...teams];
    aux[index].name = value;
    setTeams(aux);
  };
  const removeTeam = (index: number) => {
    let aux = [...teams];
    aux.splice(index, 1);
    setTeams(aux);
  };

  const pushTeam = () => {
    setTeams([...teams, { name: "", _id: "_", captain: "_", users: [] }]);
  };

  const click = async () => {
    setLoad(true);
    const { status, data } = await updateTeams(teams, category?._id ?? "");
    setLoad(false);
    if (status === 200) {
      setEvents(data);
      close();
    } else {
      alert(data.msg);
    }
  };

  return (
    <Modal title="EDITAR WODS" close={close}>
      {category && <CategoriesSelect {...{ category, setCategory, event }} />}
      <div className="plus_teams_ctn">
        {teams.map((t, i) => {
          return (
            <div className="plus_team" key={i}>
              <InputTeam value={t.name} index={i} update={updateName} />
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
    </Modal>
  );
};

export default EditTeamsModal;

// import { useState } from "react";
// import { editTeams } from "../../api/events.api";
// import { CrossIcon } from "./ModalTools";

// export const EditTeamsModal = ({
//   close,
//   event,
//   cindex,
//   setCindex,
//   teamsValue,
//   set,
// }) => {
//   const [load, setLoad] = useState(false);
//   const [teams, setTeams] = useState(teamsValue ? [...teamsValue] : []);
//   const [toDelete, setToDelete] = useState([]);

//   const pushTeam = () => {
//     setTeams([
//       ...teams,
//       {
//         name: "",
//         box: "",
//         category_id: event.categories[cindex]._id,
//         new: true,
//       },
//     ]);
//   };

//   const updateName = (value, index) => {
//     const aux = teams.map((t, i) => {
//       if (i === index) return { ...t, name: value };
//       else return t;
//     });
//     setTeams(aux);
//   };
//   const updateBox = (value, index) => {
//     const aux = teams.map((t, i) => {
//       if (i === index) return { ...t, box: value };
//       else return t;
//     });
//     setTeams(aux);
//   };

//   const removeTeam = (index) => {
//     let aux = [...teams];
//     if (aux[index]._id) {
//       let aux2 = [...toDelete, aux[index]._id];
//       setToDelete(aux2);
//     }
//     aux.splice(index, 1);
//     setTeams([...aux]);
//   };

//   const click = async () => {
//     const filtredTeams = [];
//     teams.forEach((t, index) => {
//       if (t.category_id === event.categories[cindex]._id)
//         filtredTeams.push(t);
//     });
//     setLoad(true);
//     const { status, data } = await editTeams(
//       event._id,
//       event.categories[cindex]._id,
//       filtredTeams,
//       toDelete
//     );
//     setLoad(false);
//     if (status === 200) {
//       let aux = []
//       data.forEach((t, index) => {
//         if (t.category_id === event.categories[cindex]._id) aux.push(t);
//       });
//       set([...data]);
//       setTeams([...data])
//       // close();
//     } else {
//       alert(data.msg);
//     }
//   };

//   return (
//     <div className="blackscreen">
//       <div className="modal_ctn">
//         <div className="modal_top">
//           <h6>EDITAR EQUIPOS</h6>
//           <div className="cross_ctn" onClick={close}>
//             <CrossIcon />
//           </div>
//         </div>
//         <CategoriesSelect {...{ setCindex, cindex, event }} />
//         <div className="plus_teams_ctn">
//           {teams.map((t, i) => {
//             if (t.category_id === event.categories[cindex]._id) {
//               return (
//                 <div className="plus_team" key={i}>
//                   <InputTeam
//                     value={t.name}
//                     name="name"
//                     index={i}
//                     update={updateName}
//                     label="NOMBRE"
//                   />
//                   <InputTeam
//                     value={t.box}
//                     name="box"
//                     index={i}
//                     update={updateBox}
//                     label="BOX"
//                   />
//                   <div
//                     className="plus_team_cross"
//                     onClick={() => {
//                       removeTeam(i);
//                     }}
//                   >
//                     <CrossIcon />
//                   </div>
//                 </div>
//               );
//             }
//           })}
//         </div>
//         <div className="mt_auto"></div>
//         <div className="bottom_ctn">
//           <div className="btn_plus_categ" onClick={pushTeam}>
//             <h6>Agregar Equipo</h6>
//           </div>
//           <button className="btn_confirm" onClick={click} disabled={load}>
//             {load ? <h6>Editando Equipos...</h6> : <h6>Editar Equipos</h6>}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
type InputTeamT = {
  value: string;
  update: (index: number, value: string) => void;
  index: number;
};
const InputTeam = ({ value, update, index }: InputTeamT) => {
  const onChangeText = (e: any) => {
    const value = e.target.value;
    update(index, value);
  };
  return (
    <div className="input_label">
      <label htmlFor={`team_inp${index}`}>NOMBRE</label>
      <input
        type="text"
        id={`team_inp_id${index}`}
        name={`team_inp${index}`}
        onChange={onChangeText}
        value={value}
        placeholder="Ej: Los Dinamita"
      />
    </div>
  );
};
