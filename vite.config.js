import { defineConfig } from 'vite'
import netlify from "@netlify/vite-plugin";

export default defineConfig({
    server: {
        allowedHosts: [
            'add-profile-page--ifo-prod.netlify.app'
        ]
    },
    plugins: [netlify()],
})