export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const current = await readUiSettings()
  const updated = { ...current }

  if (body.rtsp_host !== undefined) {
    updated.rtsp_host = body.rtsp_host || undefined
  }

  await writeUiSettings(updated)
  return { success: true }
})
