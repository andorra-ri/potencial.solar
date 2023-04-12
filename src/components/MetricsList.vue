<template>
  <ul class="metrics">
    <li v-for="(metric, name) in props.metrics" :key="name">
      <em>{{ t(`metric.${name}.label`) }}</em>
      <strong>
        {{ metric }}
        <small>{{ t(`metric.${name}.unit`) }}</small>
      </strong>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  metrics: Record<string, string | number>;
}>();

const { t } = useI18n();
</script>
