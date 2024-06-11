import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Home from "./components/Home";
import Account from "./components/Account";
import Activation from "./components/Activation";
import Login from "./components/Login";
import axios from "axios";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:5000/auth/logout", { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <nav className="navigation">
            <div className="navigation-tabs">
              <div className="">
                <Link to="/">Home</Link>
              </div>
              <div>
                <Link to="/activation">Activation</Link>
              </div>
              <div>
                <Link to="/account">Account</Link>
              </div>
            </div>
            <div className="navigation-user">
              <img src="./user.png" width={50} />
              <button onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </button>
            </div>
          </nav>
        )}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/activation"
            element={
              isAuthenticated ? <Activation /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/account"
            element={isAuthenticated ? <Account /> : <Navigate to="/login" />}
          />
          {!isAuthenticated && <Route path="/login" element={<Login />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
