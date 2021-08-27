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
import { rules } from '@/modules/users'

export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      rules: rules,
      errors: []
    }
  },
  methods: {
    // ログインする
    async login() {
      this.errors = []

      const response = await this.$http.post('/api/v1/auth/login', { user: this.user }).catch(err => err.response || err)

      // ログインに成功した場合
      if (response.status === 200) {
        const user = response.data.data

        this.$store.dispatch('setFlash', { msg: 'ログインしました', type: 'success' })
        this.$store.dispatch('setCurrentUser', user)

        if (this.$route.query && this.$route.query.path) {
          // 認証が必要なページから遷移してきた場合は、そのページへ移動
          this.$router.push({ path: this.$route.query.path })
        } else {
          this.$router.push({ path: '/' })
        }
      }

        // パスワードが違う場合
      else if (response.status === 401) {
        this.errors.push(response.data.errors.message)
      }

      // 既にログインしている場合
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: '既にログインしています', type: 'warning' })
        this.$router.push('/')
      }

      // アカウントが見つからなかった場合
      else if (response.status === 404) {
        this.errors.push(response.data.errors.message)
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