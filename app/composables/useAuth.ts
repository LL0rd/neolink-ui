export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function loginAndRedirect(password: string): Promise<boolean> {
    const success = await authStore.login(password)
    if (success) {
      await router.push('/')
    }
    return success
  }

  async function logoutAndRedirect() {
    await authStore.logout()
    await router.push('/login')
  }

  return {
    ...toRefs(authStore),
    loginAndRedirect,
    logoutAndRedirect,
  }
}
