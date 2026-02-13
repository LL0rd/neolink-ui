<template>
  <div>
    <v-card max-width="400" class="mx-auto" elevation="8">
      <v-card-item>
        <v-card-title class="text-center">
          <v-icon size="48" color="primary" class="mb-2">mdi-cctv</v-icon>
          <div class="text-h5">Neolink UI</div>
          <div class="text-caption text-medium-emphasis">Enter your password to continue</div>
        </v-card-title>
      </v-card-item>

      <v-card-text>
        <v-form ref="form" @submit.prevent="handleLogin">
          <CommonPasswordField
            v-model="password"
            label="Password"
            :rules="[v => !!v || 'Password is required']"
            class="mb-4"
          />

          <v-alert v-if="loginError" type="error" density="compact" class="mb-4">
            Invalid password
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="authStore.loading"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const { loginAndRedirect } = useAuth()
const password = ref('')
const loginError = ref(false)

async function handleLogin() {
  loginError.value = false
  const success = await loginAndRedirect(password.value)
  if (!success) {
    loginError.value = true
  }
}
</script>
