<template>
  <div id="map" class="scroll-to">
    <roof-popup v-if="activeRoof" :roof="activeRoof" to="metrics-popup" />
    <building-popup v-if="activeBuilding" :roof="activeBuilding" to="metrics-popup" />
    <div v-if="status.type" :class="status.type">{{ t(`status.${status.message}`) }}</div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMap, useControls, useGeoJSON, useMarker, usePopup, type Map } from 'mapbox-composition';
import { feature, featureCollection } from '@turf/helpers';
import LegendControl from 'mapboxgl-legend';
import { useRoofsRepository } from '/@/repositories';
import RoofPopup from '/@/components/RoofPopup.vue';
import BuildingPopup from '/@/components/BuildingPopup.vue';
import config from '/@/config.yaml';

type MarkerDescription = {
  type: string;
  coordinates: [number, number];
  text: string;
};

const { VITE_MAPBOX_TOKEN: accessToken } = import.meta.env;

// TODO: Use proper types for all <any> after refactoring

// Only show markers on zoom > 14
const zoomVisibleMarker = (map: Map, marker: any) => {
  const zoom = map.getZoom();
  if (zoom < 14) marker.remove();
  else marker.addTo(map);
};

export default {
  name: 'SolarMap',
  components: { RoofPopup, BuildingPopup },
  setup() {
    const { t } = useI18n();
    const status = reactive<{
      type: 'waiting' | 'error' | null;
      message: string;
    }>({ type: null, message: '' });
    const activeRoof = ref<any>();
    const activeBuilding = ref<any>();

    onMounted(async () => {
      try {
        status.type = 'waiting';
        status.message = 'LOADING_DATA';
        const { roofs, buildings } = await useRoofsRepository();

        status.message = 'LOADING_MAP';
        const map = await useMap('map', { ...config.map, accessToken });
        const { addControl, addFullscreen } = useControls(map);
        addFullscreen();
        addControl('legend', 'top-left', new LegendControl({
          toggler: true,
          highlight: true,
          layers: {
            Roofs: ['fill-color'],
            Buildings: ['fill-color'],
          },
        }));

        // Hide default style buildings to avoid confusion
        map.setLayoutProperty('building', 'visibility', 'none');

        status.message = 'LOADING_LAYERS';
        const popup = usePopup(map, {
          name: 'metrics-popup',
          closeOnClick: false,
        });

        config.markers.forEach(({ type, coordinates, text }: MarkerDescription) => {
          const element = document.createElement('div');
          element.classList.add(`marker-${type}`);
          const { marker } = useMarker(map, {
            element,
            coordinates,
            popup: usePopup({ content: t(`${type}.${text}`) }),
          });
          zoomVisibleMarker(map, marker);
          map.on('zoom', () => zoomVisibleMarker(map, marker));
        });

        useGeoJSON(map, {
          name: 'roofs',
          source: featureCollection(roofs.map(roof => {
            const { geometry, ...properties } = roof;
            return feature(geometry, properties);
          })),
          layers: [config.layers.roofs],
          onClick: ({ lngLat, features }) => {
            popup.setLocation(lngLat);
            activeBuilding.value = null;
            activeRoof.value = features[0].properties;
          },
        });

        useGeoJSON(map, {
          name: 'buildings',
          source: featureCollection(buildings.map(building => {
            const { geometry, ...properties } = building;
            return feature(geometry, properties);
          })),
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
        status.message = error instanceof Error ? error.message : 'error';
      }
    });

    return { t, status, activeRoof, activeBuilding };
  },
};
</script>
