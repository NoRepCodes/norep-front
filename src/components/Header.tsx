import { PropsWithChildren, useContext } from "react";
import { Link, Outlet, useHref } from "react-router-dom";
import "../sass/header.sass";
import "../sass/modals.sass";
import "../sass/msg.sass";
import logo from "../images/white.png";
import { Footer } from "./Footer";
import { Context } from "./Context";
import EventModal from "./modals/CreateEventModal";
import useModal from "../hooks/useModal";
import { AnimatePresence } from "framer-motion";
import MsgModal from "./MsgModal";
// import { CreateEventModal } from "./Modals";

export const Header = ({ children }: PropsWithChildren) => {
  const { admin, setAdmin, user, setUser, msg, setMsg } =
    useContext(Context);
  const [openCreate, toggleModal] = useModal();
  //@ts-ignore
  const href = useHref();
  const [openMenu, toggleMenu] = useModal();

  const closeSessionMobile = () => {
    localStorage.removeItem("adm");
    setUser(undefined);
    setAdmin(false);
    // setOpenMenu(false);
  };

  // const [openCreate, setOpenCreate] = useState(true);
  // const toggleModal = () => setOpenCreate(!openCreate);

  const closeSession = () => {
    localStorage.removeItem("adm");
    setUser(undefined);
    setAdmin(false);
  };


  return (
    <div className="page_ctn">
      {openCreate && (
        // <></>
        <EventModal close={toggleModal} />
      )}
      <AnimatePresence>
        {msg.open && <MsgModal {...{ setMsg, msg }} />}
      </AnimatePresence>
      <div className="header_ctn" >
        <Link className="logo_ctn" to="/">
          <img src={logo} alt="logo" />
        </Link>
        {/* <Link to="resultados">
          <div className="link">
            <h6>RESULTADOS</h6>
            {href === "/resultados" && <div className="link_active" />}
          </div>
        </Link> */}
        <Link to="eventos">
          <div className="link">
            <h6>EVENTOS</h6>
            {href === "/eventos" && <div className="link_active" />}
          </div>
        </Link>
        <Link to="/">
          <div className="link">
            <h6>NO REP</h6>
            {href === "/" && <div className="link_active" />}
          </div>
        </Link>
        {admin ? (
          <Link to="/dashboard">
            <div className="link">
              <h6>SOLICITUDES</h6>
              {href === "/dashboard" && <div className="link_active" />}
            </div>
          </Link>
        ) : null}
        {!admin && !user && (
          <>
            <Link to="registro">
              <div className="link">
                <h6>REGISTRO</h6>
                {href === "/registro" && <div className="link_active" />}
              </div>
            </Link>
            <Link to="login">
              <div className="link">
                <h6>INICIAR SESION</h6>
                {href === "/login" && <div className="link_active" />}
              </div>
            </Link>
          </>
        )}
        {admin && (
          <div className="header_btns">
            <div className="btn_create" onClick={toggleModal}>
              <IconPlus />
              <h6>CREAR EVENTO</h6>
            </div>
            <div className="btn_closeS" onClick={closeSession}>
              <IconDoor />
              <h6>CERRAR SESIÓN</h6>
            </div>
          </div>
        )}
        {user && (
          <div className="header_btns">
            {/* <div className="btn_create" onClick={toggleModal}>
              <IconPlus />
              <h6>CREAR EVENTO</h6>
            </div> */}
            <div className="link" style={{ cursor: "default" }}>
              <h6>{user.name.toUpperCase()}</h6>
            </div>
            <div className="btn_closeS" onClick={closeSession}>
              <IconDoor />
              <h6>CERRAR SESIÓN</h6>
            </div>
          </div>
        )}
        {/* <div className="searchbar">
          <p>Buscar...</p>
        </div> */}
        {/* <h6>INICIAR SESION</h6> */}
        <HamburguerMenu onClick={toggleMenu} openMenu={openMenu} />
      </div>
      <div className="header_downbar">
        <a
          className="sm_link"
          target="blank"
          href="https://www.instagram.com/team.norep"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fff"
              d="M17.033 6.966c.584.583.584 1.529 0 2.112l-7.955 7.956c-.583.583-1.529.583-2.112 0-.583-.583-.583-1.529 0-2.112l7.956-7.956c.582-.583 1.528-.583 2.111 0zm-9.138 13.386c-1.171 1.171-3.076 1.171-4.248 0-1.171-1.171-1.171-3.077 0-4.248l5.639-5.632c-1.892-.459-3.971.05-5.449 1.528l-2.147 2.147c-2.254 2.254-2.254 5.909 0 8.163 2.254 2.254 5.909 2.254 8.163 0l2.147-2.148c1.477-1.477 1.986-3.556 1.527-5.448l-5.632 5.638zm6.251-18.662l-2.146 2.148c-1.478 1.478-1.99 3.553-1.53 5.445l5.634-5.635c1.172-1.171 3.077-1.171 4.248 0 1.172 1.171 1.172 3.077 0 4.248l-5.635 5.635c1.893.459 3.968-.053 5.445-1.53l2.146-2.147c2.254-2.254 2.254-5.908 0-8.163-2.253-2.254-5.908-2.254-8.162-.001z"
            />
          </svg>
          <p>Instagram</p>
        </a>
        {/* <div className="sm_link">
          <p>Contacto</p>
        </div> */}
      </div>
      {openMenu && (
        <div className="hamb_dropdown">
          <Link to="eventos">
            <div className="link" onClick={toggleMenu}>
              <h6>EVENTOS</h6>
              {href === "/eventos" && <div className="link_active" />}
            </div>
          </Link>
          <Link to="/">
            <div className="link" onClick={toggleMenu}>
              <h6>NO REP</h6>
              {href === "/" && <div className="link_active" />}
            </div>
          </Link>
          {(admin || user) && (
            <div className="link" onClick={closeSessionMobile}>
              <h6>CERRAR SESION</h6>
            </div>
          )}
          {(!admin || !user) && (
            <>
              <Link to="/login">
                <div className="link" onClick={toggleMenu}>
                  <h6>INICIAR SESION</h6>
                  {href === "/login" && <div className="link_active" />}
                </div>
              </Link>
              <Link to="/registro">
                <div className="link" onClick={toggleMenu}>
                  <h6>REGISTRO</h6>
                  {href === "/registro" && <div className="link_active" />}
                </div>
              </Link>
            </>
          )}
        </div>
      )}
      <Outlet />
      {children}
      <Footer />
    </div>
  );
};

type HambType = {
  onClick: () => void;
  openMenu: boolean;
};
export const HamburguerMenu = ({ onClick, openMenu }: HambType) => {
  return (
    <div className="hamb_ctn" onClick={onClick}>
      {openMenu ? (
        <svg
          width="24"
          height="24"
          clipRule="evenodd"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
            fill="#fff"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="21"
          viewBox="0 0 24 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="0.5" width="23" height="4" stroke="#fff" />
          <rect x="0.5" y="8.5" width="23" height="4" stroke="#fff" />
          <rect x="0.5" y="16.5" width="23" height="4" stroke="#fff" />
        </svg>
      )}
    </div>
  );
};

const IconPlus = () => {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
        fillRule="nonzero"
      />
    </svg>
  );
};
const IconDoor = () => {
  return (
    <svg
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path d="M13.033 2v-2l10 3v18l-10 3v-2h-9v-7h1v6h8v-18h-8v7h-1v-8h9zm1 20.656l8-2.4v-16.512l-8-2.4v21.312zm-3.947-10.656l-3.293-3.293.707-.707 4.5 4.5-4.5 4.5-.707-.707 3.293-3.293h-9.053v-1h9.053z" />
    </svg>
  );
};
