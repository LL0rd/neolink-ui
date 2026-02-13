export default defineEventHandler(async () => {
  const config = await readConfig()
  return {
    success: true,
    data: {
      bind: config.bind,
      bind_port: config.bind_port,
      certificate: config.certificate,
      tls_client_auth: config.tls_client_auth,
    },
  }
})
