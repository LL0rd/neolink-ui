<template>
  <v-btn
    :icon="iconOnly"
    :loading="processStore.loading"
    :color="color"
    :size="size"
    :variant="variant"
    @click="handleRestart"
  >
    <v-icon>mdi-restart</v-icon>
    <span v-if="!iconOnly" class="ml-1">Restart Neolink</span>
  </v-btn>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  iconOnly?: boolean
  color?: string
  size?: string
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
}>(), {
  iconOnly: true,
  color: 'primary',
  size: 'default',
  variant: 'text',
})

const processStore = useProcessStore()
const { restartNeolink } = useNeolink()

async function handleRestart() {
  await restartNeolink()
}
</script>
