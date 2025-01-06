import React from 'react';

function WeatherDisplay({ data }) {
  if (!data) return null;

  return (
    <div className="weather-display">
      <h2>{data.address}</h2>
      <div className="current-weather">
        <h3>Current Weather</h3>
        <p>Temperature: {data.currentConditions.temp}°C</p>
        <p>Conditions: {data.currentConditions.conditions}</p>
        <p>Humidity: {data.currentConditions.humidity}%</p>
        <p>Wind Speed: {data.currentConditions.windspeed} km/h</p>
      </div>
    </div>
  );
}

export default WeatherDisplay;