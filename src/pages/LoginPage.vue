<script setup lang="ts">
import { reactive, ref } from 'vue'
import { apiInstance } from '@/shared/api/base'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

interface LoginRuleForm {
  username: string
  password: string
}

const formRef = ref<FormInstance>()

const form = reactive<LoginRuleForm>({
  username: '',
  password: '',
})

const formRules = reactive<FormRules<LoginRuleForm>>({
  username: {
    required: true,
    message: 'Please input username',
    trigger: 'change',
  },
  password: {
    required: true,
    message: 'Please input password',
    trigger: 'change',
  },
})

async function handleSubmit() {
  await formRef.value?.validate(async valid => {
    if (valid) {
      const { email, username, role } = await apiInstance.post(
        '/auth/sign-in',
        form,
      )

      console.log(email, username, role)

      await router.push({ name: 'home' })

      const payload = { email, username, role }

      userStore.setUser(payload)
      localStorage.setItem('user', JSON.stringify(payload))
    }
  })
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[42rem] mt-[18rem] mx-auto">
    <h1 class="text-[2.4rem] mb-[1.2rem]">Login</h1>
    <el-form
      :model="form"
      :rules="formRules"
      label-width="auto"
      ref="formRef"
      label-position="top"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Sign in</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<style scoped></style>
