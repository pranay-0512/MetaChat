import React, {useState}from 'react';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import './App.css';
function App() {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const toggleForm = () => {
    setIsLoginPage(!isLoginPage);
  };
  return (
    <>
      <Dashboard/>
      {/* <Form isLoginPage={isLoginPage} toggleForm={toggleForm}/> */}
    </>
  );
}

export default App;
