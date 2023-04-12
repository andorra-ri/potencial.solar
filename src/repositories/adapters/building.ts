import { getMeanPrice, findCost } from '/@/utils';
import type { Roof, Building } from '/@/types';
import config from '/@/config.yaml';

const { panel, tariffs, costs, grants, environment } = config.constants;

const TARIFF_C = getMeanPrice(tariffs.C_BASE, tariffs.INCREASE, panel.LIFESPAN);

export const adaptBuilding = (building: Roof): Building => {
  const { power, energy } = building;
  const costPower = findCost(costs.INSTALLATION, power);
  const installCost = costPower * power * 1000;
  const installationGrant = power * Math.min(costPower, costs.REFERENCE) * grants.BASE * 1000;
  const grant = Math.min(installationGrant, grants.MAX);
  const operationCost = findCost(costs.OPERATION, power) * power;
  const profits = energy * TARIFF_C * 1000;
  const returnPeriod = (installCost - grant) / (profits - operationCost);
  const emissions = (energy * environment.EMISSIONS_FACTOR) / 1000;
  const homesEquivalent = (energy * 1000) / environment.HOME_CONSUMPTION;
  return {
    ...building,
    installCost,
    grant,
    operationCost,
    profits,
    returnPeriod,
    emissions,
    homesEquivalent,
  };
};
