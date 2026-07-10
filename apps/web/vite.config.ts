import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': '/src'
		}
	},
	build: {
		sourcemap: true
	},
	server: {
		proxy: {
			'/api': {
				target: `http://localhost:${process.env.API_PORT || 3001}`,
				changeOrigin: true
			}
		}
	}
});
