import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUser } from '@/entities/user/model/types'

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null)
  const loggedIn = ref(false)

  const getUser = computed(() => user.value)
  const getLoggedIn = computed(() => loggedIn.value)
  const getRole = computed(() => user.value?.role)

  function setUser(payload: IUser) {
    user.value = payload
    loggedIn.value = true
  }

  function resetUser() {
    user.value = null
    loggedIn.value = false

    localStorage.removeItem('user')
  }

  return {
    user: getUser,
    loggedIn: getLoggedIn,
    role: getRole,
    setUser,
    resetUser,
  }
})
