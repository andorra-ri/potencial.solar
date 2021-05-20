<template>
	<teleport :to="`#${to}`">
		<h2>Edifici CESI {{ roof.cesi }}</h2>
		<details v-for="(metrics, group) in { installation, economics }" :key="group" open>
			<summary>{{ group }}</summary>
			<ul class="metrics">
				<li v-for="(metric, name) in metrics" :key="name">
					<em>{{ name }}</em>
					<strong>{{ metric }} <small>unit</small></strong>
				</li>
			</ul>
		</details>
	</teleport>
</template>

<script>
import { computed } from 'vue';
import { useFormat } from '/@/utils/index';

export default {
	name: 'RoofPopup',
	props: {
		to: { type: String, required: true },
		roof: { type: Object, required: true },
	},
	setup(props) {
		const { number } = useFormat('ca');

		const installation = computed(() => ({
			area: `${number(props.roof.use_area, 0)} / ${number(props.roof.area, 0)}`,
			panels: number(props.roof.panels),
			power: number(props.roof.power, 2),
			energy: number(props.roof.energy, 2),
		}));

		const economics = computed(() => ({
			install_cost: number(props.roof.install_cost),
			grant: number(props.roof.grant),
			operation_cost: number(props.roof.operation_cost),
			profits: number(props.roof.profits),
			return_period: number(props.roof.return_period),
		}));

		return { installation, economics };
	},
};
</script>
