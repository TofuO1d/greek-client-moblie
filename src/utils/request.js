import axios from 'axios'
import router from '@/router'
import store from '@/store'
import to from 'await-to-js'
import { refreshTokenAPI } from '@/api/user'
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
// 4. token失效处理
request.interceptors.response.use(
  res => res,
  async err => {
    // 1. 判断状态码401
    // 2. 删除token
    // 3. 跳转登录，当前路由的完整地址需要传递给登录页面。因为：将来登录完事需要回跳
    if (err.response && err.response.status === 401) {
      // ★1. 使用refresh_token更新token不能使用instance，请求拦截器中会覆盖请求头
      const [err2, res] = await to(
        refreshTokenAPI(store.state.user.refreshToken)
      )
      // ★2. 刷新token失败
      if (err2) {
        store.commit('user/setToken', '')
        // 组件：this.$route.path 路径  fullPath 完整路径，带参数的
        // 通过 router实例 获取当前路由信息对象 currentRoute
        // 回跳地址：/order?id=100&name=tom  ===> 跳转登录地址  /login?returnUrl=/order?id=100&name=tom
        // 地址可能回出现特殊字符 & 需要转换成url编码 encodeURIComponent
        // 转义后 /login?returnUrl=%2Forder%3Fid%3D100%26name%3Dtom
        router.push(
          '/login?returnUrl=' + encodeURIComponent(router.currentRoute.fullPath)
        )
      } else {
        // ★3. 刷新token成功
        store.commit('user/setToken', res.data.data.token)
        // ★4. 继续发送失败的请求，需要成功
        // err.config 是之前失败的请求配置
        return request(err.config)
      }
    }
    return Promise.reject(err)
  }
)
// // 响应拦截器
// request.interceptors.response.use(
//   res => res,
//   err => {
//     // if (err.response && err.response.status === 401) {
//     //   // token失效
//     //   store.commit('user/setToken', '')
//     //   router.push(
//     //     '/login?returnUrl=' + encodeURIComponent(router.currentRoute.fullPath)
//     //   )
//     // }
//     // return Promise.reject(err)
//   }
// )
// 导出一个新axios实例调用接口的函数，返回值promise
export default ({ url, method = 'get', params, data, headers }) => {
  const promise = request({ url, method, params, data, headers })
  return to(promise)
}
