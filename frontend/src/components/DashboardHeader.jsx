import React from 'react';

const DashboardHeader = ({ city = 'KIT CAMPUS', temp = 29, condition = 'Sunny' }) => {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-header__title">{city}</h1>
      <p className="dashboard-header__subtitle">{temp}°C | {condition}</p>
    </header>
  );
};

export default DashboardHeader;
