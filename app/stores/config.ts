import type { NeolinkConfig, NeolinkCamera, NeolinkUser, NeolinkMqtt } from '../../shared/types/config'

export const useConfigStore = defineStore('config', () => {
  const config = ref<NeolinkConfig>({ cameras: [], users: [] })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchConfig() {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data: NeolinkConfig }>('/api/config')
      config.value = res.data ?? { cameras: [], users: [] }
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to load config'
    } finally {
      loading.value = false
    }
  }

  async function fetchCameras() {
    try {
      const res = await $fetch<{ success: boolean; data: NeolinkCamera[] }>('/api/config/cameras')
      if (config.value) config.value.cameras = res.data ?? []
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to load cameras'
    }
  }

  async function getCamera(name: string): Promise<NeolinkCamera | null> {
    try {
      const res = await $fetch<{ success: boolean; data: NeolinkCamera }>(`/api/config/cameras/${encodeURIComponent(name)}`)
      return res.data ?? null
    } catch {
      return null
    }
  }

  async function addCamera(camera: NeolinkCamera) {
    await $fetch('/api/config/cameras', {
      method: 'POST',
      body: camera,
    })
    await fetchCameras()
  }

  async function updateCamera(name: string, camera: NeolinkCamera) {
    await $fetch(`/api/config/cameras/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: camera,
    })
    await fetchCameras()
  }

  async function deleteCamera(name: string) {
    await $fetch(`/api/config/cameras/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })
    await fetchCameras()
  }

  async function updateGlobalSettings(settings: Pick<NeolinkConfig, 'bind' | 'bind_port' | 'certificate' | 'tls_client_auth'>) {
    await $fetch('/api/config/global', {
      method: 'PUT',
      body: settings,
    })
    await fetchConfig()
  }

  async function updateMqttSettings(mqtt: NeolinkMqtt) {
    await $fetch('/api/config/mqtt', {
      method: 'PUT',
      body: mqtt,
    })
    await fetchConfig()
  }

  async function updateUsers(users: NeolinkUser[]) {
    await $fetch('/api/config/users', {
      method: 'PUT',
      body: users,
    })
    await fetchConfig()
  }

  const cameras = computed(() => config.value?.cameras ?? [])
  const users = computed(() => config.value?.users ?? [])
  const mqtt = computed(() => config.value?.mqtt ?? {})
  const globalSettings = computed(() => ({
    bind: config.value?.bind,
    bind_port: config.value?.bind_port,
    certificate: config.value?.certificate,
    tls_client_auth: config.value?.tls_client_auth,
  }))

  return {
    config,
    loading,
    error,
    cameras,
    users,
    mqtt,
    globalSettings,
    fetchConfig,
    fetchCameras,
    getCamera,
    addCamera,
    updateCamera,
    deleteCamera,
    updateGlobalSettings,
    updateMqttSettings,
    updateUsers,
  }
})
