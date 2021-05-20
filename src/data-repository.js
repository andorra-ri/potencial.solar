import { useGeoJSON } from '/@/utils/index';
import { constants } from '/@/config.yaml';

// Averaged energy price across panels' lifespan
const { ENERGY_PRICE, ENERGY_PRICE_INCREASE, LIFESPAN } = constants;
export const MEAN_ENERGY_PRICE = [...Array(LIFESPAN - 1)].reduce(acc => {
	acc.current *= 1 + ENERGY_PRICE_INCREASE;
	acc.sum += acc.current;
	return acc;
}, { sum: ENERGY_PRICE, current: ENERGY_PRICE }).sum / LIFESPAN;

// Data repository from rooftop layer
export default async function useDataRepository() {
	const { onProperties } = useGeoJSON();

	const response = await fetch('/rooftops.json');
	const json = await response.json();

	// Calculate rooftop variables
	const { PANEL_AREA, PANEL_POWER, EFFICIENCY } = constants;
	const rooftops = onProperties(json, properties => {
		const { use_area: useArea, mean_rad: meanRad } = properties;
		const panels = Math.floor(useArea / PANEL_AREA);
		const power = panels * PANEL_POWER;
		const energy = (meanRad * power * EFFICIENCY) / 1000;
		return { ...properties, panels, power, energy };
	});

	// Group rooftops by CESI and aggregate variables
	const { COSTS, GRANT, GRANT_MAX } = constants;
	const sum = values => values.reduce((acc, value) => acc + value, 0);
	const aggregators = { area: sum, use_area: sum, panels: sum, power: sum, energy: sum };
	const { mergeByProperty } = useGeoJSON();
	const mergedRoofs = mergeByProperty(rooftops, 'cesi', aggregators);

	// Calculate building variables
	/* eslint-disable camelcase */
	const findCost = (costs, power) => costs.find(([limit]) => power <= limit)[1];
	const buildings = onProperties(mergedRoofs, properties => {
		const { power, energy } = properties;
		const costPower = findCost(COSTS.INSTALL, power);
		const install_cost = costPower * power * 1000;
		const grant = Math.min(power * Math.min(costPower, COSTS.REF) * GRANT * 1000, GRANT_MAX);
		const operation_cost = findCost(constants.COSTS.OPERATION, power) * power;
		const profits = energy * MEAN_ENERGY_PRICE * 1000;
		const return_period = (install_cost - grant) / (profits - operation_cost);
		return { ...properties, install_cost, grant, operation_cost, profits, return_period };
	});

	return { rooftops, buildings };
}
