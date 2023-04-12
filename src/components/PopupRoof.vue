<template>
  <teleport :to="`#${to}`">
    <h3>{{ t('metric.cesi', data) }}</h3>
    <section v-if="isUsable">
      <details v-for="(metrics, group) in { resource, installation }" :key="group" open>
        <summary>{{ t(`metric.${group}`) }}</summary>
        <metrics-list :metrics="metrics" />
      </details>
    </section>
    <p v-else class="not-usable">{{ t('roofNotUsable') }}</p>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { numberFormatter } from '/@/utils';
import MetricsList from './MetricsList.vue';
import type { Roof } from '/@/types';

const props = defineProps<{
  to: string,
  data: Roof,
}>();

const { t, locale } = useI18n();
const round = numberFormatter(locale.value);

const isUsable = computed(() => props.data.panels > 0);
const resource = computed(() => ({ radiation: round(props.data.meanRad, 0) }));

const installation = computed(() => {
  const { area, useArea, panels, power, energy } = props.data;
  return {
    area: `${round(useArea, 0)} / ${round(area, 0)}`,
    panels: round(panels),
    power: round(power, 2),
    energy: round(energy, 2),
  };
});
</script>
