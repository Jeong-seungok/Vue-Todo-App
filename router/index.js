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
        name: 'index',
        path: '/', // 최상위 페이지
        component: Home
    },
    {
        name: 'about',
        path: '/about',
        component: About
    },
    {
        name: 'todos',
        path: '/todos',
        redirect: '/todos/all', // /todos로 접속시 /todos/all로 다시 재접속 
        component: TodoApp,
        // 라우트 객체
        children: [
            {
                name: 'todos-filter',
                path: ':id' // 파라미터 설정
            }
        ]
    }
]

export default new VueRouter({
    // mode: 'history',
    routes // routes: routes
})