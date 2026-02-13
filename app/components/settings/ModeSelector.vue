<template>
  <v-btn-toggle
    :model-value="processStore.status.mode"
    mandatory
    density="compact"
    color="primary"
    @update:model-value="handleModeChange"
  >
    <v-btn value="rtsp" size="small">
      <v-icon start>mdi-video</v-icon>
      RTSP
    </v-btn>
    <v-btn value="mqtt" size="small">
      <v-icon start>mdi-message-processing</v-icon>
      MQTT
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
const processStore = useProcessStore()
const { success, error } = useNotification()

async function handleModeChange(mode: string) {
  try {
    await processStore.setMode(mode)
    success(`Mode changed to ${mode.toUpperCase()}`)
  } catch (e: any) {
    error(e.data?.message || 'Failed to change mode')
  }
}
</script>
