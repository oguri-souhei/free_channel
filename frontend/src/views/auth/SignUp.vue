<template>
  <div class="sign_up">
    <h2>アカウント登録</h2>

    <v-form ref="form" lazy-validation>
      <!-- errors -->
      <div class="errors" v-if="errors.length !== 0">
        <ul>
          <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
        </ul>
      </div>

      <v-text-field v-model="user.name" :counter="50" label="名前" required></v-text-field>

      <v-text-field v-model="user.email" :counter="250" label="メールアドレス" required></v-text-field>

      <v-text-field v-model="user.password" label="パスワード" required></v-text-field>

      <v-text-field v-model="user.password_confirmation" label="パスワード（確認用）" required></v-text-field>

      <v-btn color="primary" @click="signUp">登録</v-btn>
    </v-form>
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
    async signUp() {
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

.sign_up {
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
}

form {
  padding-top: 30px;
}
</style>