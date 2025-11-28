import type { City, WeatherData, OpenWeatherResponse } from '../types';
import { calculateDewPoint } from '../utils/formatters';

const BASE_URL = 'https://api.openweathermap.org';

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherData> {
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: OpenWeatherResponse = await response.json();
  return mapResponseToWeatherData(data);
}

export async function searchCities(
  query: string,
  apiKey: string,
  limit = 5
): Promise<City[]> {
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();
  return data.map((item: any) => ({
    id: `${item.lat.toFixed(4)}-${item.lon.toFixed(4)}`,
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon
  }));
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  apiKey: string
): Promise<City | null> {
  const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Reverse geocoding error: ${response.status}`);
  }

  const data = await response.json();
  if (data.length === 0) return null;

  const item = data[0];
  return {
    id: `${item.lat.toFixed(4)}-${item.lon.toFixed(4)}`,
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon
  };
}

function mapResponseToWeatherData(data: OpenWeatherResponse): WeatherData {
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    windSpeed: data.wind.speed,
    windDeg: data.wind.deg,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    dewPoint: calculateDewPoint(data.main.temp, data.main.humidity)
  };
}
