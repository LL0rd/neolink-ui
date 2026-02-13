<template>
  <v-app-bar elevation="1">
    <v-app-bar-nav-icon @click="$emit('toggleDrawer')" />

    <v-app-bar-title>
      <span class="font-weight-bold">Neolink</span>
      <span class="text-medium-emphasis ml-1">UI</span>
    </v-app-bar-title>

    <template #append>
      <CommonStatusChip :running="processStore.status.running" class="mr-3" />
      <CommonRestartButton size="small" />

      <v-menu v-if="authStore.authRequired">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="logoutAndRedirect">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
defineEmits<{
  toggleDrawer: []
}>()

const authStore = useAuthStore()
const processStore = useProcessStore()
const { logoutAndRedirect } = useAuth()
</script>
