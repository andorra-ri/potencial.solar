<template>
	<teleport :to="`#${to}`">
		<h3>Edifici CESI {{ roof.cesi }}</h3>
		<section v-if="isUsable">
			<details v-for="(metrics, group) in { resource, installation }" :key="group" open>
				<summary>{{ t(`metric.${group}`) }}</summary>
				<metrics-list :metrics="metrics" />
			</details>
		</section>
		<p v-else class="not-usable">{{ t('rooftop_not_usable') }}</p>
	</teleport>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricsList from './MetricsList.vue';
import { useFormat } from '/@/utils/index';

export default {
	name: 'RoofPopup',
	components: { MetricsList },
	props: {
		to: { type: String, required: true },
		roof: { type: Object, required: true },
	},
	setup(props) {
		const { t } = useI18n();
		const { number } = useFormat('ca');

		const isUsable = computed(() => props.roof.panels > 0);
		const resource = computed(() => ({ radiation: number(props.roof.mean_rad, 0) }));

		const installation = computed(() => ({
			area: `${number(props.roof.use_area, 0)} / ${number(props.roof.area, 0)}`,
			panels: number(props.roof.panels),
			power: number(props.roof.power, 2),
			energy: number(props.roof.energy, 2),
		}));

		return { t, isUsable, resource, installation };
	},
};
</script>
