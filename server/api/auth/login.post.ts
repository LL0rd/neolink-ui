export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  if (!isAuthRequired()) {
    return { success: true, data: { authenticated: true } }
  }

  if (!verifyPassword(parsed.data.password)) {
    throw createError({ statusCode: 401, message: 'Invalid password' })
  }

  createSession(event)
  return { success: true, data: { authenticated: true } }
})
