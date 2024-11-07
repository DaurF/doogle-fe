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

import { deleteProducer, updateProducer } from '@/entities/producer/api'
import type { IProducer } from '@/entities/producer/model/types'
import { TopRight, View } from '@element-plus/icons-vue'

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

const { producers } = defineProps<{
  producers: IProducer[]
}>()

const emit = defineEmits<{
  (e: 'update-producers'): void
}>()

const editId = ref<null | string>(null)
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  ...ProducerFormInstance,
})

const editForm = reactive<RuleForm>({
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
      try {
        await apiInstance.post('/producers', form)
        ElNotification({
          type: 'success',
          title: 'Producers',
          message: `Producer ${form.name} has been created successfully!`,
        })
        formRef.value?.resetFields()
      } catch (err) {
        ElMessage({
          message: err.message,
          type: 'error',
        })
      }
      emit('update-producers')
    }
  })
}

async function handleDeleteProducer(producer: IProducer) {
  await deleteProducer(producer._id)
  emit('update-producers')
  ElNotification({
    type: 'success',
    title: 'Producers',
    message: `Producer ${producer.name} has been removed!`,
  })
}

function handleClose() {
  dialogVisible.value = false
}

async function handleSubmitEdit() {
  await updateProducer({ id: editId.value, data: editForm })
  emit('update-producers')
  handleClose()
  editId.value = null
  ElNotification({
    type: 'success',
    title: 'Producers',
    message: `Producer ${editForm.name} has been updated!`,
  })
}

function handleShowEdit(data: IProducer) {
  dialogVisible.value = true
  editForm.name = data.name
  editForm.description = data.description
  editForm.imageUrl = data.imageUrl
  editForm.website = data.website
  editForm.country = data.country
  editId.value = data._id
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

  <el-divider />

  <el-table
    :data="producers"
    border
    style="width: 100%"
    empty-text="No producers"
  >
    <el-table-column prop="name" label="Name" min-width="20">
      <template #default="scope">
        <el-link>
          {{ scope.row.name }}
          <el-icon class="el-icon--right">
            <View />
          </el-icon>
        </el-link>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="Description" />

    <el-table-column prop="imageUrl" label="Image" width="80">
      <template #default="scope">
        <el-image class="h-[6.4rem]" :src="scope.row.imageUrl" fit="contain" />
      </template>
    </el-table-column>

    <el-table-column prop="country" label="Country" min-width="20" />

    <el-table-column fixed="right" label="Operations" min-width="20">
      <template #default="scope">
        <el-button
          @click="handleShowEdit(scope.row)"
          size="small"
          type="primary"
          plain
        >
          Edit
        </el-button>
        <el-popconfirm
          title="Are you sure to delete this?"
          @confirm="handleDeleteProducer(scope.row)"
          @cancel="
            () => {
              editForm.name = ''
              editForm.description = ''
              editId = null
            }
          "
        >
          <template #reference>
            <el-button size="small" type="danger" plain> Delete</el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button @click="cancel" size="small">No</el-button>
            <el-button @click="confirm" type="danger" size="small">
              Yes
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogVisible"
    title="Update Producer"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      :model="editForm"
      :rules="rules"
      label-width="auto"
      ref="formRef"
      style="max-width: 600px"
    >
      <el-form-item label="Producer name" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>

      <el-form-item label="Country" prop="country">
        <el-input v-model="editForm.country" />
      </el-form-item>

      <el-form-item label="Image url" prop="imageUrl">
        <el-input v-model="editForm.imageUrl" />
      </el-form-item>

      <el-form-item label="Website url" prop="website">
        <el-input v-model="editForm.website" />
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input v-model="editForm.description" type="textarea" :rows="8" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmitEdit">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
