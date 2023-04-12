<template>
  <section class="container scroll-to">
    <div id="map" />
    <component :is="popupType" :data="content.data" :to="content.name" />
    <div v-if="status" class="status">{{ t(status) }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { createMap, useMap } from '/@/services/map';
import { useRoofsRepository } from '/@/repositories';
import { PopupBuilding, PopupRoof } from '/@/components';
import { toFeatureCollection } from '/@/utils';
import type { Roof, Building } from '/@/types';
import config from '/@/config.yaml';

/*
type MarkerDescription = {
  type: string;
  coordinates: [number, number];
  text: string;
};
*/

// Only show markers on zoom > 14
/*
const zoomVisibleMarker = (map: Map, marker: any) => {
  const zoom = map.getZoom();
  if (zoom < 14) marker.remove();
  else marker.addTo(map);
};
*/

const { t } = useI18n();
const status = ref<string>();

const { addLayer, addPopup } = useMap();
const { roofs, buildings, loadRoofs } = useRoofsRepository();

const { content, bindClick } = addPopup<Roof | Building>({
  name: 'popup',
  closeOnClick: false,
});

const popupType = computed(() => {
  if (!content.value.data) return null;
  return 'meanRad' in content.value.data ? PopupRoof : PopupBuilding;
});

addLayer(computed(() => {
  const source = toFeatureCollection(roofs.value);
  const layers = config.layers.ROOFS;
  return { name: 'roofs', source, layers, onClick: bindClick };
}));

addLayer(computed(() => {
  const source = toFeatureCollection(buildings.value);
  const layers = config.layers.BUILDINGS;
  return { name: 'buildings', source, layers, onClick: bindClick };
}));

onMounted(async () => {
  try {
    status.value = 'status.LOADING_MAP';
    await createMap(config.map);

    status.value = 'status.LOADING_DATA';
    await loadRoofs();

    /*
    // Hide default style buildings to avoid confusion
    map.setLayoutProperty('building', 'visibility', 'none');

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
    */

    status.value = undefined;
  } catch {
    status.value = 'status.ERROR';
  }
});
</script>
