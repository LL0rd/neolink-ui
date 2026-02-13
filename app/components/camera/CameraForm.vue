<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit">
    <!-- Stream URL info -->
    <v-alert type="info" variant="tonal" class="mb-4" density="compact">
      <div class="d-flex align-center mb-1">
        <v-icon class="mr-2">mdi-video-wireless</v-icon>
        <span class="font-weight-medium mr-2">Main Stream:</span>
        <code>rtsp://{{ host }}:{{ port }}/{{ formData.name }}</code>
      </div>
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-video-wireless-outline</v-icon>
        <span class="font-weight-medium mr-2">Sub Stream:</span>
        <code>rtsp://{{ host }}:{{ port }}/{{ formData.name }}/sub</code>
      </div>
    </v-alert>

    <v-expansion-panels v-model="openPanels" multiple>
      <!-- Connection -->
      <v-expansion-panel value="connection">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-lan-connect</v-icon>
          Connection
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.name"
                label="Camera Name"
                :rules="[v => !!v || 'Name is required']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.username" label="Camera Username" />
            </v-col>
            <v-col cols="12" md="6">
              <CommonPasswordField v-model="formData.password" label="Camera Password" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.address"
                label="IP Address"
                hint="Direct IP address (e.g., 192.168.1.100:9000)"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.uid"
                label="UID"
                hint="Camera UID for P2P discovery"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.channel_id"
                label="Channel ID"
                type="number"
                :min="0"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Stream -->
      <v-expansion-panel value="stream">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-video</v-icon>
          Stream
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.stream"
                label="Stream"
                :items="['main', 'sub', 'extern']"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.buffer_duration"
                label="Buffer Duration (seconds)"
                type="number"
                :min="0"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.use_splash" label="Use Splash Screen" />
            </v-col>
            <v-col v-if="formData.use_splash" cols="12" md="6">
              <v-text-field v-model="formData.splash_pattern" label="Splash Pattern" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Behavior -->
      <v-expansion-panel value="behavior">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-tune</v-icon>
          Behavior
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.enabled" label="Enabled" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.debug" label="Debug" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.strict" label="Strict" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.update_time" label="Update Time" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.idle_disconnect" label="Idle Disconnect" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="formData.push_notifications" label="Push Notifications" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.max_discovery_retries"
                label="Max Discovery Retries"
                type="number"
                :min="0"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.max_encryption" label="Max Encryption" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="formData.print_format" label="Print Format" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Pause -->
      <v-expansion-panel value="pause">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-pause-circle</v-icon>
          Pause
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="pauseData.mode"
                label="Pause Mode"
                :items="['none', 'sleep', 'black']"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="pauseData.on_motion" label="Pause on Motion" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="pauseData.on_disconnect" label="Pause on Disconnect" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="pauseData.motion_timeout"
                label="Motion Timeout (seconds)"
                type="number"
                :min="0"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- MQTT -->
      <v-expansion-panel value="mqtt">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-message-processing</v-icon>
          Camera MQTT
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="mqttData.enable_motion" label="Enable Motion" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="mqttData.enable_light" label="Enable Light" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="mqttData.enable_battery" label="Enable Battery" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="mqttData.enable_preview" label="Enable Preview" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="mqttData.enable_floodlight" label="Enable Floodlight" />
            </v-col>
          </v-row>
          <v-divider class="my-3" />
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="mqttData.motion_update_interval" label="Motion Update Interval" type="number" :min="0" suffix="ms" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="mqttData.light_update_interval" label="Light Update Interval" type="number" :min="0" suffix="ms" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="mqttData.battery_update_interval" label="Battery Update Interval" type="number" :min="0" suffix="ms" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="mqttData.preview_update_interval" label="Preview Update Interval" type="number" :min="0" suffix="ms" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model.number="mqttData.floodlight_update_interval" label="Floodlight Update Interval" type="number" :min="0" suffix="ms" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Access / Discovery -->
      <v-expansion-panel value="access">
        <v-expansion-panel-title>
          <v-icon class="mr-2">mdi-shield-account</v-icon>
          Access & Discovery
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="discoveryData.topic" label="Discovery Topic" hint="HA MQTT discovery topic prefix" />
            </v-col>
            <v-col cols="12" md="6">
              <v-combobox v-model="discoveryData.features" label="Discovery Features" multiple chips closable-chips hint="HA discovery feature flags" />
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-combobox
            v-model="formData.permitted_users"
            label="Permitted Users"
            multiple
            chips
            closable-chips
            hint="Users allowed to access this camera's stream"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="d-flex justify-end mt-6 ga-2">
      <v-btn variant="text" to="/">Cancel</v-btn>
      <v-btn type="submit" color="primary" prepend-icon="mdi-content-save">
        Save
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import type { NeolinkCamera, CameraPause, CameraMqtt, CameraDiscovery } from '../../../shared/types/config'

