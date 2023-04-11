import type { Polygon, MultiPolygon } from '@turf/helpers';

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
