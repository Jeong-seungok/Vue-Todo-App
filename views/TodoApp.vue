<template>
    <div class="todo-app-wrap">
        <div class="todo-app__action">
            <!-- 항목 분류 -->
            <div class="filters">
                <router-link
                    to="all"
                    tag="button">
                    모든 항목 ({{ total }})
                </router-link>
                <router-link
                    to="active"
                    tag="button">
                    해야 할 항목 ({{ activeCount }})
                </router-link>
                <router-link
                    to="completed"
                    tag="button">
                    완료된 항목 ({{ completedCount }})
                </router-link>
            </div>

            <!-- 전체 선택 및 완료 항목 삭제 -->
            <div class="actions">
                <label>
                    <input 
                        v-model="allDone"
                        type="checkbox"/>
                    <span 
                    class="icons"
                    @click="completeAll"><i class="material-icons">done_all</i></span>
                </label>
                <div>
                    <button 
                    class="btn"
                    @click="scrollTop"><i class="material-icons">keyboard_arrow_up</i></button>
                    <button 
                    class="btn"
                    @click="scrollBottom"><i class="material-icons">keyboard_arrow_down</i></button>
                    <button
                        class="btn --danger"
                        @click="clearCompleted"><i class="material-icons">delete_sweep</i></button>
                </div>
            </div>
        </div>

        <!-- Todo 리스트 -->
        <div class="todo-app__list">
            <todo-item 
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"/>
        </div>
        <!--todo는 props로 자식컴포넌트에 전달, @upate,delte는 emit으로 자식컴포넌트에서 전달받음-->
        <todo-creator />
        <!--@create는 emit으로 자식컴포넌트에서 전달받음-->
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '../components/TodoItem'

export default {
    // 자식 컴포넌트
    components: {
        TodoCreator,
        TodoItem
    },
    computed: {
        ...mapState('todoApp', [
            'todos'
        ]),
        ...mapGetters('todoApp',[
            'total',
            'activeCount',
            'completedCount'
        ]),
        filteredTodos () {
            switch(this.$route.params.id){
                // 모든 항목
                case 'all':
                default:
                    return this.todos
                // 해야할 항목
                case 'active':
                    return this.todos.filter(todo => !todo.done);
                // 완료된 항목
                case 'completed':
                    return this.todos.filter(todo => todo.done);
            }
        },
        allDone: {
            get(){
                return this.total === this.completedCount && this.total > 0;
            },
            set(checked){
                this.completeAll(checked)
            }
        }
    },
    // TodoApp.vue가 생성되고 나서 직후, 라이프사이클 훅
    created () {
        this.initDB();
    },
    methods: {
        ...mapMutations('todoApp',[
            'updateTodo'
        ]),  
        ...mapActions('todoApp',[
            'initDB',
            'completeAll',
            'clearCompleted'
        ]),
        scrollTop(){
            let todoWrap = document.querySelector('.todo-app-wrap');
            todoWrap.scrollTo({top:0,left:0,behavior:'smooth'})
        },
        scrollBottom(){
            let todoWrap = document.querySelector('.todo-app-wrap');
            todoWrap.scrollTo({top:todoWrap.scrollHeight, left:0, behavior:'smooth'})
        }
    }
}
</script>

<style lang="scss">
    @import "scss/style";
    .router-link-exact-active.router-link-active{
        font-weight: bold;
        background: royalblue;
        color: #fff;
    }
</style>