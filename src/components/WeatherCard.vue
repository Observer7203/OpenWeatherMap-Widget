<template>
  <div class="weather-card">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <template v-else-if="weather">
      <div class="card-header">
        <h3 class="city-name">{{ city.name }}, {{ city.country }}</h3>
        <WeatherIcon :icon="weather.icon" :condition="weather.condition" />
      </div>

      <div class="temperature">
        <span class="temp-value">{{ weather.temp }}</span>
        <span class="temp-unit">C</span>
      </div>

      <p class="description">
        Feels like {{ weather.feelsLike }}C. {{ weather.description }}.
      </p>

      <div class="details">
        <div class="detail-row">
          <div class="detail-item">
            <span class="wind-arrow" :style="{ transform: `rotate(${weather.windDeg}deg)` }"></span>
            <span>{{ weather.windSpeed }}m/s {{ formatWindDirection(weather.windDeg) }}</span>
          </div>
          <div class="detail-item">
            <span>{{ weather.pressure }}hPa</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span>Humidity: {{ weather.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span>Dew point: {{ weather.dewPoint }}C</span>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span>Visibility: {{ formatVisibility(weather.visibility) }}</span>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="error">
      Unable to load weather data
    </div>
  </div>
</template>

<script setup lang="ts">
import WeatherIcon from './WeatherIcon.vue';
import type { City, WeatherData } from '../types';
import { formatVisibility, formatWindDirection } from '../utils/formatters';

interface Props {
  city: City;
  weather: WeatherData | null;
  loading: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.weather-card {
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.city-name {
  font-size: $font-size-base;
  font-weight: 500;
  margin: 0;
  color: $text-primary;
}

.temperature {
  display: flex;
  align-items: flex-start;
  margin: $spacing-sm 0;
}

.temp-value {
  font-size: 48px;
  font-weight: 300;
  line-height: 1;
  color: $text-primary;
}

.temp-unit {
  font-size: $font-size-lg;
  color: $text-secondary;
  margin-left: 2px;
}

.description {
  color: $text-secondary;
  margin: 0 0 $spacing-md;
  font-size: $font-size-sm;
  text-transform: capitalize;
}

.details {
  font-size: $font-size-sm;
  color: $text-primary;
}

.detail-row {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-xs;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.wind-arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid $text-primary;
}

.loading,
.error {
  padding: $spacing-lg;
  text-align: center;
  color: $text-secondary;
}
</style>
