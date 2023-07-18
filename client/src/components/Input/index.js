import React from 'react';
import './style.css';

const Input = ({
  label = '',
  name = '',
  type = 'text',
  isRequired = false,
  placeholder = '',
  value='',
  className='',
  onChange = ()=>{}
}) => {
  return (
    <div className={`input-container ${className}`}>
      <label htmlFor={name} className='input-label'>
        {label}
      </label>
      <input
        id={name}
        type={type}
        required={isRequired}
        placeholder={placeholder}
        className='input-field'
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
