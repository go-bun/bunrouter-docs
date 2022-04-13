import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Getting started', link: '/guide/golang-router.html' },
        { text: 'Middlewares', link: '/guide/golang-http-middlewares.html' },
        { text: 'HTTP error handling', link: '/guide/golang-http-error-handling.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Tutorials',
      children: [
        { text: 'HTTP performance monitoring', link: '/guide/golang-http-performance.html' },
        { text: 'Logging and Debugging', link: '/guide/golang-router-logging.html' },
        { text: 'Route handlers', link: '/guide/golang-http-handlers.html' },
        { text: 'Gzip compression', link: '/guide/golang-http-gzip.html' },
        { text: 'CORS', link: '/guide/golang-cors.html' },
        { text: 'Recovering from panics', link: '/guide/golang-http-panics.html' },
        { text: 'Serving static files', link: '/guide/serving-static-files.html' },
      ],
    },
    {
      isGroup: true,
      text: 'Misc',
      children: [
        {
          text: 'Zero-downtime restarts and deploys',
          link: '/guide/go-zero-downtime-restarts.html',
        },
      ],
    },
  ],
}
