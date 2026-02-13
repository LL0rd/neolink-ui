<template>
  <v-app>
    <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
      <v-card max-width="500" class="text-center pa-6">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
        <v-card-title class="text-h4">
          {{ error?.statusCode || 'Error' }}
        </v-card-title>
        <v-card-text class="text-body-1">
          {{ error?.message || 'An unexpected error occurred' }}
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="handleError">
            Go Home
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>
