import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'

Vue.use(Antd);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false;
Vue.http = Vue.prototype.$http = {
  get: ({url, data}) => {
    return new Promise((resolve, reject) => {
      axios.get(url)
          .then(res => {

            resolve(res.data)
          })
          .catch(e => reject(e))
    });


  }

};




/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
