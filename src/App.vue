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
		<section id="project" class="columns">
			<div class="column column--2">
				<p>{{ t('project.context') }}</p>
				<p>
					<span class="logo">potencial.s<span class="symbol">o</span>lar</span>
					{{ t('project.mission') }}
				</p>
			</div>
			<div class="column">
				<h2>{{ t('project.docs') }}</h2>
				<p>
					<a href="/docs/informe_metodologia.pdf" target="blank">
						<img src="/@/assets/file-text.svg" class="icon"> Informe metodològic
					</a>
				</p>
			</div>
		</section>
		<footer>
			<a href="http://www.obsa.ad" target="blank" class="obsa">
				<img src="/@/assets/obsa.png">
			</a>
		</footer>
	</div>
</template>

<script>
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
