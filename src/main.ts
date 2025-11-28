import { createApp } from 'vue';
import App from './App.vue';

const API_KEY = 'b82846980a6125e682741eef220b0939';

const app = createApp(App, {
  apiKey: API_KEY
});

app.mount('#app');
