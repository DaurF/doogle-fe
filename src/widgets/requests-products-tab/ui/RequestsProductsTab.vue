<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import type { IProducer } from '@/entities/producer/model/types'
import type { ICategory } from '@/entities/category/model/types'
import { createRequest } from '@/entities/requests/api'
import type { Image } from '@/shared/types'

interface RuleForm {
  name: string
  category: null | string
  producer: null | string
  description: string
  price: number
  stock: number
  images: Image[]
}

const emit = defineEmits<{
  (e: 'update'): void
}>()

const { categories, producers } = defineProps<{
  categories: ICategory[]
  producers: IProducer[]
}>()

const ProductFormInstance = {
  name: '',
  category: null,
  producer: null,
  description: '',
  price: 200,
  stock: 1,
  images: [{ key: 0, value: '' }],
}

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({ ...ProductFormInstance })

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Product name', trigger: 'blur' },
    { min: 8, max: 200, message: 'Length should be 8 to 200', trigger: 'blur' },
  ],
  category: {
    required: true,
    message: 'Please select Category',
    trigger: 'blur',
  },
  producer: {
    required: true,
    message: 'Please select Producer',
    trigger: 'blur',
  },
  price: [
    {
      required: true,
      message: 'Please input Product price',
      trigger: 'blur',
    },
  ],
  stock: [
    {
      required: true,
      message: 'Please input Product price',
      trigger: 'blur',
    },
  ],
  description: [
    {
      required: true,
      message: 'Please input Product description',
      trigger: 'blue',
    },
    {
      min: 1,
      max: 500,
      message: 'Length should be 1 to 500',
      trigger: 'blur',
    },
  ],
})

function handleRemoveImage(image: Image) {
  const idx = form.images.findIndex(img => img.key === image.key)
  if (idx !== -1) form.images.splice(idx, 1)
}

function handleAddImage() {
  form.images.push({
    key: Date.now(),
    value: '',
  })
}

const onSubmit = async () => {
  await formRef.value?.validate(async valid => {
    if (valid) {
      await createRequest({
        type: 'create-product',
        body: {
          ...form,
          images: form.images.map(img => img.value),
          category: categories.find(cat => form.category === cat._id),
          producer: producers.find(prod => form.producer === prod._id),
        },
      })

      ElNotification({
        title: 'Create Product Request',
        message: `Request for adding product has been created!\nWait till moderators check your request out`,
        type: 'success',
      })

      formRef.value?.resetFields()
      form.images = []
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
    <el-form-item label="Product name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Category" prop="category">
      <el-select
        v-model="form.category"
        placeholder="please select product category"
        filterable
      >
        <el-option
          v-for="(category, idx) in categories"
          :key="idx"
          :value="category._id"
          :label="category.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Manufacturer" prop="producer">
      <el-select
        v-model="form.producer"
        placeholder="please select product manufacturer"
        filterable
      >
        <el-option
          v-for="(producer, idx) in producers"
          :key="idx"
          :value="producer._id"
          :label="producer.name"
        />
      </el-select>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="Price" prop="price">
          <el-input v-model.number="form.price" :min="200" :max="1_000_000_000">
            <template #prefix>
              <span>₸</span>
            </template>
          </el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="Stock" prop="stock">
          <el-input v-model.number="form.stock" :min="1" :max="500" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      v-for="(image, idx) in form.images"
      :key="idx"
      :label="'Image ' + idx"
      :prop="'image.' + idx + '.value'"
    >
      <div class="flex w-full gap-[1rem]">
        <el-input v-model="image.value" />
        <el-button
          @click.prevent="handleRemoveImage(image)"
          type="danger"
          :icon="Delete"
          plain
        />
      </div>
    </el-form-item>

    <el-row justify="end" class="mb-[0.8rem]">
      <el-button @click.prevent="handleAddImage" type="primary" plain>
        Add Image
      </el-button>
    </el-row>

    <el-form-item label="Description" prop="description">
      <el-input v-model="form.description" type="textarea" :rows="5" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
