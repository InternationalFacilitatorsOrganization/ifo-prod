import { defineConfig } from 'vite'
import netlify from "@netlify/vite-plugin";

export default defineConfig({
    server: {
        allowedHosts: [
            'devserver-add-profile-page--ifo-prod.netlify.app'
        ]
    },
    plugins: [netlify()],
})