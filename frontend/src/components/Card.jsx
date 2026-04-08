import React from 'react';

/**
 * Generic reusable Card wrapper
 * Props: label, icon (emoji/svg), children, className
 */
const Card = ({ label, icon, children, className = '' }) => {
  return (
    <div className={`weather-card ${className}`}>
      {label && (
        <div className="weather-card__label">
          {icon && <span className="label-icon">{icon}</span>}
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
