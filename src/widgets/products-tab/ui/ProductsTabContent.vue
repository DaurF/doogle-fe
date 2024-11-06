<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { apiInstance } from '@/shared/api/base'
import type { IProduct } from '@/entities/product/model/types'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import type { IProducer } from '@/entities/producer/model/types'
import type { ICategory } from '@/entities/category/model/types'
import { fetchProducts } from '@/entities/product/api'

interface Image {
  key: number
  value: string
}

interface RuleForm {
  name: string
  category: null | ICategory
  producer: null | IProducer
  description: string
  price: number
  stock: number
  images: Image[]
}

const ProductFormInstance = {
  name: '',
  category: null,
  producer: null,
  description: '',
  price: 200,
  stock: 1,
  images: [{ key: 0, value: '' }],
}

const { categories, producers } = defineProps<{
  categories: ICategory[]
  producers: IProducer[]
}>()

const selProductId = ref<null | string>(null)
const dialogVisible = ref(false)
const search = ref('')
const productList = ref<IProduct[]>([])

const filterProductList = computed(() =>
  productList.value.filter(
    data =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const formRef = ref<FormInstance>()
const formRefEdit = ref<FormInstance>()

const form = reactive<RuleForm>({ ...ProductFormInstance })
const editForm = ref<RuleForm>({ ...ProductFormInstance })

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

init()

async function init() {
  productList.value = await fetchProducts()
}

function handleRemoveImage(image: Image) {
  const idx = form.images.findIndex(img => img.key === image.key)
  if (idx !== -1) form.images.splice(idx, 1)
}

function handleRemoveEditImage(image: Image) {
  const idx = editForm.value.images.findIndex(img => img.key === image.key)
  if (idx !== -1) editForm.value.images.splice(idx, 1)
}

function handleAddImage() {
  form.images.push({
    key: Date.now(),
    value: '',
  })
}

function handleAddEditImage() {
  editForm.value.images.push({
    key: Date.now(),
    value: '',
  })
}

const onSubmit = async () => {
  await formRef.value?.validate(async valid => {
    if (valid) {
      const res = await apiInstance.post('/products', {
        ...form,
        images: form.images.map(img => img.value),
      })

      ElNotification({
        title: 'Products',
        message: `Product with id ${product._id} has been created!`,
        type: 'success',
      })

      await init()

      formRef.value?.resetFields()
      form.images = []
    }
  })
}

async function handleDelete(product: IProduct) {
  await apiInstance.delete(`/products/${product._id}`)
  ElNotification({
    title: 'Products',
    message: `Product with id ${product._id} has been deleted successfully!`,
    type: 'success',
  })

  await init()
}

function handleShowEdit(product: IProduct) {
  selProductId.value = product._id

  editForm.value.name = product.name
  editForm.value.category = product.category
  editForm.value.producer = product.producer
  editForm.value.price = product.price
  editForm.value.description = product.description
  editForm.value.images = Array.from(
    { length: product.images.length },
    (_, i) => ({
      key: i + 1,
      value: product.images[i],
    }),
  )
  dialogVisible.value = true
}

async function handleSubmitEdit() {
  await formRefEdit.value?.validate(async valid => {
    if (valid) {
      await apiInstance.patch(`/products/${selProductId.value}`, {
        ...editForm.value,
        images: editForm.value.images.map(img => img.value),
      })

      ElNotification({
        title: 'Products',
        message: `Product with id ${selProductId.value} has been updated!`,
        type: 'success',
      })

      await init()

      formRefEdit.value?.resetFields()
      editForm.value.images = []
      dialogVisible.value = false
      selProductId.value = null
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
          :value="category"
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
          :value="producer"
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
      <el-input v-model="form.description" type="textarea" rows="5" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>

  <el-divider />

  <el-table
    :data="filterProductList"
    :default-sort="{ prop: 'createdAt', order: 'descending' }"
    empty-text="Нет товаров"
  >
    <el-table-column label="Created at" prop="createdAt" sortable width="120">
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
        <div class="flex justify-center">
          <el-image :src="scope.row.images[0]" class="h-[8rem]" fit="cover" />
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Stock" prop="stock" align="center" sortable />

    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleShowEdit(scope.row)">
          Edit
        </el-button>
        <el-popconfirm
          title="Are you sure you wish to delete this product?"
          width="200"
          @confirm="handleDelete(scope.row)"
        >
          <template #reference>
            <el-button size="small" type="danger"> Delete</el-button>
          </template>
          <template #actions="{ confirm, cancel }">
            <el-button text @click="cancel">Cancel</el-button>
            <el-button size="small" type="danger" @click="confirm">
              Confirm
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <el-form
      :model="editForm"
      :rules="rules"
      label-width="auto"
      ref="formRefEdit"
      style="max-width: 600px"
    >
      <el-form-item label="Product name" prop="name">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-select
          v-model="editForm.category"
          placeholder="please select product category"
          filterable
        >
          <el-option
            v-for="(category, idx) in categories"
            :key="idx"
            :value="category"
            :label="category.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Manufacturer" prop="producer">
        <el-select
          v-model="editForm.producer"
          placeholder="please select product manufacturer"
          filterable
        >
          <el-option
            v-for="(producer, idx) in producers"
            :key="idx"
            :value="producer"
            :label="producer.name"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="Price" prop="price">
            <el-input
              v-model.number="editForm.price"
              :min="200"
              :max="1_000_000_000"
            >
              <template #prefix>
                <span>₸</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="Stock" prop="stock">
            <el-input v-model.number="editForm.stock" :min="1" :max="500" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        v-for="(image, idx) in editForm.images"
        :key="idx"
        :label="'Image ' + idx"
        :prop="'image.' + idx + '.value'"
      >
        <div class="flex w-full gap-[1rem]">
          <el-input v-model="image.value" />
          <el-button
            @click.prevent="handleRemoveEditImage(image)"
            type="danger"
            :icon="Delete"
            plain
          />
        </div>
      </el-form-item>

      <el-row justify="end" class="mb-[0.8rem]">
        <el-button @click.prevent="handleAddEditImage" type="primary" plain>
          Add Image
        </el-button>
      </el-row>

      <el-form-item label="Description" prop="description">
        <el-input v-model="editForm.description" type="textarea" rows="8" />
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
