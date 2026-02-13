import type { SessionInfo } from '../../shared/types/api'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(false)
  const authRequired = ref(true)
  const loading = ref(false)

  async function checkSession() {
    try {
      const res = await $fetch<{ success: boolean; data: SessionInfo }>('/api/auth/session')
      authenticated.value = res.data?.authenticated ?? false
      authRequired.value = res.data?.authRequired ?? true
    } catch {
      authenticated.value = false
    }
  }

  async function login(password: string) {
    loading.value = true
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { password },
      })
      authenticated.value = true
      return true
    } catch {
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      authenticated.value = false
    }
  }

  return {
    authenticated,
    authRequired,
    loading,
    checkSession,
    login,
    logout,
  }
})
