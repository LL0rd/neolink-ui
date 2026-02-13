<template>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.enable_motion"
        label="Enable Motion"
        @update:model-value="update('enable_motion', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.enable_light"
        label="Enable Light"
        @update:model-value="update('enable_light', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.enable_battery"
        label="Enable Battery"
        @update:model-value="update('enable_battery', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.enable_preview"
        label="Enable Preview"
        @update:model-value="update('enable_preview', $event)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-switch
        :model-value="modelValue.enable_floodlight"
        label="Enable Floodlight"
        @update:model-value="update('enable_floodlight', $event)"
      />
    </v-col>
  </v-row>

  <v-divider class="my-3" />

  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        :model-value="modelValue.motion_update_interval"
        label="Motion Update Interval"
        type="number"
        :min="0"
        suffix="ms"
        @update:model-value="update('motion_update_interval', $event ? Number($event) : undefined)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        :model-value="modelValue.light_update_interval"
        label="Light Update Interval"
        type="number"
        :min="0"
        suffix="ms"
        @update:model-value="update('light_update_interval', $event ? Number($event) : undefined)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        :model-value="modelValue.battery_update_interval"
        label="Battery Update Interval"
        type="number"
        :min="0"
        suffix="ms"
        @update:model-value="update('battery_update_interval', $event ? Number($event) : undefined)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        :model-value="modelValue.preview_update_interval"
        label="Preview Update Interval"
        type="number"
        :min="0"
        suffix="ms"
        @update:model-value="update('preview_update_interval', $event ? Number($event) : undefined)"
      />
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        :model-value="modelValue.floodlight_update_interval"
        label="Floodlight Update Interval"
        type="number"
        :min="0"
        suffix="ms"
        @update:model-value="update('floodlight_update_interval', $event ? Number($event) : undefined)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { CameraMqtt } from '../../../shared/types/config'

const props = defineProps<{
  modelValue: CameraMqtt
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CameraMqtt]
}>()

function update(key: keyof CameraMqtt, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>
