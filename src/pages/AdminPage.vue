<script setup lang="ts">
import { ref } from 'vue'
import CategoriesTabContent from '@/widgets/categories-tab/ui/CategoriesTabContent.vue'
import { fetchCategories } from '@/entities/category/api'
import type { ICategory } from '@/entities/category/model/types'
import ProducersTabContent from '@/widgets/producers-tab/ui/ProducersTabContent.vue'
import ProductsTabContent from '@/widgets/products-tab/ui/ProductsTabContent.vue'
import type { IProducer } from '@/entities/producer/model/types'
import { fetchProducers } from '@/entities/producer/api'

enum ActiveTab {
  PRODUCTS,
  CATEGORIES,
  PRODUCERS,
}

const activeTab = ref<ActiveTab>(ActiveTab.PRODUCTS)

const categoryList = ref<ICategory[]>([])
const producerList = ref<IProducer[]>([])

init()

async function init() {
  await setCategories()
  await setProducers()
}

async function setCategories() {
  categoryList.value = await fetchCategories()
}

async function setProducers() {
  producerList.value = await fetchProducers()
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem] mb-[1.2rem]">Admin panel</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Products" :name="ActiveTab.PRODUCTS">
        <ProductsTabContent
          :categories="categoryList"
          :producers="producerList"
        />
      </el-tab-pane>
      <el-tab-pane label="Categories" :name="ActiveTab.CATEGORIES">
        <CategoriesTabContent
          :categories="categoryList"
          @update-categories="setCategories"
        />
      </el-tab-pane>
      <el-tab-pane label="Producers" :name="ActiveTab.PRODUCERS">
        <ProducersTabContent
          :producers="producerList"
          @update-producers="setProducers"
        />
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<style scoped></style>
