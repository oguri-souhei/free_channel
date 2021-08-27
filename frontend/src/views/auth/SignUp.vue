<template>
  <div class="sign_up">

    <h2>アカウント登録</h2>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation>

        <!-- errors -->
        <div class="errors" v-if="errors.length !== 0">
          <ul>
            <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
          </ul>
        </div>

        <ValidationProvider v-slot="{ errors }" name="名前" rules="required|max:50">
          <v-text-field v-model="user.name" :counter="50" label="名前" :error-messages="errors" required></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="メールアドレス" rules="required|max:250|email">
          <v-text-field v-model="user.email" :counter="250" label="メールアドレス" :error-messages="errors" required></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="パスワード" rules="required|min:6">
          <v-text-field v-model="user.password" label="パスワード" :error-messages="errors" required></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="パスワード（確認用）" rules="required">
          <v-text-field v-model="user.password_confirmation" label="パスワード（確認用）" :error-messages="errors" required></v-text-field>
        </ValidationProvider>

        <v-btn color="primary" @click="signUp" :disabled="invalid">登録</v-btn>
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
  name: 'SignUp',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      errors: []
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