<template>
  <div class="show-room">
    <div class="room-header">
      <div class="room-title">
        <h2>{{ room.name }}</h2>
      </div>
      <div class="room-menu" v-if="isOwner">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon color="black">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-card tile>
            <v-list dense>
              <v-list-item-group color="primary">
                <v-list-item>
                  <v-list-item-content>
                    <router-link :to="{ name: 'EditRoom', params: { id: room.id }}">編集</router-link>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <span @click="destroyRoom">削除</span>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>
    <div class="comments">
      <div v-for="(comment, index) in comments" :key="index" :class="'comment comment-' + index">
        <Comment
          :id="comment.id"
          :sentence="comment.sentence"
          :createdAt="comment.created_at"
          :userName="comment.user_name"
          :avatar="comment.avatar"
          :userId="comment.user_id"
          :isFavorited="comment.favorited"
          :favoriteCount="comment.favorite_count"
        />
      </div>
    </div>
    <div class="comment-field">
      <form>
        <textarea
          placeholder="コメントを入力"
          id="sentence"
          v-model="comment"
          @keydown.enter.exact.prevent="keyDownEnter"
          @keyup.enter.exact="createComment"
        ></textarea>
      </form>
      <v-btn
        color="primary"
        class="comment-submit-button"
        @click="submitComment"
        data-cy-comment-submit-button>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/comments/Comment.vue'
import { scrollBottom } from '@/modules/scrollBottom'

export default {
  name: 'ShowRoom',
  components: {
    Comment
  },
  data() {
    return {
      room: {},
      comment: '',
      comments: [],
      roomChannel: null,
      keyDownCode: null
    }
  },
  computed: {
    // ログイン中のユーザーが部屋の作成者か？
    isOwner() {
      return this.$store.state.currentUser && this.$store.state.currentUser.id === this.room.user_id
    }
  },
  methods: {
    async setRoom() {
      const response = await this.$http.get('/api/v1/rooms/' + this.$route.params.id).catch(err => err.response)

      if (response.status === 200) {
        this.room = response.data.data.room
        this.comments = response.data.data.comments
      }

      // 部屋が見つからなかった
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: '部屋が見つかりませんでした', type: 'error' })
        this.$router.push('/').catch(() => null)
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    },
    // 部屋を削除
    async destroyRoom() {
      if (!window.confirm('この部屋を本当に削除しますか？')) return

      const response = await this.$http.delete('/api/v1/rooms/' + this.room.id).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        this.$store.dispatch('setFlash', { msg: '部屋を削除しました', type: 'success' })
        this.$router.push('/').catch(() => null)
      }

      // 他のユーザー
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: 'この操作は禁止されています', type: 'error' })
      }

      // 部屋が見つからない
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: '部屋を見つけることができませんでした', type: 'error' })
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
      }
    },
    keyDownEnter(e) {
      this.keyDownCode = e.keyCode // enterを押した時のkeycodeを記録
    },
    // Enterキーを押してコメントした場合の処理
    createComment() {
      if (this.comment.trim().length === 0) return // コメントが空の場合
      if (this.keyDownCode === 229) return // 229コードの場合（日本語変換確定時のEnterキー）は処理をスキップ
      // ログインしていない
      if (!this.$store.getters.isLoggedIn) {
        this.$store.dispatch('setFlash', { msg: 'コメントするにはログインしてください', type: 'warning' })
        this.$router.push({ path: '/login', query: { path: this.$route.fullPath }})
        return
      }

      const comment = { sentence: this.comment, user_id: this.$store.state.currentUser.id, room_id: this.room.id }
      this.roomChannel.comment(comment)
      this.comment = ''
    },
    // ボタンを押してコメントした場合の処理
    submitComment() {
      if (this.comment.trim().length === 0) return // コメントがからの場合
      // ログインしていない場合
      if (!this.$store.getters.isLoggedIn) {
        this.$store.dispatch('setFlash', { msg: 'コメントするにはログインしてください', type: 'warning' })
        this.$router.push({ path: '/login', query: { path: this.$route.fullPath }})
        return
      }
      const comment = { sentence: this.comment, user_id: this.$store.state.currentUser.id, room_id: this.room.id }
      this.roomChannel.comment(comment)
      this.comment = ''
    }
  },
  created() {
    this.setRoom()

    if (!this.$store.getters.isLoggedIn) return // ログインしていないならスキップ

    const that = this
    this.roomChannel = this.$cable.subscriptions.create({
      channel: 'RoomChannel',
      id: this.$route.params.id
    }, {
      received(comment) {
        that.comments.push(comment)
        that.$nextTick(() => {
          scrollBottom()
        })
      },
      comment(comment) {
        this.perform('comment', { comment })
      }
    })
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
}

a {
  text-decoration: none;
  color: #333;
}

.show-room {
  height: 100vh;
  width: 100%;
  margin-top: 30px;
  position: relative;
}

.room-header {
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.room-title {
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
}

.comments {
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px
}

.comment {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.comment-field {
    position: fixed;
    display: flex;
    bottom: 0px;
    width: 100%;
    height: 80px;
    background: #ccc;
}

form {
  width: 90%;
  height: 100%;
}

textarea {
  height: 100%;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
}

.comment-submit-button {
  width: 10%;
  height: 80px !important;
}
</style>