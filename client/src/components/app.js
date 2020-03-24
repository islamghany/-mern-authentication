import React, { useEffect, useState } from "react";
import "../assets/style/style.scss";
import Off from "./routes/off";
import On from "./routes/on";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import LoadingPage from "../shared/tools/loading-page";
const App = () => {
  const [storedData, setStoredData] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const currentUser = useSelector(state => state.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser.token) {
      if (storedData && storedData.token && storedData.email) {
        if (new Date(storedData.expiration) > new Date()) {
          dispatch({
            type: "LOGIN",
            payload: { ...storedData }
          });
        } else {
          localStorage.removeItem("currentUser");
          setStoredData(null);
        }
      }
    }
  }, []);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentUser"));
    if (!data) {
      setStoredData(null);
    }
  }, [currentUser.token]);
  return (
    <div>
      <Router>
        {!currentUser.token && storedData && storedData.token ? (
          <LoadingPage />
        ) : currentUser.token ? (
          <On />
        ) : (
          <Off />
        )}
      </Router>
    </div>
  );
};
export default App;
