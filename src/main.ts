import '../src/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { StripePlugin } from '@vue-stripe/vue-stripe'

import App from './App.vue'
import router from './router'

// const options = {
//   pk: import.meta.env.VITE_STRIPE_PK,
//   stripeAccount:
// }

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app')
