<script setup lang="ts">
import { apiInstance } from '@/shared/api/base'
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'

const productList = ref<IProduct[]>([])

created()

async function created() {
  productList.value = await apiInstance.get('/products/recommendations')
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[130rem] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[2.4rem]">Recommendations</h1>
    <div class="grid grid-cols-6 gap-[2.4rem] items-stretch text-[1.2rem]">
      <RouterLink
        :to="{ name: 'product', params: { id: product._id } }"
        v-for="(product, idx) in productList"
        :key="idx"
      >
        <el-card class="h-full" shadow="never">
          <template #header>
            <div class="card-header">
              <p class="h-[4.6rem] overflow-hidden text-[1.4rem] font-bold">
                {{ product.name }}
              </p>
            </div>
          </template>

          <div class="flex justify-center mb-[1.6rem]">
            <el-image :src="product.images[0]" class="h-[12rem]" fit="cover" />
          </div>
          <p class="overflow-hidden h-[9.2rem]">{{ product.description }}</p>
        </el-card>
      </RouterLink>
    </div>
  </el-container>
</template>
