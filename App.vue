<template>
    <todo-app />
</template>

<script>
import TodoApp from './components/TodoApp'
export default {
    components: {
        'todo-app': TodoApp // 속성명과 값이 같으면 생략가능 ex) 'todo-app': TodoApp -> TodoApp
    }
}
</script>
