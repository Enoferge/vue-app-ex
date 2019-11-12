import 'babel-polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuetify from 'vuetify'
import 'vuetify/src/stylus/app.styl'
import 'vuetify/dist/vuetify.min.css'
import ru from 'vuetify/es5/locale/ru'
import en from 'vuetify/es5/locale/en'

import axios from 'axios'
import Notifications from 'vue-notification'

import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Notifications);

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  lang: {
    locales: {ru, en},
    current: 'ru'
  },

  theme: {
        primary: '#322b52',
        secondary: '#FFD82B',
        accent: '#b71c1c',
        error: '#b71c1c',
  },
  iconfont: 'mdi'
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
