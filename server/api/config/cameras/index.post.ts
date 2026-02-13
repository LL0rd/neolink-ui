export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = cameraSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: `Validation error: ${parsed.error.issues.map(i => i.message).join(', ')}`,
    })
  }

  await addCamera(parsed.data)
  return { success: true, data: parsed.data }
})
