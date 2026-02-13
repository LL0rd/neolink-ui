export default defineEventHandler(async () => {
  const config = await readConfig()
  return { success: true, data: config.cameras || [] }
})
