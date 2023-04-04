import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import registerComponent from './components'
import './styles/main.scss'
import directives from './libs/directives'
import VueMeta from 'vue-meta'
import VueScreenSize from 'vue-screen-size'
import vuetwemoji from 'vue-twemoji'
import vuetify from './libs/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(vuetwemoji, [{
  baseUrl: 'https://twemoji.maxcdn.com/', //can set to local folder of emojis. default: https://twemoji.maxcdn.com/
  extension: '.png', //.svg, .png
  className: 'emoji', //custom className for image output
  size: '36x36' //image size
}])
Vue.use(VueScreenSize)
Vue.use(VueMeta)

registerComponent(Vue)
directives.install(Vue)
Vue.config.productionTip = false

let v = new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

window.$vue = v
