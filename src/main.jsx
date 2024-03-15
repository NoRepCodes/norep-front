import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getEventsHome } from "./api/events.api";
import { Context } from "./components/Context";
import { Header } from "./components/Header";
import LoadingPage from "./components/LoadingPage";
import "./index.css";
import { AdminLogin } from "./pages/AdminLogin";
import { Events } from "./pages/Events";
import Home from "./pages/Home";
import { Results } from "./pages/Results";
// import Table from "./pages/TableOld";

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
      {
        path: "admin",
        element: <AdminLogin />,
      },
    ],
  },
]);

const App = () => {
  const [first, setFirst] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [events, setEvents] = useState([]);
  const [time, setTime] = useState(0);
  useEffect(() => {
    (async () => {
      const { status, data } = await getEventsHome();
      if (status === 200) {
      //setEvents();
        setEvents(data[0]);
        setTime(data[1]);
        // console.log(data)
      }
      const adm = JSON.parse(localStorage.getItem("adm"));
      if (adm) {
        setAdmin(adm);
      }

      setFirst(true);
    })();
  }, []);

  // if(true){
  if (!first && time !== 0) {
    return <LoadingPage />;
  }

  return (
    <Context.Provider value={{ events, time, admin, setAdmin, setEvents }}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// TO DO

/**
 * close session button - ✅
 * move buttons to hamburguer icon - ✅
 * show "loading" when updating - ✅
 * rotate images (carousel) - ✅
 * remove temporal partners on mobile - ✅
 * user box info display - ✅
 * fix categories modal - ✅
 * Remove time and add select wods - NOT SELECT BUT BETTER INPUT ✅
 * fix time-issue - ✅
 *
 * Add old events option  ✅
 * option to delete category at create and delete event  ✅
 * crud/ temporal partners (carousel imgs)  ✅
 * only allow admins to acces inaccesible events  ✅
 * btn to alternate between lbs and kgs  ✅
 * merge update with create event modal  ✅
 *
 * Loading page  ✅
 *
 * CIRCUIT NEW TABLE LOGIC ✅
 * AJUST MODALS ✅
 * {
 *    Edit Event  ✅
 *    Edit Wods  ✅
 *    Edit Teams  ✅
 *    Edit Results  ✅
 * }
 *
 * DOMAIN ✅
 * official partners links and svg ~ Need links
 * fix bottom banner jump ❌
 * admins users logic /CRUD ✅
 *
 * - - - - LAST ONE
 * Icon in tab ✅
 * LOGIN ADMIN ✅
 * TEST ENVIROMENT ✅
 * do testing, duh
 */
