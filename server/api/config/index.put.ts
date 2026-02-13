export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await writeConfig(body)
  return { success: true }
})
