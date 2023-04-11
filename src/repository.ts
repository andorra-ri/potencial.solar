import union from '@turf/union';
import api, { type RoofDTO } from '/@/services/supabase';
import { getMeanPrice, findCost, groupBy } from '/@/utils';
import type { Roof, Building } from '/@/types';
import config from '/@/config.yaml';

const {
  LIFESPAN,
  ENERGY: { TARIFF_C_BASE, TARIFF_BLUE_BASE, PRICE_INCREASE },
  COSTS, GRANT, GRANT_MAX, EMISSIONS_FACTOR, HOME_CONSUMPTION,
  PANEL_AREA, PANEL_POWER, EFFICIENCY,
} = config.constants;

const adaptRooftop = (roof: RoofDTO): Roof => {
  const panels = Math.floor(roof.useArea / PANEL_AREA);
  const power = panels * PANEL_POWER;
  const energy = (roof.meanRad * power * EFFICIENCY) / 1000;
  return { ...roof, panels, power, energy };
};

const mergeRooftops = (building: Building, rooftop: Roof): Building => ({
  cesi: rooftop.cesi,
  useArea: (building.useArea || 0) + rooftop.useArea,
  area: (building.area || 0) + rooftop.area,
  panels: (building.panels || 0) + rooftop.panels,
  sumRad: (building.sumRad || 0) + rooftop.sumRad,
  maxRad: (building.maxRad || 0) + rooftop.maxRad,
  power: (building.power || 0) + rooftop.power,
  energy: (building.energy || 0) + rooftop.energy,
  geometry: building.geometry
    ? union(building.geometry, rooftop.geometry)?.geometry || building.geometry
    : rooftop.geometry,
});

export const TARIFF_C = getMeanPrice(TARIFF_C_BASE, PRICE_INCREASE, LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(TARIFF_BLUE_BASE, PRICE_INCREASE, LIFESPAN);

export default async function useDataRepository() {
  const TABLE = 'roofs_radiation_andorra';
  const data = await api.get<RoofDTO[]>(TABLE);

  const rooftops = data.map(adaptRooftop);

  const buildings = groupBy(rooftops, 'cesi', mergeRooftops)
    .map(building => {
      const { power, energy } = building;
      const costPower = findCost(COSTS.INSTALL, power);
      const installCost = costPower * power * 1000;
      const installationGrant = power * Math.min(costPower, COSTS.REF) * GRANT * 1000;
      const grant = Math.min(installationGrant, GRANT_MAX);
      const operationCost = findCost(COSTS.OPERATION, power) * power;
      const profits = energy * TARIFF_C * 1000;
      const returnPeriod = (installCost - grant) / (profits - operationCost);
      const emissions = (energy * EMISSIONS_FACTOR) / 1000;
      const homesEq = (energy * 1000) / HOME_CONSUMPTION;
      return {
        ...building,
        installCost,
        grant,
        operationCost,
        profits,
        returnPeriod,
        emissions,
        homesEq,
      };
    });

  return { rooftops, buildings };
}
