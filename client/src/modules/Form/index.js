import React from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './style.css';

const Form = ({ isLoginPage, toggleForm }) => {

  return (
    <div className='form-container'>
      <div className='form-header'>Welcome {isLoginPage && `Back`}</div>
      <div className='form-subheader'>
        Sign {isLoginPage ? `in with your Username and password` : `up now to get started`}
      </div>
      {!isLoginPage && (
        <Input
          label='Username'
          className='form-input'
          placeholder='Enter your full name'
          isRequired={true}
          name='username'
        />
      )}
      <Input
        label='Email'
        className='form-input'
        placeholder='Email'
        isRequired={true}
        name='username'
      />
      <Input
        type='password'
        label='Password'
        className='form-input'
        placeholder={isLoginPage ? `Enter the Password` : `Enter your Password`}
        isRequired={true}
        name='username'
      />
      <Button label={isLoginPage ? 'Login' : 'Sign up' } className='form-button'/>
      {!isLoginPage ? <div className='form-footer'>
        Already have an account? <span onClick={toggleForm}>Login</span>
      </div>: <div className='form-footer'>
        New here? <span onClick={toggleForm}>Sign up</span>
      </div>}
    </div>
  );
};

export default Form;
