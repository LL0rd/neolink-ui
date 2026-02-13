export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Always check session on first navigation
  if (!authStore.authenticated) {
    await authStore.checkSession()
  }

  // If auth not required, skip
  if (!authStore.authRequired) return

  // Allow login page
  if (to.path === '/login') {
    // Redirect to dashboard if already authenticated
    if (authStore.authenticated) {
      return navigateTo('/')
    }
    return
  }

  // Require authentication for all other pages
  if (!authStore.authenticated) {
    return navigateTo('/login')
  }
})
