/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	plugins: [require('flowbite/plugin')],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#ffffff', // White
					150: '#e4ede5', // Very light grayish green
					250: '#cadccc', // Light grayish green
					350: '#afcbb2', // Pale green
					450: '#95ba99', // Soft green
					500: '#7BA980', // Bambusa green
					600: '#628766', // Moderate green
					700: '#49654c', // Dark green
					800: '#314333', // Deep green
					900: '#182119', // Very deep green
					1000: '#182119'
					/*
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'*/
				}
			}
		}
	}
};
