import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// Import Tailwind CSS styles
import './assets/main.css'

// Import Element Plus plugin and styles
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Import Element Plus Icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus)

// Register all Element Plus Icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')