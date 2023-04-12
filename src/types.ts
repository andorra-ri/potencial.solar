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

export type Building = {
  installCost: number;
  grant: number;
  operationCost: number;
  profits: number;
  returnPeriod: number;
  emissions: number;
  homesEquivalent: number;
} & Omit<Roof, 'meanRad'>;

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
