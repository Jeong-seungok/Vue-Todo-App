<template>
    <div class="todo-items">
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
            @keypress.esc="offeditMode">
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
                @click="deleteMode">삭제</button>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs' // 날짜 수정을 위한 라이브러리

export default {
    // props에 대한 요구사항 지정(검증)
    props: {
        todo: Object // TodoApp 부모컴포넌트에서 받은 todo를 담은 속성 todo
    },
    data (){
        return {
            iseditMode: false, // 수정모드 기본 값은 false
            editedTitle: '' // 수정모드 title 기본 값은 ''
        }
    },
    // 가공된 데이터
    computed: {
        // todo는 DB의 데이터를 복사한 것이기 때문에 수정을 해도 반영이 안됨을 해결하기 위한 done 옵션
        done: {
            // done이 실행되기 위한 특정 데이터 상태를 가져옴
            get(){ 
                return this.todo.done;
            },
            // done이 변경되었을때 어떻게 처리할지 결정
            // 변경된 값을 매개변수로 받을 수 있음
            set(done){
                console.log(done);
                this.updateTodo({done})
            }
        },
        date(){
            const data = dayjs(this.todo.createdAt);
            const isSame = data.isSame(this.todo.updatedAt);

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
            // 수정내용과 기존 내용이 다를 경우에만 업데이트
            if(this.todo.title !== this.editedTitle){
                this.updateTodo({
                    title: this.editedTitle,
                    updatedAt: new Date()
                });
                this.offeditMode()
            }
        },
        // 수정할때
        editMode(){
            this.iseditMode = true; // 수정모드 활성화
            this.editedTitle = this.todo.title; // input 값 = 해당 todo의 title 값

        // 수정모드 활성시 input에 포커싱
            this.$nextTick(()=>{ // nextTick은 뷰에서 제공하는 메서드(DOM이 업데이트 되고나서 실행)
                this.$refs.editModeTitle.focus(); 
            })
        },
        // 수정종료했을때
        offeditMode(){
            this.iseditMode = false;
        },
        deleteMode(){
            this.$emit('delete-mode', this.todo); // delete-mode 이벤트 이름과 해당 todo를 전달
        },
        updateTodo(value){
            this.$emit('update-todo', this.todo, value); // update-todo 이벤트 이름, 해당 todo, {done}
        }
    }
}
</script>