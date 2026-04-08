import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';

import DashboardHeader from './DashboardHeader';
import Card from './Card';
import Globe from './Globe';
import ForecastList from './ForecastList';
import {
  HumidityBars,
  TempSparkline,
  SunriseChart,
  TrendChart,
  FeelsLikeChart,
  PressureGauge,
  AQIGauge,
  WindCompass,
  MoonSVG,
} from './Charts';

/* ── Static fallback data matching reference image ── */
const STATIC = {
  city: 'KIT CAMPUS',
  temp: 29,
  condition: 'Sunny',
  humidity: 45,
  temperature: 33,
  feelsLike: 30.32,
  wind: { speed: 7, gust: 15, deg: 300, dir: 'NW' },
  pressure: 1011,
  uvIndex: 7,
  visibility: 3000,
  lightIntensity: 'Low',
  aqi: 252,
  aqiLabel: 'Poor',
  altitude: { low: 1007, high: 5000, qnh: 1011 },
  precipitation: { mm: 0, note: 'None expected in 10 days' },
  moon: {
    phase: 'Wanning Gibbous',
    illumination: '86%',
    moonrise: '20:00',
    nextFull: '20 Days',
  },
  hourly: [
    { temp: '23°', label: '6 AM' },
    { temp: '21°', label: '8 AM' },
    { temp: 'Sunset', label: '' },
    { temp: '20°', label: '4 PM' },
    { temp: '19°', label: '6 PM' },
    { temp: '19°', label: '8 PM' },
    { temp: '18°', label: '10 PM' },
  ],
};

