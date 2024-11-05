<script setup lang="ts">
import { apiInstance } from '@/shared/api/base'
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'

const orders = ref<IProduct[]>([])
const search = ref('')

created()

async function created() {
  orders.value = await apiInstance.get<IProduct[]>('/users/purchase-history')
  console.log(orders.value)
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Orders</h1>
    <el-table
      :data="orders"
      :default-sort="{ prop: 'createdAt', order: 'descending' }"
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
      </el-table-column>
    </el-table>
  </el-container>
</template>

<style scoped></style>
