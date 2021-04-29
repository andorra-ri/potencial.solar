<template>
	<teleport :to="`#${to}`">
		<ul class="metrics">
			<li v-for="metric in metrics" :key="metric.name">
				<em>{{ metric.name }}</em>
				<strong>
					{{ metric.value }}
					<small v-if="metric.unit">{{ metric.unit }}</small>
				</strong>
			</li>
		</ul>
	</teleport>
</template>

<script>
import { computed } from 'vue';
import { round } from '/@/utils';

export default {
	name: 'RoofPopup',
	props: {
		to: { type: String, required: true },
		roof: { type: Object, required: true },
	},
	setup(props) {
		const metrics = computed(() => ({
			cesi: { name: 'CESI', value: props.roof.cesi },
			area: {
				name: 'Àrea útil / total',
				value: `${round(props.roof.usefulArea)} / ${round(props.roof.totalArea)}`,
				unit: 'm2',
			},
			meanRadiation: { name: 'Insolació', value: round(props.roof.meanRadiation), unit: 'kWh/m2' },
			panels: { name: '# Mòduls', value: props.roof.panels },
			power: { name: 'Potència', value: round(props.roof.power, 2), unit: 'kWp' },
			energy: { name: 'Energia', value: round(props.roof.energy, 2), unit: 'MWh' },
			installCost: { name: 'Inversió', value: round(props.roof.installCost), unit: '€' },
			operationCost: { name: 'Cost operació', value: round(props.roof.operationCost), unit: '€' },
		}));
		return { metrics };
	},
};
</script>
