import { ref, watch, type Ref } from 'vue';
import {
  useMap as useMapbox,
  useControls,
  useGeoJSON,
  // useMarker,
  usePopup,
  type Map,
  type GeoJSONLayerOptions,
  type PopupOptions,
  type MapOptions,
  type MapMouseEvent,
} from 'mapbox-composition';
// import { feature, featureCollection } from '@turf/helpers';
import LegendControl, { type LegendControlOptions } from 'mapboxgl-legend';
import { Deferred } from '/@/utils';

export type { MapMouseEvent };

const { VITE_MAPBOX_TOKEN } = import.meta.env;

const MAP = new Deferred<Map>();

export const createMap = async (options: MapOptions & { legend: LegendControlOptions }) => {
  const { legend, controls, ...rest } = options;
  const map = await useMapbox('map', {
    ...rest,
    accessToken: VITE_MAPBOX_TOKEN,
  });
  const { addControl, addFullscreen } = useControls(map);
  if (legend) addControl('legend', 'top-left', new LegendControl(legend));
  addFullscreen();

  MAP.resolve(map);
};

export const useMap = () => {
  const addLayer = (options: Ref<GeoJSONLayerOptions>) => {
    const layer = ref<ReturnType<typeof useGeoJSON>>();
    (async () => {
      const resolved = await MAP.promise;
      layer.value = useGeoJSON(resolved, options.value);
      watch(options, ({ source }) => layer.value?.updateSource(source));
    })();
    return layer;
  };

  const addPopup = (options: Ref<PopupOptions>) => {
    const popup = ref<ReturnType<typeof usePopup>>();
    (async () => {
      const resolved = await MAP.promise;
      popup.value = usePopup(resolved, options.value);
      watch(options, ({ coordinates, content }) => {
        if (coordinates) popup.value?.setLocation(coordinates);
        if (content) popup.value?.setContent(content);
      });
    })();
    return popup;
  };

  return { addLayer, addPopup };
};
