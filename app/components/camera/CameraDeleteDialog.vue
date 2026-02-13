<template>
  <CommonConfirmDialog
    :model-value="modelValue"
    title="Delete Camera"
    :message="`Are you sure you want to delete camera &quot;${cameraName}&quot;? This action cannot be undone.`"
    confirm-text="Delete"
    confirm-color="error"
    @update:model-value="$emit('update:modelValue', $event)"
    @confirm="$emit('confirm')"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  cameraName: string
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>
