export default defineEventHandler(async (event) => {
  const name = decodeURIComponent(getRouterParam(event, 'name')!)
  const body = await readBody(event)
  const parsed = cameraSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: `Validation error: ${parsed.error.issues.map(i => i.message).join(', ')}`,
    })
  }

  await updateCamera(name, parsed.data)
  return { success: true, data: parsed.data }
})
