import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  // アカウント登録ページ
  {
    path: '/sign_up',
    name: 'SignUp',
    component: () => import('../views/auth/SignUp.vue')
  },
  // ログインページ
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  // ユーザー編集ページ
  {
    path: '/users/edit',
    name: 'EditUser',
    component: () => import('../views/users/EditUser.vue')
  },
  // ユーザー個別ページ
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('../views/users/User.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
