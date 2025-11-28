<template>
  <div class="add-city-input">
    <label class="label">Add Location:</label>
    <div class="input-wrapper">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        placeholder="Enter city name"
        @input="handleInput"
        @keydown.enter="selectFirstResult"
      />
      <button class="submit-btn" @click="selectFirstResult" :disabled="!searchResults.length">
        <svg viewBox="0 0 24 24" class="enter-icon">
          <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/>
        </svg>
      </button>
      <ul v-if="searchResults.length > 0" class="search-results">
        <li
          v-for="result in searchResults"
          :key="result.id"
          :class="{ disabled: existingCityIds.has(result.id) }"
          @click="selectCity(result)"
        >
          <span class="result-name">{{ result.name }}</span>
          <span class="result-country">, {{ result.country }}</span>
          <span v-if="result.state" class="result-state">, {{ result.state }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { searchCities } from '../services/weatherService';
import type { City } from '../types';

interface Props {
  existingCityIds: Set<string>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  add: [city: City];
}>();

const apiKey = inject<string>('apiKey', '');

const searchQuery = ref('');
const searchResults = ref<City[]>([]);
const isSearching = ref(false);

let debounceTimer: ReturnType<typeof setTimeout>;

const handleInput = () => {
  clearTimeout(debounceTimer);

  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }

  debounceTimer = setTimeout(async () => {
    isSearching.value = true;
    try {
      searchResults.value = await searchCities(searchQuery.value, apiKey);
    } catch (error) {
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300);
};

const selectCity = (city: City) => {
  if (props.existingCityIds.has(city.id)) return;

  emit('add', city);
  searchQuery.value = '';
  searchResults.value = [];
};

const selectFirstResult = () => {
  const available = searchResults.value.find(r => !props.existingCityIds.has(r.id));
  if (available) {
    selectCity(available);
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.add-city-input {
  position: relative;
  margin-top: $spacing-md;
}

.label {
  display: block;
  margin-bottom: $spacing-xs;
  color: $text-primary;
  font-size: $font-size-sm;
}

.input-wrapper {
  position: relative;
  display: flex;
  gap: $spacing-xs;

  input {
    flex: 1;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $radius-sm;
    font-size: $font-size-base;
    font-family: $font-family;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }
  }
}

.submit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: $spacing-xs;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .enter-icon {
    width: 24px;
    height: 24px;
    fill: $text-secondary;
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $bg-widget;
  border: 1px solid $border-color;
  border-radius: $radius-sm;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  box-shadow: $shadow;

  li {
    padding: $spacing-sm $spacing-md;
    cursor: pointer;

    &:hover:not(.disabled) {
      background: $bg-hover;
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.result-name {
  font-weight: 500;
}

.result-country,
.result-state {
  color: $text-secondary;
}
</style>
