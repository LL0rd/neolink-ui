<template>
  <v-text-field
    :model-value="modelValue"
    :type="visible ? 'text' : 'password'"
    :label="label"
    :placeholder="placeholder"
    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
    :rules="rules"
    :hint="hint"
    :persistent-hint="!!hint"
    @update:model-value="$emit('update:modelValue', $event)"
    @click:append-inner="visible = !visible"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  rules?: any[]
  hint?: string
}>(), {
  label: 'Password',
  placeholder: '',
  rules: () => [],
  hint: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)
</script>
