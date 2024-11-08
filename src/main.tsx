import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { getEventsHome } from "./api/events.api";
import { Context,  MsgT } from "./components/Context";
import { Header } from "./components/Header";
// import LoadingPage from "./components/LoadingPage";
// import AdminLogin from "./pages/Admin/AdminLogin";
import Events from "./pages/Events/Events";
import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import "./index.css";
import "./sass/index.sass";
import { EventType } from "./types/event.t";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { UserType } from "./types/user.t";
import Dashboard from "./pages/Dashboard/Dashboard";

const ErrorElement = () => {
  return (
    <Header>
      <div className="error_page">
        <h6>404</h6>
        <p>Página no encontrada :(</p>
      </div>
    </Header>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "eventos",
        element: <Events />,
      },
      {
        path: "resultados/:_id",
        element: <Results />,
      },
      // {
      //   path: "admin",
      //   element: <AdminLogin />,
      // },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "registro",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

const App = () => {
  //test for testing
  // const [first, setFirst] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [events, setEvents] = useState<EventType[] | undefined>(undefined);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [msg, setMsg] = useState<MsgT>({
    msg: "",
    open: false,
    type: "none",
  });

  useEffect(() => {
  //   (async () => {
  //     const { status, data } = await getEventsHome();
  //     if (status === 200) {
  //     //setEvents();
  //       setEvents(data[0]);
  //       setTime(data[1]);
  //     }
      
  //     setFirst(true);
  //   })();
  let ifAdm = localStorage.getItem("adm")
  let ifUsr = localStorage.getItem("@user")
  if(ifAdm){
    const adm = JSON.parse(ifAdm);
    if (adm) {
      setAdmin(adm);
    }
  }else if(ifUsr){
    const usr = JSON.parse(ifUsr);
    if (usr) {
      setUser(usr);
    }
  }
  }, []);

  // // if(true){
  // if (!first && time !== 0) {
  //   return <LoadingPage />;
  // }

  return (
    // <StrictMode>
    <Context.Provider
      value={{ events, admin, setAdmin, setEvents, user, setUser,msg, setMsg }}
    >
      <RouterProvider router={router} />
    </Context.Provider>
    // </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

// TO DO ✅ ❌ ⏳ ❓

/**
 * PAGES:
 * - HOME
 * - - TS MIGRATION ✅
 * - - FETCH EVENTS ✅
 * - - LOGIC OF UPDATED ⏳ - Option: Search for most updated wod and retrieve Event_name + category_name
 *
 * - ADMIN LOGIN
 * - - TS MIGRATION ✅
 * - - SET ADMIN IN REGULAR LOGIN ❓
 *
 * - EVENTS
 * - - TS MIGRATION ✅
 * - - FETCH EVENTS ✅
 * - - SEARCH FOR TEAM_NAME ✅
 * - - SEARCH FOR USER_NAME ⏳
 *
 * - RESULTS
 * - - TS MIGRATION ✅
 * - - FETCH EVENTS ✅
 * - - DISPLAY TABLE RESULTS ✅
 * - - SEARCH TEAM WHEN TEAM_NAME ✅
 * - - SEARCH TEAM WHEN USER_NAME ⏳
 * - - UPDATE EVENT ✅
 * - - - VERIFY THAT CATEGORY HAS EMPTY TEAMS BEFORE UPDATE & MANTAIN CATEGORY_ID's ✅
 * - - - MIX UPDATE AND CREATE EVENT MODAL INTO ONE ✅
 *
 * - - UPDATE WODS ✅
 * - - - - CLEAN INPUTS ❓
 * - - - - VALIDATE INPUTS ✅
 * - - - - TO_DELETE VARIABLE ✅
 * - - - - SEND INFO AND UPDATE ✅
 * - - - - RESET RESULTS AFTER UPDATE ✅
 * - - - -
 *
 * - - UPDATE TEAMS (JUST WHEN NEEDED) ✅
 * - - UPDATE RESULTS ✅
 * - -
 *
 * - - CREATE USER (BACKEND) ✅
 * - - - - CARD_ID VALIDATION ✅
 * - - - - EMAIL VALIDATION ✅
 *
 * - - USER CATEGORY REGISTER (BACKEND) ⏳
 * - - - - CREATE TICKET ✅
 * - - - - EMAIL SENDER AT ACCEPTANCE ⏳
 * - - - - REMOVE PAY-PICTURE AT ACCEPTANCE ✅
 * - - - - VERIFY CARDS_ID ✅
 * - - - -
 * 
 * - - DO TICKET LOGIC ASAP
 * - - - - CREATE/UPDATE TICKET DUE
 * - - - - CREATE TICKET DUE
 * 
 * - - MOUSE DISSAPEAR ON INPUT ❓
 * - - WITH ONE USER, DISSAPEAR TEAM NAME INPUT ✅
 * - - CLEAR INPUT AFTER CATEG FORM ✅
 * - - MESSAGE TO LET USERS KNOW THAT THEY SHOULD BE IN THE APP FIRST 
 * - - WHEN THE TEAM PAY COMPLETELY, SHOW TABLE
 * - - 
 *
 * - LOGIN PAGE ✅
 * - - LOGIC ✅
 * - - DESIGN ✅
 *
 * - REGISTER PAGE ✅
 * - - LOGIC ✅
 * - - DESIGN ✅
 *
 * - TICKET DASHBOARD ✅
 *
 * - TICKET DISPLAY ✅
 * - -
 *
 * new pass yahoo Crossfit2024
 *
 * sender
 * NoRep
 * norep.code@yahoo.com
 * Crossfit2024
 *
 * 
 * FIX ZUNFEST TIME TO REGISTER ✅
 * FIX PUSH TICKET ERROR ❓
 * FIX NO DOUBT TEAM TICKET 
 *
 * 
 * 
 * */
