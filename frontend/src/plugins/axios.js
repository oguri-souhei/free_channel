export default {
  install(Vue, { axios }) {
    // APIサーバーのURL
    axios.defaults.baseURL = process.env.VUE_APP_API_URL

    // デフォルトのヘッダ
    axios.defaults.headers.common = {
      "X-Requested-With": "XMLHttpRequest"
    }

    axios.defaults.withCredentials = true

    Vue.prototype.$http = axios
  }
}