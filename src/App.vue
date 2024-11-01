<script setup lang="ts">
import { type RouteLocationRaw, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const activeIndex = ref('/')

function handleRouteTransition(payload: RouteLocationRaw) {
  router.push(payload)
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
        <el-menu-item index="1">Catalog</el-menu-item>
        <el-menu-item class="el-menu-item--off-css">
          <el-button @click="handleRouteTransition({ name: 'admin' })"
            >Admin
          </el-button>
          <el-button>Sign in</el-button>
          <el-button type="primary">Register</el-button>
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

.el-menu--horizontal > .el-menu-item:nth-child(2) {
  margin: auto;
}
</style>
