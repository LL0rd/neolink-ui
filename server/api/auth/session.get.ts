export default defineEventHandler((event) => {
  return {
    success: true,
    data: {
      authenticated: validateSession(event),
      authRequired: isAuthRequired(),
    },
  }
})
