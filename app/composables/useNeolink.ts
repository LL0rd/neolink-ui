export function useNeolink() {
  const configStore = useConfigStore()
  const processStore = useProcessStore()
  const { success, error } = useNotification()

  async function initialize() {
    await Promise.all([
      configStore.fetchConfig(),
      processStore.fetchStatus(),
    ])
    processStore.startPolling()
  }

  async function restartNeolink() {
    try {
      await processStore.restart()
      success('Neolink restarted successfully')
    } catch (e: any) {
      error(e.data?.message || 'Failed to restart neolink')
    }
  }

  async function saveAndRestart(action: () => Promise<void>) {
    try {
      await action()
      success('Configuration saved')
    } catch (e: any) {
      error(e.data?.message || 'Failed to save configuration')
      throw e
    }
  }

  return {
    configStore,
    processStore,
    initialize,
    restartNeolink,
    saveAndRestart,
  }
}
