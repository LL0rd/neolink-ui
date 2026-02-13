import { z } from 'zod'

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export const cameraPauseSchema = z.object({
  on_motion: z.boolean().optional(),
  on_disconnect: z.boolean().optional(),
  motion_timeout: z.number().min(0).optional(),
  mode: z.enum(['none', 'sleep', 'black']).optional(),
}).optional()

export const cameraMqttSchema = z.object({
  enable_motion: z.boolean().optional(),
  enable_light: z.boolean().optional(),
  enable_battery: z.boolean().optional(),
  enable_preview: z.boolean().optional(),
  enable_floodlight: z.boolean().optional(),
  motion_update_interval: z.number().min(0).optional(),
  light_update_interval: z.number().min(0).optional(),
  battery_update_interval: z.number().min(0).optional(),
  preview_update_interval: z.number().min(0).optional(),
  floodlight_update_interval: z.number().min(0).optional(),
}).optional()

export const cameraDiscoverySchema = z.object({
  topic: z.string().optional(),
  features: z.array(z.string()).optional(),
}).optional()

export const cameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  username: z.string().optional(),
  password: z.string().optional(),
  address: z.string().optional(),
  uid: z.string().optional(),
  stream: z.string().optional(),
  channel_id: z.number().int().min(0).optional(),
  permitted_users: z.array(z.string()).optional(),
  discovery: cameraDiscoverySchema,
  max_encryption: z.string().optional(),
  enabled: z.boolean().optional(),
  debug: z.boolean().optional(),
  strict: z.boolean().optional(),
  update_time: z.boolean().optional(),
  idle_disconnect: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  buffer_duration: z.number().min(0).optional(),
  use_splash: z.boolean().optional(),
  splash_pattern: z.string().optional(),
  max_discovery_retries: z.number().int().min(0).optional(),
  print_format: z.string().optional(),
  pause: cameraPauseSchema,
  mqtt: cameraMqttSchema,
})

export const globalSettingsSchema = z.object({
  bind: z.string().optional(),
  bind_port: z.number().int().min(1).max(65535).optional(),
  certificate: z.string().optional(),
  tls_client_auth: z.string().optional(),
})

export const mqttSettingsSchema = z.object({
  broker_addr: z.string().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  credentials: z.tuple([z.string(), z.string()]).optional(),
  ca: z.string().optional(),
  client_auth: z.object({
    certificate: z.string().optional(),
    key: z.string().optional(),
  }).optional(),
})

export const userSchema = z.object({
  name: z.string().min(1),
  pass: z.string().optional(),
})

export const usersSchema = z.array(userSchema)

export const modeSchema = z.object({
  mode: z.enum(['rtsp', 'mqtt']),
})
