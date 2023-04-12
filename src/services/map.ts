import { ref, readonly, watch } from 'vue';
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
import type { MaybeRef } from '/@/types';

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

/* eslint-disable no-underscore-dangle */
export const useMap = () => {
  const addLayer = (options: MaybeRef<GeoJSONLayerOptions>) => {
    const layer = ref<ReturnType<typeof useGeoJSON>>();
    (async () => {
      const resolved = await MAP.promise;
      const _options = ref(options);
      layer.value = useGeoJSON(resolved, _options.value);
      watch(_options, ({ source }) => layer.value?.updateSource(source));
    })();
    return layer;
  };

  const addPopup = <T>(options: MaybeRef<PopupOptions>) => {
    const _options = ref(options);
    const popup = ref<ReturnType<typeof usePopup>>();
    const state = ref<{ name: string, data: T | undefined}>({
      name: _options.value.name,
      data: undefined,
    });

    const bindClick = ({ lngLat, features }: MapMouseEvent) => {
      popup.value?.setLocation(lngLat);
      state.value.data = features[0].properties;
    };

    (async () => {
      const resolved = await MAP.promise;
      popup.value = usePopup(resolved, _options.value);
      watch(_options, ({ coordinates, content }) => {
        if (coordinates) popup.value?.setLocation(coordinates);
        if (content) popup.value?.setContent(content);
      });
    })();

    return { popup, content: readonly(state), bindClick };
  };

  return { addLayer, addPopup };
};
