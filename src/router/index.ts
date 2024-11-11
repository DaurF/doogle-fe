import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import SupplierPage from '@/pages/SupplierPage.vue'
import RequestsPage from '@/pages/RequestsPage.vue'
import IncomingRequests from '@/pages/IncomingRequests.vue'
import CartPage from '@/pages/CartPage.vue'
import DesiredPage from '@/pages/DesiredPage.vue'
import IncomingOrders from '@/pages/IncomingOrders.vue'

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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: SupplierPage,
      meta: {
        requiresAuth: true,
        roles: ['supplier'],
      },
    },
    {
      path: '/requests',
      name: 'requests',
      component: RequestsPage,
      meta: {
        requiresAuth: true,
        roles: ['supplier'],
      },
    },
    {
      path: '/incoming-requests',
      name: 'incoming-requests',
      component: IncomingRequests,
      meta: {
        requiresAuth: true,
        roles: ['moder', 'admin'],
      },
    },
    {
      path: '/desired',
      name: 'desired',
      component: DesiredPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/incoming-orders',
      name: 'incoming-orders',
      component: IncomingOrders,
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
      meta: {
        requiresAuth: true,
        roles: ['admin'],
      },
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

router.beforeEach(to => {
  if (to.meta.requiresAuth) {
    const userJSON = localStorage.getItem('user')
    const user = JSON.parse(userJSON)

    if (!user) return { name: 'home' }

    if (to.meta.roles && !to.meta.roles.includes(user.role))
      return { name: 'home' }
  }

  return true
})

export default router
