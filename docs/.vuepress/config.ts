import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { path } from '@vuepress/utils'
const { webpackBundler } = require('@vuepress/bundler-webpack')
const { googleAnalyticsPlugin } = require('@vuepress/plugin-google-analytics')
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')
const { searchPlugin } = require('@vuepress/plugin-search')
const { sitemapPlugin } = require('vuepress-plugin-sitemap2')
const { seoPlugin } = require('vuepress-plugin-seo2')
const { redirectPlugin } = require('vuepress-plugin-redirect')

import { localTheme } from './theme'
import { navbar, sidebar } from './configs'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Golang router',
  description: 'Fast and flexible HTTP router for Go',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    ],
  ],

  theme: localTheme({
    logo: '/logo.png',
    darkMode: false,
    contributors: false,

    navbar: navbar.en,
    sidebar: sidebar.en,

    docsRepo: 'go-bun/bunrouter-docs',
    docsBranch: 'master',
    docsDir: 'docs',
  }),
  alias: {
    '@public': path.resolve(__dirname, './public'),
  },

  evergreen: isProd,
  bundler: webpackBundler({
    configureWebpack: (config) => {
      config.module.rules.push({
        test: /\.mjs$/i,
        resolve: { byDependency: { esm: { fullySpecified: false } } },
      })
      return {}
    },
  }),

  markdown: {
    code: {
      lineNumbers: false,
    },
  },

  plugins: [
    googleAnalyticsPlugin({ id: 'G-ZX59B8KDS3' }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    searchPlugin(),
    sitemapPlugin({ hostname: 'https://bunrouter.uptrace.dev' }),
    seoPlugin({
      hostname: 'https://bunrouter.uptrace.dev',
      canonical(page) {
        return 'https://bunrouter.uptrace.dev' + page.path
      },
    }),
    redirectPlugin({
      hostname: 'https://bunrouter.uptrace.dev',
      config: {
        '/guide/getting-started.html': '/guide/golang-router.html',
        '/guide/cors.html': '/guide/golang-cors.html',
        '/guide/performance-error-monitoring.html': '/guide/golang-http-performance.html',
      },
    }),
    require('./uptrace-plugin'),
  ],
})
