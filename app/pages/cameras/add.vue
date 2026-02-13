<template>
  <div>
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" to="/" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-h4 font-weight-bold">Add Camera</h1>
        <p class="text-body-2 text-medium-emphasis">Configure a new camera</p>
      </div>
    </div>

    <CameraAddWizard @complete="handleComplete" />
  </div>
</template>

<script setup lang="ts">
import type { NeolinkCamera } from '../../../shared/types/config'

const router = useRouter()
const configStore = useConfigStore()
const { success, error } = useNotification()

async function handleComplete(camera: NeolinkCamera) {
  try {
    await configStore.addCamera(camera)
    success(`Camera "${camera.name}" added successfully`)
    await router.push('/')
  } catch (e: any) {
    error(e.data?.message || 'Failed to add camera')
  }
}
</script>
