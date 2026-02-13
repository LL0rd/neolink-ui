<template>
  <v-navigation-drawer :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-list-item
      prepend-icon="mdi-cctv"
      title="Neolink UI"
      subtitle="Camera Management"
      class="mb-2"
    />

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/"
        exact
      />
      <v-list-item
        prepend-icon="mdi-camera-plus"
        title="Add Camera"
        to="/cameras/add"
      />
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        to="/settings"
      />
    </v-list>

    <template #append>
      <v-list density="compact" nav>
        <v-list-item class="text-caption text-medium-emphasis">
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-1" :color="processStore.status.running ? 'success' : 'error'">
              mdi-circle
            </v-icon>
            <span>Neolink: {{ processStore.status.running ? 'Running' : 'Stopped' }}</span>
          </div>
          <div v-if="processStore.status.mode" class="mt-1">
            Mode: {{ processStore.status.mode.toUpperCase() }}
          </div>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const processStore = useProcessStore()
</script>
