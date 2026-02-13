export default defineEventHandler(() => {
  return { success: true, data: { mode: getProcessMode() } }
})
