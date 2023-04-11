<template>
  <teleport :to="`#${to}`">
    <h3>Edifici CESI {{ roof.cesi }}</h3>
    <section v-if="isUsable">
      <details v-for="(metrics, group) in { resource, installation }" :key="group" open>
        <summary>{{ t(`metric.${group}`) }}</summary>
        <metrics-list :metrics="metrics" />
      </details>
    </section>
    <p v-else class="not-usable">{{ t('roofNotUsable') }}</p>
  </teleport>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import MetricsList from './MetricsList.vue';
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

    const isUsable = computed(() => props.roof.panels > 0);
    const resource = computed(() => ({ radiation: formatNumber(props.roof.meanRad, 0) }));

    const installation = computed(() => ({
      area: `${formatNumber(props.roof.useArea, 0)} / ${formatNumber(props.roof.area, 0)}`,
      panels: formatNumber(props.roof.panels),
      power: formatNumber(props.roof.power, 2),
      energy: formatNumber(props.roof.energy, 2),
    }));

    return { t, isUsable, resource, installation };
  },
};
</script>
