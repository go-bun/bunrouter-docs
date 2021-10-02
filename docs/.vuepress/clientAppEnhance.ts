import { defineClientAppEnhance } from '@vuepress/client'

export default defineClientAppEnhance(({ app, router }) => {
  router.beforeResolve((to, from, next) => {
    const redirectMap = {}

    const redirect = redirectMap[to.path]
    if (redirect) {
      window.location.href = redirect
    } else {
      next()
    }
  })
})
