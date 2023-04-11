import { createApp } from 'vue';
import i18n from './i18n';
import App from './App.vue';

import 'reset-css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapboxgl-legend/dist/style.css';
import './styles/main.scss';

const app = createApp(App);
app.use(i18n);
app.mount('#app');
