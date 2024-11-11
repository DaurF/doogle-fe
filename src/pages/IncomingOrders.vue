<script setup lang="ts">
import { ref } from 'vue'
import type { IOrder } from '@/entities/orders/model/types'
import { fetchSupplierOrders } from '@/entities/orders/api'
import type { IProduct } from '@/entities/product/model/types'
import { apiInstance } from '@/shared/api/base'

const dialogVisible = ref(false)
const orders = ref<IOrder[]>([])
const selOrderProducts = ref<null | { quantity: number; product: IProduct }[]>(
  null,
)
created()

async function created() {
  orders.value = await fetchSupplierOrders()
}

function checkConfirmed(order: IOrder) {
  for (const confirmed of Object.values(order.confirmed)) {
    if (!confirmed) return false
  }

  return true
}

function handleOpenDialog(order: IOrder) {
  selOrderProducts.value = order.products
  dialogVisible.value = true
}

async function handleConfirm(order: IOrder) {
  await apiInstance.patch('/orders/confirm', { id: order._id })
  await created()
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[125rem] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Incoming Orders</h1>
    <el-table
      :data="orders"
      :default-sort="{ prop: 'createdAt', order: 'descending' }"
    >
      <el-table-column label="Created at" prop="createdAt" sortable width="120">
        <template #default="scope">
          {{ scope.row.createdAt.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Address" prop="address" />
      <el-table-column label="City" prop="city" />
      <el-table-column label="Price" sortable prop="totalPrice" width="120">
        <template #default="scope">
          {{ scope.row.totalPrice.toLocaleString() }} ₸
        </template>
      </el-table-column>

      <el-table-column label="Confirmed" prop="confirmed" align="center">
        <template #default="scope">
          <el-tag v-if="checkConfirmed(scope.row)" type="success">
            Confirmed
          </el-tag>
          <el-tag v-else type="danger">Unconfirmed</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Operations">
        <template #default="scope">
          <div class="flex">
            <el-button
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row)"
            >
              Show Products
            </el-button>

            <el-button
              type="primary"
              @click="handleConfirm(scope.row)"
              :disabled="checkConfirmed(scope.row)"
            >
              Confirm
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-container>

  <el-dialog
    v-model="dialogVisible"
    title="Order Products"
    width="500"
    top="6.4rem"
    @close="selOrderProducts = null"
  >
    <ul v-if="selOrderProducts">
      <li v-for="(key, idx) in Object.keys(selOrderProducts)" :key="idx">
        {{ key }}: {{ selOrderProducts[key] }}
      </li>
    </ul>
  </el-dialog>
</template>

<style scoped></style>
