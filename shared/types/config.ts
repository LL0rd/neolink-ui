/** Neolink camera pause configuration */
export interface CameraPause {
  on_motion?: boolean
  on_disconnect?: boolean
  motion_timeout?: number
  mode?: 'none' | 'sleep' | 'black'
}

/** Camera-level MQTT overrides */
export interface CameraMqtt {
  enable_motion?: boolean
  enable_light?: boolean
  enable_battery?: boolean
  enable_preview?: boolean
  enable_floodlight?: boolean
  motion_update_interval?: number
  light_update_interval?: number
  battery_update_interval?: number
  preview_update_interval?: number
  floodlight_update_interval?: number
}

/** HA Discovery configuration per camera */
export interface CameraDiscovery {
  topic?: string
  features?: string[]
}

/** Stream configuration */
export interface CameraStream {
  name: string
  resolution?: string
}

/** A single [[cameras]] entry */
export interface NeolinkCamera {
  name: string
  username?: string
  password?: string
  address?: string
  uid?: string
  stream?: string
  channel_id?: number
  permitted_users?: string[]
  discovery?: CameraDiscovery
  max_encryption?: string
  enabled?: boolean
  debug?: boolean
  strict?: boolean
  update_time?: boolean
  idle_disconnect?: boolean
  push_notifications?: boolean
  buffer_duration?: number
  use_splash?: boolean
  splash_pattern?: string
  max_discovery_retries?: number
  print_format?: string
  pause?: CameraPause
  mqtt?: CameraMqtt
}

/** A single [[users]] entry */
export interface NeolinkUser {
  name: string
  pass?: string
}

/** Global MQTT broker configuration */
export interface NeolinkMqtt {
  broker_addr?: string
  port?: number
  credentials?: [string, string]
  ca?: string
  client_auth?: {
    certificate?: string
    key?: string
  }
}

/** Top-level neolink.toml configuration */
export interface NeolinkConfig {
  bind?: string
  bind_port?: number
  certificate?: string
  tls_client_auth?: string
  users?: NeolinkUser[]
  mqtt?: NeolinkMqtt
  cameras?: NeolinkCamera[]
}
