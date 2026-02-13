export default defineEventHandler(async () => {
  await stopProcess()
  return { success: true, data: getProcessStatus() }
})
