<template>
  <teleport :to="`#${to}`">
    <h3>Edifici CESI {{ data.cesi }}</h3>
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
    data: { type: Object, required: true },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const formatNumber = numberFormatter(locale.value);

    const isUsable = computed(() => props.data.panels > 0);
    const resource = computed(() => ({ radiation: formatNumber(props.data.meanRad, 0) }));

    const installation = computed(() => ({
      area: `${formatNumber(props.data.useArea, 0)} / ${formatNumber(props.data.area, 0)}`,
      panels: formatNumber(props.data.panels),
      power: formatNumber(props.data.power, 2),
      energy: formatNumber(props.data.energy, 2),
    }));

    return { t, isUsable, resource, installation };
  },
};
</script>
