export default defineNitroPlugin((nitro) => {
  // Auto-start neolink on server boot
  nitro.hooks.hook('afterResponse', async () => {
    // Only start once
    const status = getProcessStatus()
    if (!status.running && !_started) {
      _started = true
      try {
        const config = useRuntimeConfig()
        setProcessMode(config.neolinkMode || 'rtsp')
        await startProcess()
        console.log('[neolink-ui] Neolink process auto-started')
      } catch (err) {
        console.error('[neolink-ui] Failed to auto-start neolink:', err)
      }
    }
  })

  // Graceful shutdown
  nitro.hooks.hook('close', () => {
    console.log('[neolink-ui] Shutting down neolink process...')
    killProcess()
  })
})

let _started = false
