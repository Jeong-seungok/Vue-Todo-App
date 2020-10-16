import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex);

export default new Vuex.Store({
    // 제품용: false, 개발용: true (성능 이슈 때문에)
    strict: process.env.NODE_ENV !== 'production',
    // data
    state:{

    },
    // computed
    getters:{

    },
    // methods
    // 실제 값을 변경할때(비동기 X)
    mutations:{

    },
    // methods
    // 일반 로직(비동기 O)
    // 데이터 변경 X
    actions:{

    },
    // 독립적으로 사용할 모듈
    modules:{
        todoApp
    }
})