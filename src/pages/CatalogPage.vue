<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import type { IPagination, IProduct } from '@/entities/product/model/types'
import { fetchProducts } from '@/entities/product/api'
import type { ICategory } from '@/entities/category/model/types'
import type { IProducer } from '@/entities/producer/model/types'
import { fetchCategories } from '@/entities/category/api'
import { fetchProducers } from '@/entities/producer/api'

const totalSize = ref(0)

const productList = ref<IProduct[]>([])
const categories = ref<ICategory[]>([])
const producers = ref<IProducer[]>([])

const pagination = reactive<IPagination>({
  page: 1,
  limit: 10,
  search: '',
  category: undefined,
  producer: undefined,
})

watchEffect(getProductList)

init()

async function init() {
  await getProductList()
  categories.value = await fetchCategories()
  producers.value = await fetchProducers()
}

async function getProductList() {
  const res = await fetchProducts(pagination)
  productList.value = res.products
  totalSize.value = res.total
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[128rem] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem]">Catalog</h1>
    <el-divider />
    <el-row :gutter="40">
      <el-col :span="6">
        <el-card shadow="never">
          <div>
            <label for="search" class="block mb-[0.8rem] text-[1.475rem]">
              Search
            </label>
            <el-input
              id="search"
              placeholder="Search..."
              v-model="pagination.search"
            />
          </div>
          <el-divider />
          <div class="mb-[1.6rem]">
            <label for="cat" class="block mb-[0.8rem] text-[1.475rem]">
              Category
            </label>
            <el-select
              id="cat"
              v-model="pagination.category"
              placeholder="Select category"
              clearable
            >
              <el-option
                v-for="(cat, idx) in categories"
                :key="idx"
                :label="cat.name"
                :value="cat.name"
              />
            </el-select>
          </div>

          <div>
            <label for="brand" class="block mb-[0.8rem] text-[1.475rem]">
              Producer
            </label>
            <el-select
              id="brand"
              v-model="pagination.producer"
              placeholder="Select producer"
              clearable
            >
              <el-option
                v-for="(item, idx) in producers"
                :key="idx"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17">
        <div class="grid grid-cols-3 gap-[2.4rem] mb-[3.6rem] items-stretch">
          <RouterLink
            :to="{ name: 'product', params: { id: product._id } }"
            v-for="(product, idx) in productList"
            :key="idx"
          >
            <el-card class="h-full" shadow="never">
              <template #header>
                <p
                  class="h-[4.8rem] overflow-hidden text-[1.6rem] text-ellipsis"
                >
                  {{ product.name }}
                </p>
              </template>

              <div class="flex justify-center mb-[1.6rem]">
                <el-image
                  :src="product.images[0]"
                  class="h-[12rem]"
                  fit="cover"
                />
              </div>
              <p
                class="overflow-hidden h-[9.2rem] text-ellipsis text-[1.2rem] mb-[1.2rem]"
              >
                {{ product.description }}
              </p>
              <p class="text-end">Осталось: {{ product.stock }} шт.</p>
            </el-card>
          </RouterLink>
        </div>
        <div class="flex justify-center">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.limit"
            :page-sizes="[10, 20, 30, 40]"
            layout="sizes, prev, pager, next, jumper"
            :total="totalSize"
          />
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<style scoped></style>
