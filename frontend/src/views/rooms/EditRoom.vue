<template>
  <div class="edit-room">

    <h2>部屋編集</h2>

    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <v-form ref="form" lazy-validation>

        <!-- errors -->
        <div class="errors" v-if="errors.length !== 0">
          <ul>
            <li v-for="e in errors" :key="e"><v-alert type="error" dense text>{{ e }}</v-alert></li>
          </ul>
        </div>

        <ValidationProvider v-slot="{ errors }" name="部屋名" rules="required|max:300">
          <v-text-field
            v-model="room.name"
            id="name"
            :counter="300"
            label="部屋名"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="カテゴリー" rules="required">
          <v-select
            data-test="test"
            v-model="room.category"
            :items="categories"
            id="category"
            label="カテゴリー"
            :error-messages="errors"
          ></v-select>
        </ValidationProvider>

        <v-btn color="primary" @click="updateRoom" :disabled="invalid">編集</v-btn>
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
  name: 'EditRoom',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      room: {
        id: '',
        name: '',
        category: ''
      },
      categories: CATEGORIES,
      errors: []
    }
  },
  methods: {
    async updateRoom() {
      this.errors = [] // エラーメッセージを空に

      const response = await this.$http.patch('/api/v1/rooms/' + this.room.id, { room: this.room }).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        this.$store.dispatch('setFlash', { msg: '部屋を編集しました', type: 'success' })
        this.$router.push({ name: 'ShowRoom', params: { id: this.room.id }})
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

      // 部屋の作成者ではない
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: 'この操作は禁止されています', type: 'error' })
        this.$router.push({ name: 'ShowRoom', params: { id: this.room.id }}).catch(() => null)
      }

      // その他
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    },
    async setRoom(id) {
      const response = await this.$http.get(`/api/v1/rooms/${id}/info`).catch(err => err.response)

      if (response.status === 200) {
        const room = response.data.data
        this.room = room
      }

      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
      }
    }
  },
  async created() {
    await this.setRoom(this.$route.params.id)
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

.edit-room {
  max-width: 500px;
  text-align: center;
  margin: 0 auto;
  margin-top: 30px;
  padding-left: 10px;
  padding-right: 10px;
}

form {
  padding-top: 30px;
}
</style>