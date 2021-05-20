<template>
	<div id="map" />
	<roof-popup v-if="activeRoof" :roof="activeRoof" to="roof-popup" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useMap, useControls, useGeoJSON, usePopup } from 'mapbox-composition';
import LegendControl from 'mapboxgl-legend';
import useDataRepository from '/@/data-repository';
import RoofPopup from '/@/components/RoofPopup.vue';
import config from './config.yaml';

const { VITE_MAPBOX_TOKEN: accessToken } = import.meta.env;

export default {
	name: 'App',
	components: { RoofPopup },
	setup() {
		const activeRoof = ref(undefined);

		onMounted(async () => {
			const { rooftops } = await useDataRepository();

			const map = await useMap('map', { ...config.map, accessToken });
			const { addControl, addNavigation } = useControls(map);
			addNavigation();
			addControl('legend', 'top-left', new LegendControl({ toggler: true }));

			// Hide default style buildings to avoid confusion
			map.setLayoutProperty('building', 'visibility', 'none');

			const popup = usePopup(map, {
				name: 'roof-popup',
				closeOnClick: false,
			});

			useGeoJSON(map, {
				name: 'roofs',
				source: rooftops,
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
