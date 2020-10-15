import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

// 뷰에서 뷰라우터를 사용하겠다라는 의미
Vue.use(VueRouter);
const routes = [
    //config(설정)
    {
        path: '/', // 최상위 페이지
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/todos',
        component: TodoApp
    }
]

export default new VueRouter({
    // mode: 'history',
    routes // routes: routes
})