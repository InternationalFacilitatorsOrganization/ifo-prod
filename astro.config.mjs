// @ts-check
import { defineConfig } from 'astro/config';
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), clerk(), netlify()],
  vite: {
    plugins: [tailwindcss()],
  },
});