import { featureCollection } from '@turf/helpers';

export default function useGeoJSON() {
	// Transform the properties object of every feature
	const onProperties = (geojson, callback) => {
		const features = geojson.features.map(feature => {
			const properties = callback(feature.properties);
			return { ...feature, properties };
		});
		return featureCollection(features);
	};

	return { onProperties };
}
