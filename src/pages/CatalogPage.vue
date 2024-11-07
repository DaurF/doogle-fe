<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import { fetchProducts } from '@/entities/product/api'
import { Star } from '@element-plus/icons-vue'
import { apiInstance } from '@/shared/api/base'

const productList = ref<IProduct[]>([])

init()

async function init() {
  productList.value = await fetchProducts()
}

async function addToFavorites(productId: string) {
  await apiInstance.patch(`/users/${productId}`)
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem]">Catalog</h1>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never">
          <el-input placeholder="Search..." />
        </el-card>
      </el-col>
      <el-col :span="18">
        <div class="grid grid-cols-3 gap-[2.4rem] items-stretch">
          <RouterLink
            :to="{ name: 'product', params: { id: product._id } }"
            v-for="(product, idx) in productList"
            :key="idx"
          >
            <el-card class="h-full" shadow="never">
              <template #header>
                <span class="text-[1.6rem]">{{ product.name }}</span>
              </template>

              <div class="flex justify-center mb-[1.6rem]">
                <el-image
                  :src="product.images[0]"
                  class="h-[12rem]"
                  fit="cover"
                />
              </div>
              <p class="overflow-auto text-[1.2rem] mb-[1.2rem]">
                {{ product.description }}
              </p>
              <p class="text-end">Осталось: {{ product.stock }} шт.</p>
            </el-card>
          </RouterLink>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped></style>
