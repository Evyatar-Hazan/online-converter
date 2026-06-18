import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://online-converter.evyatarhazan.com',
  integrations: [react()],
  output: 'static'
});
