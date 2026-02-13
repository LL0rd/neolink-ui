interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout: number
}

const notifications = ref<Notification[]>([])
let nextId = 0

export function useNotification() {
  function notify(message: string, type: Notification['type'] = 'info', timeout = 4000) {
    const id = nextId++
    notifications.value.push({ id, message, type, timeout })

    if (timeout > 0) {
      setTimeout(() => {
        dismiss(id)
      }, timeout)
    }
  }

  function dismiss(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  function success(message: string) {
    notify(message, 'success')
  }

  function error(message: string) {
    notify(message, 'error', 6000)
  }

  function warning(message: string) {
    notify(message, 'warning')
  }

  return {
    notifications: readonly(notifications),
    notify,
    dismiss,
    success,
    error,
    warning,
  }
}
