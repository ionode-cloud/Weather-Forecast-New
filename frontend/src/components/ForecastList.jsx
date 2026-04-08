import React from 'react';

const FORECAST_DATA = [
  { day: 'Mon', icon: '☀️', range: '24°C / 18°C', cond: 'Sunny'  },
  { day: 'Tue', icon: '☁️', range: '22°C / 16°C', cond: 'Cloudy' },
  { day: 'Wed', icon: '🌧️', range: '20°C / 14°C', cond: 'Rainy'  },
  { day: 'Thu', icon: '🌧️', range: '20°C / 14°C', cond: 'Rainy'  },
  { day: 'Fri', icon: '🌧️', range: '20°C / 14°C', cond: 'Rainy'  },
  { day: 'Sat', icon: '💨', range: '20°C / 14°C', cond: 'Windy'  },
  { day: 'Sun', icon: '💨', range: '20°C / 14°C', cond: 'Windy'  },
];

const ForecastList = ({ data = FORECAST_DATA }) => {
  return (
    <div className="weather-forecast__list">
      {data.map((item) => (
        <div key={item.day} className="weather-forecast__item">
          <span className="weather-forecast__day">{item.day}</span>
          <span className="weather-forecast__icon">{item.icon}</span>
          <span className="weather-forecast__range">{item.range}</span>
          <span className="weather-forecast__cond">{item.cond}</span>
        </div>
      ))}
    </div>
  );
};

export default ForecastList;
