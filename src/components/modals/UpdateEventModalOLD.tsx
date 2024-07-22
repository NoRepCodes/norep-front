// import { useRef } from "react";
// import { useState } from "react";
// import {
//   Modal,
//   InputArray,
//   CrossIcon,
//   InputDate,
//   InputLabel,
// } from "./ModalTools";
// import "../../sass/modals/createEventModal.sass";
// import { deleteEvent, updateEvent } from "../../api/events.api";
// //@ts-ignore
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

// const resetValues = {
//   name: "",
//   place: "",
//   until: "",
//   since: "",
//   accesible: true,
// };

// const testValues = {
//   name: "Test01",
//   place: "Very long text for a very long place idk",
//   until: "2024-04-03",
//   since: "2024-03-02",
//   accesible: true,
// };

// const emptyCategory = {
//   name: "",
//   wods: [],
// };

// const UpdateEventModal = ({
//   event,
//   cindex,
//   close,
//   setEvents,
//   resetTeams,
//   events,
// }) => {
//   // const [oldPartners, setOldPartners] = useState([event.partners])
//   const [image, setImage] = useState([event.secure_url]);
//   const [partners, setPartners] = useState(partnersImages(event));
//   const [load, setLoad] = useState(false);
//   const [load2, setLoad2] = useState(false);
//   const [inputs, setInputs] = useState({
//     name: event.name,
//     place: event.place,
//     until: convertDate(event.until),
//     since: convertDate(event.since),
//     accesible: event.accesible,
//   });
//   const [categories, setCategories] = useState([...event.categories]);
//   const [categToDelete, setCategToDelete] = useState([]);

//   const navigate = useNavigate();

//   const validation = () => {
//     let bool = true;
//     if (!image || !image[0]) bool = false;
//     if (inputs.name.length <= 0) bool = false;
//     if (inputs.place.length <= 0) bool = false;
//     if (inputs.until.length <= 0) bool = false;
//     if (inputs.since.length <= 0) bool = false;
//     if (categories.length <= 0) bool = false;
//     return bool;
//   };

//   const confirm = async () => {
//     // setLoad(true);
//     if (validation()) {
//       /// SET IMAGES TO DELETE IN CASE IS NOT IN THE NEY ARRAY
//       let toDelete = [];
//       event.partners.forEach((item) => {
//         if (!partners.find((img) => img === item.secure_url))
//           toDelete.push(item.public_id);
//       });
//       let newImage;
//       if (image[0] !== event.secure_url) {
//         toDelete.push(event.public_id);
//         newImage = image[0];
//       } else {
//         newImage = { secure_url: event.secure_url, public_id: event.public_id };
//       }

//       let newPartners = [];
//       partners.forEach((p) => {
//         if (checkCloudinary(p)) {
//           let indexof = event.partners.findIndex((elm) => elm.secure_url === p);
//           newPartners.push(event.partners[indexof]);
//         } else newPartners.push(p);
//       });
//       const { status, data } = await updateEvent(
//         inputs,
//         categories,
//         newImage,
//         newPartners,
//         toDelete,
//         event._id,
//         categToDelete
//       );
//       setLoad(false);
//       if (status === 200) {
//         setEvents((prev) =>
//           prev.map((ev, i) => {
//             if (ev._id === event._id) {
//               return data;
//             } else {
//               return ev;
//             }
//           })
//         );
//         if (categToDelete.length > 0) await resetTeams();
//         close();
//       } else {
//         alert(data.msg);
//       }
//     } else setLoad(false);
//   };

//   const plusCateg = () => {
//     setCategories([...categories, {...emptyCategory}]);
//   };
//   const minusCateg = (index) => {
//     let aux = [...categories];
//     // Find if there is a category to get his ID and delete teams after
//     let exist = event.categories.findIndex(
//       (elm) => elm.name === aux[index].name
//     );
//     if (exist >= 0 ? true : false) {
//       let aux2 = [...categToDelete];
//       aux2.push(event.categories[exist]._id);
//       setCategToDelete(aux2);
//     }
//     aux.splice(index, 1);
//     setCategories([...aux]);
//   };
//   const updateCateg = (value, index) => {
//     let aux = [...categories];
//     aux[index].name = value;
//     setCategories(aux);
//   };
//   const deleteEventClick = async () => {
//     setLoad2(true);
//     const { status, data } = await deleteEvent(event);
//     setLoad2(false);
//     if (status === 200) {
//       let aux = [...events];
//       let indexof = aux.findIndex((ev) => ev._id === event._id);
//       aux.splice(indexof, 1);
//       setEvents(aux);
//       navigate("/");
//       close();
//     } else {
//       alert(data.msg);
//     }
//   };

