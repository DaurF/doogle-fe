<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import {
  fetchDesiredProducts,
  removeProductFromFavorites,
} from '@/entities/product/api'
import { StarFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const desiredProducts = ref<IProduct[]>()

init()

async function init() {
  desiredProducts.value = await fetchDesiredProducts()
}

async function handleRemoveFavorite(product: IProduct) {
  await removeProductFromFavorites(product._id)
  await init()
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[125rem] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Desired Products</h1>
    <el-table
      :data="desiredProducts"
      empty-text="В желаемых не ничего"
      row-class-name="cursor-pointer"
      @cell-click="
        (row: any, cell: any) =>
          cell.label !== 'Operations' &&
          router.push({ name: 'product', params: { id: row._id } })
      "
    >
      <el-table-column label="Name" prop="name" class="cursor-pointer" />
      <el-table-column label="Price" sortable prop="price" width="120">
        <template #default="scope">
          {{ scope.row.price.toLocaleString() }} ₸
        </template>
      </el-table-column>
      <el-table-column label="Image" prop="images" width="200">
        <template #default="scope">
          <div class="flex justify-center">
            <el-image
              :src="scope.row.images[0]"
              class="h-[9.6rem]"
              fit="cover"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="150" align="center">
        <template #default="scope">
          <el-button
            type="danger"
            plain
            @click="handleRemoveFavorite(scope.row)"
          >
            <el-icon class="el-icon--left">
              <StarFilled />
            </el-icon>
            Unfavor
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<style scoped></style>
