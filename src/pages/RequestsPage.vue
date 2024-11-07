<script setup lang="ts">
import { ref } from 'vue'
import RequestsProductsTab from '@/widgets/requests-products-tab/ui/RequestsProductsTab.vue'
import { deleteRequest, fetchRequests } from '@/entities/requests/api'
import type { IRequest, RequestType } from '@/entities/requests/model/types'
import { fetchCategories } from '@/entities/category/api'
import { fetchProducers } from '@/entities/producer/api'
import type { ICategory } from '@/entities/category/model/types'
import type { IProducer } from '@/entities/producer/model/types'
import RequestsCategoriesTab from '@/widgets/requests-categories-tab/ui/RequestsCategoriesTab.vue'
import RequestsProducersTab from '@/widgets/requests-producers-tab/ui/RequestsProducersTab.vue'
import { ElNotification } from 'element-plus'

const options = ['Products', 'Categories', 'Producers']

const dialogVisible = ref(false)

const value = ref<'Products' | 'Categories' | 'Producers'>('Products')

const categories = ref<ICategory[]>([])
const producers = ref<IProducer[]>([])
const requests = ref<never[]>([])

const selRequest = ref<null | IRequest>(null)

init()

async function init() {
  requests.value = await fetchRequests()
  categories.value = await fetchCategories()
  producers.value = await fetchProducers()
}

function getTypeLabel(type: RequestType) {
  switch (type) {
    case 'create-category':
      return 'Creating Category'
    case 'create-producer':
      return 'Creating Producer'
    case 'create-product':
      return 'Creating Product'
    case 'update-category':
      return 'Updating Category'
    case 'update-producer':
      return 'Updating Producer'
    case 'update-product':
      return 'Updating Product'
    default:
      return ''
  }
}

function handleOpenDialog(request: IRequest) {
  selRequest.value = request
  dialogVisible.value = true
}

async function handleRemove(requestId: string) {
  await deleteRequest(requestId)
  ElNotification({
    title: 'Request Remove',
    message: 'Request has been removed!',
  })

  await init()
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem]">Requests</h1>
    <el-divider />
    <el-row :gutter="24">
      <el-col :span="12">
        <div class="custom-style">
          <el-segmented v-model="value" :options="options" />
        </div>
        <el-divider />
        <RequestsProductsTab
          v-if="value === 'Products'"
          :categories="categories"
          :producers="producers"
          @update="init"
        />
        <RequestsCategoriesTab v-if="value === 'Categories'" @update="init" />
        <RequestsProducersTab v-if="value === 'Producers'" @update="init" />
      </el-col>
      <el-col :span="12">
        <el-table :data="requests">
          <el-table-column label="Created at" prop="createdAt" sortable>
            <template #default="scope">
              {{ scope.row.createdAt.split('T')[0] }}
            </template>
          </el-table-column>

          <el-table-column label="Type" prop="type">
            <template #default="scope">
              {{ getTypeLabel(scope.row.type) }}
            </template>
          </el-table-column>

          <el-table-column label="Status" prop="status">
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.status === 'pending'
                    ? 'primary'
                    : scope.row.status === 'approved'
                      ? 'success'
                      : scope.row.status === 'rejected'
                        ? 'danger'
                        : ''
                "
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="Operations">
            <template #default="scope">
              <el-button
                @click="handleOpenDialog(scope.row)"
                type="primary"
                size="small"
                link
              >
                Details
              </el-button>
              <el-button
                @click="handleRemove(scope.row._id)"
                type="danger"
                size="small"
                link
              >
                Remove
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-container>

  <el-dialog
    v-model="dialogVisible"
    title="Request Details"
    width="500"
    @close="selRequest = null"
  >
    <ul v-if="selRequest">
      <li v-for="(key, idx) in Object.keys(selRequest)" :key="idx">
        {{ key }}: {{ selRequest[key] }}
      </li>
    </ul>
  </el-dialog>
</template>

<style scoped>
.custom-style .el-segmented {
  --el-border-radius-base: 16px;
}
</style>
