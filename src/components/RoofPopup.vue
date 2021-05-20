<template>
	<teleport :to="`#${to}`">
		<h2>Edifici CESI {{ roof.cesi }}</h2>
		<details v-for="(metrics, group) in { resource, installation }" :key="group" open>
			<summary>{{ t(`metric.${group}`) }}</summary>
			<ul class="metrics">
				<li v-for="(metric, name) in metrics" :key="name">
					<em>{{ t(`metric.${name}.label`) }}</em>
					<strong>{{ metric }} <small>{{ t(`metric.${name}.unit`, ' ') }}</small></strong>
				</li>
			</ul>
		</details>
	</teleport>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormat } from '/@/utils/index';

export default {
	name: 'RoofPopup',
	props: {
		to: { type: String, required: true },
		roof: { type: Object, required: true },
	},
	setup(props) {
		const { t } = useI18n();
		const { number } = useFormat('ca');

		const resource = computed(() => ({ radiation: number(props.roof.mean_rad, 0) }));

		const installation = computed(() => ({
			area: `${number(props.roof.use_area, 0)} / ${number(props.roof.area, 0)}`,
			panels: number(props.roof.panels),
			power: number(props.roof.power, 2),
			energy: number(props.roof.energy, 2),
		}));

		return { t, resource, installation };
	},
};
</script>
