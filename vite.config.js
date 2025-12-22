import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        allowedHosts: [
            'devserver-add-profile-page--ifo-prod.netlify.app'
        ]
    }
})