const props = defineProps<{
  camera: NeolinkCamera
}>()

const emit = defineEmits<{
  save: [camera: NeolinkCamera]
}>()

const configStore = useConfigStore()
const openPanels = ref(['connection'])

const host = computed(() => configStore.globalSettings.bind || 'localhost')
const port = computed(() => configStore.globalSettings.bind_port || 8554)

const formData = reactive<NeolinkCamera>({
  name: props.camera.name ?? '',
  username: props.camera.username ?? '',
  password: props.camera.password ?? '',
  address: props.camera.address ?? '',
  uid: props.camera.uid ?? '',
  stream: props.camera.stream,
  channel_id: props.camera.channel_id,
  permitted_users: props.camera.permitted_users ? [...props.camera.permitted_users] : [],
  max_encryption: props.camera.max_encryption ?? '',
  enabled: props.camera.enabled ?? true,
  debug: props.camera.debug ?? false,
  strict: props.camera.strict ?? false,
  update_time: props.camera.update_time,
  idle_disconnect: props.camera.idle_disconnect,
  push_notifications: props.camera.push_notifications,
  buffer_duration: props.camera.buffer_duration,
  use_splash: props.camera.use_splash,
  splash_pattern: props.camera.splash_pattern ?? '',
  max_discovery_retries: props.camera.max_discovery_retries,
  print_format: props.camera.print_format ?? '',
})

const pauseData = reactive<CameraPause>({
  on_motion: props.camera.pause?.on_motion,
  on_disconnect: props.camera.pause?.on_disconnect,
  motion_timeout: props.camera.pause?.motion_timeout,
  mode: props.camera.pause?.mode,
})

const mqttData = reactive<CameraMqtt>({
  enable_motion: props.camera.mqtt?.enable_motion,
  enable_light: props.camera.mqtt?.enable_light,
  enable_battery: props.camera.mqtt?.enable_battery,
  enable_preview: props.camera.mqtt?.enable_preview,
  enable_floodlight: props.camera.mqtt?.enable_floodlight,
  motion_update_interval: props.camera.mqtt?.motion_update_interval,
  light_update_interval: props.camera.mqtt?.light_update_interval,
  battery_update_interval: props.camera.mqtt?.battery_update_interval,
  preview_update_interval: props.camera.mqtt?.preview_update_interval,
  floodlight_update_interval: props.camera.mqtt?.floodlight_update_interval,
})

const discoveryData = reactive<CameraDiscovery>({
  topic: props.camera.discovery?.topic ?? '',
  features: props.camera.discovery?.features ? [...props.camera.discovery.features] : [],
})

function handleSubmit() {
  const camera: NeolinkCamera = {
    ...toRaw(formData),
  }

  // Attach sub-objects if they have values
  const pause = toRaw(pauseData)
  if (Object.values(pause).some(v => v !== undefined && v !== null)) {
    camera.pause = pause
  }

  const mqtt = toRaw(mqttData)
  if (Object.values(mqtt).some(v => v !== undefined && v !== null)) {
    camera.mqtt = mqtt
  }

  const discovery = toRaw(discoveryData)
  if (discovery.topic || (discovery.features && discovery.features.length > 0)) {
    camera.discovery = discovery
  }

  // Clean empty string values
  Object.keys(camera).forEach(key => {
    const val = (camera as any)[key]
    if (val === undefined || val === '') {
      delete (camera as any)[key]
    }
  })

  // Name is always required
  camera.name = formData.name

  emit('save', camera)
}
</script>
