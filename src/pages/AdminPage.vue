<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ICategory } from '@/entities/category/model/types'
import { fetchCategories, fetchProducers } from '@/entities/category/api'
import type { IProducer } from '@/entities/producer/model/types'
import { type FormInstance, ElNotification, type FormRules } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { apiInstance } from '@/shared/api/base'
import { fetchProducts } from '@/entities/product/api'
import type { IProduct } from '@/entities/product/model/types'

const activeTab = ref<'create' | 'data'>('data')

const visible = ref(false)

const search = ref('')

const productList = ref<IProduct[]>([])
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
  ],
  quantity: [
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
      min: 50,
      max: 500,
      message: 'Length should be 50 to 500',
      trigger: 'blur',
    },
  ],
})

created()

async function created() {
  categoryList.value = await fetchCategories()
  producerList.value = await fetchProducers()
  await getProducts()
}

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
  await apiInstance.post('/products', {
    ...form,
    images: form.images.map(img => img.value),
    stock: form.quantity,
  })
  activeTab.value = 'data'

  await getProducts()
}

async function handleDelete(product: IProduct) {
  visible.value = false
  await apiInstance.delete(`/products/${product._id}`)
  ElNotification({
    title: 'Products',
    message: `Product with id ${product._id} has been deleted successfully!`,
    type: 'success',
  })

  await getProducts()
}

async function getProducts() {
  productList.value = await fetchProducts()
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
          <el-form-item label="Category" prop="category">
            <el-select
              v-model="form.category"
              placeholder="please select product category"
            >
              <el-option
                v-for="(category, idx) in categoryList"
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
            >
              <el-option
                v-for="(producer, idx) in producerList"
                :key="idx"
                :value="producer._id"
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

          <el-form-item
            v-for="(image, idx) in form.images"
            :key="idx"
            :label="'Image ' + idx"
            :prop="'image.' + idx + '.value'"
          >
            <el-space>
              <el-input v-model="image.value" />
              <el-button
                @click.prevent="handleRemoveImage(image)"
                type="danger"
                :icon="Delete"
                plain
              />
            </el-space>
          </el-form-item>

          <el-row justify="end" class="mb-[0.8rem]">
            <el-button @click.prevent="handleAddImage" type="primary" plain>
              Add Image
            </el-button>
          </el-row>

          <el-form-item label="Description" prop="description">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Create</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Products" name="data">
        <el-table
          :data="productList"
          :default-sort="{ prop: 'createdAt', order: 'descending' }"
        >
          <el-table-column
            label="Created at"
            prop="createdAt"
            sortable
            width="120"
          >
            <template #default="scope">
              {{ scope.row.createdAt.split('T')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="Manufacturer" prop="producer" width="135">
            <template #default="scope">
              {{ scope.row.producer.name }}
            </template>
          </el-table-column>
          <el-table-column label="Category" prop="category" width="135">
            <template #default="scope">
              {{ scope.row.category.name }}
            </template>
          </el-table-column>
          <el-table-column label="Name" prop="name" />
          <el-table-column label="Price" sortable prop="price" width="120">
            <template #default="scope">
              {{ scope.row.price.toLocaleString() }} ₸
            </template>
          </el-table-column>
          <el-table-column label="Image" prop="images" width="150">
            <template #default="scope">
              <el-image
                :src="scope.row.images[0]"
                class="h-[8rem] mx-auto"
                fit="cover"
              />
            </template>
          </el-table-column>

          <el-table-column align="right">
            <template #header>
              <el-input
                v-model="search"
                size="small"
                placeholder="Type to search"
              />
            </template>
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                Edit
              </el-button>
              <el-popover
                :key="scope.row._id"
                :visible="visible"
                placement="bottom"
                width="200"
              >
                <p>Are you sure you wish to delete this product?</p>
                <el-button text @click="visible = false">Cancel</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)"
                >
                  Confirm
                </el-button>
                <template #reference>
                  <el-button size="small" type="danger" @click="visible = true">
                    Delete
                  </el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped></style>
