import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import yaml from '@modyfi/vite-plugin-yaml';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		yaml(),
		vueI18n({
			compositionOnly: true,
			include: [path.resolve(__dirname, './src/locales/**')],
		}),
	],
	css: { postcss: { plugins: [autoprefixer()] } },
	resolve: {
		alias: [
			{ find: '/@', replacement: path.resolve(__dirname, './src') },
		],
	},
});
