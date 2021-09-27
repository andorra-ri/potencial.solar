<template>
	<teleport :to="`#${to}`">
		<h3>Edifici CESI {{ roof.cesi }}</h3>
		<section v-if="isUsable">
			<details open>
				<summary>{{ t('metric.installation') }}</summary>
				<metrics-list :metrics="installation" />
			</details>
			<details>
				<summary>{{ t('metric.self_supply') }} - {{ selfSupplyRatio * 100 }}%</summary>
				<input
					v-model="selfSupplyRatio"
					type="range"
					min="0"
					max="1"
					step="0.1">
				<metrics-list :metrics="selfSupply" />
			</details>
			<details open>
				<summary>{{ t('metric.economics') }}</summary>
				<metrics-list :metrics="economics" />
			</details>
			<details open>
				<summary>{{ t('metric.environment') }}</summary>
				<metrics-list :metrics="environment" />
				<a
					href="https://calculadoraco2.mediambient.ad/"
					target="blank"
					class="btn">
					{{ t('button.calculate_co2') }}
				</a>
			</details>
		</section>
		<p v-else class="not-usable">{{ t('building_not_usable') }}</p>
	</teleport>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricsList from './MetricsList.vue';
import { TARIFF_C, TARIFF_BLUE } from '/@/data-repository';
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

		const selfSupplyRatio = ref(0);

		const isUsable = computed(() => props.roof.panels > 0);

		const installation = computed(() => ({
			area: `${number(props.roof.use_area, 0)} / ${number(props.roof.area, 0)}`,
			panels: number(props.roof.panels),
			power: number(props.roof.power, 2),
			energy: number(props.roof.energy, 2),
		}));

		const selfSupplyEnergy = computed(() => props.roof.energy * selfSupplyRatio.value);
		const injectionEnergy = computed(() => props.roof.energy * (1 - selfSupplyRatio.value));
		const selfSupply = computed(() => ({
			self_energy: number(selfSupplyEnergy.value, 2),
			inject_energy: number(injectionEnergy.value, 2),
		}));

		const economics = computed(() => {
			const savings = selfSupplyEnergy.value * TARIFF_BLUE * 1000;
			const profits = injectionEnergy.value * TARIFF_C * 1000;
			const returnPeriod = (props.roof.install_cost - props.roof.grant)
				/ (savings + profits - props.roof.operation_cost);
			return {
				install_cost: number(props.roof.install_cost, 0),
				grant: number(props.roof.grant, 0),
				operation_cost: number(props.roof.operation_cost, 0),
				savings: number(savings, 0),
				profits: number(profits, 0),
				return_period: number(returnPeriod),
			};
		});

		const environment = computed(() => ({
			emission_savings: number(props.roof.emissions, 2),
			homes_eq: number(props.roof.homes_eq, 0),
		}));

		return { t, isUsable, installation, selfSupplyRatio, selfSupply, economics, environment };
	},
};
</script>
