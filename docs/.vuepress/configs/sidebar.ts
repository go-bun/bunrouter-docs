import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/getting-started.md',
        '/guide/middlewares.md',
        '/guide/error-handling.md',
      ],
    },
    {
      isGroup: true,
      text: 'Tutorials',
      children: [
        '/guide/performance-error-monitoring.md',
        '/guide/debugging.md',
        '/guide/handlers.md',
        '/guide/gzip-compression.md',
        '/guide/cors.md',
        '/guide/panics.md',
        '/guide/serving-static-files.md',
      ],
    },
    {
      isGroup: true,
      text: 'Misc',
      children: ['/guide/go-zero-downtime-restarts.md'],
    },
  ],
}
