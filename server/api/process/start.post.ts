export default defineEventHandler(async () => {
  await startProcess()
  return { success: true, data: getProcessStatus() }
})
