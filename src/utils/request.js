import axios from 'axios'
import router from '@/router'
import store from '@/store'
import to from 'await-to-js'
// 配置基地址
const request = axios.create({
  baseURL: 'https://geek.itheima.net/',
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = store.state.user.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  err => Promise.reject(err)
)
// 响应拦截器
request.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // token失效
      store.commit('user/setToken', '')
      router.push(
        '/login?returnUrl=' + encodeURIComponent(router.currentRoute.fullPath)
      )
    }
    return Promise.reject(err)
  }
)
// 导出一个新axios实例调用接口的函数，返回值promise
export default ({ url, method = 'get', params, data, headers }) => {
  const promise = request({ url, method, params, data, headers })
  return to(promise)
}
