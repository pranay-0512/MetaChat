import React from 'react';
import './style.css';

const Button = ({
  label = '',
  name = '',
  type = 'submit',
  className = '',
  onclick= ()=>{}
}) => {
  return (
    <div>
      <button name={name} type={type} className={`button ${className}`} onClick={onclick}>
        {label}
      </button>
    </div>
  );
};

export default Button;
