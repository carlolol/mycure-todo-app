import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'

Vue.use(Router)

const DEFAULT_TITLE = 'MyCure Todo App';

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        title: 'MyCure Todo App'
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
      meta: {
        title: 'Sign Up'
      }
    }
  ],
});

router.afterEach((to, from) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;