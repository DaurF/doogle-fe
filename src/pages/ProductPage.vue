<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import { apiInstance } from '@/shared/api/base'
import { Star, StarFilled } from '@element-plus/icons-vue'

const { id } = defineProps<{
  id: string
}>()

const dialogVisible = ref(false)
const product = ref<IProduct | null>(null)

created()

async function created() {
  product.value = await apiInstance.get<IProduct>(`/products/${id}`)
}

async function addToFavorites(productId: string) {
  await apiInstance.patch(`/users/${productId}`)
}

async function handleBuy() {
  await apiInstance.post(`/products/${id}/buy`)
  dialogVisible.value = false
}

function handleClose() {
  dialogVisible.value = false
}
</script>

<template>
  <el-container
    direction="vertical"
    class="max-w-[50%] mx-auto items-start"
    v-if="product"
  >
    <el-image :src="product.images[0]" class="h-[24rem]" fit="cover" />
    <h4 class="text-[2.4rem]">{{ product.name }}</h4>
    <p class="mb-[1.2rem]">{{ product.description }}</p>
    <p>Manufacturer: {{ product.producer.name }}</p>
    <p class="mb-[2.4rem]">Category: {{ product.category.name }}</p>
    <div class="flex justify-between">
      <el-button size="large" type="primary" @click="dialogVisible = true">
        Купить за {{ product.price.toLocaleString() }} ₸
      </el-button>
      <el-button
        size="large"
        :icon="product.isFavorite ? StarFilled : Star"
        type="primary"
        plain
        @click="addToFavorites(product._id)"
      />
    </div>
  </el-container>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <p>
      To purchase you product send to
      <span class="text-red-600">{{ product.price.toLocaleString() }} ₸</span>
      to this bitcoin address
    </p>
    <p class="text-blue-600">1FfmbHfnpaZjKFvyi1okTjJJusN455paPH</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleBuy">
          Confirm that I've sent
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
