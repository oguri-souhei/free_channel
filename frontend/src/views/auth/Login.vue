<template>
  <div id="login">
    <h2>ログイン</h2>
    <el-form label-position="top" label-width="100px" :model="user" :rules="rules">
      <!-- errors -->
      <div id="errors" v-if="errors.length !== 0">
        <ul v-for="e in errors" :key="e">
          <li>
            <el-alert :title="e" type="error" center show-icon></el-alert>
          </li>
        </ul>
      </div>
      <el-form-item label="メールアドレス" prop="email">
        <el-input id="email" v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="パスワード" prop="password">
        <el-input id="password" v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-button type="primary" id="submit" @click="login">ログイン</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
          { type: 'email', required: true, message: 'メールアドレスを正しい形式で設定してください', trigger: 'blur'},
          { max: 250, message: 'メールアドレスは250文字以内で設定してください', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'パスワードを入力してください', trigger: 'blur' },
          { min: 6, message: 'パスワードは6文字以上で設定してください', trigger: 'blur' }
        ],
      },
      errors: []
    }
  },
  methods: {
    // ログインする
    async login() {
      this.errors = []

      const result = await this.$http.post('/api/v1/auth/login', { user: this.user }).catch(err => err.response || err)

      // アカウントが見つからなかった場合
      if (result.status === 404) {
        this.errors.push(result.data.errors.message)
      }

      // パスワードが違う場合
      else if (result.status === 401) {
        this.errors.push(result.data.errors.message)
      }

      // 既にログインしている場合
      else if (result.status === 403) {
        this.$store.dispatch('setFlash', { msg: '既にログインしています', type: 'warning' })
        this.$router.push('/')
      }

      // ログインに成功した場合
      else if (result.status === 200) {
        const user = result.data.data

        this.$store.dispatch('setFlash', { msg: 'ログインしました', type: 'success' })
        this.$store.dispatch('setCurrentUser', user)

        if (this.$route.query && this.$route.query.path) {
          // 認証が必要なページから遷移してきた場合は、そのページへ移動
          this.$router.push({ path: this.$route.query.path })
        } else {
          this.$router.push({ path: '/' })
        }
      }

      // その他のエラー
      else {
        this.errors.push('未知のエラー')
      }
    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
}

li {
  list-style: none;
}

#sign_up {
  padding-top: 30px;
}

.el-form {
  width: 450px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>