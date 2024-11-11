<script setup lang="ts">
import { ref } from 'vue'
import { apiInstance } from '@/shared/api/base'

const stats = ref<null | any>(null)

created()

async function created() {
  stats.value = await apiInstance.get('/orders/supplier-statistics')
  console.log(stats.value)
}
</script>

<template>
  <div class="max-w-[120rem] mx-auto">
    <el-row v-if="stats">
      <el-col :span="12">
        <el-statistic title="Total Order Count" :value="stats.orderCount" />
      </el-col>
      <el-col :span="12">
        <el-statistic title="Total Revenue" :value="stats.totalRevenue" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
