import { useRef } from "react";
import { useState } from "react";
import {
  Modal,
  InputArray,
  CrossIcon,
  InputDate,
  InputLabel,
} from "./ModalTools";
import "../../sass/modals/createEventModal.sass";
import { createEvent } from "../../api/events.api";

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

const resetValues = {
  name: "",
  place: "",
  until: "",
  since: "",
  accesible:true,
}

const testValues = {
  name: "Test01",
  place: "Very long text for a very long place idk",
  until: "2024-04-03",
  since: "2024-03-02",
  accesible:true,
}

export const CreateEventModal = ({ close, setEvents }) => {
  const [image, setImage] = useState(null);
  const [partners, setPartners] = useState(null);
  const [load, setLoad] = useState(false);
  const [inputs, setInputs] = useState(resetValues);
  const [categories, setCategories] = useState([]);

  const validation = ()=>{
    let bool = true
    if(!image || !image[0]) bool = false
    if(inputs.name.length <= 0) bool = false
    if(inputs.place.length <= 0) bool = false
    if(inputs.until.length <= 0) bool = false
    if(inputs.since.length <= 0) bool = false
    if(categories.length <= 0) bool = false
    return bool
  }

  const confirm = async () => {
    setLoad(true);
    if (validation()) {
      const { status, data } = await createEvent(inputs, categories, image,partners);
      setLoad(false);
      if (status === 200) {
        setEvents((prev) => [...prev, data]);
        close();
      } else {
        alert(data.msg)
      }
    }else setLoad(false)
  };

  const plusCateg = () => {
    setCategories([...categories, []]);
  };
  const minusCateg = (index) => {
    let aux = [...categories];
    aux.splice(index, 1);
    setCategories([...aux]);
  };
  const updateCateg = (value, index) => {
    let aux = [...categories];
    aux[index] = value;
    setCategories(aux);
  };

  return (
    <Modal title="CREAR EVENTO" close={close}>
      <CEMImageInput
        image={image}
        index={0}
        set={setImage}
        label="IMAGEN DE EVENTO"
      />
      <CEMCheckbox {...{inputs,setInputs}} />
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
        <CategoriesInput
          {...{ categories, updateCateg, plusCateg, minusCateg }}
        />
        <div className="cem_partners">
          {partners === null ? (
            <CEMImageInput
              image={partners}
              index={0}
              set={setPartners}
              label="PATROCINANTE 1"
            />
          ) : (
            <>
              {partners?.map((p, index) => (
                <CEMImageInput
                  image={partners}
                  index={index}
                  set={setPartners}
                  label={`PATROCINANTE ${index + 1}`}
                  key={index}
                />
              ))}
            </>
          )}
          {partners?.length < 3 && (
            <CEMImageInput
              image={partners}
              index={partners.length + 1}
              set={setPartners}
              label={`PATROCINANTE ${partners.length + 1}`}
            />
          )}
        </div>
      </div>
      <BottomBtns {...{ plusCateg, confirm, load }} />
    </Modal>
  );
};

const BottomBtns = ({ plusCateg, confirm, load }) => {
  return (
    <div className="bottom_ctn">
      {/* <div className="btn_plus_categ" onClick={plusCateg}>
        <h6>Añadir categorias</h6>
      </div> */}
      <button className="btn_confirm" onClick={confirm} disabled={load}>
        {load ? <h6>Creando Evento...</h6> : <h6>Crear Evento</h6>}
      </button>
    </div>
  );
};

const CategoriesInput = ({
  categories,
  updateCateg,
  plusCateg,
  minusCateg,
}) => {
  return (
    <>
      <div style={{ height: 12, width: "100%" }}></div>
      {categories.map((categ, index) => (
        <InputArray
          name={`categ ${index + 1}`}
          label={`Categoría ${index + 1}`}
          update={updateCateg}
          value={categ}
          index={index}
          key={index}
          minus={minusCateg}
        />
      ))}
      {categories.length % 2 === 0 ? null : (
        <div style={{ height: 12, width: "50%" }}></div>
      )}
      <div className="btn_plus_categ" onClick={plusCateg}>
        <h6>Añadir categorias</h6>
      </div>
    </>
  );
};

const CEMImageInput = ({ image, index, set, label = "" }) => {
  const ref = useRef(null);
  const clickInputImg = () => ref.current.click();

  const handleFile = async (e) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      let aux = image ? [...image] : [];
      aux.splice(index, 1, base64);
      set(aux);
    }
  };

  const remove = () => {
    let aux = image ? [...image] : [];
    if (aux.length === 1) aux = [];
    else aux.splice(index, 1);
    set(aux);
  };
  return (
    <div className="img_ctn">
      <div className="top">
        <label htmlFor="img">{label}</label>
        {image && image[index] ? (
          <div onClick={remove}>
            <CrossIcon />
          </div>
        ) : null}
      </div>
      {image && image[index] ? (
        <img src={image[index]} onClick={clickInputImg} />
      ) : (
        <div className="input_img" onClick={clickInputImg}>
          +
        </div>
      )}
      <input
        ref={ref}
        type="file"
        id="img"
        name="img"
        accept="image/*"
        onChange={handleFile}
      />
    </div>
  );
};

const CEMCheckbox = ({inputs,setInputs}) => {
  return (
    <div
      className="check_event"
      onClick={() => {
        setInputs(prev=>({...prev,accesible:!inputs.accesible}))
      }}
    >

      <label htmlFor="x">EVENTO ACCESIBLE</label>
      {inputs.accesible ? <CheckOpen /> : <CheckClose />}
    </div>
  );
};

const CheckOpen = () => (
  <svg
    clipRule="evenodd"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m21 4.009c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-14.051 8.382c-.165-.148-.249-.352-.249-.557 0-.411.333-.746.748-.746.178 0 .355.063.499.19l3.298 2.938 5.453-5.962c.149-.161.35-.243.554-.243.417 0 .748.337.748.747 0 .179-.065.359-.196.502l-5.953 6.509c-.147.161-.35.242-.552.242-.178 0-.357-.062-.499-.19z"
      fillRule="nonzero"
    />
  </svg>
);

const CheckClose = () => (
  <svg
    clipRule="evenodd"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15z"
      fillRule="nonzero"
    />
  </svg>
);
