import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import Reports from '@/components/Reports'
import Agents from '@/components/Agents'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/',
      name: 'Reports',
      component: Reports
    },
    {
      path: '/',
      name: 'Agents',
      component: Agents
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
