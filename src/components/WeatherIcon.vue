<template>
  <div class="weather-icon">
    <img :src="iconUrl" :alt="condition" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  condition: string;
}

const props = defineProps<Props>();

const iconUrl = computed(() => {
  return `https://openweathermap.org/img/wn/${props.icon}@2x.png`;
});
</script>

<style lang="scss" scoped>
.weather-icon {
  display: inline-flex;

  img {
    width: 50px;
    height: 50px;
  }
}
</style>
