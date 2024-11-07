<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElMessage,
  ElNotification,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { apiInstance } from '@/shared/api/base'
import countries from '../../../shared/countries.json'
import { createRequest } from '@/entities/requests/api'

interface RuleForm {
  name: string
  country: string
  imageUrl: string
  website: string
  description: string
}

const ProducerFormInstance = {
  name: '',
  country: '',
  imageUrl: '',
  website: '',
  description: '',
}

const emit = defineEmits<{
  (e: 'update'): void
}>()

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  ...ProducerFormInstance,
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input producer name', trigger: 'blur' },
    { min: 1, max: 200, message: 'Length should be 1 to 200', trigger: 'blur' },
  ],
  country: [
    { required: true, message: 'Please input country name', trigger: 'blur' },
    { min: 1, max: 50, message: 'Length should be 1 to 50', trigger: 'blur' },
  ],
})

const onSubmit = async () => {
  await formRef.value?.validate(async valid => {
    if (valid) {
      await createRequest({
        type: 'create-producer',
        body: {
          ...form,
        },
      })

      ElNotification({
        title: 'Create Producer Request',
        message: `Request for adding producer has been created!\nWait till moderators check your request out`,
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
    <el-form-item label="Producer name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="Country" prop="country">
      <el-select v-model="form.country" placeholder="Choose country" filterable>
        <el-option
          v-for="(item, idx) in countries"
          :key="idx"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="Image url" prop="imageUrl">
      <el-input v-model="form.imageUrl" />
    </el-form-item>

    <el-form-item label="Website url" prop="website">
      <el-input v-model="form.website" />
    </el-form-item>

    <el-form-item label="Description" prop="description">
      <el-input v-model="form.description" type="textarea" :rows="6" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
