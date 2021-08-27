import axios from 'axios'

// ログイン中のユーザーを取得
export async function getCurrentUser() {
  const result = await axios.get('/api/v1/login_user').catch(err => err.response)

  return new Promise((resolve, reject) => {
    if (result.status === 200) {
      resolve(result.data.data)
    }

    else {
      console.error(result)
      reject(result)
    }
  })
}
