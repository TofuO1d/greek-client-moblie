export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem('greek-store-token'),
      refreshToken: localStorage.getItem('geek-client-mobile-refreshToken')
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('greek-store-token', token)
    },
    setRefreshToken (state, refreshToken) {
      // 1. 修改vuex的数据
      state.refreshToken = refreshToken
      // 2. 同步修改本地
      localStorage.setItem('geek-client-mobile-refreshToken', refreshToken)
    }
  },
  actions: {},
  getters: {}
}
