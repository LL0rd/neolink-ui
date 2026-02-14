export default defineEventHandler(async () => {
  const settings = await readUiSettings()
  const detectedIp = detectPrimaryIp()
  return { success: true, data: { ...settings, detected_ip: detectedIp } }
})
