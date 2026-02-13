<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      RTSP Users
      <v-spacer />
      <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="addUser">
        Add User
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-table v-if="localUsers.length > 0">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th style="width: 100px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in localUsers" :key="index">
            <td>
              <v-text-field
                v-model="user.name"
                density="compact"
                variant="plain"
                hide-details
                placeholder="Username"
              />
            </td>
            <td>
              <v-text-field
                v-model="user.pass"
                density="compact"
                variant="plain"
                hide-details
                type="password"
                placeholder="Password"
              />
            </td>
            <td>
              <v-btn icon size="small" variant="text" color="error" @click="removeUser(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-else class="text-center text-medium-emphasis pa-6">
        No users configured. Add a user to restrict RTSP access.
      </div>

      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" prepend-icon="mdi-content-save" :loading="saving" @click="handleSave">
          Save Users
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { NeolinkUser } from '../../../shared/types/config'

const configStore = useConfigStore()
const { success, error } = useNotification()
const saving = ref(false)

const localUsers = ref<NeolinkUser[]>([])

onMounted(() => {
  localUsers.value = configStore.users.map(u => ({ ...u }))
})

function addUser() {
  localUsers.value.push({ name: '', pass: '' })
}

function removeUser(index: number) {
  localUsers.value.splice(index, 1)
}

async function handleSave() {
  saving.value = true
  try {
    const users = localUsers.value.filter(u => u.name)
    await configStore.updateUsers(users)
    success('Users saved')
  } catch (e: any) {
    error(e.data?.message || 'Failed to save users')
  } finally {
    saving.value = false
  }
}
</script>
