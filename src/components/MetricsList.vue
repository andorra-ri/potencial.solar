<template>
  <ul class="metrics">
    <li v-for="(metric, name) in metrics" :key="name">
      <em>{{ t(`metric.${name}.label`) }}</em>
      <strong>
        {{ metric }}
        <small>{{ t(`metric.${name}.unit`) }}</small>
      </strong>
    </li>
  </ul>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  name: 'MetricsList',
  props: {
    metrics: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>
