import type { Polygon, MultiPolygon } from '@turf/helpers';

export type RoofDTO = {
  cesi: string;
  area: number;
  useArea: number;
  meanRad: number;
  maxRad: number;
  sumRad: number;
  geometry: Polygon | MultiPolygon;
};
