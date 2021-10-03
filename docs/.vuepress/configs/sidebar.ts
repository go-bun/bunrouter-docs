import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/handlers.md',
        '/guide/middlewares.md',
        '/guide/error-handling.md',
        '/guide/performance-error-monitoring.md',
      ],
    },
  ],
}
