<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- Global notification snackbars -->
  <div class="notification-container">
    <v-snackbar
      v-for="n in notifications"
      :key="n.id"
      :model-value="true"
      :color="n.type"
      :timeout="n.timeout"
      location="bottom right"
      @update:model-value="dismiss(n.id)"
    >
      {{ n.message }}
      <template #actions>
        <v-btn variant="text" @click="dismiss(n.id)">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
const { notifications, dismiss } = useNotification()
</script>
