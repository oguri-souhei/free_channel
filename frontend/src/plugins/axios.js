export default {
  install(Vue, { axios }) {
    const apiHost = process.env.VUE_APP_API_HOST
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
