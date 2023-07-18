import React from "react";
import Dashboard from "./modules/Dashboard";
import SignUp from "./modules/Form/signup";
import LogIn from "./modules/Form/login";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

const ProtectedRoute = ({ children, auth=false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null;

  if (!isLoggedIn && auth) {
    return <Navigate to={"/login"} />;
  } else if (
    isLoggedIn &&
    ["/login", "/signup"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute>
            <SignUp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute>
            <LogIn />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
