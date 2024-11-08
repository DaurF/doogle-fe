<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import { changeQuantity, clearCart, fetchCart } from '@/entities/user/api'
import {
  ElMessageBox,
  ElNotification,
  type FormInstance,
  type FormRules,
} from 'element-plus'
import { Right } from '@element-plus/icons-vue'
import type { OrderPayload } from '@/entities/orders/model/types'
import { addOrder } from '@/entities/orders/api'

type CartItem = { product: IProduct; quantity: number; dirty?: boolean }

const ordered = ref(false)
const cart = ref<CartItem[]>([])
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()

interface RuleForm {
  city: string
  address: string
  delivery_time: string
}

const form = reactive({
  city: '',
  address: '',
  delivery_time: '',
})

const rules = reactive<FormRules<RuleForm>>({
  city: {
    required: true,
    message: 'Please input city',
    trigger: 'blur',
  },
  address: {
    required: true,
    message: 'Please input address',
    trigger: 'blur',
  },
  delivery_time: {
    required: true,
    message: 'Please select delivery_time',
    trigger: 'blur',
  },
})

const totalPrice = ref(0)

init()

async function init() {
  const data = await fetchCart()
  cart.value = data.map(el => ({ ...el, dirty: false }))
}

async function handleSaveChanges(item: CartItem) {
  await changeQuantity({ productId: item.product._id, quantity: item.quantity })
  ElNotification({
    title: 'Change Quantity',
    message: `You've successfully changed quantity of product ${item.product._id} to ${item.quantity}`,
    type: 'success',
  })
  item.dirty = false
}

const handleClose = () => {
  ElMessageBox.confirm(
    'Are you sure to close this dialog? All the form will be reset',
  )
    .then(handleCloseDialog)
    .catch(() => {
      // catch error
    })
}

function handleCloseDialog() {
  dialogVisible.value = false
  formRef.value?.resetFields()
  setTimeout(() => {
    ordered.value = false
    totalPrice.value = 0
  }, 300)
}

async function onSubmitOrder() {
  await formRef.value?.validate(async valid => {
    if (valid) {
      const total = cart.value.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      )

      ordered.value = true
      const payload: OrderPayload = {
        ...form,
        products: cart.value.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalPrice: total,
      }
      await addOrder(payload)
      totalPrice.value = total
      await clearCart()
      await init()
    }
  })
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[125rem] mx-auto">
    <div class="flex justify-between items-center mb-[1.2rem]">
      <h1 class="text-[2.4rem] mt-[1.6rem]">Cart</h1>
      <el-button
        size="large"
        type="primary"
        @click="dialogVisible = true"
        :disabled="cart.length === 0"
        >Place an order
        <el-icon class="el-icon--right">
          <Right />
        </el-icon>
      </el-button>
    </div>
    <el-table :data="cart" empty-text="В корзине не товаров">
      <el-table-column label="Created at" prop="createdAt" sortable width="120">
        <template #default="scope">
          {{ scope.row.product.createdAt.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Manufacturer" prop="producer" width="135">
        <template #default="scope">
          {{ scope.row.product.producer.name }}
        </template>
      </el-table-column>
      <el-table-column label="Category" prop="category" width="135">
        <template #default="scope">
          {{ scope.row.product.category.name }}
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="product.name" />
      <el-table-column label="Price" sortable prop="price" width="120">
        <template #default="scope">
          {{ scope.row.product.price.toLocaleString() }} ₸
        </template>
      </el-table-column>
      <el-table-column label="Image" prop="images" width="150">
        <template #default="scope">
          <div class="flex justify-center">
            <el-image
              :src="scope.row.product.images[0]"
              class="h-[9.6rem]"
              fit="cover"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Quantity" prop="quantity" align="center">
        <template #default="scope">
          <el-input-number
            :min="1"
            :max="scope.row.product.stock"
            @change="scope.row.dirty = true"
            v-model="scope.row.quantity"
          />
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="120" align="center">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            :disabled="!scope.row.dirty"
            @click.prevent="handleSaveChanges(scope.row)"
          >
            Save Changes
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-container>

  <el-dialog
    v-model="dialogVisible"
    title="Ordering"
    width="400"
    :before-close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      v-if="!ordered"
    >
      <el-form-item label="City" prop="city">
        <el-input v-model="form.city" />
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="Delivery" prop="delivery_time">
        <el-date-picker
          v-model="form.delivery_time"
          type="date"
          aria-label="Pick a date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <el-result icon="success" title="Order Confirmed" v-else>
      <template #sub-title>
        <p>
          Please transfer
          <strong class="text-[1.475rem] text-black">{{ totalPrice }} ₸</strong>
          to the following Kaspi phone number:
          <strong class="text-[1.475rem] text-black">+777777777</strong>
        </p>
      </template>
    </el-result>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCloseDialog">Close</el-button>
        <el-button v-if="!ordered" type="primary" @click="onSubmitOrder">
          Confirm Order
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