//   return (
//     <Modal title="EDITAR EVENTO" close={close}>
//       <CEMImageInput
//         image={image}
//         index={0}
//         set={setImage}
//         label="IMAGEN DE EVENTO"
//       />
//       <CEMCheckbox {...{ inputs, setInputs }} />
//       <div className="cem_form">
//         <InputLabel
//           name="name"
//           label="NOMBRE"
//           set={setInputs}
//           value={inputs.name}
//         />
//         <InputLabel
//           name="place"
//           label="UBICACION"
//           set={setInputs}
//           value={inputs.place}
//         />
//         <InputDate
//           name="since"
//           label="FECHA INICIO"
//           set={setInputs}
//           value={inputs.since}
//         />
//         <InputDate
//           name="until"
//           label="FECHA CIERRE"
//           set={setInputs}
//           value={inputs.until}
//         />
//         <CategoriesInput
//           {...{ categories, updateCateg, plusCateg, minusCateg }}
//         />
//         <div className="cem_partners">
//           {partners === null ? (
//             <CEMImageInput
//               image={partners}
//               index={0}
//               set={setPartners}
//               label="PATROCINANTE 1"
//             />
//           ) : (
//             <>
//               {partners?.map((p, index) => (
//                 <CEMImageInput
//                   image={partners}
//                   index={index}
//                   set={setPartners}
//                   label={`PATROCINANTE ${index + 1}`}
//                   key={index}
//                 />
//               ))}
//             </>
//           )}
//           {partners?.length < 3 && (
//             <CEMImageInput
//               image={partners}
//               index={partners.length + 1}
//               set={setPartners}
//               label={`PATROCINANTE ${partners.length + 1}`}
//             />
//           )}
//         </div>
//       </div>
//       <BottomBtns {...{ confirm, load, deleteEventClick, load2 }} />
//     </Modal>
//   );
// };

// const BottomBtns = ({ confirm, load, deleteEventClick, load2 }) => {
//   return (
//     <div className="bottom_ctn">
//       <button
//         className="btn_plus_categ"
//         onClick={deleteEventClick}
//         disabled={load2}
//       >
//         {load2 ? <h6>Eliminando Evento...</h6> : <h6>Eliminar Evento</h6>}
//       </button>
//       <button className="btn_confirm" onClick={confirm} disabled={load}>
//         {load ? <h6>Actualizando Evento...</h6> : <h6>Actualizar Evento</h6>}
//       </button>
//     </div>
//   );
// };

// const CategoriesInput = ({
//   categories,
//   updateCateg,
//   plusCateg,
//   minusCateg,
// }) => {
//   return (
//     <>
//       <div style={{ height: 12, width: "100%" }}></div>
//       {categories.map((categ, index) => (
//         <InputArray
//           name={`categ ${index + 1}`}
//           label={`Categoría ${index + 1}`}
//           update={updateCateg}
//           value={categ.name}
//           index={index}
//           key={index}
//           minus={minusCateg}
//         />
//       ))}
//       {categories.length % 2 === 0 ? null : (
//         <div style={{ height: 12, width: "50%" }}></div>
//       )}
//       <div className="btn_plus_categ" onClick={plusCateg}>
//         <h6>Añadir categorias</h6>
//       </div>
//     </>
//   );
// };

// const CEMImageInput = ({ image, index, set, label = "" }) => {
//   const ref = useRef(null);
//   const clickInputImg = () => ref.current.click();

//   const handleFile = async (e) => {
//     if (e.target.files) {
//       const base64 = await convertBase64(e.target.files[0]);
//       let aux = image ? [...image] : [];
//       aux.splice(index, 1, base64);
//       set(aux);
//     }
//   };

//   const remove = () => {
//     let aux = image ? [...image] : [];
//     if (aux.length === 1) aux = [];
//     else aux.splice(index, 1);
//     set(aux);
//   };
//   return (
//     <div className="img_ctn">
//       <div className="top">
//         <label htmlFor="img">{label}</label>
//         {image && image[index] ? (
//           <div onClick={remove}>
//             <CrossIcon />
//           </div>
//         ) : null}
//       </div>
//       {image && image[index] ? (
//         <img src={image[index]} onClick={clickInputImg} />
//       ) : (
//         <div className="input_img" onClick={clickInputImg}>
//           +
//         </div>
//       )}
//       <input
//         ref={ref}
//         type="file"
//         id="img"
//         name="img"
//         accept="image/*"
//         onChange={handleFile}
//       />
//     </div>
//   );
// };

// const CEMCheckbox = ({ inputs, setInputs }) => {
//   return (
//     <div
//       className="check_event"
//       onClick={() => {
//         setInputs((prev) => ({ ...prev, accesible: !inputs.accesible }));
//       }}
//     >
//       <label htmlFor="x">EVENTO ACCESIBLE</label>
//       {inputs.accesible ? <CheckOpen /> : <CheckClose />}
//     </div>
//   );
// };

// const checkCloudinary = (link) => /res\.cloudinary/gm.test(link);

// const convertBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// };
// const convertDate = (date) => moment.unix(date).format("YYYY-MM-DD");
// const categoriesName = (event) => {
//   let arr = [];
//   event.categories.forEach((categ) => {
//     arr.push(categ.name);
//   });
//   return arr;
// };
// const partnersImages = (event) => {
//   let arr = [];
//   event.partners.forEach((p) => {
//     arr.push(p.secure_url);
//   });
//   return arr;
// };

// const CheckOpen = () => (
//   <svg
//     clipRule="evenodd"
//     fillRule="evenodd"
//     strokeLinejoin="round"
//     strokeMiterlimit="2"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="m21 4.009c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-14.051 8.382c-.165-.148-.249-.352-.249-.557 0-.411.333-.746.748-.746.178 0 .355.063.499.19l3.298 2.938 5.453-5.962c.149-.161.35-.243.554-.243.417 0 .748.337.748.747 0 .179-.065.359-.196.502l-5.953 6.509c-.147.161-.35.242-.552.242-.178 0-.357-.062-.499-.19z"
//       fillRule="nonzero"
//     />
//   </svg>
// );

// const CheckClose = () => (
//   <svg
//     clipRule="evenodd"
//     fillRule="evenodd"
//     strokeLinejoin="round"
//     strokeMiterlimit="2"
//     viewBox="0 0 24 24"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15z"
//       fillRule="nonzero"
//     />
//   </svg>
// );

// export default UpdateEventModal