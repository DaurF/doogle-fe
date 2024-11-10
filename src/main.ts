import '../src/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

createApp(App).use(ElementPlus).use(createPinia()).use(router).mount('#app')
