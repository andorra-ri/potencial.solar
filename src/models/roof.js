const PANEL_POWER = 0.3;
const EFFICIENCY = 0.83; // 83%
const COSTS = {
	INSTALL: [[2, 1.64], [6, 1.36], [20, 1.25], [50, 1.16], [Infinity, 1.04]],
	OPERATION: [[50, 25], [Infinity, 18]],
};

const findCost = (costs, power) => costs.find(([limit]) => power <= limit)[1];

export default attrs => {
	const { cesi, area: totalArea, use_area: usefulArea, mean_rad: meanRadiation } = attrs;

	// Installation
	const panels = Math.floor(usefulArea / 1.7);
	const power = panels * PANEL_POWER;
	const energy = (meanRadiation * power * EFFICIENCY) / 1000;

	// Costs
	const installCost = findCost(COSTS.INSTALL, power) * power * 1000;
	const operationCost = findCost(COSTS.OPERATION, power) * power;

	return {
		cesi,
		totalArea,
		usefulArea,
		meanRadiation,
		panels,
		power,
		energy,
		installCost,
		operationCost,
	};
};
