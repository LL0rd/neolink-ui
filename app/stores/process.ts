import type { ProcessStatus } from '../../shared/types/api'

export const useProcessStore = defineStore('process', () => {
  const status = ref<ProcessStatus>({
    running: false,
    mode: 'rtsp',
  })
  const logs = ref<string[]>([])
  const loading = ref(false)

  let pollInterval: ReturnType<typeof setInterval> | null = null

  async function fetchStatus() {
    try {
      const res = await $fetch<{ success: boolean; data: ProcessStatus }>('/api/process/status')
      status.value = res.data ?? { running: false, mode: 'rtsp' }
    } catch {
      // ignore
    }
  }

  async function fetchLogs() {
    try {
      const res = await $fetch<{ success: boolean; data: string[] }>('/api/process/logs')
      logs.value = res.data ?? []
    } catch {
      // ignore
    }
  }

  async function start() {
    loading.value = true
    try {
      await $fetch('/api/process/start', { method: 'POST' })
      await fetchStatus()
    } finally {
      loading.value = false
    }
  }

  async function stop() {
    loading.value = true
    try {
      await $fetch('/api/process/stop', { method: 'POST' })
      await fetchStatus()
    } finally {
      loading.value = false
    }
  }

  async function restart() {
    loading.value = true
    try {
      await $fetch('/api/process/restart', { method: 'POST' })
      await fetchStatus()
    } finally {
      loading.value = false
    }
  }

  async function fetchMode() {
    try {
      const res = await $fetch<{ success: boolean; data: { mode: string } }>('/api/process/mode')
      status.value.mode = res.data?.mode ?? 'rtsp'
    } catch {
      // ignore
    }
  }

  async function setMode(mode: string) {
    await $fetch('/api/process/mode', {
      method: 'PUT',
      body: { mode },
    })
    status.value.mode = mode
  }

  function startPolling(intervalMs = 5000) {
    stopPolling()
    pollInterval = setInterval(() => {
      fetchStatus()
    }, intervalMs)
  }

  function stopPolling() {
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
  }

  return {
    status,
    logs,
    loading,
    fetchStatus,
    fetchLogs,
    start,
    stop,
    restart,
    fetchMode,
    setMode,
    startPolling,
    stopPolling,
  }
})
