<template>
    <div 
        :class="done"
        class="todo-items">
        <!-- 수정모드 활성화 -->
        <div 
            class="item__inner item--edit"
            v-if="iseditMode">
            <input 
                type="text"
                :value="editedTitle"
                ref="editModeTitle"
                @input="editedTitle = $event.target.value"
                @keypress.enter="completededit"
                @keydown.esc="offeditMode">
            <div class="item__actions">
                <!-- key값으로 다른 엘리먼트 포커싱 방지 -->
                <button 
                    key="complete"
                    @click="completededit">완료</button>
                <button 
                    key="cancel"
                    @click="offeditMode">취소</button>
            </div>
        </div>
        <!-- 기본 형태 -->
        <div 
            class="item__inner item--normal"
            v-else>
            <input 
                v-model="done" 
                type="checkbox" />
            <!-- 제목 날짜 -->
            <div class="item__title-wrap">
                <div class="item__title">
                    {{ todo.title }}
                </div>
                <div class="item__date">
                    {{ date }}
                </div>
            </div>
            <!-- 수정, 삭제 -->
            <div class="item__actions">
                <!-- key값으로 다른 엘리먼트 포커싱 방지 -->
                <button 
                    key="update"
                    @click="editMode">수정</button>
                <button 
                    key="delete"
                    @click="deleteTodo">삭제</button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs' // 날짜 수정을 위한 라이브러리

export default {
    // 부모컴포넌트에서 받은 props
    props: {
        todo: Object // props에 대한 요구사항 지정(검증)
    },
    data (){
        return {
            iseditMode: false, // 기본적으로 수정모드는 꺼짐
            editedTitle: '' // 수정시 열릴 input 초기값은 ''
        }
    },
    // 가공된 데이터
    computed: {
        done: {
            // v-model 양방향 바인딩, get/set 설정
            get(){ 
                return this.todo.done; // done(boolean)값을 받아옴
            },
            set(done){
                this.updateTodo({done}) // updateTodo 메소드로 done을 객체값으로 전달
            }
        },
        date(){
            const data = dayjs(this.todo.createdAt); // Date() 내장 객체 인스턴스를 dayjs 라이브러리의 객체 데이터로 저장
            const isSame = data.isSame(this.todo.updatedAt); // 생성 시간과 수정 시간이 동일한지 체크
            if(isSame){
                return data.format('YYYY년 MM월 DD일');
            }
            else{
                return `${data.format('YYYY년 MM월 DD일')} (edited)`
            }
        }
    },
    methods:{
        completededit(){
            // 기존 내용이랑 수정내용이 updateTodo에 수정값 전달
            // 전달 후에 수정모드 종료
            if(this.todo.title !== this.editedTitle){
                this.updateTodo({
                    title: this.editedTitle,
                    updatedAt: new Date()
                });
                this.offeditMode()
            }
        },
        // 수정모드
        editMode(){
            console.log(this.todo);
            this.iseditMode = true; // 수정모드 활성화
            this.editedTitle = this.todo.title; // 수정모드 input 값은 해당 todo의 title 값

        // 수정모드 활성시 input에 포커싱
            this.$nextTick(()=>{ // nextTick은 뷰에서 제공하는 메서드(DOM이 업데이트 되고나서 실행)
                this.$refs.editModeTitle.focus(); // DOM 업데이트 전에 실행되는걸 방지
            })
        },
        // 수정모드 종료
        offeditMode(){
            this.iseditMode = false;
        },
        deleteTodo(){
            this.$emit('delete-mode', this.todo); // delete-mode 이벤트 이름과 해당 todo를 전달
        },
        updateTodo(value){
            this.$emit('update-todo', this.todo, value); // update-todo 이벤트 이름, 해당 todo, 변경된 객체 전달
        }
    }
}
</script>

<style scoped lang="scss">
    .todo-items{
        margin-bottom: 10px;
        .item__inner{
            display: flex;
            align-items: center;
            padding: 12px 14px;
            min-height: 44px;
            input[type="checkbox"]{
                margin-right: 15px;
            }
            input[type="text"]{
                flex-grow: 1;
                font-size: 20px;
                border: none;
                margin: 0 25px;
            }
        }
        .item__title-wrap{
            flex-grow: 1;
        }
        .item__date{
            font-size: 12px;
        }
        &.done{
            .item__title{
                text-decoration: line-through;
            }
        }
    }
</style>