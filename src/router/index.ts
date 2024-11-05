import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: CatalogPage,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage,
    },
    {
      path: '/product/:id',
      name: 'product',
      props: true,
      component: ProductPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: RegisterPage,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: LoginPage,
    },
  ],
})

export default router
