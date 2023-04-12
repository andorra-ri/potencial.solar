import union from '@turf/union';
import type { RoofDTO } from '/@/services/types';
import type { Roof, KeyOfAttributeType } from '/@/types';
import config from '/@/config.yaml';

const { panel } = config.constants;

const ROOF_SUM_ATTRIBUTES = ['area', 'useArea', 'panels', 'sumRad', 'maxRad', 'power', 'energy'] as const;

export const adaptRoof = (roof: RoofDTO): Roof => {
  const panels = Math.floor(roof.useArea / panel.AREA);
  const power = panels * panel.POWER;
  const energy = (roof.meanRad * power * panel.EFFICIENCY) / 1000;

  return { ...roof, panels, power, energy };
};

export const mergeRoofs = (roofs: Roof[]) => {
  const { cesi } = roofs[0];

  const sumAttributes = ROOF_SUM_ATTRIBUTES.reduce((acc, attribute) => {
    acc[attribute] = roofs.reduce((sum, roof) => sum + roof[attribute], 0);
    return acc;
  }, {} as Record<KeyOfAttributeType<Roof, number>, number>);

  const { geometry } = roofs.reduce((acc, roof) => (
    acc ? (union(acc.geometry, roof.geometry) ?? acc) : roof
  ), undefined as unknown as { geometry: Roof['geometry'] });

  return { cesi, ...sumAttributes, geometry };
};
