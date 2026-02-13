export default defineEventHandler(async (event) => {
  const name = decodeURIComponent(getRouterParam(event, 'name')!)
  const config = await readConfig()
  const camera = config.cameras?.find(c => c.name === name)

  if (!camera) {
    throw createError({ statusCode: 404, message: `Camera "${name}" not found` })
  }

  return { success: true, data: camera }
})
