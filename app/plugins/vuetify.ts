import type { VuetifyOptions } from 'vuetify'

export default {
  defaults: {
    VBtn: {
      variant: 'flat',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
    },
    VSwitch: {
      color: 'primary',
      inset: true,
    },
    VCard: {
      elevation: 2,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#42A5F5',
          secondary: '#78909C',
          accent: '#26A69A',
          error: '#EF5350',
          warning: '#FFA726',
          info: '#29B6F6',
          success: '#66BB6A',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#546E7A',
          accent: '#009688',
          error: '#D32F2F',
          warning: '#F57C00',
          info: '#0288D1',
          success: '#388E3C',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
} satisfies VuetifyOptions
