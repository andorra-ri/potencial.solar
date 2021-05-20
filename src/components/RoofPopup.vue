<template>
	<teleport :to="`#${to}`">
		<h2>Edifici CESI {{ roof.cesi }}</h2>
		<details open>
			<summary>Recurs solar</summary>
			<ul class="metrics">
				<li v-for="metric in resource" :key="metric.name">
					<em>{{ metric.name }}</em>
					<strong>{{ metric.value }} <small>{{ metric.unit }}</small></strong>
				</li>
			</ul>
		</details>
		<details open>
			<summary>Instal·lació</summary>
			<ul class="metrics">
				<li v-for="metric in installation" :key="metric.name">
					<em>{{ metric.name }}</em>
					<strong>{{ metric.value }} <small>{{ metric.unit }}</small></strong>
				</li>
			</ul>
		</details>
		<details open>
			<summary>Autoconsum {{ selfSupply * 100 }}%</summary>
			<input
				v-model="selfSupply"
				type="range"
				min="0"
				max="1"
				step="0.1">
			<p class="">{{ selfEnergy }} <small>MWh/any</small></p>
		</details>
		<details open>
			<summary>Econòmic</summary>
			<ul class="metrics">
				<li v-for="metric in economics" :key="metric.name">
					<em>{{ metric.name }}</em>
					<strong>{{ metric.value }} <small>{{ metric.unit }}</small></strong>
				</li>
			</ul>
		</details>
	</teleport>
</template>

<script>
import { ref, computed } from 'vue';
import { useFormat } from '/@/utils/index';
import { constants } from '/@/config.yaml';

const { COSTS, ENERGY_PRICE, ENERGY_INJECT_PRICE } = constants;
const findCost = (costs, power) => costs.find(([limit]) => power <= limit)[1];

export default {
	name: 'RoofPopup',
	props: {
		to: { type: String, required: true },
		roof: { type: Object, required: true },
	},
	setup(props) {
		const { number } = useFormat('ca');
		const selfSupply = ref(0.5);

		const resource = computed(() => [
			{ name: 'Irradiació', value: number(props.roof.mean_rad, 0), unit: 'Wh/m2' },
		]);

		const installation = computed(() => [
			{
				name: 'Àrea útil / total',
				value: `${number(props.roof.use_area, 0)} / ${number(props.roof.area, 0)}`,
				unit: 'm2',
			},
			{ name: 'Mòduls', value: number(props.roof.panels) },
			{ name: 'Potència', value: number(props.roof.power, 2), unit: 'kWp' },
			{ name: 'Energia', value: number(props.roof.energy, 2), unit: 'MWh/any' },
		]);

		// Costs
		const economics = computed(() => {
			const installCost = findCost(COSTS.INSTALL, props.roof.power) * props.roof.power * 1000;
			const operationCost = findCost(COSTS.OPERATION, props.roof.power) * props.roof.power;
			const savings = props.roof.energy * selfSupply.value * ENERGY_PRICE * 1000;
			const earning = props.roof.energy * (1 - selfSupply.value) * ENERGY_INJECT_PRICE * 1000;
			const returnPeriod = installCost / (savings + earning - operationCost);
			return [
				{ name: 'Inversió', value: number(installCost), unit: '€' },
				{ name: 'Cost operació', value: number(operationCost), unit: '€ / any' },
				{ name: 'Estalvi autoconsum', value: number(savings), unit: '€ / any' },
				{ name: "Guany d'injecció", value: number(earning), unit: '€ / any' },
				{ name: 'Període retorn', value: number(returnPeriod, 1), unit: 'anys' },
			];
		});

		const selfEnergy = computed(() => number(selfSupply.value * props.roof.energy));

		return { resource, installation, economics, selfSupply, selfEnergy };
	},
};
</script>
