import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'], darkMode: 'class', theme: { extend: { colors: { crimson: '#bd1935', ink: '#10243b', cream: '#fffaf4' }, fontFamily: { sans: ['var(--font-noto)', 'sans-serif'] }, maxWidth: { app: '64rem', marketing: '72rem' }, height: { nav: '3.5rem' }, borderRadius: { app: '0.5rem' } } }, plugins: [] };
export default config;
