import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./style.css";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email:'',
    password:''
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/login',{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(data)
    })
    if(res.status === 400) {
      alert('Invalid credentials')
  }else{
      const resData = await res.json()
      if(resData.token) {
          localStorage.setItem('user:token', resData.token)
          localStorage.setItem('user:detail', JSON.stringify(resData.user))
          navigate("/")
      }
  }
  };

  return (
    <div className="form-container">
        <div className="form-header">Good to see you again!</div>
        <div className="form-subheader">Login back to your account</div>
      <form onSubmit={(e)=>{handleSubmit(e)}}>
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

        <Button type="submit" label="Log In" className="form-button" />
      </form>
        <div className="form-footer">
         New Here? <span onClick={() => navigate("/signup")}>Sign up</span>
        </div>
      
    </div>
  );
};

export default LogIn;
