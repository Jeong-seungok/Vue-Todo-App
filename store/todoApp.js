import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import _find from 'lodash/find'
import _assign from 'lodash/assign'

export default {
  // 독립적으로 관리
  namespaced: true,
  // data (객체데이터 반환)
  state: () => ({
    db: null,
    todos: [],
    filter: 'all'
  }),
  // computed
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        // 모든 항목
        case 'all':
        default:
          return state.todos
          // 해야할 항목
        case 'active':
          return state.todos.filter(todo => !todo.done)
          // 완료된 항목
        case 'completed':
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  // 동기, 데이터 변경 O, 값을 반환할 수 없음
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    createDB (state, newTodo) {
      state.db
        .get('todos') // lodash에서 제공하는 메서드 get,push
        .push(newTodo)
        .write()
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id }) // 첫번째 인수로 올 검색할 배열은 위에 get에서 받아오기에 생략 가능
        .assign(value) // value 객체를 해당 todo에 갱신
        .write()
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  // 비동기, 데이터 변경 X
  actions: {
    // DB 초기화
    initDB ({ state, commit }) { // const { state, commit } = context;
      const adapter = new LocalStorage('todo-app') // todo-app 이름의 로컬저장소 생성

      commit('assignDB', lowdb(adapter)) // lowdb에 todo-app 연결

      const hasTodos = state.db.has('todos').value()

      // todos 데이터가 있는 경우
      if (hasTodos) {
        // DB에서 todos를 가져와 복사함
        commit('assignTodos', cloneDeep(state.db.getState().todos))
      } else { // todos 데이터가 없는 경우
        state.db
          .defaults({ // 초기값 지정
            todos: [] // Collection
          })
          .write() // lowdb에서는 write 메서드를 마지막에 추가해야 실제 DB에 작성됨
      }
    },
    // Todo 생성
    // 매개변수 title은 TodoCreator 컴포넌트의 this.title이다
    createTodo ({ state, commit }, title) {
      // 객체 리터럴 생성(양식 개념)
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title, // = title: title 속성의 이름과 변수명이 같으면 하나로 생략 가능
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }
      // DB에 생성
      commit('createDB', newTodo)

      // 클라이언트 화면에 생성
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, payload) {
      const { todo, value } = payload
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    deleteMode ({ state, commit }, todo) {
      commit('deleteDB', todo)

      const foundIndex = _findIndex(state.todos, { id: todo.id })
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // DB
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // todo.done = checked;
          commit('updateTodo', {
            todo: todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      commit('assignTodos', cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
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
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // state.deleteMode(todo);
          dispatch('deleteMode', todo)
        }
      })
    }
  }
}
