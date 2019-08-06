// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import utils         from './utils'
import '../config/axios'
Vue.prototype.$axios = axios

Vue.prototype.$baseUrl=utils.getUrlKey();//打包放出
//Vue.prototype.$baseUrl="http://192.168.2.45:8081/";//打包屏蔽
Vue.prototype.$uploadUrl = "http://file.heidouinfo.com/";


import {
  Container,
  Header,
  Aside,
  Main,
  Upload,
  Dialog,
  Pagination,
  DatePicker,
  MessageBox,
  Select,
  Option,
  Loading,
  Radio,
  InputNumber,
  Tabs,
  Tree,
  TimePicker,
  TimeSelect,
} from "element-ui";

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Upload);
Vue.use(Pagination);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Dialog);
Vue.use(Loading);
Vue.use(Radio);
Vue.use(InputNumber);
Vue.use(Tabs);
Vue.use(Tree);
Vue.use(TimePicker);
Vue.use(TimeSelect);

MessageBox.install = function (Vue, options) {
  Vue.prototype.$MessageBox = MessageBox
}
Vue.use(MessageBox )
import '../src/assets/styles/common.scss'

Vue.config.productionTip = false


router.beforeEach((to, from, next) => { 
  next(); 
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { 
    App
  },
  template: '<App/>'
})
