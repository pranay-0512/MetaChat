import React from 'react';
import './style.css'; // Import the CSS file for Button component

const Button = ({
  label = '',
  name = '',
  type = 'submit',
  className = '',
}) => {
  return (
    <div>
      <button name={name} type={type} className={`button ${className}`}>
        {label}
      </button>
    </div>
  );
};

export default Button;
