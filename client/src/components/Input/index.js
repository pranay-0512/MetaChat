import React from 'react';
import './style.css';

const Input = ({
  label = '',
  name = '',
  type = 'text',
  isRequired = false,
  placeholder = '',
}) => {
  return (
    <div className='input-container'>
      <label htmlFor={name} className='input-label'>
        {label}
      </label>
      <input
        type={type}
        required={isRequired}
        placeholder={placeholder}
        className='input-field'
      />
    </div>
  );
};

export default Input;
