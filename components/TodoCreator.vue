<template>
    <div class="create-wrap">
        <button
        class="create icons"
        @click="createTodo"><i class="material-icons">add</i></button>
        <input type="text"
        :placeholder="placeholdermsg"
        :value="title"
        @input="title = $event.target.value"
        @keypress.enter="createTodo">
        <!--입력한 값이 title로 반환-->
        <!--Enter 입력시 또는 버튼 입력시 createTodo 메서드 실행-->
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholdermsg: '할 일을 작성해보세요!'
    }
  },
  methods: {
    createTodo () {
      // Todo 생성
      const checkTitle = this.title && this.title === this.title.trim() // 빈 문자가 아니고 앞뒤 공백이 없는 경우 참
      if (!checkTitle) {
        alert('빈 문자 또는 공백이 있으면 안됩니다!')
        this.title = this.title.trim() // 공백을 제거한 title을 this.title에 반환
        return
      }
      // this.$emit('create-todo', this.title) create-todo는 event 이름, 자식은 부모의 메서드를 가져올 수 없기 때문에 emit 이용(올려주는 개념)
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      this.$nextTick(() => {
        let todoWrap = document.querySelector('.todo-app-wrap')
        todoWrap.scrollTo(0, todoWrap.scrollHeight)
      })
    }
  }
}
</script>
