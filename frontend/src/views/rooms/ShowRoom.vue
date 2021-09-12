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

          <v-list>
            <v-list-item>
              <v-list-item-title>
                <router-link to="/rooms/edit">編集</router-link>
              </v-list-item-title>
              <v-list-item-title @click="destroyRoom">ルーム削除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="comments">
      <div v-for="(comment, index) in comments" :key="index" :class="'comment comment-' + index">
        <Comment
          :sentence="comment.sentence"
          :createdAt="comment.created_at"
          :userName="comment.user_name"
          :avatar="comment.avatar"
          :userId="comment.user_id"
        />
      </div>
    </div>
    <div class="comment-field">
      <form>
        <v-textarea
          solo
          label="コメントを入力"
          id="sentence"
          @keydown.enter.exact.prevent="keyDownEnter"
          @keyup.enter.exact="createComment"
        ></v-textarea>
      </form>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/comments/Comment.vue'

export default {
  name: 'ShowRoom',
  components: {
    Comment
  },
  data() {
    return {
      room: {},
      comments: []
    }
  },
  computed: {
    // ログイン中のユーザーがルームの作成者か？
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

      // ルームが見つからなかった
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: 'ルームが見つかりませんでした', type: 'error' })
        this.$router.push('/').catch(() => null)
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    },
    // enterを押した時のkeycodeを記録
    keyDownEnter(e) {
      this.keyDownCode = e.keyCode
    },
    // ルームを削除
    async destroyRoom() {
      if (!window.confirm('このルームを本当に削除しますか？')) return

      const response = await this.$http.delete('/rooms/' + this.room.id).catch(err => err.response)

      // 成功時
      if (response.status === 200) {
        this.$store.dispatch('setFlash', { msg: 'ルームを削除しました', type: 'success' })
        this.$router.push('/')
      }

      // 他のユーザー
      else if (response.status === 403) {
        this.$store.dispatch('setFlash', { msg: 'この操作は禁止されています', type: 'error' })
      }
      // ルームが見つからない
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: 'ルームを見つけることができませんでした', type: 'error' })
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
      }
    },
    createComment(e) {
      if (e.target.value.trim().length === 0) return // コメントが空の場合
      console.log('created comment')
      e.target.value = ''
    }
  },
  created() {
    this.setRoom()
  }
}
</script>

<style scoped>
h2 {
  margin: 0;
}

.show-room {
  height: 100vh;
  width: 100%;
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
  padding-bottom: 110px;
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px
}

.comment {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.comment-field {
  width: 100%;
  height: 100px;
  position: fixed;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 3px;
}
</style>