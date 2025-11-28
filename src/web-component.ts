import { defineCustomElement } from 'vue';
import App from './App.vue';

const WeatherWidgetElement = defineCustomElement(App);

customElements.define('weather-widget', WeatherWidgetElement);

export default WeatherWidgetElement;
