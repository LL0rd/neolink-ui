<template>
  <v-card
    class="camera-card"
    :to="`/cameras/${encodeURIComponent(camera.name)}`"
  >
    <v-card-item>
      <template #prepend>
        <v-icon size="40" :color="camera.enabled === false ? 'grey' : 'primary'">
          mdi-camera
        </v-icon>
      </template>
      <v-card-title>{{ camera.name }}</v-card-title>
      <v-card-subtitle>
        {{ camera.address || camera.uid || 'No address' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <div class="d-flex flex-wrap ga-2 mb-2">
        <v-chip size="x-small" variant="tonal" :color="camera.enabled === false ? 'grey' : 'success'">
          {{ camera.enabled === false ? 'Disabled' : 'Enabled' }}
        </v-chip>
        <v-chip v-if="camera.stream" size="x-small" variant="outlined">
          {{ camera.stream }}
        </v-chip>
        <v-chip v-if="camera.channel_id !== undefined" size="x-small" variant="outlined">
          CH {{ camera.channel_id }}
        </v-chip>
      </div>

      <div v-if="camera.username" class="text-caption text-medium-emphasis">
        User: {{ camera.username }}
      </div>
      <div class="text-caption text-medium-emphasis mt-1">
        <v-icon size="x-small" class="mr-1">mdi-video-wireless</v-icon>
        rtsp://{{ host }}:{{ port }}/{{ camera.name }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        size="small"
        variant="text"
        color="primary"
        append-icon="mdi-pencil"
        :to="`/cameras/${encodeURIComponent(camera.name)}`"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { NeolinkCamera } from '../../../shared/types/config'

defineProps<{
  camera: NeolinkCamera
}>()

const configStore = useConfigStore()
const host = computed(() => configStore.globalSettings.bind || 'localhost')
const port = computed(() => configStore.globalSettings.bind_port || 8554)
</script>
