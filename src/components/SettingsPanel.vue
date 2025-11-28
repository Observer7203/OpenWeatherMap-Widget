<template>
  <div class="settings-panel">
    <header class="panel-header">
      <h3>Settings</h3>
      <button class="close-btn" @click="$emit('close')">
        <svg viewBox="0 0 24 24" class="close-icon">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </header>

    <div class="panel-content">
      <draggable
        v-model="localCities"
        item-key="id"
        handle=".drag-handle"
        ghost-class="ghost"
        @end="onDragEnd"
        class="city-list"
      >
        <template #item="{ element }">
          <CityListItem
            :city="element"
            @remove="handleRemove"
          />
        </template>
      </draggable>

      <AddCityInput
        :existing-city-ids="existingCityIds"
        @add="handleAdd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import draggable from 'vuedraggable';
import CityListItem from './CityListItem.vue';
import AddCityInput from './AddCityInput.vue';
import type { City } from '../types';

interface Props {
  cities: City[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'add-city': [city: City];
  'remove-city': [cityId: string];
  'reorder-cities': [cities: City[]];
  close: [];
}>();

const localCities = ref<City[]>([...props.cities]);

watch(() => props.cities, (newCities) => {
  localCities.value = [...newCities];
}, { deep: true });

const existingCityIds = computed(() =>
  new Set(props.cities.map(c => c.id))
);

const onDragEnd = () => {
  emit('reorder-cities', localCities.value);
};

const handleRemove = (cityId: string) => {
  emit('remove-city', cityId);
};

const handleAdd = (city: City) => {
  emit('add-city', city);
};
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.settings-panel {
  padding: $spacing-md;
  padding-bottom: 120px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;

  h3 {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: 500;
  }
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: $spacing-xs;

  .close-icon {
    width: 24px;
    height: 24px;
    fill: $text-secondary;
  }
}

.city-list {
  margin-bottom: $spacing-md;
}

.ghost {
  opacity: 0.5;
  background: $bg-hover;
}
</style>
