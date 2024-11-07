<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ElMessage,
  ElNotification,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { apiInstance } from '@/shared/api/base'
import type { ICategory } from '@/entities/category/model/types'
import { deleteCategory, updateCategory } from '@/entities/category/api'

const CategoryFormInstance = {
  name: '',
  description: '',
}

interface RuleForm {
  name: string
  description: string
}

const { categories } = defineProps<{
  categories: ICategory[]
}>()

const emit = defineEmits<{
  (e: 'update-categories'): void
}>()

const editId = ref<null | string>(null)
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  ...CategoryFormInstance,
})

const editForm = reactive<RuleForm>({
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
      try {
        await apiInstance.post('/categories', form)
        ElNotification({
          type: 'success',
          title: 'Categories',
          message: `Category ${form.name} has been created`,
        })
        formRef.value?.resetFields()
      } catch (err) {
        ElMessage({
          message: err.message,
          type: 'error',
        })
      }
      emit('update-categories')
    }
  })
}

async function handleDeleteCategory(id: string) {
  await deleteCategory(id)
  emit('update-categories')
  ElNotification({
    type: 'success',
    title: 'Categories',
    message: `Category ${form.name} has been removed`,
  })
}

function handleClose() {
  dialogVisible.value = false
}

async function handleSubmitEdit() {
  await updateCategory({ id: editId.value, data: editForm })
  ElNotification({
    type: 'success',
    title: 'Categories',
    message: `Category ${form.name} has been updated`,
  })
  emit('update-categories')
  handleClose()
  editId.value = null
}

function handleShowEdit(data: ICategory) {
  dialogVisible.value = true
  editForm.name = data.name
  editForm.description = data.description
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

  <el-divider />

  <el-table
    :data="categories"
    border
    style="width: 100%"
    empty-text="No categories"
  >
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="description" label="Description" />
    <el-table-column fixed="right" label="Operations" min-width="15">
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
          @confirm="handleDeleteCategory(scope.row._id)"
          @cancel="
            () => {
              editForm.name = ''
              editForm.description = ''
              editId = null
            }
          "
        >
          <template #reference>
            <el-button
              @click="handleDelete(scope.$index, scope.row)"
              size="small"
              type="danger"
              plain
            >
              Delete
            </el-button>
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
    title="Update Category"
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
      <el-form-item label="Category name" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>

      <el-form-item label="Description" prop="description">
        <el-input v-model="editForm.description" type="textarea" />
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
