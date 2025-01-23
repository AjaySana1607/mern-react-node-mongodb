import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Register from "./components/register"; // Import the Register component
import RecordList from "./components/recordList";
import Create from "./components/create";
import Edit from "./components/edit";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("token") !== null);
  }, []);

  const handleLoginSuccess = (newToken, userid) => {
  console.log("Login success! Token:", newToken, "UserID:", userid);

  setIsLoggedIn(true);
  localStorage.setItem("token", newToken);
  localStorage.setItem("userid", userid);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} /> {/* Add the route for Register component */}
        {isLoggedIn ? (
          <>
            <Route path="/dashboard" element={<RecordList />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit/:id" element={<Edit />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
