<template>
  <teleport :to="`#${to}`">
    <h3>Edifici CESI {{ roof.cesi }}</h3>
    <section v-if="isUsable">
      <details open>
        <summary>{{ t('metric.installation') }}</summary>
        <metrics-list :metrics="installation" />
      </details>
      <details>
        <summary>{{ t('metric.selfSupply') }} - {{ selfSupplyRatio * 100 }}%</summary>
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
          {{ t('button.calculateCo2') }}
        </a>
      </details>
    </section>
    <p v-else class="not-usable">{{ t('buildingNotUsable') }}</p>
  </teleport>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricsList from './MetricsList.vue';
import { TARIFF_C, TARIFF_BLUE } from '/@/repository';
import { numberFormatter } from '/@/utils';

export default {
  name: 'RoofPopup',
  components: { MetricsList },
  props: {
    to: { type: String, required: true },
    roof: { type: Object, required: true },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const formatNumber = numberFormatter(locale.value);

    const selfSupplyRatio = ref(0);

    const isUsable = computed(() => props.roof.panels > 0);

    const installation = computed(() => ({
      area: `${formatNumber(props.roof.useArea, 0)} / ${formatNumber(props.roof.area, 0)}`,
      panels: formatNumber(props.roof.panels),
      power: formatNumber(props.roof.power, 2),
      energy: formatNumber(props.roof.energy, 2),
    }));

    const selfSupplyEnergy = computed(() => props.roof.energy * selfSupplyRatio.value);
    const injectionEnergy = computed(() => props.roof.energy * (1 - selfSupplyRatio.value));
    const selfSupply = computed(() => ({
      selfEnergy: formatNumber(selfSupplyEnergy.value, 2),
      injectEnergy: formatNumber(injectionEnergy.value, 2),
    }));

    const economics = computed(() => {
      const savings = selfSupplyEnergy.value * TARIFF_BLUE * 1000;
      const profits = injectionEnergy.value * TARIFF_C * 1000;
      const returnPeriod = (props.roof.installCost - props.roof.grant)
        / (savings + profits - props.roof.operationCost);
      return {
        installCost: formatNumber(props.roof.installCost, 0),
        grant: formatNumber(props.roof.grant, 0),
        operationCost: formatNumber(props.roof.operationCost, 0),
        savings: formatNumber(savings, 0),
        profits: formatNumber(profits, 0),
        returnPeriod: formatNumber(returnPeriod),
      };
    });

    const environment = computed(() => ({
      emissionSavings: formatNumber(props.roof.emissions, 2),
      homesEq: formatNumber(props.roof.homesEq, 0),
    }));

    return { t, isUsable, installation, selfSupplyRatio, selfSupply, economics, environment };
  },
};
</script>
