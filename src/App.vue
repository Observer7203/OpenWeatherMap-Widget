<template>
  <div class="weather-widget">
    <template v-if="!isSettingsOpen">
      <div class="widget-header" v-if="cities.length > 0">
        <button class="settings-toggle" @click="toggleSettings" aria-label="Open settings">
          <svg viewBox="0 0 24 24" class="gear-icon">
            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>
      </div>

      <div class="weather-cards">
        <WeatherCard
          v-for="city in cities"
          :key="city.id"
          :city="city"
          :weather="weatherData[city.id]"
          :loading="loadingCities.has(city.id)"
        />
        <div v-if="cities.length === 0 && !isDetecting" class="no-cities">
          <p>No cities added.</p>
          <button @click="toggleSettings">Add location</button>
        </div>
        <div v-if="isDetecting" class="detecting">
          Detecting your location...
        </div>
      </div>
    </template>

    <SettingsPanel
      v-else
      :cities="cities"
      @add-city="handleAddCity"
      @remove-city="handleRemoveCity"
      @reorder-cities="handleReorderCities"
      @close="toggleSettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide, computed } from 'vue';
import WeatherCard from './components/WeatherCard.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import { useCities } from './composables/useCities';
import { useWeatherApi } from './composables/useWeatherApi';
import { useGeolocation } from './composables/useGeolocation';
import type { City } from './types';

interface Props {
  apiKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  apiKey: ''
});

const isSettingsOpen = ref(false);

const {
  cities,
  isFirstVisit,
  loadFromStorage,
  addCity,
  removeCity,
  reorderCities
} = useCities();

const {
  weatherData,
  loadingCities,
  fetchWeatherForCity,
  fetchWeatherForAll
} = useWeatherApi();

const { isDetecting, detectUserLocation } = useGeolocation();

provide('apiKey', props.apiKey);

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

const handleAddCity = async (city: City) => {
  addCity(city);
  await fetchWeatherForCity(city, props.apiKey);
};

const handleRemoveCity = (cityId: string) => {
  removeCity(cityId);
};

const handleReorderCities = (newOrder: City[]) => {
  reorderCities(newOrder);
};

onMounted(async () => {
  loadFromStorage();

  if (isFirstVisit.value && cities.value.length === 0) {
    const userCity = await detectUserLocation(props.apiKey);
    if (userCity) {
      await handleAddCity(userCity);
    }
  } else if (cities.value.length > 0) {
    await fetchWeatherForAll(cities.value, props.apiKey);
  }
});

watch(cities, async (newCities) => {
  if (newCities.length > 0 && !isSettingsOpen.value) {
    await fetchWeatherForAll(newCities, props.apiKey);
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
@import './styles/_variables.scss';

.weather-widget {
  font-family: $font-family;
  width: 100%;
  max-width: 300px;
  background: $bg-widget;
  border-radius: $radius-md;
  box-shadow: $shadow;
}

.widget-header {
  display: flex;
  justify-content: flex-end;
  padding: $spacing-sm $spacing-md 0;
}

.settings-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: $spacing-xs;
  border-radius: $radius-sm;
  transition: background-color 0.2s;

  &:hover {
    background: $bg-hover;
  }

  .gear-icon {
    width: 20px;
    height: 20px;
    fill: $text-secondary;
  }
}

.no-cities {
  padding: $spacing-lg;
  text-align: center;
  color: $text-secondary;

  button {
    margin-top: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: $radius-sm;
    cursor: pointer;
    font-family: $font-family;

    &:hover {
      background: #2563eb;
    }
  }
}

.detecting {
  padding: $spacing-lg;
  text-align: center;
  color: $text-secondary;
}
</style>
