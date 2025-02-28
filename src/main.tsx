import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import Home from "./views/Guest/Home/Home";
import EventsList from "./views/Guest/EventList/EventList";
import Results from "./views/Guest/Results/Results";
// import Login from "./views/Guest/Login/Login";
import Context, { MsgT, UserDataT } from "./helpers/UserContext";
import "./index.css";
import "./sass/index.sass";
import { getVersion } from "./api/api_guest";
import Login from "./views/Guest/Login/Login";
import Register from "./views/Guest/Register/Register";
import RecoverPassword from "./views/User/RecoverPassword/RecoverPassword";
import Dashboard from "./views/Admin/Dashboard/Dashboard";
import AdminEvent from "./views/Admin/Event/AdminEvent";
import CreateEvent from "./views/Admin/CreateEvent/CreateEvent";

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
        element: <EventsList />,
      },
      {
        path: "resultados/:_id",
        element: <Results />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "registro",
        element: <Register />,
      },
      {
        path: "recuperarContraseña",
        element: <RecoverPassword />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/:_id",
        element: <AdminEvent />,
      },
      {
        path: "crearEvento",
        element: <CreateEvent />,
      },
    ],
  },
]);

const App = () => {
  const [userData, setUserData] = useState<UserDataT|undefined>(undefined);
  const [adminData, setAdminData] = useState<
    { username: string; _id: string } | undefined
    >(undefined);
    // >({username:'',_id:''});
  const [msg, setMsg] = useState<MsgT|undefined>(undefined);

  useEffect(() => {
    (async () => {
      const cacheUser = localStorage.getItem("@user_session");
      const cacheAdmin = localStorage.getItem("@admin_session");
      if (cacheAdmin || cacheUser) {
        const { status, data } = await getVersion({
          cacheAdmin,
          cacheUser,
        });
        if (status === 200) {
          if (data.admin) setAdminData(data.admin);
          if (data.user) setUserData(data.user);
        }
      }
    })();
  }, []);

  return (
    // <StrictMode>
    <Context.Provider
      value={{ userData, setUserData, adminData, setAdminData, msg, setMsg }}
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
 * - REGISTER PAGE ✅
 * - TABLE PAGE ✅
 * - ADMIN PAGE !!!! ✅
 * - - EDIT EVENT ✅
 * - - EDIT WODS ✅
 * - - EDIT RESULTS ✅
 * - - EDIT TEAMS 
 * - - SEE USERS
 * - -
 * - PROFILE PAGE 
 * - CATEGORY INFO PAGE 
 * - CATEGORY REGISTER PAGE 
 *
 * new pass yahoo Crossfit2024
 *
 * sender
 * NoRep
 * norep.code@yahoo.com
 * Crossfit2024
 *
 *
 * */
