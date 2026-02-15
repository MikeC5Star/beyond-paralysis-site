const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				clinical: {
					bg: '#0f172a',
					card: '#1e293b',
					accent: '#00e5ff',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		plugin(function ({ addComponents }) {
			addComponents({
				'.card-glow': {
					backgroundColor: '#1e293b',
					border: '1px solid rgba(0, 229, 255, 0.15)',
					boxShadow: [
						'0 0 20px 0px rgba(0, 229, 255, 0.12)',
						'0 0 50px 0px rgba(0, 229, 255, 0.08)',
						'0 0 100px 0px rgba(0, 229, 255, 0.04)',
						'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
					].join(', '),
				},
				'.card-glow-golden': {
					backgroundColor: '#1e293b',
					border: '1px solid rgba(255, 193, 7, 0.3)',
					boxShadow: [
						'0 0 20px 0px rgba(255, 193, 7, 0.15)',
						'0 0 50px 0px rgba(255, 193, 7, 0.10)',
						'0 0 100px 0px rgba(255, 193, 7, 0.05)',
						'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
					].join(', '),
				},
			});
		}),
	],
};
