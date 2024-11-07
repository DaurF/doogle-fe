<script setup lang="ts">
import { ref } from 'vue'
import type { IRequest, RequestType } from '@/entities/requests/model/types'
import {
  approveRequest,
  fetchAllRequests,
  rejectRequest,
} from '@/entities/requests/api'
import { ElNotification } from 'element-plus'

const requests = ref<IRequest>([])

const dialogVisible = ref(false)
const selRequest = ref<null | IRequest>(null)

init()

async function init() {
  requests.value = await fetchAllRequests()
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

async function handleRejectRequest(request: IRequest) {
  await rejectRequest(request._id)
  ElNotification({
    title: 'Requests',
    message: `Request ${request._id} has been rejected`,
    type: 'success',
  })
  await init()
}

async function handleApproveRequest(request: IRequest) {
  await approveRequest(request._id, {
    data: { ...request.body, userId: request.submittedBy, type: request.type },
  })
  ElNotification({
    title: 'Requests',
    message: `Request ${request._id} has been approved`,
    type: 'success',
  })
  await init()
}
</script>

<template>
  <el-container direction="vertical" class="max-w-[60%] mx-auto">
    <h1 class="text-[2.4rem] mt-[1.6rem]">Incoming Requests</h1>
    <el-divider />
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

      <el-table-column fixed="right" label="Operations" align="center">
        <template #default="scope">
          <el-button
            @click="handleApproveRequest(scope.row)"
            size="small"
            type="success"
            plain
            :disabled="scope.row.status !== 'pending'"
          >
            Approve
          </el-button>
          <el-button
            size="small"
            type="danger"
            plain
            @click="handleRejectRequest(scope.row)"
            :disabled="scope.row.status !== 'pending'"
          >
            Reject
          </el-button>

          <el-button
            @click="handleOpenDialog(scope.row)"
            type="primary"
            size="small"
            link
          >
            Details
          </el-button>

          <!--          <el-button-->
          <!--            @click="handleRemove(scope.row._id)"-->
          <!--            type="danger"-->
          <!--            size="small"-->
          <!--            link-->
          <!--          >-->
          <!--            Remove-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
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

<style scoped></style>
