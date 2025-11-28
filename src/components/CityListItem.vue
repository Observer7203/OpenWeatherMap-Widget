<template>
  <div class="city-list-item">
    <button class="drag-handle" aria-label="Drag to reorder">
      <svg viewBox="0 0 24 24" class="drag-icon">
        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    </button>

    <span class="city-name">{{ city.name }}, {{ city.country }}</span>

    <button class="remove-btn" @click="$emit('remove', city.id)" aria-label="Remove city">
      <svg viewBox="0 0 24 24" class="remove-icon">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { City } from '../types';

interface Props {
  city: City;
}

defineProps<Props>();

defineEmits<{
  remove: [cityId: string];
}>();
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.city-list-item {
  display: flex;
  align-items: center;
  padding: $spacing-sm $spacing-xs;
  background: $bg-widget;
  border-radius: $radius-sm;
  margin-bottom: $spacing-xs;

  &:hover {
    background: $bg-hover;
  }
}

.drag-handle {
  cursor: grab;
  background: transparent;
  border: none;
  padding: $spacing-xs;
  display: flex;
  align-items: center;

  &:active {
    cursor: grabbing;
  }

  .drag-icon {
    width: 20px;
    height: 20px;
    fill: $text-secondary;
  }
}

.city-name {
  flex: 1;
  margin: 0 $spacing-sm;
  color: $text-primary;
}

.remove-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: $spacing-xs;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .remove-icon {
    width: 20px;
    height: 20px;
    fill: $color-danger;
  }
}
</style>
