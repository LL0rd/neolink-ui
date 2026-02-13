<template>
  <v-chip
    :color="running ? 'success' : 'error'"
    variant="tonal"
    size="small"
    :prepend-icon="running ? 'mdi-check-circle' : 'mdi-close-circle'"
  >
    {{ running ? 'Running' : 'Stopped' }}
  </v-chip>
</template>

<script setup lang="ts">
defineProps<{
  running: boolean
}>()
</script>
