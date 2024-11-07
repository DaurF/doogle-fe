<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { createRequest } from '@/entities/requests/api'

const emit = defineEmits<{
  (e: 'update'): void
}>()

const CategoryFormInstance = {
  name: '',
  description: '',
}

interface RuleForm {
  name: string
  description: string
}

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  ...CategoryFormInstance,
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input category name', trigger: 'blur' },
    { min: 5, max: 200, message: 'Length should be 5 to 200', trigger: 'blur' },
  ],
})

const onSubmit = async () => {
  await formRef.value?.validate(async valid => {
    if (valid) {
      await createRequest({
        type: 'create-category',
        body: {
          ...form,
        },
      })

      ElNotification({
        title: 'Create Category Request',
        message: `Request for adding category has been created!\nWait till moderators check your request out`,
        type: 'success',
      })

      formRef.value?.resetFields()
      emit('update')
    }
  })
}
</script>

<template>
  <el-form
    :model="form"
    :rules="rules"
    label-width="auto"
    ref="formRef"
    style="max-width: 600px"
  >
    <el-form-item label="Category name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
