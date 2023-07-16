import React from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./style.css";
import {Link} from 'react-router-dom'

const SignUp = () => {
  // SignUp page
  return (
    <div className="form-container">
      <div className="form-header">Welcome</div>
      <div className="form-subheader">Sign Up now to get started</div>
      <Input
        label="Username"
        className="form-input"
        placeholder="Enter your full name"
        isRequired={true}
        name="username"
      />
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
      <Button label="Sign up" className="form-button" />
      <div className="form-footer">
        Already a user? <Link to='/signup'>Login</Link>
      </div>
    </div>
  );
};

export default SignUp;
