<template>
  <div class="login">
    <h2>ログイン</h2>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation>

        <!-- errors -->
        <div class="errors" v-if="errors.length !== 0">
          <ul>
            <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
          </ul>
        </div>

        <ValidationProvider v-slot="{ errors }" name="メールアドレス" rules="required|email|max:250">
          <v-text-field
            v-model="user.email"
            id="email"
            :counter="250"
            label="メールアドレス"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="パスワード" rules="required|min:6">
          <v-text-field
            v-model="user.password"
            id="password"
            label="パスワード"
            :error-messages="errors"
            required
        ></v-text-field>
        </ValidationProvider>

        <v-btn color="primary" @click="login" :disabled="invalid">ログイン</v-btn>

      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { required, min, email, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

setInteractionMode('eager')

extend('min', {
  ...min,
  message: '{_field_}は{length}文字以上で入力してください',
})

extend('required', {
  ...required,
  message: '{_field_}を入力してください',
})

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

extend('email', {
  ...email,
  message: '{_field_}は正しい形式で入力してください',
})

export default {
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      errors: [],
    }
  },
  methods: {
    async login() {
      this.errors = []

      const response = await this.$http.post('/api/v1/auth/login', { user: this.user }).catch(err => err.response)

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

.login {
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
}
</style>