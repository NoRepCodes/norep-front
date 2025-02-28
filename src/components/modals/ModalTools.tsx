import {
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import "../../sass/modals/modalTools.sass";
import { ResultContext } from "../results/ResultContx";

export const CrossIcon = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
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

const ModalHeader = ({
  title = "",
  close,
}: {
  title: string;
  close: () => void;
}) => {
  return (
    <div className="modal_top">
      <h6>{title}</h6>
      <div className="cross_ctn" onClick={close}>
        <CrossIcon />
      </div>
    </div>
  );
};

type ModalP = PropsWithChildren & {
  title: string;
  close: () => void;
};

export const Modal = ({ children, title, close }: ModalP) => {
  return (
    <div className="blackscreen">
      <div className="modal">
        <div className="modal_ctn">
          <ModalHeader {...{ title, close }} />
          {children}
        </div>
      </div>
    </div>
  );
};


export const CategoriesSelect = () => {
  const { category, setCategory, event } = useContext(ResultContext);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <div className="categories_select">
      <div className="categories_select_btn" onClick={toggle}>
        {category && <h6>{category.name}</h6>}
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
            event.categories.map((categ:any) => (
              <h6
                key={categ._id}
                onClick={() => {
                  setCategory(categ);
                  toggle();
                }}
              >
                {categ.name}
              </h6>
            ))}
        </div>
      )}
    </div>
  );
};
