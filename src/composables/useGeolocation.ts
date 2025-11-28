import { ref } from 'vue';
import { reverseGeocode } from '../services/weatherService';
import type { City } from '../types';

export function useGeolocation() {
  const isDetecting = ref(false);
  const error = ref<string | null>(null);

  const detectUserLocation = async (apiKey: string): Promise<City | null> => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported';
      return null;
    }

    isDetecting.value = true;
    error.value = null;

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const city = await reverseGeocode(latitude, longitude, apiKey);
      return city;
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = 'Location permission denied';
            break;
          case err.POSITION_UNAVAILABLE:
            error.value = 'Location unavailable';
            break;
          case err.TIMEOUT:
            error.value = 'Location request timeout';
            break;
        }
      } else {
        error.value = 'Failed to detect location';
      }
      return null;
    } finally {
      isDetecting.value = false;
    }
  };

  return {
    isDetecting,
    error,
    detectUserLocation
  };
}
