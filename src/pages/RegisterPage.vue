<script setup lang="ts">
import { reactive, ref } from 'vue'
import { apiInstance } from '@/shared/api/base'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

interface RuleForm {
  username: string
  email: string
  password: string
  role: string
}

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  username: '',
  email: '',
  password: '',
  role: '',
})

const formRules = reactive<FormRules<RuleForm>>({
  username: {
    required: true,
    message: 'Please input username',
    trigger: 'change',
  },
  email: {
    required: true,
    message: 'Please input email',
    trigger: 'change',
  },
  password: {
    required: true,
    message: 'Please input password',
    trigger: 'change',
  },
  role: {
    required: true,
    message: 'Please choose role',
    trigger: 'change',
  },
})

async function handleSubmit() {
  formRef.value?.validate(async valid => {
    if (valid) {
      const { email, username, role } = await apiInstance.post(
        '/auth/sign-up',
        form,
      )
      await router.push({ name: 'home' })

      const payload = { email, username, role }

      userStore.setUser(payload)
      localStorage.setItem('user', JSON.stringify(payload))
      formRef.value?.resetFields()
    }
  })
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[30%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Register</h1>
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
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-radio-group v-model="form.role">
          <el-radio value="customer">Customer</el-radio>
          <el-radio value="supplier">Supplier</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Sign up</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<style scoped></style>
