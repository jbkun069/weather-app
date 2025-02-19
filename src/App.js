import * as React from 'react';
import { useState, useEffect } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import './App.css';

const API_KEY = 'SR8WJEYWM8AH696DNKP93ZWHN';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Weather Data:', data);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getInitialLocation = () => {
      if (!navigator.geolocation) {
        fetchWeather('London');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          fetchWeather('London');
        }
      );
    };

    getInitialLocation();
  }, []);

  useEffect(() => {
    console.log('Current Conditions:', weatherData?.currentConditions);
    console.log('Weather:', weatherData?.currentConditions?.conditions);
    console.log('Temperature:', weatherData?.currentConditions?.temp);
  }, [weatherData]);

  return (
    <div className="App">
      <div className="gradient-overlay"></div>
      <div className="content">
        <div className="app-header">
          <h1 className="app-title">Weather</h1>
          <h2 className="app-subtitle">ForeCasts</h2>
        </div>
        <SearchBar onSearch={fetchWeather} />
        {error && <div className="error">{error}</div>}
        {loading && <div className="loading">Loading...</div>}
        {!loading && !error && <WeatherDisplay data={weatherData} />}
      </div>
    </div>
  );
}

export default App;