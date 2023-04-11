<template>
  <div class="container">
    <header class="topbar">
      <span class="logo">potencial.s<span class="symbol">o</span>lar</span>
      <ul class="nav">
        <li><a href="#map">{{ t('nav.map') }}</a></li>
        <li><a href="#project">{{ t('nav.project') }}</a></li>
      </ul>
    </header>
    <h1>{{ t('tagline') }}</h1>
    <solar-map />
    <section id="project" class="columns scroll-to">
      <div class="column column--2">
        <p>{{ t('project.context') }}</p>
        <p>
          <span class="logo">potencial.s<span class="symbol">o</span>lar</span>
          {{ t('project.mission') }}
        </p>
        <p>{{ t('project.warn') }}</p>
      </div>
      <div class="column iconed-list">
        <h2>{{ t('project.docs') }}</h2>
        <p>
          <a href="/docs/informe_metodologia.pdf" target="blank">
            <img src="/@/assets/file-text.svg" class="icon"> Informe metodològic
          </a>
        </p>
        <p>
          <a href="https://www.mediambient.ad/renova" target="blank">
            <img src="/@/assets/link.svg" class="icon">
            Programa Renova
          </a>
        </p>
        <p>
          <a href="https://www.bopa.ad/bopa/032069/Pagines/GR20200515_10_21_59.aspx" target="blank">
            <img src="/@/assets/link.svg" class="icon">
            Reglament de la generació d’energia elèctrica
          </a>
        </p>
      </div>
    </section>
    <footer>
      <div class="logos">
        <a
          href="http://www.ari.ad"
          target="blank"
          title="Andorra Recerca + Innovació">
          <img src="/logo_ari.png" alt="Andorra Recerca + Innovació">
        </a>
        +
        <a
          href="https://www.mediambient.ad/energia"
          target="blank"
          title="Oficina de l'Energia i del Canvi Climàtic">
          <img src="/logo_govern_andorra.png" class="logo-govern" alt="OECC">
        </a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import SolarMap from '/@/components/SolarMap.vue';

export default {
  name: 'App',
  components: { SolarMap },
  setup() {
    const { t } = useI18n();
    return { t };
  },
};
</script>
