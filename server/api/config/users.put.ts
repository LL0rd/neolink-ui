export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = usersSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: `Validation error: ${parsed.error.issues.map(i => i.message).join(', ')}`,
    })
  }

  await updateUsers(parsed.data)
  return { success: true }
})
