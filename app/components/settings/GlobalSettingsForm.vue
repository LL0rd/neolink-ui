<template>
  <v-card>
    <v-card-title>General Settings</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.bind"
              label="Bind Address"
              hint="IP address to bind to (default: 0.0.0.0)"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.bind_port"
              label="Bind Port"
              type="number"
              :min="1"
              :max="65535"
              hint="RTSP port (default: 8554)"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.certificate"
              label="TLS Certificate Path"
              hint="Path to TLS certificate file"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.tls_client_auth"
              label="TLS Client Auth"
              hint="TLS client authentication mode"
              persistent-hint
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end mt-4">
          <v-btn type="submit" color="primary" prepend-icon="mdi-content-save" :loading="saving">
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const configStore = useConfigStore()
const { success, error } = useNotification()
const saving = ref(false)

const form = reactive({
  bind: '',
  bind_port: undefined as number | undefined,
  certificate: '',
  tls_client_auth: '',
})

onMounted(() => {
  const g = configStore.globalSettings
  form.bind = g.bind || ''
  form.bind_port = g.bind_port
  form.certificate = g.certificate || ''
  form.tls_client_auth = g.tls_client_auth || ''
})

async function handleSave() {
  saving.value = true
  try {
    const settings: Record<string, any> = {}
    if (form.bind) settings.bind = form.bind
    if (form.bind_port) settings.bind_port = form.bind_port
    if (form.certificate) settings.certificate = form.certificate
    if (form.tls_client_auth) settings.tls_client_auth = form.tls_client_auth
    await configStore.updateGlobalSettings(settings)
    success('Global settings saved')
  } catch (e: any) {
    error(e.data?.message || 'Failed to save settings')
  } finally {
    saving.value = false
  }
}
</script>
