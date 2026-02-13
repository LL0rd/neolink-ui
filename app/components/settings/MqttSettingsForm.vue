<template>
  <v-card>
    <v-card-title>MQTT Broker Settings</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSave">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.broker_addr"
              label="Broker Address"
              hint="MQTT broker hostname or IP"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model.number="form.port"
              label="Port"
              type="number"
              :min="1"
              :max="65535"
              hint="MQTT broker port (default: 1883)"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="credUser"
              label="MQTT Username"
            />
          </v-col>
          <v-col cols="12" md="6">
            <CommonPasswordField
              v-model="credPass"
              label="MQTT Password"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.ca"
              label="CA Certificate Path"
              hint="Path to CA certificate for TLS"
              persistent-hint
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />
        <h4 class="text-subtitle-2 mb-2">Client Certificate Authentication</h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="clientCert"
              label="Client Certificate Path"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="clientKey"
              label="Client Key Path"
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
import type { NeolinkMqtt } from '../../../shared/types/config'

const configStore = useConfigStore()
const { success, error } = useNotification()
const saving = ref(false)

const form = reactive({
  broker_addr: '',
  port: undefined as number | undefined,
  ca: '',
})

const credUser = ref('')
const credPass = ref('')
const clientCert = ref('')
const clientKey = ref('')

onMounted(() => {
  const m = configStore.mqtt
  form.broker_addr = m.broker_addr || ''
  form.port = m.port
  form.ca = m.ca || ''
  if (m.credentials) {
    credUser.value = m.credentials[0] || ''
    credPass.value = m.credentials[1] || ''
  }
  if (m.client_auth) {
    clientCert.value = m.client_auth.certificate || ''
    clientKey.value = m.client_auth.key || ''
  }
})

async function handleSave() {
  saving.value = true
  try {
    const mqtt: NeolinkMqtt = {}
    if (form.broker_addr) mqtt.broker_addr = form.broker_addr
    if (form.port) mqtt.port = form.port
    if (form.ca) mqtt.ca = form.ca
    if (credUser.value && credPass.value) {
      mqtt.credentials = [credUser.value, credPass.value]
    }
    if (clientCert.value || clientKey.value) {
      mqtt.client_auth = {}
      if (clientCert.value) mqtt.client_auth.certificate = clientCert.value
      if (clientKey.value) mqtt.client_auth.key = clientKey.value
    }
    await configStore.updateMqttSettings(mqtt)
    success('MQTT settings saved')
  } catch (e: any) {
    error(e.data?.message || 'Failed to save MQTT settings')
  } finally {
    saving.value = false
  }
}
</script>
