<template>
    <section class="home">
        <div>
            <h1>My HomePage!!</h1>
            <!-- $router로 페이지 이동 가능한 메소드 사용 -->
            <router-link to="about" tag="h2">About</router-link>
            <router-link to="todos" tag="h2">Todo App</router-link>
        </div>
    </section>
</template>
