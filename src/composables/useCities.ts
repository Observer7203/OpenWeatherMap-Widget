import { ref, watch } from 'vue';
import type { City } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'weather-widget-cities';
const FIRST_VISIT_KEY = 'weather-widget-visited';

const cities = ref<City[]>([]);
const isFirstVisit = ref(false);

export function useCities() {
  const { save, load } = useLocalStorage();

  const loadFromStorage = () => {
    const savedCities = load<City[]>(STORAGE_KEY);
    const hasVisited = load<boolean>(FIRST_VISIT_KEY);

    if (savedCities) {
      cities.value = savedCities;
    }

    isFirstVisit.value = !hasVisited;

    if (!hasVisited) {
      save(FIRST_VISIT_KEY, true);
    }
  };

  const saveToStorage = () => {
    save(STORAGE_KEY, cities.value);
  };

  watch(cities, saveToStorage, { deep: true });

  const addCity = (city: City): boolean => {
    if (cities.value.some(c => c.id === city.id)) {
      return false;
    }
    cities.value.push(city);
    return true;
  };

  const removeCity = (cityId: string) => {
    const index = cities.value.findIndex(c => c.id === cityId);
    if (index !== -1) {
      cities.value.splice(index, 1);
    }
  };

  const reorderCities = (newOrder: City[]) => {
    cities.value = newOrder;
  };

  return {
    cities,
    isFirstVisit,
    loadFromStorage,
    addCity,
    removeCity,
    reorderCities
  };
}
