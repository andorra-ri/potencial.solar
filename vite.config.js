import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import yaml from '@rollup/plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), yaml()],
	resolve: {
		alias: [
			{ find: '/@', replacement: path.resolve(__dirname, './src') },
		],
	},
});
