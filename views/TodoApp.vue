<template>
    <div class="todo-app-wrap">
        <div class="todo-app__action">
            <!-- 항목 분류 -->
            <div class="filters">
                <button
                    :class="{ active: filter === 'all' }"
                    @click="changeFilter('all')">
                    모든 항목 ({{ total }})
                </button>
                <button
                    :class="{ active: filter === 'active' }"
                    @click="changeFilter('active')">
                    해야 할 항목 ({{ activeCount }})
                </button>
                <button
                    :class="{ active: filter === 'completed' }"
                    @click="changeFilter('completed')">
                    완료된 항목 ({{ completedCount }})
                </button>
            </div>

            <!-- 전체 선택 및 완료 항목 삭제 -->
            <div class="actions">
                <label>
                    <input 
                        v-model="allDone"
                        type="checkbox"/>
                    <span class="icons"><i class="material-icons">done_all</i></span>
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
                :todo="todo"
                @update-todo="updateTodo"
                @delete-mode="deleteMode"/>
        </div>
        <!--todo는 props로 자식컴포넌트에 전달, @upate,delte는 emit으로 자식컴포넌트에서 전달받음-->
        <todo-creator 
        @create-todo="createTodo"/>
        <!--@create는 emit으로 자식컴포넌트에서 전달받음-->
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _remove from 'lodash/remove'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import TodoCreator from '~/components/TodoCreator'
import TodoItem from '../components/TodoItem'

export default {
    // 자식 컴포넌트
    components: {
        TodoCreator,
        TodoItem
    },
    data () {
        return {
            db: null,
            todos: [],
            filter: 'all'
        }
    },
    computed: {
        filteredTodos () {
            switch(this.filter){
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
        total(){
            return this.todos.length;
        },
        activeCount(){
            return this.todos.filter(todo => !todo.done).length;
        },
        completedCount(){
            return this.total - this.activeCount;
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
        // DB 초기화
        initDB () {
            const adapter = new LocalStorage('todo-app'); // todo-app 이름의 로컬저장소 생성
            this.db = lowdb(adapter); // lowdb에 todo-app 연결

            const hasTodos = this.db.has('todos').value();

            // todos 데이터가 있는 경우
            if(hasTodos){
                // DB에서 todos를 가져와 복사함
                this.todos = cloneDeep(this.db.getState().todos);
            }
            // todos 데이터가 없는 경우
            else{
            this.db
            .defaults({ // 초기값 지정
                todos: [] // Collection
            })
            .write() // lowdb에서는 write 메서드를 마지막에 추가해야 실제 DB에 작성됨
            }
        },
        
        // Todo 생성
        // 매개변수 title은 TodoCreator 컴포넌트의 this.title이다
        createTodo(title){
            // 객체 리터럴 생성(양식 개념)
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title, // = title: title 속성의 이름과 변수명이 같으면 하나로 생략 가능
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }

            // DB에 생성
            this.db
            .get('todos') // lodash에서 제공하는 메서드 get,push
            .push(newTodo)
            .write()

            // 클라이언트 화면에 생성
            this.todos.push(newTodo)
        },
        updateTodo(todo, value){
            this.db
            .get('todos')
            .find({id:todo.id}) // 첫번째 인수로 올 검색할 배열은 위에 get에서 받아오기에 생략 가능
            .assign(value) // value 객체를 해당 todo에 갱신
            .write()

            const foundTodo = _find(this.todos, {id: todo.id});
            _assign(foundTodo, value);
        },
        deleteMode(todo){
            this.db
            .get('todos')
            .remove({id:todo.id})
            .write()

            const foundIndex = _findIndex(this.todos, {id: todo.id})
            this.$delete(this.todos, foundIndex)
        },
        changeFilter(filter){
            this.filter = filter;
        },
        completeAll(checked){
            // DB
            const newTodos = this.db
            .get('todos')
            .forEach(todo => {
                todo.done = checked;
            })
            .write()

            // Local
            // this.todos.forEach(todo => {
            //     todo.done = checked;
            // })

            this.todos = cloneDeep(newTodos); 
        },
        clearCompleted(){
            // list: 누적값, todo: 현재값, index: 인덱스
            /* this.todos
            .reduce((list, todo, index)=>{
                if(todo.done){
                    list.push(index)
                }
                return list
            }, [])
            .reverse()
            .forEach(index=>{
                this.deleteMode(this.todos[index]);
            }) */
            _forEachRight(this.todos, todo => {
                if(todo.done){
                    this.deleteMode(todo);
                }
            })
        },
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
    @import "../scss/style";
</style>