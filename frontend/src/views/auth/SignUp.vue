<template>
  <div id="sign_up">
    <h2>アカウント登録</h2>
    <el-form label-position="top" label-width="100px" :model="user" :rules="rules">
      <!-- errors -->
      <div id="errors" v-if="errors.length !== 0">
        <ul v-for="e in errors" :key="e">
          <li>
            <el-alert :title="e" type="error" center show-icon></el-alert>
          </li>
        </ul>
      </div>
      <el-form-item label="名前" prop="name">
        <el-input id="name" v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="メールアドレス" prop="email">
        <el-input id="email" v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="パスワード" prop="password">
        <el-input id="password" v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="パスワード（確認用）" prop="password_confirmation">
        <el-input id="password_confirmation" v-model="user.password_confirmation" show-password></el-input>
      </el-form-item>
      <el-button type="primary" id="submit" @click="createUser">登録</el-button>
    </el-form>
  </div>
</template>

<script>
import { rules } from '@/modules/users'

export default {
  name: 'SignUp',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      errors: [],
      rules: rules
    }
  },
  methods: {
    async createUser() {
      this.errors = [] // エラーメッセージを空に

      const response = await this.$http.post('/api/v1/auth/sign_up', { user: this.user }).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        const user = response.data.data

        this.$store.dispatch('setCurrentUser', user)
        this.$store.dispatch('setFlash', { msg: 'アカウントを登録しました', type: 'success' })

        this.$router.push('/')
      }

      // パラメータが不正
      else if (response.status === 400) {
        this.errors = response.data.errors
      }

      // 既にログインしている
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: '既にログインしています', type: 'error' })

        this.$router.push('/')
      }

      // その他
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
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