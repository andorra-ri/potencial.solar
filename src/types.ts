import type { Polygon, MultiPolygon } from '@turf/helpers';

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

/* Utility types */
export type KeyOfAttributeType<T, K> = {
  [k in keyof T]: (T[k] extends K ? k : never)
}[keyof T];
