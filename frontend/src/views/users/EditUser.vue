<template>
  <div class="edit-user">

    <h2>アカウント編集</h2>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation>

        <!-- errors -->
        <div class="errors" v-if="errors.length !== 0">
          <ul>
            <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
          </ul>
        </div>

        <ValidationProvider v-slot="{ errors, validate }" name="アバター" rules="ext:jpg,jpeg,png">
          <Avatar :url="user.avatar && user.avatar.url"></Avatar>
          <v-file-input
            v-model="user.avatar"
            id="avatar"
            label="アバター"
            truncate-length="15"
            :error-messages="errors"
            @change="validate"
            show-size
          ></v-file-input>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="名前" rules="required|max:50">
          <v-text-field
            v-model="user.name"
            id="name"
            :counter="50"
            label="名前"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="メールアドレス" rules="required|max:250|email">
          <v-text-field
            v-model="user.email"
            id="email"
            :counter="250"
            label="メールアドレス"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="パスワード" rules="min:6">
          <v-text-field
            v-model="user.password"
            id="password"
            label="パスワード"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="パスワード（確認用）" rules="confirmed:パスワード">
          <v-text-field
            v-model="user.password_confirmation"
            id="password_confirmation"
            label="パスワード（確認用）"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="現在のパスワード" rules="required|min:6">
          <v-text-field
            v-model="user.current_password"
            id="current_password"
            label="現在のパスワード"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <v-btn color="primary" @click="updateUser" :disabled="invalid">送信</v-btn>
      </v-form>

    </ValidationObserver>
    </div>
</template>

<script>
import Avatar from '@/components/users/Avatar.vue'
import { required, min, email, max, confirmed, ext } from 'vee-validate/dist/rules'
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

extend('confirmed', {
  ...confirmed,
  message: '{_field_}と{target}の入力が一致しません'
})

extend('ext', {
  ...ext,
  message: 'アップロードできる拡張子は jpg, jpeg, png です'
})

export default {
  name: 'EditUser',
  components: {
    ValidationObserver,
    ValidationProvider,
    Avatar,
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        current_password: '',
        avatar: null
      },
      errors: []
    }
  },
  methods: {
    async updateUser() {
      this.errors = [] // エラーメッセージを空に

      // 送信するデータを作成
      const formData = new FormData()
      for (const prop in this.user) {
        formData.append(`user[${prop}]`, this.user[prop])
      }

      const response = await this.$http.patch('/api/v1/auth/registrations', formData).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        const user = response.data.data

        this.$store.dispatch('setCurrentUser', user)
        this.$store.dispatch('setFlash', { msg: 'アカウントを編集しました', type: 'success' })

        this.$router.push('/').catch(() => null) // 。。。
      }

      // パラメータが不正
      else if (response.status === 400) {
        this.errors = response.data.errors
      }

      // ログインしていない
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: 'この操作は禁止されています', type: 'error' })
        this.$router.push({ path: '/login', query: { path: this.$route.fullpath }})
      }

      // その他
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
      }
    }
  },
  mounted() {
    const currentUser = this.$store.state.currentUser
    this.user.name = currentUser.name
    this.user.email = currentUser.email
    this.user.avatar = currentUser.avatar
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

.edit-user {
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