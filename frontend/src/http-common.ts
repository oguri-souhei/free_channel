import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  // APIのURI(環境変数)
  baseURL: process.env.VUE_APP_API_HOST,
  // リクエストヘッダ
  headers: {
    "Content-type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // Cookieを使用する
  withCredentials: true,
});

export default apiClient;