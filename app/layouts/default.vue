<template>
  <v-app>
    <LayoutAppDrawer v-model="drawer" />
    <LayoutAppBar @toggle-drawer="drawer = !drawer" />

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(true)
</script>
