// node.js에서 돌아가는 파일
const path = require('path') // node.js에서 제공하는 path 모듈을 가져옴
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { default: merge } = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => { // opts로 개발용인지 제품용인지 구분
  const config = {
    // 개발용, 제품용 모두 중복되는 옵션
    resolve: {
      extensions: ['.vue', '.js'], // 생략할 확장자명들
      alias: {
        '~': path.join(__dirname), // 경로 별칭 지정 
        'scss': path.join(__dirname, 'scss')
      }
    },
    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js') // 루트 파일 경로의 main.js
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // 결과물의 이름, 진입점의 app이 name으로 들어감 => app.js가 됨
      path: path.join(__dirname, 'dist') // 확장자 명이 아니므로 dist라는 디렉토리 생성
    },
    // 모듈처리방식 명시
    module: {
      rules: [
        {
          test: /\.vue$/, // test를 통해 vue라는 확장자를 찾음
          use: 'vue-loader' // vue-loader로 호출함
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // node_modules 디렉토리는 babel-loader로 해석하지 않음
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] // postcss가 sass보다 먼저 로드되야함
        }
      ]
    },
    // 모듈이 처리되고 나서 추가적으로 어떤 작업이 진행되는지 명시
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/',
            to: 'favicon/'
          }
        ]
      })
    ]
  }
  // 개발용
  if (opts.mode === 'development') {
    // 중복 옵션과 추가 개발용 옵션을 병합
    return merge(config, {
      devtool: 'eval', // eval: 용량이 커지고 최적화 X / 디버깅 가능하고 빌드 시간이 짧음
      devServer: {
        // npm run dev시 브라우저 바로 열림
        open: false,
        // 수정 사항이 바로 브라우저에 반영(기본값)
        hot: true
      }
    })
  } else { // 제품용
    // 중복 옵션과 추가 제품용 옵션을 병합
    return merge(config, {
      devtool: 'cheap-module-resource', // cheap-module-resource: 용량이 작고 최적화 O / 디버깅을 못하고 빌드 시간이 길음
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
