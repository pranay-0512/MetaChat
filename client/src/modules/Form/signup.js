import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./style.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName:'',
    email:'',
    password:''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://192.168.0.212:8000/api/register',{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(data)
    })
    if(res.status === 400) {
      alert('Invalid credentials')
  }else{
      navigate("/login")
  }
  };

  return (
    <div className="form-container">
        <div className="form-header">Welcome</div>
        <div className="form-subheader">Sign Up now to get started</div>
      <form onSubmit={(e)=>{handleSubmit(e)}}>
        <Input
          label="Full Name"
          className="form-input"
          placeholder="Enter your full name"
          isRequired={true}
          name="name"
          value={data.fullName}
          onChange={(e) => setData({...data,fullName:e.target.value})}
        />
        <Input
          label="Email"
          type="email"
          className="form-input"
          placeholder="Email"
          isRequired={true}
          name="email"
          value={data.email}
          onChange={(e) => setData({...data,email:e.target.value})}
        />
        <Input
          type="password"
          label="Password"
          className="form-input"
          placeholder="Enter the Password"
          isRequired={true}
          name="password"
          value={data.password}
          onChange={(e) => setData({...data,password:e.target.value})}
        />

        <Button type="submit" label="Sign up" className="form-button" />
      </form>
        <div className="form-footer">
          Already a user? <span onClick={() => navigate("/login")}>Login</span>
        </div>
      
    </div>
  );
};

export default SignUp;
