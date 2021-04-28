<template>
	<div id="map" />
</template>

<script>
import { onMounted } from 'vue';
import { useMap, useControls } from 'mapbox-composition';
import config from './config.yaml';

const { VITE_MAPBOX_TOKEN: accessToken } = import.meta.env;

export default {
	name: 'App',
	setup() {
		onMounted(async () => {
			const map = await useMap('map', { ...config.map, accessToken });
			const { addNavigation } = useControls(map);
			addNavigation();
		});

		return {};
	},
};
</script>
