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
import type { Roof, Building, Marker } from '/@/types';
import config from '/@/config.yaml';

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

addLayer({
  name: 'markers',
  source: toFeatureCollection(config.markers.map((marker: Marker) => {
    const title = t(`markers.${marker.title}`);
    return { ...marker, title };
  })),
  layers: config.layers.MARKERS,
});

onMounted(async () => {
  try {
    status.value = 'status.LOADING_MAP';
    await createMap(config.map);

    status.value = 'status.LOADING_DATA';
    await loadRoofs();

    status.value = undefined;
  } catch {
    status.value = 'status.ERROR';
  }
});
</script>
