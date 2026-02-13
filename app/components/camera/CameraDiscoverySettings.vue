<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        :model-value="modelValue.topic"
        label="Discovery Topic"
        hint="HA MQTT discovery topic prefix"
        @update:model-value="update('topic', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-combobox
        :model-value="modelValue.features"
        label="Discovery Features"
        multiple
        chips
        closable-chips
        hint="HA discovery feature flags"
        @update:model-value="update('features', $event)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { CameraDiscovery } from '../../../shared/types/config'

const props = defineProps<{
  modelValue: CameraDiscovery
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CameraDiscovery]
}>()

function update(key: keyof CameraDiscovery, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
