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

// 検証ルールを返す
export const rules = {
  name: [ 
    { required: true, message: '名前を入力してください', trigger: 'blur' },
    { max: 50, message: '名前は50文字以内で設定してください', trigger: 'blur'}
  ],
  email: [
    { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
    { type: 'email', required: true, message: 'メールアドレスを正しい形式で設定してください', trigger: 'blur'},
    { max: 250, message: 'メールアドレスは250文字以内で設定してください', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'パスワードを入力してください', trigger: 'blur' },
    { min: 6, message: 'パスワードは6文字以上で設定してください', trigger: 'blur' }
  ],
  password_confirmation: [
    { required: true, message: 'パスワード（確認用）を入力してください', trigger: 'blur' },
    { min: 6, message: 'パスワードは6文字以上で入力してください', trigger: 'blur' }
  ]
}
