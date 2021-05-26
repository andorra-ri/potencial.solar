import { useGeoJSON } from '/@/utils/index';
import { constants, carto } from '/@/config.yaml';

// Averaged energy price across panels' lifespan
const getMeanPrice = (basePrice, incrementRatio, lifespan) => (
	[...Array(lifespan - 1)].reduce(acc => {
		acc.current *= 1 + incrementRatio;
		acc.sum += acc.current;
		return acc;
	}, { sum: basePrice, current: basePrice }).sum / lifespan
);

const { ENERGY: { TARIFF_C_BASE, TARIFF_BLUE_BASE, PRICE_INCREASE }, LIFESPAN } = constants;
export const TARIFF_C = getMeanPrice(TARIFF_C_BASE, PRICE_INCREASE, LIFESPAN);
export const TARIFF_BLUE = getMeanPrice(TARIFF_BLUE_BASE, PRICE_INCREASE, LIFESPAN);

// Data repository from rooftop layer
export default async function useDataRepository() {
	const { onProperties } = useGeoJSON();

	const { VITE_CARTO_TOKEN: token } = import.meta.env;
	const { user, query } = carto;
	const url = `https://${user}.carto.com/api/v2/sql?q=${query}&api_key=${token}&format=geojson`;

	try {
		const response = await fetch(url);
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
		const { mergeByProperty } = useGeoJSON();
		const mergedRoofs = mergeByProperty(rooftops, 'cesi', sum);

		// Calculate building variables
		/* eslint-disable camelcase */
		const findCost = (costs, power) => costs.find(([limit]) => power <= limit)[1];
		const buildings = onProperties(mergedRoofs, properties => {
			const { power, energy } = properties;
			const costPower = findCost(COSTS.INSTALL, power);
			const install_cost = costPower * power * 1000;
			const installationGrant = power * Math.min(costPower, COSTS.REF) * GRANT * 1000;
			const grant = Math.min(installationGrant, GRANT_MAX);
			const operation_cost = findCost(constants.COSTS.OPERATION, power) * power;
			const profits = energy * TARIFF_C * 1000;
			const return_period = (install_cost - grant) / (profits - operation_cost);
			return { ...properties, install_cost, grant, operation_cost, profits, return_period };
		});

		return { rooftops, buildings };
	} catch { throw new Error('ERROR_CARTO_LOAD'); }
}
