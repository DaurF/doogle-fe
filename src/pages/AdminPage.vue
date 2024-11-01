<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ICategory } from '@/entities/category/model/types'
import { fetchCategories, fetchProducers } from '@/entities/category/api'
import type { IProducer } from '@/entities/producer/model/types'
import type { FormInstance } from 'element-plus'
import type { FormRules } from 'element-plus/lib/components'

const activeTab = ref<'create' | 'data'>('create')

const categoryList = ref<ICategory[]>([])
const producerList = ref<IProducer[]>([])

interface Image {
  key: number
  value: string
}

interface RuleForm {
  name: string
  category: string
  producer: string
  description: string
  price: number
  images: Image[]
}

const formRef = ref<FormInstance>()

const form = reactive<RuleForm>({
  name: '',
  category: '',
  producer: '',
  description: '',
  price: 200,
  quantity: 1,
  images: [],
})

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
    {
      min: 200,
      max: 1_000_000_000,
      message: 'Price has to range from 200 to 1000000000',
      trigger: 'blur',
    },
  ],
})

created()

async function created() {
  categoryList.value = await fetchCategories()
  producerList.value = await fetchProducers()
}

const onSubmit = () => {
  console.log('submit!')
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Admin panel</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Create" name="create">
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
          <el-form-item label="Category">
            <el-select
              v-model="form.category"
              placeholder="please select product category"
            >
              <el-option
                v-for="(category, idx) in categoryList"
                :key="idx"
                :value="category.id"
                :label="category.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Manufacturer" prop="producer">
            <el-select
              v-model="form.producer"
              placeholder="please select product manufacturer"
            >
              <el-option
                v-for="(producer, idx) in producerList"
                :key="idx"
                :value="producer.id"
                :label="producer.name"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Price" prop="price">
                <el-input-number
                  v-model="form.price"
                  :min="200"
                  :max="1_000_000_000"
                >
                  <template #prefix>
                    <span>₸</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Quantity" prop="quantity">
                <el-input-number v-model="form.quantity" :min="1" :max="500" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Description" prop="description">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Products" name="data">Товары</el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped></style>
