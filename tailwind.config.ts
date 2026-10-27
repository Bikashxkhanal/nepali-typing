import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { crimson: '#bd1935', ink: '#10243b', cream: '#fffaf4' }, fontFamily: { sans: ['var(--font-noto)', 'sans-serif'] } } }, plugins: [] };
export default config;
