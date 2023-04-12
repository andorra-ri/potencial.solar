<template>
  <teleport :to="`#${to}`">
    <h3>{{ t('metric.cesi', data) }}</h3>
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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricsList from './MetricsList.vue';
import { TARIFF_C, TARIFF_BLUE } from '/@/repositories';
import { numberFormatter } from '/@/utils';
import type { Building } from '/@/types';

const props = defineProps<{
  to: string,
  data: Building,
}>();

const { t, locale } = useI18n();
const round = numberFormatter(locale.value);

const selfSupplyRatio = ref(0);

const isUsable = computed(() => props.data.panels > 0);

const installation = computed(() => {
  const { area, useArea, panels, power, energy } = props.data;
  return {
    area: `${round(useArea, 0)} / ${round(area, 0)}`,
    panels: round(panels),
    power: round(power, 2),
    energy: round(energy, 2),
  };
});

const selfSupplyEnergy = computed(() => props.data.energy * selfSupplyRatio.value);
const injectionEnergy = computed(() => props.data.energy * (1 - selfSupplyRatio.value));
const selfSupply = computed(() => ({
  selfEnergy: round(selfSupplyEnergy.value, 2),
  injectEnergy: round(injectionEnergy.value, 2),
}));

const economics = computed(() => {
  const { installCost, operationCost, grant } = props.data;
  const savings = selfSupplyEnergy.value * TARIFF_BLUE * 1000;
  const profits = injectionEnergy.value * TARIFF_C * 1000;
  const returnPeriod = (installCost - grant) / (savings + profits - operationCost);
  return {
    installCost: round(installCost, 0),
    grant: round(grant, 0),
    operationCost: round(operationCost, 0),
    savings: round(savings, 0),
    profits: round(profits, 0),
    returnPeriod: round(returnPeriod),
  };
});

const environment = computed(() => {
  const { emissions, homesEquivalent } = props.data;
  return {
    emissionSavings: round(emissions, 2),
    homesEq: round(homesEquivalent, 0),
  };
});
</script>
