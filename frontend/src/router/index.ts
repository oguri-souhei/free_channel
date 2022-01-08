import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import { APP_NAME } from '../const'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: APP_NAME,
      requiresAuth: null
    }
  },
  // アカウント登録ページ
  {
    path: '/sign_up',
    name: 'SignUp',
    component: () => import('../views/auth/SignUp.vue'),
    meta: {
      title: 'アカウント登録 | ' + APP_NAME,
      requiresAuth: false
    }
  },
  // ログインページ
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: {
      title: 'ログイン | ' + APP_NAME,
      requiresAuth: false
    }
  },
  // ユーザー編集ページ
  {
    path: '/users/edit',
    name: 'EditUser',
    component: () => import('../views/users/EditUser.vue'),
    meta: {
      title: 'アカウント編集 | ' + APP_NAME,
      requiresAuth: true
    }
  },
  // ユーザー個別ページ
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('../views/users/User.vue'),
    meta: {
      title: 'アカウント | ' + APP_NAME,
      requiresAuth: null
    }
  },
  // 部屋の一覧ページ
  {
    path: '/rooms',
    name: 'IndexRooms',
    component: () => import('../views/rooms/IndexRoom.vue'),
    meta: {
      title: '部屋一覧 | ' + APP_NAME,
      requiresAuth: null
    }
  },
  // 部屋作成ページ
  {
    path: '/rooms/new',
    name: 'NewRoom',
    component: () => import('../views/rooms/NewRoom.vue'),
    meta: {
      title: '部屋作成 | ' + APP_NAME,
      requiresAuth: true
    }
  },
  // 部屋の編集ページ
  {
    path: '/rooms/:id/edit',
    name: 'EditRoom',
    component: () => import('../views/rooms/EditRoom.vue'),
    meta: {
      title: '部屋編集 | ' + APP_NAME,
      requiresAuth: true
    }
  },
  // 部屋個別ページ
  {
    path: '/rooms/:id',
    name: 'ShowRoom',
    component: () => import('../views/rooms/ShowRoom.vue'),
    meta: {
      title: '部屋 | ' + APP_NAME,
      requiresAuth: null
    }
  },
  // ページが見つからない場合はトップページを表示
  {
    path: '*',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: APP_NAME,
      requiresAuth: null
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  // 遷移先のルートがundefinedの場合はreturn
  if (!to || !to.meta) return

  document.title = to.meta.title
  // 認証が必要なページで、ログインしていない場合
  if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
    store.dispatch('setFlash', { msg: 'このページにアクセスするにはログインする必要があります', type: 'warning' })
    next({ path: '/login', query: { path: to.fullPath }})
  // 認証済みではアクセスできないページで、ログイン済みの場合
  } else if (to.meta.requiresAuth === false && store.getters.isLoggedIn) {
    store.dispatch('setFlash', { msg: 'このページにはアクセスできません', type: 'warning' })
    next('/')
  // ログインしていても、してなくても大丈夫なページの場合
  } else {
    next()
  }
})

export default router
