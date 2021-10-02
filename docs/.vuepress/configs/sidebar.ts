import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/': [
    {
      isGroup: true,
      text: 'Guide',
      children: ['/guide/README.md', '/guide/middlewares.md', '/guide/error-handling.md'],
    },
    {
      isGroup: true,
      text: 'Tutorial',
      children: ['/go-http/go-json-rest-api.md'],
    },
  ],
}
