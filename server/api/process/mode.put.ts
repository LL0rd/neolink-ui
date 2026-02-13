export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = modeSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid mode. Must be "rtsp" or "mqtt".',
    })
  }

  setProcessMode(parsed.data.mode)
  return { success: true, data: { mode: parsed.data.mode } }
})
