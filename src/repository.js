import union from '@turf/union';
import api from '/@/services/supabase';
import { getMeanPrice, findCost, groupBy } from '/@/utils';
import config from '/@/config.yaml';

const adaptRooftop = rooftop => {
	const { use_area: useArea, mean_rad: meanRad, ...properties } = rooftop;
	const panels = Math.floor(useArea / PANEL_AREA);
	const power = panels * PANEL_POWER;
	const energy = (meanRad * power * EFFICIENCY) / 1000;
	return { ...properties, useArea, meanRad, panels, power, energy };
};

const mergeRooftops = (building, rooftop) => ({
	cesi: rooftop.cesi,
	useArea: (building.useArea || 0) + rooftop.useArea,
	area: (building.area || 0) + rooftop.area,
	panels: (building.panels || 0) + rooftop.panels,
	sumRad: (building.sumRad || 0) + rooftop.sum_rad,
	maxRad: (building.maxRad || 0) + rooftop.max_rad,
	power: (building.power || 0) + rooftop.power,
	energy: (building.energy || 0) + rooftop.energy,
	geometry: building.geometry
		? union(building.geometry, rooftop.geometry).geometry
		: rooftop.geometry,
});

const {
	LIFESPAN,
	ENERGY: { TARIFF_C_BASE, TARIFF_BLUE_BASE, PRICE_INCREASE },
	COSTS, GRANT, GRANT_MAX, EMISSIONS_FACTOR, HOME_CONSUMPTION,
	PANEL_AREA, PANEL_POWER, EFFICIENCY,
} = config.constants;

export const TARIFF_C = getMeanPrice(TARIFF_C_BASE, PRICE_INCREASE, LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(TARIFF_BLUE_BASE, PRICE_INCREASE, LIFESPAN);

export default async function useDataRepository() {
	const TABLE = 'roofs_radiation_andorra';
	const data = await api.get(TABLE);

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
