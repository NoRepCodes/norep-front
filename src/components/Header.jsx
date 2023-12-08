import React, { useContext, useState } from "react";
import { Link, Outlet, useHref } from "react-router-dom";
import "../sass/header.sass";
import "../sass/modals.sass";
import logo from "../images/white.png";
import { Footer } from "./Footer";
import { Context } from "./Context";
import { CreateEventModal } from "./Modals";

export const Header = ({ children }) => {
  const { admin,setEvents } = useContext(Context);
  const href = useHref();
  const [openMenu, setOpenMenu] = useState(true);
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const [openCreate, setOpenCreate] = useState(false)
  const toggleModal = ()=> setOpenCreate(!openCreate)
  // console.log(href);

  return (
    <div className="page_ctn">
      {openCreate && <CreateEventModal close={toggleModal} setEvents={setEvents} />}
      <div className="header_ctn">
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
        {admin && (
          <div className="btn_create" onClick={toggleModal} >
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
            <h6>CREAR EVENTO</h6>
          </div>
        )}
        {/* <div className="searchbar">
          <p>Buscar...</p>
        </div> */}
        {/* <h6>INICIAR SESION</h6> */}
        <HamburguerMenu onClick={toggleMenu} openMenu={openMenu} />
      </div>
      <div className="header_downbar">
        <div className="sm_link">
          <p>Instagram</p>
        </div>
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
        </div>
      )}
      <Outlet />
      {children}
      <Footer />
    </div>
  );
};

const HamburguerMenu = ({ onClick, openMenu }) => {
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
