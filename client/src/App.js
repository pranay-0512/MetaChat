import React from 'react';
import Dashboard from './modules/Dashboard';
import SignUp from './modules/Form/signup';
import LogIn from './modules/Form/login';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null;

  if (!isLoggedIn && window.location.pathname === "/"){
    return <Navigate to={`/login`} />;
} else if (isLoggedIn && ['/login', '/signup'].includes(window.location.pathname)) {
    return <Navigate to={'/'} />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/signup' element={
        <ProtectedRoute>
          <SignUp />
        </ProtectedRoute>
      } />
      <Route path='/login' element={
        <ProtectedRoute>
          <LogIn />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
