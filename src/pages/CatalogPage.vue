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
    <div class="grid grid-cols-3 gap-[2.4rem] items-stretch">
      <RouterLink
        :to="{ name: 'product', params: { id: product._id } }"
        v-for="(product, idx) in productList"
        :key="idx"
      >
        <el-card class="h-full">
          <template #header>
            <div class="card-header">
              <span>{{ product.name }}</span>
            </div>
          </template>

          <div class="flex justify-center mb-[1.6rem]">
            <el-image :src="product.images[0]" class="h-[16rem]" fit="cover" />
          </div>
          <p class="overflow-auto">{{ product.description }}</p>
        </el-card>
      </RouterLink>
    </div>
  </el-container>
</template>

<style scoped></style>
