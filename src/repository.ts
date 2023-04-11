import union from '@turf/union';
import api, { type RoofDTO } from '/@/services/supabase';
import { getMeanPrice, findCost, groupBy } from '/@/utils';
import type { Roof, Building } from '/@/types';
import config from '/@/config.yaml';

const { panel, tariffs, costs, grants, environment } = config.constants;

const adaptRoof = (roof: RoofDTO): Roof => {
  const panels = Math.floor(roof.useArea / panel.AREA);
  const power = panels * panel.POWER;
  const energy = (roof.meanRad * power * panel.EFFICIENCY) / 1000;
  return { ...roof, panels, power, energy };
};

const mergeRoofs = (building: Building, roof: Roof): Building => ({
  cesi: roof.cesi,
  useArea: (building.useArea || 0) + roof.useArea,
  area: (building.area || 0) + roof.area,
  panels: (building.panels || 0) + roof.panels,
  sumRad: (building.sumRad || 0) + roof.sumRad,
  maxRad: (building.maxRad || 0) + roof.maxRad,
  power: (building.power || 0) + roof.power,
  energy: (building.energy || 0) + roof.energy,
  geometry: building.geometry
    ? union(building.geometry, roof.geometry)?.geometry || building.geometry
    : roof.geometry,
});

export const TARIFF_C = getMeanPrice(tariffs.C_BASE, tariffs.INCREASE, panel.LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(tariffs.BLUE_BASE, tariffs.INCREASE, panel.LIFESPAN);

export default async function useDataRepository() {
  const TABLE = 'roofs_radiation_andorra';
  const data = await api.get<RoofDTO[]>(TABLE);

  const roofs = data.map(adaptRoof);

  const buildings = groupBy(roofs, 'cesi', mergeRoofs)
    .map(building => {
      const { power, energy } = building;
      const costPower = findCost(costs.INSTALLATION, power);
      const installCost = costPower * power * 1000;
      const installationGrant = power * Math.min(costPower, costs.REFERENCE) * grants.BASE * 1000;
      const grant = Math.min(installationGrant, grants.MAX);
      const operationCost = findCost(costs.OPERATION, power) * power;
      const profits = energy * TARIFF_C * 1000;
      const returnPeriod = (installCost - grant) / (profits - operationCost);
      const emissions = (energy * environment.EMISSIONS_FACTOR) / 1000;
      const homesEq = (energy * 1000) / environment.HOME_CONSUMPTION;
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

  return { roofs, buildings };
}
