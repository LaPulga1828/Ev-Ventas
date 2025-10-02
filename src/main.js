// FILE: main.js

import { createApp } from 'vue'
import { Quasar, Notify, Loading, date } from 'quasar'
import {router} from "./routes/routes.js"
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
const pinia=createPinia()
const myApp = createApp(App)
pinia.use(piniaPluginPersistedstate)

myApp.use(Quasar, {
  plugins: {
    Notify, Loading, date
  }, // import Quasar plugins and add here
})

myApp.use(router)
myApp.use(pinia)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')