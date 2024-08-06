import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Modal, CrossIcon, InputDate } from "./ModalTools";
import "../../sass/modals/createEventModal.sass";
import { createEvent, updateEvent } from "../../api/event.api";
import {
  CategoryType,
  EventType,
  ImageType,
  KeyByString,
  TeamType,
} from "../../types/event.t";
//@ts-ignore
import moment from "moment";
import { Context } from "../Context";

const emptyCateg = {
  teams: [],
  name: "",
  updating: false,
  price: 0,
  filter_age: false,
  filter_genre: false,
  filter_amount: false,
  filter_limit: false,
  filter: {
    limit: 0,
    male: 0,
    female: 0,
    amount: 0,
    age_min: 0,
    age_max: 0,
  },
};
type ConvertBase64T = (file: Blob) => Promise<string | ArrayBuffer | null>;
const convertBase64: ConvertBase64T = (file) => {
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

type EventModalT = {
  close: () => void;
  event?: EventType;
};

type CEMImgT = {
  image: ImageType[];
  index: number;
  set: Dispatch<ImageType[]>;
  label: string;
};

type CEMCheckboxT = {
  inputs: InputEventT;
  setInputs: Dispatch<InputEventT>;
  name: string;
  label: string;
};
type InputEventT = KeyByString & {
  name: string;
  // since: string | number;
  // until: string | number;
  since: string;
  until: string;
  place: string;
  accesible: boolean;
  manual_teams: boolean;
  register_time: {
    since: string;
    until: string;
  };
};

type InputCategT = KeyByString & {
  teams: TeamType[];
  name: string;
  updating: boolean;
  price: number;
  filter_age: boolean;
  filter_genre: boolean;
  filter_amount: boolean;
  filter_limit: boolean;
  filter?: {
    male?: number;
    female?: number;
    age_min?: number;
    age_max?: number;
    amount?: number;
    limit?: number;
  };
};
type ConvertCategT = (categ: CategoryType[]) => InputCategT[];

type CEMInputT = {
  name: string;
  label: string;
  set?: Dispatch<SetStateAction<InputEventT>>;
  custom?: (text: any) => void;
  value: string;
};

type CategFilterCheckP = {
  name: string;
  label: string;
  category: InputCategT;
  index: number;
  set: Dispatch<SetStateAction<InputCategT[]>>;
  disabled?: boolean;
};

type CategoryInputP = {
  category: InputCategT;
  set: Dispatch<SetStateAction<InputCategT[]>>;
  index: number;
  manual_teams: boolean;
  minusCateg: (index: number) => void;
};

const EventModal = ({ close, event }: EventModalT) => {
  const eventFormat: EventType = {
    _id: event?._id,
    name: event?.name ?? "",
    price: event?.price ?? 0,
    since: event?.since ?? "",
    until: event?.until ?? "",
    dues: event?.dues ?? 1,
    place: event?.place ?? "",
    secure_url: event?.secure_url ?? "",
    public_id: event?.public_id ?? "",
    accesible: event?.accesible ?? false,
    partners: event?.partners ?? [],
    categories: event?.categories ?? [],
    manual_teams: event?.manual_teams ?? false,
    register_time: event?.register_time ?? {
      since: "",
      until: "",
    },
  };

  return (
    <UpdateEventModal
      {...{
        close,
        edit: event ? true : false,
        evnt: { ...eventFormat },
      }}
    />
  );
};

const convertCateg: ConvertCategT = (categ) => {
  return categ.map((c) => {
    return {
      ...c,
      filter_age: c.filter?.age_max && c.filter?.age_max ? true : false,
      filter_amount: c.filter?.amount ? true : false,
      filter_limit: c.filter?.limit ? true : false,
      filter_genre: c.filter?.male && c.filter?.female ? true : false,
    };
  });
};

const UpdateEventModal = ({
  close,
  evnt,
  edit,
}: EventModalT & { evnt: EventType; edit: boolean }) => {
  const {
    secure_url,
    public_id,
    categories: categ,
    partners: partn,
    ...others
  } = evnt;
  const { setEvents, setMsg } = useContext(Context);
  const [image, setImage] = useState<ImageType[]>([{ secure_url, public_id }]);
  const [inputs, setInputs] = useState<InputEventT>({ ...others });
  const [categories, setCategories] = useState<InputCategT[]>(
    convertCateg(categ)
  );
  const [partners, setPartners] = useState<ImageType[]>([...partn]);
  const [load, setLoad] = useState(false);

  const validation = () => {
    if (!image || !image[0]) return "No se han añadido una imagen al evento";
    if (inputs.name.length <= 0) return "El nombre no puede estar vacío";
    if (inputs.place.length <= 0) return "La ubicación no puede estar vacía";
    if (typeof inputs.until === "string" && inputs.until.length <= 0)
      return "La fecha de cierre no puede estar vacía";
    if (typeof inputs.since === "string" && inputs.since.length <= 0)
      return "La fecha de inicio no puede estar vacía";
    if (categories.length <= 0)
      return "El evento debe tener almenos 1 categoría";
    let aux = undefined;
    categories.forEach((c) => {
      if (c.filter) {
        if ((c.filter.age_min ?? 0) > (c.filter.age_max ?? 0))
          aux = "Los limites de edad no coinciden (Min - Max)";
        if (c.filter_genre && c.filter_amount) {
          if ((c.filter.male ?? 0) + (c.filter.female ?? 0) !== c.filter.amount)
            aux = "El límite de género e Integrantes por equipo no coinciden";
        }
      }
    });
    if (aux) return aux;
    return undefined;
  };

  const confirm = async () => {
    const err = validation();
    if (err !== undefined)
      return setMsg({
        msg: err,
        type: "error",
        open: true,
      });
    const eventInfo = retrieveEventInfo(inputs, categories, image, partners);
    // console.log(eventInfo);
    setLoad(true);
    const { status, data } = edit
      ? await updateEvent(eventInfo)
      : await createEvent(eventInfo);
    setLoad(false);
    if (status === 200) {
      setEvents(data);
      setMsg({
        msg: edit
          ? "Evento actualizado con exito!"
          : "Evento creado con exito!",
        type: "success",
        open: true,
      });
      close();
    } else {
      setMsg({
        msg: data.msg,
        type: "error",
        open: true,
      });
    }
  };

  const plusCateg = () => {
    console.log({...emptyCateg});
    setCategories([...categories, { ...emptyCateg }]);
  };
  const minusCateg = (index: number) => {
    let aux = [...categories];
    aux.splice(index, 1);
    setCategories([...aux]);
  };

  const ocSince = (v: string) =>
    setInputs({
      ...inputs,
      register_time: { ...inputs.register_time, since: v },
    });
  const ocUntil = (v: string) =>
    setInputs({
      ...inputs,
      register_time: { ...inputs.register_time, until: v },
    });
  const ocDues = (v: string) => {
    if (v.match(/^[1-9]$/gm)) {
      setInputs({ ...inputs, dues: v });
    }
  };

  return (
    <Modal title={edit ? "EDITAR EVENTO" : "CREAR EVENTO"} close={close}>
      <div className="create_evnt_ctn">
        <CEMImageInput
          image={image}
          index={0}
          set={setImage}
          label="IMAGEN DE EVENTO"
        />
        <div style={{ height: 12 }} />
        <CEMCheckbox
          {...{
            inputs,
            setInputs,
            name: "accesible",
            label: "EVENTO ACCESIBLE",
          }}
        />
        <div style={{ height: 12 }} />
        <CEMCheckbox
          {...{
            inputs,
            setInputs,
            name: "manual_teams",
            label: "EQUIPOS MANUALES",
          }}
        />
        <div className="cem_form">
          <CEM_Input
            name="name"
            label="Nombre"
            set={setInputs}
            value={inputs.name}
          />
          <CEM_Input
            name="dues"
            label="Cuotas"
            custom={ocDues}
            value={inputs.dues}
          />
          <CEM_Input
            name="place"
            label="Ubicacion"
            set={setInputs}
            value={inputs.place}
          />
          <InputDate
            name="since"
            label="Fecha de Inicio"
            set={setInputs}
            value={inputs.since}
          />
          <InputDate
            name="until"
            label="Fecha de Cierre"
            set={setInputs}
            value={inputs.until}
          />
          <InputDate
            name="r_since"
            label="Fecha de Inicio para Registro"
            custom={ocSince}
            value={inputs.register_time.since}
          />
          <InputDate
            name="r_until"
            label="Fecha de Cierre para Registro"
            custom={ocUntil}
            value={inputs.register_time.until}
          />
          {categories.map((c, index) => (
            <CategoryInput
              category={c}
              set={setCategories}
              manual_teams={inputs.manual_teams}
              {...{ index, minusCateg }}
              key={index}
            />
          ))}
          <button onClick={plusCateg}>Añadir Categoría</button>
        </div>
        <div className="partners_ctn">
          <CEMImageInput
            image={partners}
            index={0}
            set={setPartners}
            label="Patrocinante 1"
          />
          {partners.length >= 1 && (
            <CEMImageInput
              image={partners}
              index={1}
              set={setPartners}
              label="Patrocinante 2"
            />
          )}
          {partners.length >= 2 && (
            <CEMImageInput
              image={partners}
              index={2}
              set={setPartners}
              label="Patrocinante 3"
            />
          )}
        </div>
        {/* {error && (
          <p style={{ color: "red", textAlign: "center", padding: "1em 0px" }}>
            Error: {error}
          </p>
        )} */}
        <div style={{ height: "1em" }} />
        {edit ? (
          <button className="modal_btn1" onClick={confirm}>
            {!load ? "Editar Evento" : "Editando Evento..."}
          </button>
        ) : (
          <button className="modal_btn1" onClick={confirm}>
            {!load ? "Crear Evento" : "Creando Evento..."}
          </button>
        )}
      </div>
    </Modal>
  );
};

const CEMImageInput = ({ image, index, set, label }: CEMImgT) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const clickInputImg = () => ref?.current?.click();

  const handleFile = async (e: any) => {
    if (e.target.files) {
      const base64 = await convertBase64(e.target.files[0]);
      if (typeof base64 === "string") {
        let aux = image ? [...image] : [];
        aux.splice(index, 1, {
          secure_url: base64,
          public_id: image[index]?.public_id ?? undefined,
        });
        set(aux);
      }
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
        <label>{label}</label>
        {image && image[index] ? (
          <div onClick={remove}>
            <CrossIcon />
          </div>
        ) : null}
      </div>
      {image && image[index] && image[index].secure_url.length > 0 ? (
        <img src={image[index].secure_url} onClick={clickInputImg} />
      ) : (
        <div className="input_img" onClick={clickInputImg}>
          +
        </div>
      )}
      <input
        ref={ref}
        type="file"
        name="img"
        accept="image/*"
        onChange={handleFile}
      />
    </div>
  );
};

const CEMCheckbox = ({ inputs, setInputs, name, label }: CEMCheckboxT) => {
  const click = () => setInputs({ ...inputs, [name]: !inputs[name] });
  return (
    <div className="check_event" onClick={click}>
      <label>{label}</label>
      {inputs[name] ? <CheckOpen /> : <CheckClose />}
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

const CEM_Input = ({ name, label, set, value, custom }: CEMInputT) => {
  const onChangeText = (e: any) => {
    if (custom) {
      custom(e.target.value);
    } else if (set) {
      const att = e.target.getAttribute("name");
      const value = e.target.value;
      set((prev) => ({ ...prev, [att]: value }));
    }
  };
  return (
    <div className="cem_input_ctn">
      <label>{label}</label>
      <input type="text" name={name} onChange={onChangeText} value={value} />
    </div>
  );
};
const CategoryInput = ({
  category,
  set,
  index,
  minusCateg,
  manual_teams,
}: CategoryInputP) => {
  const disabled = category.teams.length > 0 ? true : false;
  return (
    <>
      <div className="category_input_top" onClick={() => console.log(category)}>
        <label style={{ fontSize: 24 }}>Categoria {index + 1}</label>
        {!disabled && (
          <div style={{ cursor: "pointer" }} onClick={() => minusCateg(index)}>
            <CrossIcon size={24} />
          </div>
        )}
      </div>
      {disabled && (
        <p className="warning">
          Esta categoria contiene equipos registrados y no puede ser modificada
        </p>
      )}
      <InputArrObj
        name="name"
        label="Nombre"
        {...{ index, set, disabled }}
        value={category.name}
      />
      <InputArrObj
        onlyFloat
        name="price"
        label="Precio de Inscripción ($)"
        {...{ index, set, disabled }}
        value={category.price}
      />
      {!manual_teams && (
        <>
          <CategFilterCheck
            name="filter_age"
            label="Edad"
            {...{ index, set, category, disabled }}
          />
          {category.filter_age && (
            <div
              style={{ display: "flex", marginTop: -24, alignItems: "center" }}
            >
              <InputArrObj
                parent="filter"
                name="age_min"
                {...{ index, set, disabled }}
                value={category.filter?.age_min}
                onlyNum
              />
              <p style={{ padding: "0px 12px", fontSize: 24 }}> - </p>
              <InputArrObj
                parent="filter"
                name="age_max"
                {...{ index, set, disabled }}
                value={category.filter?.age_max}
                onlyNum
              />
            </div>
          )}
          <CategFilterCheck
            name="filter_amount"
            label="Límite de Integrantes por equipo"
            {...{ index, set, category, disabled }}
          />
          {category.filter_amount && (
            <>
              <InputArrObj
                parent="filter"
                name="amount"
                {...{ index, set, disabled }}
                value={category.filter?.amount}
                onlyNum
              />
              <CategFilterCheck
                name="filter_genre"
                label="Género"
                {...{ index, set, category, disabled }}
              />
              {category.filter_genre && (
                <div
                  style={{
                    display: "flex",
                    marginTop: -24,
                    alignItems: "center",
                  }}
                >
                  <InputArrObj
                    parent="filter"
                    name="male"
                    {...{ index, set, disabled }}
                    value={category.filter?.male}
                    onlyNum
                    before="M"
                  />
                  <p style={{ padding: "0px 12px", fontSize: 24 }}> - </p>
                  <InputArrObj
                    parent="filter"
                    name="female"
                    {...{ index, set, disabled }}
                    value={category.filter?.female}
                    onlyNum
                    before="F"
                  />
                </div>
              )}
            </>
          )}

          <CategFilterCheck
            name="filter_limit"
            label="Cantidad Límite de equipos"
            {...{ index, set, category, disabled }}
          />
          {category.filter_limit && (
            <InputArrObj
              parent="filter"
              name="limit"
              {...{ index, set, disabled }}
              value={category.filter?.limit}
              onlyNum
            />
          )}
        </>
      )}
    </>
  );
};

const CategFilterCheck = ({
  name,
  label,
  category,
  set,
  index,
  disabled,
}: CategFilterCheckP) => {
  const click = () => {
    if (!disabled) {
      const bool: boolean = !category[name];
      set((prev) => {
        let aux = [...prev];
        aux[index][name] = bool;
        return aux;
      });
    }
  };
  return (
    <div className="check_event" onClick={click}>
      <label>{label}</label>
      {category[name] ? <CheckOpen /> : <CheckClose />}
    </div>
  );
};

type InputArrObjP = {
  name: string;
  label?: string;
  onlyNum?: boolean;
  onlyFloat?: boolean;
  ph?: string;
  value?: string | number;
  index: number;
  parent?: string;
  before?: string;
  set: Dispatch<SetStateAction<any[]>>;
  disabled?: boolean;
};
export const InputArrObj = ({
  name,
  label,
  set,
  value,
  index,
  parent,
  onlyNum,
  onlyFloat,
  ph,
  before,
  disabled,
}: InputArrObjP) => {
  const [val, setVal] = useState(value);
  useEffect(() => {
    let tm = setTimeout(() => {
      set((prev) => {
        let aux = [...prev];
        if (parent) aux[index][parent][name] = val;
        else aux[index][name] = val;
        return aux;
      });
    }, 1000);
    return () => clearTimeout(tm);
  }, [val]);

  const onChangeText = (e: any) => {
    if (onlyNum) {
      let aux = parseInt(e.target.value);
      if (e.target.value.match(/^[0-9]*$/)) setVal(isNaN(aux) ? 0 : aux);
    } else if (onlyFloat) {
      // let aux = parseInt(e.target.value);
      if (e.target.value.match(/^\d*\.?\d*$/)) setVal(e.target.value);
    } else setVal(e.target.value);
  };

  return (
    <div
      style={{
        position: "relative",
        gap: "0.5em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {label && <label>{label}</label>}
      {before && <p className="cem_input_before">{before}</p>}
      <input
        style={{ paddingLeft: before ? 30 : 12 }}
        type="text"
        name={name}
        onChange={onChangeText}
        value={val ?? ""}
        placeholder={ph}
        disabled={disabled}
      />
    </div>
  );
};

const retrieveEventInfo = (
  inputs: InputEventT,
  categ: InputCategT[],
  image: ImageType[],
  partners: ImageType[]
) => {
  const categories = categ.map((c) => ({
    _id: c._id,
    teams: c.teams,
    price: c.price,
    name: c.name,
    filter: c.filter,
    updating: c.updating,
  }));
  return {
    ...inputs,
    categories,
    secure_url: image[0].secure_url,
    public_id: image[0].public_id,
    partners,
  };
};

export default EventModal;
