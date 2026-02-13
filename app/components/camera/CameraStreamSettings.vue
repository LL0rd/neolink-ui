<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        :model-value="modelValue.stream"
        label="Stream"
        :items="streamOptions"
        clearable
        @update:model-value="$emit('update:modelValue', { ...modelValue, stream: $event })"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        :model-value="modelValue.buffer_duration"
        label="Buffer Duration (seconds)"
        type="number"
        :min="0"
        @update:model-value="$emit('update:modelValue', { ...modelValue, buffer_duration: $event ? Number($event) : undefined })"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.use_splash"
        label="Use Splash Screen"
        @update:model-value="$emit('update:modelValue', { ...modelValue, use_splash: $event })"
      />
    </v-col>
    <v-col v-if="modelValue.use_splash" cols="12" md="6">
      <v-text-field
        :model-value="modelValue.splash_pattern"
        label="Splash Pattern"
        @update:model-value="$emit('update:modelValue', { ...modelValue, splash_pattern: $event })"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { NeolinkCamera } from '../../../shared/types/config'

defineProps<{
  modelValue: NeolinkCamera
}>()

defineEmits<{
  'update:modelValue': [value: NeolinkCamera]
}>()

const streamOptions = ['main', 'sub', 'extern']
</script>
