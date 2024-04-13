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
 * ✅
 * Check updates
 * {Event, Results, Teams, Wods...} EVERY UPDATE
 * Check the category select in the Edits Results
 * 
 CHECK UPDATE EVENT, ITS SO BROKEN
 */
