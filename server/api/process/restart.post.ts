export default defineEventHandler(async () => {
  await restartProcess()
  return { success: true, data: getProcessStatus() }
})
