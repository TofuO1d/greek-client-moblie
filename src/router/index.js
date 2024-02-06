import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

// 路由懒加载方式
const Tabbar = () => import('@/components/tabbar')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const Artcile = () => import('@/views/article')
const Login = () => import('@/views/login')
const UserProfile = () => import('@/views/user/profile')
const routes = [
  // 路由规则
  { path: '/', components: { default: Home, tabbar: Tabbar } },
  { path: '/question', components: { default: Question, tabbar: Tabbar } },
  { path: '/video', components: { default: Video, tabbar: Tabbar } },
  { path: '/user', components: { default: User, tabbar: Tabbar } },
  { path: '/article', component: Artcile },
  { path: '/login', component: Login },
  { path: '/user/profile', component: UserProfile }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (!token && to.path.startsWith('/user')) {
    return next('/login?returnUrl=' + encodeURIComponent(to.fullPath))
  }
  // 其他情况放行
  next()
})
export default router
