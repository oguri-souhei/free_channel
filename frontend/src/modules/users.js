import axios from 'axios'

// ログイン中のユーザーを取得
async function getCurrentUser() {
  const response = await axios.get('/api/v1/login_user').catch(err => err.response)

  return new Promise((resolve, reject) => {
    if (response.status === 200) {
      resolve(response.data.data)
    }

    else {
      reject(response)
    }
  })
}

// idからユーザーを取得
async function getUser (id) {
  const response = await axios.get('/api/v1/users/' + id).catch(err => err.response)

  return new Promise((resolve, reject) => {
    if (response.status === 200) {
      resolve(response)
    }

    else {
      reject(response)
    }
  })
}

export { getCurrentUser, getUser }
