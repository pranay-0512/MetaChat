import React from 'react';
import Dashboard from './modules/Dashboard';
import SignUp from './modules/Form/signup';
import LogIn from './modules/Form/login';
import {Routes, Route} from 'react-router-dom'
import './App.css';
function App() {
  return (

    <Routes>
    <Route path='/' element={<Dashboard/>}/>
    <Route path='/signup' element={<SignUp/>}/>
    <Route path='/login' element={<LogIn/>}/>
    </Routes>
  );
}

export default App;
