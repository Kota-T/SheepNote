import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import Popup from './components/util/Popup.vue'
import Tab from './components/util/Tab.vue'

import { registerSW } from 'virtual:pwa-register'
registerSW()

createApp(App)
.use(router)
.component('Popup', Popup)
.component('Tab', Tab)
.directive('textarea-resize', el => {
  if(el instanceof HTMLTextAreaElement)
    el.rows = (el.value?.split('').filter(c => c === '\n').length || 1) + 1
})
.mount('#app')
