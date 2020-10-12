<template>
    <div>
        <todo-item />
        <todo-creator />
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
    components: {
        TodoCreator,
        TodoItem
    },
    data () {
        return {
            db: null
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

            // defaults 메서드로 지정하고 싶은 데이터를 설정
            this.db.defaults({
                todos: [] // Collection이라 지칭
            }).write() // lowdb에서는 write 메서드를 마지막에 추가해야 실제 DB에 작성된다
        }
    }
}
</script>