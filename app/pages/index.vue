<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis">
          {{ cameras.length }} camera{{ cameras.length !== 1 ? 's' : '' }} configured
        </p>
      </div>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-camera-plus" to="/cameras/add">
        Add Camera
      </v-btn>
    </div>

    <v-row v-if="cameras.length > 0">
      <v-col
        v-for="camera in cameras"
        :key="camera.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CameraCard :camera="camera" />
      </v-col>
    </v-row>

    <v-card v-else class="pa-12 text-center">
      <v-icon size="64" color="grey" class="mb-4">mdi-camera-off</v-icon>
      <div class="text-h6 text-medium-emphasis mb-2">No cameras configured</div>
      <div class="text-body-2 text-medium-emphasis mb-4">
        Add your first camera to get started
      </div>
      <v-btn color="primary" prepend-icon="mdi-camera-plus" to="/cameras/add">
        Add Camera
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { configStore, initialize } = useNeolink()

const cameras = computed(() => configStore.cameras)

onMounted(() => {
  initialize()
})
</script>
