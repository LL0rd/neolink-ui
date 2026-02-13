<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Settings</h1>
        <p class="text-body-2 text-medium-emphasis">Global configuration</p>
      </div>
    </div>

    <v-tabs v-model="tab" color="primary">
      <v-tab value="general">General</v-tab>
      <v-tab value="users">Users</v-tab>
      <v-tab value="mqtt">MQTT</v-tab>
      <v-tab value="process">Process</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="mt-4">
      <v-tabs-window-item value="general">
        <SettingsGlobalSettingsForm />
      </v-tabs-window-item>

      <v-tabs-window-item value="users">
        <SettingsUsersTable />
      </v-tabs-window-item>

      <v-tabs-window-item value="mqtt">
        <SettingsMqttSettingsForm />
      </v-tabs-window-item>

      <v-tabs-window-item value="process">
        <v-card>
          <v-card-title>Process Control</v-card-title>
          <v-card-text>
            <div class="d-flex align-center ga-3 mb-4">
              <CommonStatusChip :running="processStore.status.running" />
              <span v-if="processStore.status.uptime" class="text-caption text-medium-emphasis">
                Uptime: {{ formatUptime(processStore.status.uptime) }}
              </span>
              <v-spacer />
              <SettingsModeSelector />
            </div>

            <div class="d-flex ga-2 mb-6">
              <v-btn
                v-if="!processStore.status.running"
                color="success"
                prepend-icon="mdi-play"
                :loading="processStore.loading"
                @click="processStore.start()"
              >
                Start
              </v-btn>
              <v-btn
                v-if="processStore.status.running"
                color="error"
                prepend-icon="mdi-stop"
                :loading="processStore.loading"
                @click="processStore.stop()"
              >
                Stop
              </v-btn>
              <v-btn
                color="warning"
                prepend-icon="mdi-restart"
                :loading="processStore.loading"
                @click="processStore.restart()"
              >
                Restart
              </v-btn>
            </div>

            <v-divider class="mb-4" />

            <div class="d-flex align-center mb-2">
              <h3 class="text-subtitle-1 font-weight-medium">Logs</h3>
              <v-spacer />
              <v-btn size="small" variant="text" prepend-icon="mdi-refresh" @click="processStore.fetchLogs()">
                Refresh
              </v-btn>
            </div>
            <div class="log-viewer">{{ processStore.logs.join('\n') || 'No logs available' }}</div>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
const tab = ref('general')
const processStore = useProcessStore()

onMounted(() => {
  processStore.fetchLogs()
})

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}
</script>
