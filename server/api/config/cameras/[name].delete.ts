export default defineEventHandler(async (event) => {
  const name = decodeURIComponent(getRouterParam(event, 'name')!)
  await deleteCamera(name)
  return { success: true }
})