/* ═══════════════════════════════════════════════════════════ */
const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [dbData, setDbData] = useState(null);

  useEffect(() => {
    // Fetch live OpenWeatherMap data
    axios.get('/api/current').then((res) => setWeatherData(res.data)).catch(() => {});
    // Fetch latest sensor record from MongoDB
    axios.get('/api/weather?limit=1').then((res) => {
      const records = res.data?.data;
      if (records && records.length > 0) setDbData(records[0]);
    }).catch(() => {});
  }, []);

  /* Merge live OWM + DB sensor data over static defaults */
  const d = {
    ...STATIC,
    temp:        Math.round(weatherData?.main?.temp          ?? STATIC.temp),
    condition:   weatherData?.weather?.[0]?.main             ?? STATIC.condition,
    humidity:    dbData?.humidity   ?? weatherData?.main?.humidity    ?? STATIC.humidity,
    temperature: Math.round(dbData?.temperature ?? weatherData?.main?.temp ?? STATIC.temperature),
    feelsLike:   weatherData?.main?.feels_like                ?? STATIC.feelsLike,
    pressure:    dbData?.pressure   ?? weatherData?.main?.pressure    ?? STATIC.pressure,
    uvIndex:     dbData?.uvIndex    ?? STATIC.uvIndex,
    visibility:  dbData?.lightIntensity != null ? dbData.lightIntensity * 300 : STATIC.visibility,
    lightIntensity: dbData?.uvIndex > 8 ? 'High' : dbData?.uvIndex > 4 ? 'Medium' : STATIC.lightIntensity,
    aqi:         dbData?.airQualityIndex ?? STATIC.aqi,
    aqiLabel:    dbData?.airQuality ?? STATIC.aqiLabel,
    precipitation: {
      mm:   dbData?.precipitation ?? STATIC.precipitation.mm,
      note: STATIC.precipitation.note,
    },
    wind: {
      speed: dbData?.windSpeed  ?? weatherData?.wind?.speed ?? STATIC.wind.speed,
      gust:  dbData?.windGust   ?? STATIC.wind.gust,
      deg:   weatherData?.wind?.deg ?? STATIC.wind.deg,
      dir:   dbData?.windDirection ?? STATIC.wind.dir,
    },
  };

  /* ─────────────────── LEFT COLUMN ─────────────────── */
  const leftColumn = (
    <div className="dashboard-col-left">

      {/* Row 1: Humidity + Temperature */}
      <div className="dashboard-row-2">
        <Card label="Humidity" icon="💧">
          <div className="weather-card__value">{d.humidity}%</div>
          <HumidityBars value={d.humidity} />
        </Card>

        <Card label="Temperature" icon="🌡️">
          <div className="weather-card__value">{d.temperature}°C</div>
          <TempSparkline temp={d.temperature} />
        </Card>
      </div>

      {/* Row 2: Wind (full width) */}
      <Card label="Wind" icon="💨">
        <div className="weather-wind__inner">
          <div className="weather-wind__table">
            <div className="weather-wind__row">
              <span className="weather-wind__row-label">Wind</span>
              <span className="weather-wind__row-val">{d.wind.speed} kph</span>
            </div>
            <div className="weather-wind__row">
              <span className="weather-wind__row-label">Gust</span>
              <span className="weather-wind__row-val">{d.wind.gust} kph</span>
            </div>
            <div className="weather-wind__row">
              <span className="weather-wind__row-label">Direction</span>
              <span className="weather-wind__row-val">{d.wind.deg}° {d.wind.dir}</span>
            </div>
          </div>
          <WindCompass degree={d.wind.deg} />
        </div>
      </Card>

      {/* Row 3: Sunrise + Trend Chart */}
      <div className="dashboard-row-2-bottom">
        <Card label="Sunrise" icon="🌅">
          <div className="weather-sunrise__arc">
            <SunriseChart />
          </div>
        </Card>

        <Card label="Temp,Hum,wind" icon="📈">
          <div className="weather-trend__chart">
            <TrendChart />
          </div>
          <div className="weather-trend__legend">
            <span className="weather-trend__legend-item">
              <span className="weather-trend__legend-dot" style={{ background: '#ff4757' }} />
              Temperature (°C)
            </span>
            <span className="weather-trend__legend-item">
              <span className="weather-trend__legend-dot" style={{ background: '#1e90ff' }} />
              Humidity (%)
            </span>
            <span className="weather-trend__legend-item">
              <span className="weather-trend__legend-dot" style={{ background: '#f1c40f' }} />
              Wind Speed (km/h)
            </span>
          </div>
        </Card>
      </div>

      {/* Row 4: Moon phase (full width) */}
      <Card label={d.moon.phase} icon="🌗">
        <div className="weather-moon__inner">
          <div className="weather-moon__info">
            <div className="weather-moon__row">
              <span className="weather-moon__row-label">Illumination</span>
              <span className="weather-moon__row-val">{d.moon.illumination}</span>
            </div>
            <div className="weather-moon__row">
              <span className="weather-moon__row-label">Moonrise</span>
              <span className="weather-moon__row-val">{d.moon.moonrise}</span>
            </div>
            <div className="weather-moon__row">
              <span className="weather-moon__row-label">Next Full Moon</span>
              <span className="weather-moon__row-val">{d.moon.nextFull}</span>
            </div>
          </div>
          <div className="weather-moon__img"><MoonSVG size={80} /></div>
        </div>
      </Card>
    </div>
  );

  /* ─────────────────── CENTER COLUMN ─────────────────── */
  const centerColumn = (
    <div className="dashboard-col-center">
      {/* Globe fills most of center */}
      <Globe />

      {/* Bottom row: Pressure | Altitude | Precipitation */}
      <div className="dashboard-center-bottom">
        <Card label="Pressure" icon="🔽">
          <PressureGauge value={d.pressure} />
        </Card>

        <Card label="Altitude" icon="🏔️">
          <div className="weather-altitude__box">
            <div className="weather-altitude__sky" />
            <div className="weather-altitude__ground" />
            <div className="weather-altitude__top-row">
              <span>{d.altitude.low}</span>
              <span>{d.altitude.high}</span>
            </div>
            <div className="weather-altitude__plus">+</div>
            <div className="weather-altitude__bottom-label">QNH {d.altitude.qnh}</div>
          </div>
        </Card>

        <Card label="Precipitation" icon="🌧️">
          <div className="weather-precip__val">{d.precipitation.mm}mm</div>
          <div className="weather-precip__sub">Today</div>
          <div className="weather-precip__note">{d.precipitation.note}</div>
        </Card>
      </div>
    </div>
  );

  /* ─────────────────── RIGHT COLUMN ─────────────────── */
  const rightColumn = (
    <div className="dashboard-col-right">

      {/* Hourly Forecast */}
      <Card label="Hourly Forecast" icon="🕐">
        <div className="weather-hourly__row">
          {d.hourly.map((h, i) => (
            <div key={i} className="weather-hourly__item">
              <span className="weather-hourly__temp">{h.temp}</span>
              {h.label && <span className="weather-hourly__label">{h.label}</span>}
            </div>
          ))}
        </div>
      </Card>

      {/* Feels Like + Suggestion */}
      <div className="dashboard-row-2-mid">
        <Card label="Feels Like Temp" icon="🌡️">
          <div className="weather-feels__val">{d.feelsLike.toFixed(2)} °C</div>
          <div className="weather-feels__chart">
            <FeelsLikeChart value={d.feelsLike} />
          </div>
        </Card>

        <Card label="Suggestion Box" icon="💡">
          <div className="weather-suggestion__text">
            Fetching weather details...
          </div>
        </Card>
      </div>

      {/* UV Index + AQI */}
      <div className="dashboard-row-2-uv">
        <Card label="UV Index" icon="☀️">
          <div className="weather-uv__table">
            <div className="weather-uv__row">
              <span className="weather-uv__row-label">UV Index</span>
              <span className="weather-uv__row-val">{d.uvIndex}</span>
            </div>
            <div className="weather-uv__row">
              <span className="weather-uv__row-label">Visibility</span>
              <span className="weather-uv__row-val">{d.visibility}</span>
            </div>
            <div className="weather-uv__row">
              <span className="weather-uv__row-label">Light Intensity</span>
              <span className="weather-uv__row-val">{d.lightIntensity}</span>
            </div>
          </div>
        </Card>

        <Card label="AQI" icon="🌫️">
          <AQIGauge value={d.aqi} label={d.aqiLabel} />
        </Card>
      </div>

      {/* 7 Days Forecast */}
      <Card label="7 Days Forecast" icon="📅">
        <ForecastList />
      </Card>
    </div>
  );

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="dashboard-shell">
      <DashboardHeader city={d.city} temp={d.temp} condition={d.condition} />
      <div className="dashboard-grid">
        {leftColumn}
        {centerColumn}
        {rightColumn}
      </div>
    </div>
  );
};

export default WeatherDashboard;
