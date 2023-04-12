<template>
  <section class="iconed-list">
    <h2>{{ t('project.docs') }}</h2>
    <p v-for="doc in props.docs" :key="doc.name">
      <a :href="doc.link" target="blank">
        <img :src="`/doc-${doc.type}.svg`">
        {{ doc.name }}
      </a>
    </p>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  docs: {
    name: string;
    type: string;
    link: string;
  }[];
}>();

const { t } = useI18n();
</script>
