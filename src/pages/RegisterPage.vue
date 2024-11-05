<script setup lang="ts">
import { reactive } from 'vue'
import { apiInstance } from '@/shared/api/base'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive<RuleForm>({
  username: '',
  email: '',
  password: '',
})

async function handleSubmit() {
  const { email, username, role } = await apiInstance.post(
    '/auth/sign-up',
    form,
  )
  await router.push({ name: 'home' })

  const payload = { email, username, role }

  userStore.setUser(payload)
  localStorage.setItem('user', JSON.stringify(payload))
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[30%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Register</h1>
    <el-form
      :model="form"
      label-width="auto"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="Username" prop="name">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Sign up</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<style scoped></style>
