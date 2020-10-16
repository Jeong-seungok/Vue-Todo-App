import Vue from 'vue'
import App from './App'
import router from './router/index' // index는 생략가능
import store from './store/index' // index는 생략가능


new Vue({
  el: '#app',
  router: router, // router 페이지 관리
  store: store, // store 데이터 상태 관리
  render: h => h(App)
})