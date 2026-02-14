import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { networkInterfaces } from 'node:os'
import type { UiSettings } from '../../shared/types/ui-settings'

function getSettingsPath(): string {
  const config = useRuntimeConfig()
  const configDir = dirname(config.neolinkConfigPath)
  return join(configDir, 'ui-settings.json')
}

/** Detect the primary non-loopback IPv4 address */
export function detectPrimaryIp(): string {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

/** Read UI settings from JSON file */
export async function readUiSettings(): Promise<UiSettings> {
  try {
    const raw = await readFile(getSettingsPath(), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

/** Write UI settings to JSON file */
export async function writeUiSettings(settings: UiSettings): Promise<void> {
  await writeFile(getSettingsPath(), JSON.stringify(settings, null, 2), 'utf-8')
}

/** Get the host to display in RTSP URLs: custom override > detected IP */
export async function getRtspHost(): Promise<string> {
  const settings = await readUiSettings()
  return settings.rtsp_host || detectPrimaryIp()
}
