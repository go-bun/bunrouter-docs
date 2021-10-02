import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'

import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'BunRouter',
  description: 'Fast and flexible HTTP router for Go',

  theme: path.resolve(__dirname, './theme'),
  themeConfig: {
    logo: '/logo.png',

    locales: {
      '/': {
        navbar: navbar.en,
        sidebar: sidebar.en,
        editLinkText: 'Edit this page on GitHub',
      },
    },

    themePlugins: {
      git: false,
    },
  },

  evergreen: isProd,

  markdown: {
    code: {
      lineNumbers: false,
    },
  },

  plugins: [
    ['@vuepress/plugin-debug'],
    ['@vuepress/plugin-google-analytics', { id: 'G-LQ6F39WC48' }],
    [
      '@vuepress/plugin-register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
  ],
  clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts'),
})
