import { createApp } from 'vue';
import App from './App.vue';

import 'reset-css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/main.scss';

const app = createApp(App);
app.mount('#app');
