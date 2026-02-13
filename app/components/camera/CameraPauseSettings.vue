<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-select
        :model-value="modelValue.mode"
        label="Pause Mode"
        :items="pauseModes"
        clearable
        @update:model-value="update('mode', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.on_motion"
        label="Pause on Motion"
        @update:model-value="update('on_motion', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.on_disconnect"
        label="Pause on Disconnect"
        @update:model-value="update('on_disconnect', $event)"
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        :model-value="modelValue.motion_timeout"
        label="Motion Timeout (seconds)"
        type="number"
        :min="0"
        @update:model-value="update('motion_timeout', $event ? Number($event) : undefined)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { CameraPause } from '../../../shared/types/config'

const props = defineProps<{
  modelValue: CameraPause
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CameraPause]
}>()

const pauseModes = ['none', 'sleep', 'black']

function update(key: keyof CameraPause, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
