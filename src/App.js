import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MenuAppBar from "./components/MenuAppBar";
import CircularProgress from "./components/CircularProgress";
import Snackbars from "./components/SnackBar";
import Home from "./views/Home";
import Messages from "./views/Messages";
import Companies from "./views/Companies";
import Queue from "./views/Queue";
import Logs from "./views/Logs";
import NewCompany from "./views/NewCompany";
import CompanyEdit from "./views/CompanyEdit";
import Agents from "./views/Agents";
import Keycloak from "keycloak-js";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { setUser } from "./state/currentUser";

const getDetailsFromToken = (token) => {
  const decoded = jwt_decode(token);
  return {
    userName: decoded.given_name + " " + decoded.family_name,
    isAdmin: decoded.groups.find((el) => el === "adming") ? true : false,
  };
};
const App = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const kk = new Keycloak("keycloak.json");
  const dispatch = useDispatch();
  useEffect(() => {
    kk.init({ onLoad: "login-required" }).then((authenticated) => {
      setKeycloak(kk);
      setAuthenticated(authenticated);

      if (authenticated) {
        window.accessToken = kk.token;
        dispatch(setUser(getDetailsFromToken(kk.token)));
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (keycloak) {
    if (authenticated)
      return (
        <div className="App">
          <BrowserRouter>
            <MenuAppBar />
            <Routes>
              <Route path="/" element={<Home />} exact />
              <Route path="/messages" element={<Messages />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/queue" element={<Queue />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/companies/new" element={<NewCompany />} />
              <Route
                path="/companies/:companyId/edit"
                element={<CompanyEdit />}
              />
            </Routes>
          </BrowserRouter>
          <CircularProgress />
          <Snackbars />
        </div>
      );
    else return <div>Unable auth</div>;
  }
  return <div></div>;
};

export default App;
