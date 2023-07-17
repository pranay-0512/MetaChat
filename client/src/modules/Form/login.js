import React from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./style.css";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
    const navigate = useNavigate();

  // Login
  return (
    <div className="form-container">
      <div className="form-header">Good to see you again!</div>
      <div className="form-subheader">Login back to your account</div>
      
      <Input
        label="Email"
        className="form-input"
        placeholder="Email"
        isRequired={true}
        name="email"
      />
      <Input
        type="password"
        label="Password"
        className="form-input"
        placeholder="Enter the Password"
        isRequired={true}
        name="password"
      />
      <Button label="Login" className="form-button" />
      <div className="form-footer">
        New here? <span onClick={()=>navigate('/signup')}>Sign up</span>
      </div>
    </div>
  );
};

export default LogIn;
