import { readFile, writeFile, rename, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { parse, stringify } from 'smol-toml'
import type { NeolinkConfig, NeolinkCamera, NeolinkUser, NeolinkMqtt } from '../../shared/types/config'

let cachedConfig: NeolinkConfig | null = null
let cacheTime = 0
const CACHE_TTL = 2000 // 2 seconds

/** Promise chain for serializing writes */
let writeChain = Promise.resolve()

function getConfigPath(): string {
  const config = useRuntimeConfig()
  return config.neolinkConfigPath
}

/** Read and parse the neolink TOML config */
export async function readConfig(): Promise<NeolinkConfig> {
  const now = Date.now()
  if (cachedConfig && (now - cacheTime) < CACHE_TTL) {
    return cachedConfig
  }

  const configPath = getConfigPath()

  try {
    await access(configPath)
  } catch {
    // Config file doesn't exist yet, return empty config
    const empty: NeolinkConfig = { cameras: [], users: [] }
    cachedConfig = empty
    cacheTime = now
    return empty
  }

  const raw = await readFile(configPath, 'utf-8')
  const parsed = parse(raw) as unknown as NeolinkConfig

  // Normalize: ensure arrays exist
  if (!parsed.cameras) parsed.cameras = []
  if (!parsed.users) parsed.users = []

  cachedConfig = parsed
  cacheTime = now
  return parsed
}

/** Atomic write: write to temp file then rename */
async function writeConfigAtomic(config: NeolinkConfig): Promise<void> {
  const configPath = getConfigPath()
  const tempPath = join(dirname(configPath), `.neolink.toml.tmp.${Date.now()}`)

  // Build a clean object for TOML serialization
  const toWrite: Record<string, unknown> = {}
  if (config.bind !== undefined) toWrite.bind = config.bind
  if (config.bind_port !== undefined) toWrite.bind_port = config.bind_port
  if (config.certificate !== undefined) toWrite.certificate = config.certificate
  if (config.tls_client_auth !== undefined) toWrite.tls_client_auth = config.tls_client_auth

  if (config.users && config.users.length > 0) {
    toWrite.users = config.users
  }

  if (config.mqtt && Object.keys(config.mqtt).length > 0) {
    toWrite.mqtt = config.mqtt
  }

  if (config.cameras && config.cameras.length > 0) {
    toWrite.cameras = config.cameras
  }

  const toml = stringify(toWrite)
  await writeFile(tempPath, toml, 'utf-8')
  await rename(tempPath, configPath)

  // Invalidate cache
  cachedConfig = config
  cacheTime = Date.now()
}

/** Serialized config write (prevents race conditions) */
export async function writeConfig(config: NeolinkConfig): Promise<void> {
  writeChain = writeChain.then(() => writeConfigAtomic(config))
  return writeChain
}

/** Add a camera to the config */
export async function addCamera(camera: NeolinkCamera): Promise<void> {
  const config = await readConfig()
  const existing = config.cameras?.find(c => c.name === camera.name)
  if (existing) {
    throw createError({ statusCode: 409, message: `Camera "${camera.name}" already exists` })
  }
  if (!config.cameras) config.cameras = []
  config.cameras.push(camera)
  await writeConfig(config)
}

/** Update a camera by name */
export async function updateCamera(name: string, camera: NeolinkCamera): Promise<void> {
  const config = await readConfig()
  const index = config.cameras?.findIndex(c => c.name === name) ?? -1
  if (index === -1) {
    throw createError({ statusCode: 404, message: `Camera "${name}" not found` })
  }
  config.cameras![index] = camera
  await writeConfig(config)
}

/** Delete a camera by name */
export async function deleteCamera(name: string): Promise<void> {
  const config = await readConfig()
  const index = config.cameras?.findIndex(c => c.name === name) ?? -1
  if (index === -1) {
    throw createError({ statusCode: 404, message: `Camera "${name}" not found` })
  }
  config.cameras!.splice(index, 1)
  await writeConfig(config)
}

/** Update global settings (bind, bind_port, certificate, tls_client_auth) */
export async function updateGlobalSettings(settings: Pick<NeolinkConfig, 'bind' | 'bind_port' | 'certificate' | 'tls_client_auth'>): Promise<void> {
  const config = await readConfig()
  if (settings.bind !== undefined) config.bind = settings.bind
  if (settings.bind_port !== undefined) config.bind_port = settings.bind_port
  if (settings.certificate !== undefined) config.certificate = settings.certificate
  if (settings.tls_client_auth !== undefined) config.tls_client_auth = settings.tls_client_auth
  await writeConfig(config)
}

/** Update MQTT settings */
export async function updateMqttSettings(mqtt: NeolinkMqtt): Promise<void> {
  const config = await readConfig()
  config.mqtt = mqtt
  await writeConfig(config)
}

/** Update the users list */
export async function updateUsers(users: NeolinkUser[]): Promise<void> {
  const config = await readConfig()
  config.users = users
  await writeConfig(config)
}
