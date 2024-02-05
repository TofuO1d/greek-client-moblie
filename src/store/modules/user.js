export default {
  namespaced: true,
  state () {
    return {
      token: localStorage.getItem('greek-store-token')
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('greek-store-token', token)
    }
  },
  actions: {},
  getters: {}
}
