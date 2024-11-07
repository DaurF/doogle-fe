<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import { changeQuantity, fetchCart } from '@/entities/user/api'
import { ElNotification } from 'element-plus'
import { Right } from '@element-plus/icons-vue'

type CartItem = { product: IProduct; quantity: number; dirty?: boolean }

const cart = ref<CartItem[]>([])

init()

async function init() {
  cart.value = (await fetchCart()).map(el => ({ ...el, dirty: false }))
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
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Cart</h1>
      <el-button size="large" type="primary"
        >Place an order
        <el-icon class="el-icon--right">
          <Right />
        </el-icon>
      </el-button>
    </div>
    <el-divider />
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
</template>

<style scoped></style>
