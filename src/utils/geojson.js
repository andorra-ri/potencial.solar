import union from '@turf/union';
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

	// Group properties of different features into arrays to apply aggregation functions
	const groupProperties = (...features) => features.reduce((acc, feature) => {
		Object.entries(feature?.properties || {}).forEach(([name, value]) => {
			if (!acc[name]) acc[name] = [];
			acc[name].push(...(Array.isArray(value) ? value : [value]));
		});
		return acc;
	}, {});

	// Merge geometries and aggregate properties of features with the same specified property
	const mergeByProperty = (geojson, property, aggregators) => {
		const merged = Object.values(geojson.features.reduce((acc, feature) => {
			const key = feature.properties[property];
			const properties = { ...groupProperties(acc[key], feature), [property]: key };
			acc[key] = acc[key]
				? union(acc[key], feature, { properties })
				: { ...feature, properties };
			return acc;
		}, {}));

		return onProperties(featureCollection(merged), properties => (
			typeof aggregators === 'function'
				? Object.entries(properties).reduce((acc, [name, values]) => {
					acc[name] = Array.isArray(values) ? aggregators(values) : values;
					return acc;
				}, {})
				: Object.entries(aggregators || {}).reduce((acc, [name, aggregator]) => {
					acc[name] = aggregator(properties[name]);
					return acc;
				}, { [property]: properties[property] })
		));
	};

	return { onProperties, mergeByProperty };
}
