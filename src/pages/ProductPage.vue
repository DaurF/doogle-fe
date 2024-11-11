<script setup lang="ts">
import { ref } from 'vue'
import type { IProduct } from '@/entities/product/model/types'
import { apiInstance } from '@/shared/api/base'
import { ShoppingCart, Star, StarFilled } from '@element-plus/icons-vue'
import { addToCart, removeFromCart } from '@/entities/user/api'
import { useUserStore } from '@/stores/user'
import { StripeCheckout } from '@vue-stripe/vue-stripe'
import {
  addProductToFavorites,
  removeProductFromFavorites,
} from '@/entities/product/api'

const { id } = defineProps<{
  id: string
}>()

const { role } = useUserStore()

const product = ref<IProduct | null>(null)

created()

async function created() {
  product.value = await apiInstance.get<IProduct>(`/products/${id}`)
}

async function handleToggleFavorite(productId: string) {
  if (product.value?.isFavorite) await removeProductFromFavorites(productId)
  else await addProductToFavorites(productId)
  await created()
}

async function addOrRemoveCart() {
  if (!product.value?.isInCart) await addToCart(id)
  else await removeFromCart(id)
  await created()
}
</script>

<template>
  <el-container
    direction="vertical"
    class="max-w-[50%] mx-auto items-start mt-[6.4rem]"
    v-if="product"
  >
    <el-row :gutter="24">
      <el-col :span="10">
        <el-carousel height="500px">
          <el-carousel-item v-for="(item, idx) in product.images" :key="idx">
            <el-image :src="item" fit="cover" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="14">
        <h4 class="text-[2.6rem] leading-[1.1] font-medium mb-[2.4rem]">
          {{ product.name }}
        </h4>

        <div class="flex items-center gap-[1.6rem] mb-[3.6rem]">
          <el-image
            class="h-[3.2rem] object-cover"
            v-if="product.producer.imageUrl"
            :src="product.producer.imageUrl"
            :alt="product.producer.name"
          />
        </div>

        <p class="mb-[1.2rem]">{{ product.description }}</p>
        <p class="mb-[1.6rem]">Category: {{ product.category.name }}</p>
        <p class="text-[2.4rem] mb-[3.6rem] text-end">
          Price: {{ product.price.toLocaleString() }} ₸
        </p>

        <div class="flex" v-if="role === 'customer'">
          <el-button
            size="large"
            :type="product.isInCart ? 'danger' : 'primary'"
            :icon="ShoppingCart"
            :disabled="product.stock === 0"
            @click="addOrRemoveCart"
          >
            {{ product.isInCart ? 'Remove from' : 'Add to' }} Cart
          </el-button>
          <el-button
            size="large"
            :type="product.isFavorite ? 'danger' : 'primary'"
            plain
            @click="handleToggleFavorite(product._id)"
          >
            <el-icon size="18">
              <Star v-if="!product.isFavorite" />
              <StarFilled v-else-if="product.isFavorite" />
            </el-icon>
          </el-button>
        </div>
        <p v-if="role !== 'customer'">
          Войдите через аккаунт <strong>клиента</strong> для совершения покупока
        </p>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped></style>
