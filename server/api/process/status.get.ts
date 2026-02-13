export default defineEventHandler(() => {
  return { success: true, data: getProcessStatus() }
})
