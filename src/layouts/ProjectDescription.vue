<template>
  <p>{{ t('project.context') }}</p>
  <p>
    <Logo />
    {{ t('project.mission') }}
  </p>
  <p>{{ t('project.warn') }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Logo } from '/@/components';

const { t } = useI18n();
</script>
