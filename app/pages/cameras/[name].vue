<template>
  <div>
    <div class="d-flex align-center mb-6">
      <v-btn icon variant="text" to="/" class="mr-2">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div>
        <h1 class="text-h4 font-weight-bold">{{ cameraName }}</h1>
        <p class="text-body-2 text-medium-emphasis">Camera Configuration</p>
      </div>
      <v-spacer />
      <v-btn
        color="error"
        variant="tonal"
        prepend-icon="mdi-delete"
        @click="showDeleteDialog = true"
      >
        Delete
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <CameraForm
      v-if="camera"
      :camera="camera"
      @save="handleSave"
    />

    <v-alert v-else-if="!loading" type="error">
      Camera "{{ cameraName }}" not found.
    </v-alert>

    <CameraDeleteDialog
      v-model="showDeleteDialog"
      :camera-name="cameraName"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { NeolinkCamera } from '../../../shared/types/config'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const { success, error } = useNotification()

const cameraName = computed(() => decodeURIComponent(route.params.name as string))
const camera = ref<NeolinkCamera | null>(null)
const loading = ref(true)
const showDeleteDialog = ref(false)

onMounted(async () => {
  loading.value = true
  camera.value = await configStore.getCamera(cameraName.value)
  loading.value = false
})

async function handleSave(updated: NeolinkCamera) {
  try {
    await configStore.updateCamera(cameraName.value, updated)
    success('Camera updated successfully')
    if (updated.name !== cameraName.value) {
      await router.replace(`/cameras/${encodeURIComponent(updated.name)}`)
    }
    camera.value = updated
  } catch (e: any) {
    error(e.data?.message || 'Failed to update camera')
  }
}

async function handleDelete() {
  try {
    await configStore.deleteCamera(cameraName.value)
    success('Camera deleted')
    showDeleteDialog.value = false
    await router.push('/')
  } catch (e: any) {
    error(e.data?.message || 'Failed to delete camera')
  }
}
</script>
