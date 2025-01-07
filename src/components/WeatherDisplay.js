import React from 'react';
import { WiCloud, WiDaySunny, WiRain, WiStrongWind } from 'react-icons/wi';
import './WeatherDisplay.css';

function WeatherDisplay({ data }) {
  if (!data) return null;

const getWeatherIcon = (iconName) => {
    switch (iconName) {
        case 'cloud':
            return <WiCloud className="weather-icon" />;
        case 'rain':
            return <WiRain className="weather-icon" />;
        case 'wind':
            return <WiStrongWind className="weather-icon" />;
        default:
            return <WiDaySunny className="weather-icon" />;
    }
  };

  const hourlyForecast = data.days?.[0]?.hours?.slice(0, 6).map(hour => ({
    time: new Date(hour.datetime).getHours(),
    temp: Math.round(hour.temp),
    icon: hour.icon,
    precipitation: hour.precipprob,
    conditions: hour.conditions
  }));

  return (
    <div className="weather-card">
      {/* Main Temperature Display */}
      <div className="main-temp">
        <h1>{data.address}</h1>
        <div className="temp-display">
          <span className="temperature">{Math.round(data.currentConditions.temp)}°</span>
          <div className="condition-container">
            {getWeatherIcon(data.currentConditions.conditions)}
            <span className="condition">{data.currentConditions.conditions}</span>
          </div>
        </div>
        <div className="temp-range">
          H:{Math.round(data.days[0].tempmax)}° L:{Math.round(data.days[0].tempmin)}°
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="forecast-section">
        <h3>Hourly Forecast</h3>
        <div className="hourly-forecast">
          {hourlyForecast.map((hour, index) => (
            <div key={index} className="forecast-hour">
              <span className="time">{hour.time}:00</span>
              {getWeatherIcon(hour.conditions)}
              <span className="temp">{hour.temp}°</span>
              <span className="precipitation">{hour.precipitation}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Weather Info */}
      <div className="weather-details">
        <div className="detail-card">
          <h4>AIR QUALITY</h4>
          <div className="detail-value">3-Low Health Risk</div>
        </div>
        
        <div className="detail-grid">
          <div className="detail-item">
            <h4>UV INDEX</h4>
            <div className="detail-value">4</div>
            <div className="detail-label">Moderate</div>
          </div>
          
          <div className="detail-item">
            <h4>SUNRISE</h4>
            <div className="detail-value">
              {new Date(data.currentConditions.sunrise).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>
          
          <div className="detail-item">
            <h4>WIND</h4>
            <div className="detail-value">
              <WiStrongWind className="detail-icon" />
              {Math.round(data.currentConditions.windspeed)} km/h
            </div>
          </div>
          
          <div className="detail-item">
            <h4>RAINFALL</h4>
            <div className="detail-value">
              <WiRain className="detail-icon" />
              {data.currentConditions.precip} mm
            </div>
            <div className="detail-label">in last hour</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;