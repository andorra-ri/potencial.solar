<template>
	<div id="map" />
	<roof-popup v-if="activeRoof" :roof="activeRoof" to="roof-popup" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMap, useControls, useGeoJSON, usePopup } from 'mapbox-composition';
import config from './config.yaml';

import ROOFS from './assets/roofs.json';
import RoofPopup from '/@/components/RoofPopup.vue';

const { VITE_MAPBOX_TOKEN: accessToken } = import.meta.env;

export default {
	name: 'App',
	components: { RoofPopup },
	setup() {
		const activeRoof = ref(undefined);

		onMounted(async () => {
			const map = await useMap('map', { ...config.map, accessToken });
			const { addNavigation } = useControls(map);
			addNavigation();

			const popup = usePopup(map, {
				name: 'roof-popup',
				closeOnClick: false,
			});

			useGeoJSON(map, {
				name: 'roofs',
				source: ROOFS,
				layers: [config.layers.roofs],
				onClick: ({ lngLat, features }) => {
					popup.setLocation(lngLat);
					activeRoof.value = features[0].properties;
				},
			});
		});

		return { activeRoof };
	},
};
</script>
