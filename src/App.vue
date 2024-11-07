<script setup lang="ts">
import { type RouteLocationRaw, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const router = useRouter()
const { role, loggedIn } = storeToRefs(userStore)

const activeIndex = ref('/')

setUserOnStart()

function setUserOnStart() {
  const userJSON = localStorage.getItem('user')
  if (userJSON) {
    const user = JSON.parse(userJSON)
    userStore.setUser(user)
  }
}

function handleRouteTransition(payload: RouteLocationRaw) {
  router.push(payload)
}

function handleSignOut() {
  userStore.resetUser()
  router.push({ name: 'sign-in' })
}
</script>

<template>
  <el-container>
    <el-header>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="activeIndex"
        :ellipsis="false"
        router
      >
        <el-menu-item
          class="el-menu-item--off-css"
          :route="{ name: 'home' }"
          index="0"
        >
          <img style="width: 100px" src="./assets/logo.png" alt="" />
        </el-menu-item>
        <el-menu-item
          @click="handleRouteTransition({ name: 'catalog' })"
          :route="{ name: 'catalog' }"
          index="1"
        >
          Catalog
        </el-menu-item>

        <template v-if="role === 'customer'">
          <el-menu-item
            @click="handleRouteTransition({ name: 'orders' })"
            :route="{ name: 'orders' }"
            index="2"
          >
            Orders
          </el-menu-item>
          <el-menu-item
            @click="handleRouteTransition({ name: 'cart' })"
            :route="{ name: 'cart' }"
            index="3"
          >
            Cart
          </el-menu-item>
        </template>

        <template v-if="role === 'supplier'">
          <el-menu-item
            @click="handleRouteTransition({ name: 'supplier' })"
            :route="{ name: 'supplier' }"
            index="4"
          >
            Supplier
          </el-menu-item>
          <el-menu-item
            @click="handleRouteTransition({ name: 'requests' })"
            :route="{ name: 'requests' }"
            index="5"
          >
            Requests
          </el-menu-item>
        </template>

        <el-menu-item
          @click="handleRouteTransition({ name: 'incoming-requests' })"
          :route="{ name: 'incoming-requests' }"
          index="6"
          v-if="role === 'moder'"
        >
          Incoming Requests
        </el-menu-item>

        <el-menu-item class="el-menu-item--off-css el-menu-item--off-css--end">
          <el-button
            v-if="role === 'admin'"
            @click="handleRouteTransition({ name: 'admin' })"
          >
            Admin
          </el-button>
          <template v-if="!loggedIn">
            <el-button @click="handleRouteTransition({ name: 'sign-in' })">
              Sign in
            </el-button>
            <el-button
              @click="handleRouteTransition({ name: 'sign-up' })"
              type="primary"
            >
              Register
            </el-button>
          </template>
          <el-button @click="handleSignOut" type="danger" v-else>
            Sign out
          </el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-menu-item.el-menu-item--off-css:hover,
.el-menu-item.el-menu-item--off-css:focus {
  background: none;
  cursor: default;
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  cursor: pointer;
}

.el-menu-item--off-css--end {
  margin-left: auto;
}
</style>
