<template>
	<div id="map">
		<roof-popup v-if="activeRoof" :roof="activeRoof" to="metrics-popup" />
		<building-popup v-if="activeBuilding" :roof="activeBuilding" to="metrics-popup" />
		<div v-if="status.type" :class="status.type">{{ t(`status.${status.message}`) }}</div>
	</div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMap, useControls, useGeoJSON, usePopup } from 'mapbox-composition';
import LegendControl from 'mapboxgl-legend';
import useDataRepository from '/@/data-repository';
import RoofPopup from '/@/components/RoofPopup.vue';
import BuildingPopup from '/@/components/BuildingPopup.vue';
import config from '/@/config.yaml';

const { VITE_MAPBOX_TOKEN: accessToken } = import.meta.env;

export default {
	name: 'SolarMap',
	components: { RoofPopup, BuildingPopup },
	setup() {
		const { t } = useI18n();
		const status = reactive({ type: undefined, message: undefined });
		const activeRoof = ref(undefined);
		const activeBuilding = ref(undefined);

		onMounted(async () => {
			try {
				status.type = 'waiting';
				status.message = 'LOADING_DATA';
				const { rooftops, buildings } = await useDataRepository();

				status.message = 'LOADING_MAP';
				const map = await useMap('map', { ...config.map, accessToken });
				const { addControl, addNavigation } = useControls(map);
				addNavigation();
				addControl('legend', 'top-left', new LegendControl({ toggler: true }));

				// Hide default style buildings to avoid confusion
				map.setLayoutProperty('building', 'visibility', 'none');

				status.message = 'LOADING_LAYERS';
				const popup = usePopup(map, {
					name: 'metrics-popup',
					closeOnClick: false,
				});

				useGeoJSON(map, {
					name: 'roofs',
					source: rooftops,
					layers: [config.layers.roofs],
					onClick: ({ lngLat, features }) => {
						popup.setLocation(lngLat);
						activeBuilding.value = null;
						activeRoof.value = features[0].properties;
					},
				});

				useGeoJSON(map, {
					name: 'buildings',
					source: buildings,
					layers: [config.layers.buildings],
					onClick: ({ lngLat, features }) => {
						popup.setLocation(lngLat);
						activeRoof.value = null;
						activeBuilding.value = features[0].properties;
					},
				});

				status.type = null;
			} catch (error) {
				status.type = 'error';
				status.message = error.message;
			}
		});

		return { t, status, activeRoof, activeBuilding };
	},
};
</script>
