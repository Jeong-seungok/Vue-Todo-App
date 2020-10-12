module.exports = {
    root: true,
    parserOptions:{
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType: 'module'
    },
    // 환경의 약어, 사전에 정의된 전역변수를 사용할지 말지를 설정
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard',
        'plugin:vue/essential' // base, essential, recommend 규칙의 정도를 나타냄
    ],
    plugins: [
        'vue'
    ],
    rules: { // 예외 규칙 작성
        'no-new': 0
    }
}