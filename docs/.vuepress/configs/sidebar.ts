import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/getting-started.md',
        '/guide/handlers.md',
        '/guide/middlewares.md',
        '/guide/error-handling.md',
        '/guide/debugging.md',
        '/guide/serving-static-files.md',
        '/guide/go-zero-downtime-restarts.md',
        '/guide/performance-error-monitoring.md',
      ],
    },
  ],
}
