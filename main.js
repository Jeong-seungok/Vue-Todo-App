import Vue from 'vue'
import App from './App'
import router from './router/index' // index는 생략가능


new Vue({
  el: '#app',
  router: router, // router
  render: h => h(App)
})