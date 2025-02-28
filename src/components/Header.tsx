import { PropsWithChildren, useContext } from "react";
import { Link, Outlet, useHref } from "react-router-dom";
import "../sass/header.sass";
import "../sass/modals.sass";
import "../sass/msg.sass";
import logo from "../images/white.png";
import { Footer } from "./Footer";
import useModal from "../hooks/useModal";
import Context from "../helpers/UserContext";
import MsgModal from "./MsgModal";
import { AnimatePresence } from "framer-motion";
import { ViewFadeStatic } from "./AnimatedLayouts";

export const Header = ({ children }: PropsWithChildren) => {
  const { adminData, setAdminData, userData, setUserData, setMsg } =
    useContext(Context);

  //@ts-ignore
  const href = useHref();
  const [openMenu, toggleMenu] = useModal();

  const closeSession = () => {
    localStorage.removeItem("@admin_session");
    localStorage.removeItem("@user_session");
    setUserData(undefined);
    setAdminData(undefined);
    setMsg({
      type: "success",
      text: "Sesión cerrada con éxito!",
    });
  };

  return (
    <div className="page_ctn">
      <MsgModal />
      <div className="header_ctn">
        <Link className="logo_ctn" to="/" viewTransition>
          <img src={logo} alt="logo" />
        </Link>
        <HeaderLink href={href} to="/" text="NO REP" />
        <HeaderLink href={href} to="/eventos" text="EVENTOS" />

        {/* {adminData ? (
          <HeaderLink href={href} to="/dashboard" text="SOLICITUDES" />
        ) : null} */}
        {!adminData && !userData && (
          <>
            <HeaderLink href={href} to="/registro" text="REGISTRO" />
            <HeaderLink href={href} to="/login" text="INICIAR SESION" />
          </>
        )}
        {adminData && (
          <>
            <HeaderLink href={href} to="/dashboard" text="ADMINISTRACIÓN" />
            <div className="header_btns">
              <div className="btn_closeS" onClick={closeSession}>
                <IconDoor />
                <h6>CERRAR SESIÓN</h6>
              </div>
            </div>
          </>
        )}
        {userData && (
          <div className="header_btns">
            <div className="link" style={{ cursor: "default" }}>
              <h6>{userData.name.toUpperCase()}</h6>
            </div>
            <div className="btn_closeS" onClick={closeSession}>
              <IconDoor />
              <h6>CERRAR SESIÓN</h6>
            </div>
          </div>
        )}

        <HamburguerMenu onClick={toggleMenu} openMenu={openMenu} />
      </div>
      <AnimatePresence>
        {openMenu && (
          <div style={{ backgroundColor: "#181818" }}>
            <ViewFadeStatic className="hamb_dropdown">
              <div onClick={toggleMenu}>
                <HeaderLink href={href} to="/" text="NO REP" />
              </div>
              <div onClick={toggleMenu}>
                <HeaderLink href={href} to="/eventos" text="EVENTOS" />
              </div>

              {adminData ? (
                <HeaderLink href={href} to="/dashboard" text="ADMINISTRACIÓN" />
              ) : null}

              {(adminData || userData) && (
                <div onClick={toggleMenu}>
                  <div className="link" onClick={closeSession}>
                    <h6>CERRAR SESION</h6>
                  </div>
                </div>
              )}
              {!adminData && !userData && (
                <>
                  <div onClick={toggleMenu}>
                    <HeaderLink href={href} to="/registro" text="REGISTRO" />
                  </div>
                  <div onClick={toggleMenu}>
                    <HeaderLink href={href} to="/login" text="INICIAR SESION" />
                  </div>
                </>
              )}
            </ViewFadeStatic>
          </div>
        )}
      </AnimatePresence>
      <Outlet />
      {children}
      <Footer />
    </div>
  );
};

const HeaderLink = ({
  to,
  href,
  text,
}: {
  to: string;
  href: string;
  text: string;
}) => {
  return (
    <Link to={to} viewTransition>
      <div className="link">
        <h6>{text}</h6>
        {href === to && <div className="link_active" />}
      </div>
    </Link>
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

// const IconPlus = () => {
//   return (
//     <svg
//       clipRule="evenodd"
//       fillRule="evenodd"
//       strokeLinejoin="round"
//       strokeMiterlimit="2"
//       width={24}
//       height={24}
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
//         fillRule="nonzero"
//       />
//     </svg>
//   );
// };
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
