import Vue from 'vue'
import App from './views/app'
import './styles/index.css'
import './styles/index.less'

new Vue({
  render: h => h(App)
}).$mount('#app')