export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Skip auth for auth routes
  if (url.pathname.startsWith('/api/auth/')) return

  // Skip auth for non-API routes
  if (!url.pathname.startsWith('/api/')) return

  if (!validateSession(event)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
