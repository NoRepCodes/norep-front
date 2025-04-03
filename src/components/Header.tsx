import { PropsWithChildren, useContext, useEffect } from "react";
import { Link, Outlet, useHref, useNavigate } from "react-router-dom";
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
import { Ionicons } from "./Icons";
import { View } from "./UI";
import useScreen from "../hooks/useSize";

export const Header = ({ children }: PropsWithChildren) => {
  const [openMenu, toggleMenu] = useModal();

  const navigate = useNavigate();
  if (false) console.log(navigate);

  //@ts-ignore
  const href = useHref();

  const { ww } = useScreen();

  useEffect(() => {
    if(ww > 1000 && openMenu){
      toggleMenu(false)
    }
  }, [ww])
  

  return (
    <div className="page_ctn">
      <MsgModal />
      <View className="header_ctn">
        <Link className="logo_ctn" to="/" viewTransition>
          <img src={logo} alt="logo" />
        </Link>
        {ww > 1000 ? (
          <Links />
        ) : (
          <HamburguerMenu {...{ openMenu, toggleMenu }} />
        )}
      </View>
      <AnimatePresence>
        {openMenu && ww < 1000 && (
          <div style={{ backgroundColor: "#181818" }}>
            <ViewFadeStatic className="hamb_dropdown">
              <Links {...{ toggleMenu }} />
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

const Links = ({ toggleMenu }: { toggleMenu?: (state?: boolean) => void }) => {
  const { adminData, setAdminData, userData, setUserData, setMsg } =
    useContext(Context);

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
  //@ts-ignore
  const href = useHref();
  return (
    <>
      <HeaderLink {...{ href, toggleMenu }} to="/" text="NO REP" />
      <HeaderLink {...{ href, toggleMenu }} to="/eventos" text="EVENTOS" />

      {adminData && (
        <HeaderLink
          {...{ href, toggleMenu }}
          to="/dashboard"
          text="SOLICITUDES"
        />
      )}
      {!adminData && !userData && (
        <>
          <HeaderLink
            {...{ href, toggleMenu }}
            to="/registro"
            text="REGISTRO"
          />
          <HeaderLink
            {...{ href, toggleMenu }}
            to="/login"
            text="INICIAR SESION"
          />
        </>
      )}
      {adminData && (
        <>
          <HeaderLink
            {...{ href, toggleMenu }}
            to="/dashboard"
            text="ADMINISTRACIÓN"
          />
          <div className="header_btns">
            <div
              className="link"
              onClick={() => {
                closeSession();
                toggleMenu ? toggleMenu(false) : undefined;
              }}
            >
              <h6>CERRAR SESIÓN</h6>
              <Ionicons name="exit-outline" color="#fff" />
            </div>
          </div>
        </>
      )}
      {userData && (
        // <div className="header_btns" onClick={()=>{navigate('Profile',{_id:userData._id})}} >
        <div className="header_btns">
          <div className="link">
            <h6>{userData?.name.toUpperCase() ?? ""}</h6>
            <Ionicons name="person-circle-outline" color="#fff" size={32} />
          </div>
          <div
            className="link"
            onClick={() => {
              closeSession();
              toggleMenu ? toggleMenu(false) : undefined;
            }}
          >
            <h6>CERRAR SESIÓN</h6>
            <Ionicons name="exit-outline" color="#fff" />
          </div>
        </div>
      )}
    </>
  );
};

const HeaderLink = ({
  to,
  href,
  text,
  toggleMenu,
}: {
  to: string;
  href: string;
  text: string;
  toggleMenu?: (state?: boolean) => void;
}) => {
  return (
    <Link to={to} viewTransition>
      <div
        className="link"
        onClick={() => {
          toggleMenu ? toggleMenu(false) : undefined;
        }}
      >
        <h6>{text}</h6>
        {href === to && <div className="link_active" />}
      </div>
    </Link>
  );
};

type HambType = {
  toggleMenu: () => void;
  openMenu: boolean;
};
export const HamburguerMenu = ({ toggleMenu, openMenu }: HambType) => {
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        toggleMenu();
      }}
    >
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
