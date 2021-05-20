import { useGeoJSON } from '/@/utils/index';
import { constants } from '/@/config.yaml';

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

	return { rooftops };
}
