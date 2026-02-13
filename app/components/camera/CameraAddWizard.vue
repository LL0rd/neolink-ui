<template>
  <v-stepper v-model="step" :items="steps">
    <template #item.1>
      <v-card flat>
        <v-card-text>
          <h3 class="text-h6 mb-4">Basic Information</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Camera Name"
                :rules="[v => !!v || 'Name is required']"
                hint="Unique identifier for this camera"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.username" label="Camera Username" />
            </v-col>
            <v-col cols="12" md="6">
              <CommonPasswordField v-model="form.password" label="Camera Password" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <template #item.2>
      <v-card flat>
        <v-card-text>
          <h3 class="text-h6 mb-4">Connection</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.address"
                label="IP Address"
                hint="e.g., 192.168.1.100:9000"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.uid"
                label="UID"
                hint="Camera UID for P2P discovery"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.channel_id"
                label="Channel ID"
                type="number"
                :min="0"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <template #item.3>
      <v-card flat>
        <v-card-text>
          <h3 class="text-h6 mb-4">Stream Settings</h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.stream"
                label="Stream"
                :items="['main', 'sub', 'extern']"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.buffer_duration"
                label="Buffer Duration (seconds)"
                type="number"
                :min="0"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <template #item.4>
      <v-card flat>
        <v-card-text>
          <h3 class="text-h6 mb-4">Advanced Settings</h3>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="form.enabled" label="Enabled" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="form.debug" label="Debug" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-switch v-model="form.strict" label="Strict" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="form.max_encryption" label="Max Encryption" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.max_discovery_retries"
                label="Max Discovery Retries"
                type="number"
                :min="0"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <template #item.5>
      <v-card flat>
        <v-card-text>
          <h3 class="text-h6 mb-4">Review</h3>

          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>Name</v-list-item-title>
              <v-list-item-subtitle>{{ form.name || '—' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Username</v-list-item-title>
              <v-list-item-subtitle>{{ form.username || '—' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Address</v-list-item-title>
              <v-list-item-subtitle>{{ form.address || form.uid || '—' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Stream</v-list-item-title>
              <v-list-item-subtitle>{{ form.stream || 'default' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Enabled</v-list-item-title>
              <v-list-item-subtitle>{{ form.enabled !== false ? 'Yes' : 'No' }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </template>

    <template #actions="{ prev, next }">
      <v-card-actions>
        <v-btn v-if="step > 1" variant="text" @click="prev">
          Back
        </v-btn>
        <v-spacer />
        <v-btn v-if="step < 5" color="primary" variant="flat" @click="next">
          Next
        </v-btn>
        <v-btn v-else color="primary" variant="flat" prepend-icon="mdi-check" @click="handleComplete">
          Add Camera
        </v-btn>
      </v-card-actions>
    </template>
  </v-stepper>
</template>

<script setup lang="ts">
import type { NeolinkCamera } from '../../../shared/types/config'

const emit = defineEmits<{
  complete: [camera: NeolinkCamera]
}>()

const step = ref(1)

const steps = [
  { title: 'Basics', value: 1 },
  { title: 'Connection', value: 2 },
  { title: 'Stream', value: 3 },
  { title: 'Advanced', value: 4 },
  { title: 'Review', value: 5 },
]

const form = reactive<NeolinkCamera>({
  name: '',
  username: '',
  password: '',
  address: '',
  uid: '',
  stream: undefined,
  channel_id: undefined,
  enabled: true,
  debug: false,
  strict: false,
  max_encryption: undefined,
  max_discovery_retries: undefined,
  buffer_duration: undefined,
})

function handleComplete() {
  const camera: NeolinkCamera = { ...toRaw(form) }
  // Clean empty/undefined values
  Object.keys(camera).forEach(key => {
    const val = (camera as any)[key]
    if (val === undefined || val === '' || val === null) {
      delete (camera as any)[key]
    }
  })
  emit('complete', camera)
}
</script>
