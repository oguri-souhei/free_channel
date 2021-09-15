<template>
  <div class="new_room">

    <h2>ルーム作成</h2>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation>

        <!-- errors -->
        <div class="errors" v-if="errors.length !== 0">
          <ul>
            <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
          </ul>
        </div>

        <ValidationProvider v-slot="{ errors }" name="ルーム名" rules="required|max:300">
          <v-text-field
            v-model="room.name"
            id="name"
            :counter="300"
            label="ルーム名"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="カテゴリー" rules="required">
          <v-select
            v-model="room.category"
            :items="categories"
            id="category"
            label="カテゴリー"
            :error-messages="errors"
          ></v-select>
        </ValidationProvider>

        <v-btn color="primary" @click="createRoom" :disabled="invalid">作成</v-btn>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { required, max } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import { CATEGORIES } from '@/const'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_}を入力してください',
})

extend('max', {
  ...max,
  message: '{_field_}は{length}文字以内で入力してください',
})

export default {
  name: 'SignUp',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      room: {
        name: '',
        category: ''
      },
      categories: CATEGORIES,
      errors: []
    }
  },
  methods: {
    async createRoom() {
      this.errors = [] // エラーメッセージを空に

      const response = await this.$http.post('/api/v1/rooms', { room: this.room }).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        const room = response.data.data
        this.$store.dispatch('setFlash', { msg: 'ルームを作成しました', type: 'success' })
        this.$router.push({ name: 'ShowRoom', params: { id: room.id }}).catch(() => null)
      }

      // パラメータが不正
      else if (response.status === 400) {
        this.errors = response.data.errors
      }

      // ログインしていない
      else if (response.status === 402) {
        this.$store.dispatch('setFlash', { msg: 'ログインしてください', type: 'warning' })
        this.$router.push({ path: '/login', query: { path: this.$route.fullPath }})
      }

      // その他
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
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

.new_room {
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