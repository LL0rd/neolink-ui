// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,

  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
  ],

  vuetify: {
    vuetifyOptions: './app/plugins/vuetify.ts',
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/styles/main.scss',
  ],

  runtimeConfig: {
    neolinkConfigPath: process.env.NEOLINK_CONFIG_PATH || '/etc/neolink.toml',
    neolinkBinaryPath: process.env.NEOLINK_BINARY_PATH || '/usr/local/bin/neolink',
    neolinkMode: process.env.NEOLINK_MODE || 'rtsp',
    uiPassword: process.env.NEOLINK_UI_PASSWORD || '',
  },

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },
})
