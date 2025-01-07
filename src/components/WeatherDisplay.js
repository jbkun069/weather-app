import React from 'react';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiSnow, 
  WiThunderstorm, 
  WiFog,
  WiDayCloudy
} from 'react-icons/wi';

function WeatherDisplay({ data }) {
  if (!data) return null;

  const getWeatherIcon = (conditions, temp) => {
    const condition = conditions.toLowerCase();
    const iconSize = 50;

    // Dynamic color based on temperature
    const getTemperatureColor = (temp) => {
      if (temp >= 30) return '#ff5722';      // Hot (orange-red)
      if (temp >= 20) return '#ff9800';      // Warm (orange)
      if (temp >= 10) return '#ffc107';      // Mild (amber)
      if (temp >= 0) return '#4caf50';       // Cool (green)
      return '#2196f3';                      // Cold (blue)
    };

    // Dynamic color based on condition
    const getConditionColor = (condition) => {
      if (condition.includes('rain')) return '#2196f3';     // Blue
      if (condition.includes('snow')) return '#90a4ae';     // Blue-grey
      if (condition.includes('cloud')) return '#757575';    // Grey
      if (condition.includes('clear') || 
          condition.includes('sunny')) return '#ffd700';    // Gold
      if (condition.includes('thunder')) return '#5c6bc0';  // Indigo
      if (condition.includes('fog')) return '#b0bec5';      // Light grey
      return '#78909c';                                     // Default grey
    };

    const iconColor = condition.includes('rain') || 
                     condition.includes('snow') || 
                     condition.includes('fog') 
                     ? getConditionColor(condition) 
                     : getTemperatureColor(temp);

    const iconStyle = { color: iconColor };

    switch (true) {
      case condition.includes('sunny') || condition.includes('clear'):
        return <WiDaySunny size={iconSize} style={iconStyle} />;
      case condition.includes('partly cloudy'):
        return <WiDayCloudy size={iconSize} style={iconStyle} />;
      case condition.includes('cloudy') || condition.includes('overcast'):
        return <WiCloudy size={iconSize} style={iconStyle} />;
      case condition.includes('rain') || condition.includes('drizzle'):
        return <WiRain size={iconSize} style={iconStyle} />;
      case condition.includes('snow') || condition.includes('sleet'):
        return <WiSnow size={iconSize} style={iconStyle} />;
      case condition.includes('thunder') || condition.includes('storm'):
        return <WiThunderstorm size={iconSize} style={iconStyle} />;
      case condition.includes('fog') || condition.includes('mist'):
        return <WiFog size={iconSize} style={iconStyle} />;
      default:
        return <WiDaySunny size={iconSize} style={iconStyle} />;
    }
  };

  return (
    <div className="weather-display">
      <h2>{data.address}</h2>
      <div className="current-weather">
        <div className="weather-icon">
          {getWeatherIcon(data.currentConditions.conditions, data.currentConditions.temp)}
        </div>
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