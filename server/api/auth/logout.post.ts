export default defineEventHandler((event) => {
  destroySession(event)
  return { success: true }
})
