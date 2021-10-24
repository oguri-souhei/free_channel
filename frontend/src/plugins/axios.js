export default {
  install(Vue, { axios }) {
    const apiHost = process.env.NODE_ENV === 'production' ? 'https://api.freechannel.link' : 'http://localhost:3000'
    axios.defaults.baseURL = apiHost

    // デフォルトのヘッダ
    axios.defaults.headers.common = {
      "X-Requested-With": "XMLHttpRequest"
    }

    axios.defaults.withCredentials = true

    // this.$httpでaxiosを使用できる
    Vue.prototype.$http = axios
  }
}
