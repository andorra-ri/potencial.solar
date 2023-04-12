<template>
  <div class="container">
    <header class="topbar">
      <Logo />
      <ul class="nav">
        <li><a href="#map">{{ t('nav.map') }}</a></li>
        <li><a href="#project">{{ t('nav.project') }}</a></li>
      </ul>
    </header>
    <h1>{{ t('tagline') }}</h1>
    <SolarMap />
    <section id="project" class="columns scroll-to">
      <div class="column column--2"><ProjectDescription /></div>
      <div class="column"><DocumentsList :docs="config.docs" /></div>
    </section>
    <footer>
      <div class="logos">
        <a href="http://www.ari.ad" target="blank" title="Andorra Recerca + Innovació">
          <img src="/logo_ari.png" alt="Andorra Recerca + Innovació">
        </a>
        +
        <a href="https://www.mediambient.ad/energia" target="blank" title="Oficina de l'Energia i del Canvi Climàtic">
          <img src="/logo_govern_andorra.png" class="logo-govern" alt="OECC">
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SolarMap, ProjectDescription, DocumentsList } from '/@/layouts';
import { Logo } from './components';
import config from '/@/config.yaml';

const { t } = useI18n();
</script>
