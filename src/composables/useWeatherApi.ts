import { ref, reactive } from 'vue';
import type { City, WeatherData } from '../types';
import { fetchCurrentWeather } from '../services/weatherService';

const CACHE_DURATION = 10 * 60 * 1000;

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const weatherData = reactive<Record<string, WeatherData | null>>({});
const loadingCities = ref<Set<string>>(new Set());
const cache = new Map<string, CacheEntry>();

export function useWeatherApi() {
  const isCacheValid = (cityId: string): boolean => {
    const entry = cache.get(cityId);
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_DURATION;
  };

  const fetchWeatherForCity = async (
    city: City,
    apiKey: string
  ): Promise<WeatherData | null> => {
    if (isCacheValid(city.id)) {
      weatherData[city.id] = cache.get(city.id)!.data;
      return weatherData[city.id];
    }

    loadingCities.value.add(city.id);

    try {
      const data = await fetchCurrentWeather(city.lat, city.lon, apiKey);
      weatherData[city.id] = data;
      cache.set(city.id, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Weather fetch error for ${city.name}:`, error);
      weatherData[city.id] = null;
      return null;
    } finally {
      loadingCities.value.delete(city.id);
    }
  };

  const fetchWeatherForAll = async (
    cities: City[],
    apiKey: string
  ): Promise<void> => {
    await Promise.all(cities.map(city => fetchWeatherForCity(city, apiKey)));
  };

  return {
    weatherData,
    loadingCities,
    fetchWeatherForCity,
    fetchWeatherForAll
  };
}
