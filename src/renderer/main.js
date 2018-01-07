import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

import App from './App'
const Store = require('electron-store')
const store = new Store({name: 'data'})
console.log(store)
console.log('appCode' + store.get('appCode'))

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
