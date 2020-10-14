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
<style lang="scss">
    body{
        background: #282934;
        font-size: 20px;
        button{
            border: none;
            background: #fff;
            color: lightgray;
            font-size: 20px;
        }
    }
</style>