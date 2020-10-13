<template>
    <div>
        <todo-item 
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-mode="deleteMode"/>
        <!--todo 속성에 todo 값을 props로 전달해주고 TodoItem은 props를 받아서 내부에서 처리함-->
        <todo-creator @create-todo="createTodo"/>
        <!--자식 컴포넌트 TodoCreator에서 전달받은 create-todo 이벤트 연결하여 createTodo 메서드 실행-->
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
    components: {
        TodoCreator,
        TodoItem
    },
    data () {
        return {
            db: null,
            todos: []
        }
    },
    // TodoApp.vue가 생성되고 나서 직후, 라이프사이클 훅
    created () {
        this.initDB();
    },
    methods: {
        // DB 초기화
        initDB () {
            const adapter = new LocalStorage('todo-app'); // todo-app이라는 이름의 adapter 생성
            this.db = lowdb(adapter); // lowdb에 adapter를 연결하고 반환되는 값을 this.db에 담는다

            // db에서 todos 데이터를 가지고 있는지 확인하고 있다면 값을 가져옴
            // cloneDeep 메서드로 todos 안의 모든 참조관계까지 가져옴
            // 복사를 하는 이유는 LocalStorage DB의 데이터가 수정되는 것을 막기 위함
            const hasTodos = cloneDeep(this.db.has('todos').value());

            // todos 데이터가 있는 경우
            if(hasTodos){
                this.todos = this.db.getState().todos; // db에서 데이터를 받아와서 todos만 반환
            }
            // todos 데이터가 없는 경우
            else{
            this.db
            .defaults({ // defaults 메서드로 지정하고 싶은 데이터를 설정
                todos: [] // Collection이라 지칭
            })
            .write() // lowdb에서는 write 메서드를 마지막에 추가해야 실제 DB에 작성된다
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

            // 
            this.db
            .get('todos') // lodash에서 제공하는 메서드 get,push
            .push(newTodo)
            .write() // lowdb에서 제공하는 메서드 write(갱신) 필수
        },
        updateTodo(todo, value){
            this.db
            .get('todos')
            .find({id:todo.id}) // 첫번째 인수로 올 검색할 배열은 위에 get에서 받아오기에 생략 가능
            .assign(value) // value 객체 데이터를 갱신
            .write()

            const foundTodo = _find(this.todos, {id: todo.id});
            _assign(foundTodo, value);
        },
        deleteMode(){
            
        }
    }
}
</script>