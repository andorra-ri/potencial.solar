import type { Ref } from 'vue';
import type { Geometry, Polygon, MultiPolygon } from '@turf/helpers';

/* Domain types */

export type Roof = {
  cesi: string;
  area: number;
  useArea: number;
  meanRad: number;
  maxRad: number;
  sumRad: number;
  panels: number;
  power: number;
  energy: number;
  geometry: Polygon | MultiPolygon,
};

export type Building = Omit<Roof, 'meanRad'>;

export type Marker = {
  title: string;
  type: string;
  geometry: Geometry;
}

/* Utility types */

export type MaybeRef<T> = T | Ref<T>;

export type KeyOfAttributeType<T, K> = {
  [k in keyof T]: (T[k] extends K ? k : never)
}[keyof T];
