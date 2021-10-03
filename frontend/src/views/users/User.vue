<template>
  <div class="user-page">
    <div class="user-profile">
      <div class="user-box">
        <Avatar :url="avatarUrl"></Avatar>
        <div class="user-info">
          <div>
            <p class="name">{{ user.name }}</p>
            <span class="email">{{ user.email }}</span>
          </div>
        </div>
      </div>
      <div class="edit-button" v-if="isCurrentUser">
        <router-link to="/users/edit">
          <v-btn id="edit-user" color="primary" rounded>アカウント編集</v-btn>
        </router-link>
      </div>
    </div>
    <div class="user-rooms">
      <h3>作成した部屋</h3>
      <Rooms :rooms="rooms"></Rooms>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/users/Avatar.vue'
import Rooms from '@/components/rooms/Rooms.vue'
import { getUser } from '@/modules/users'

export default {
  name: 'User',
  components: {
    Avatar,
    Rooms
  },
  data() {
    return {
      user: {},
      rooms: []
    }
  },
  computed: {
    isCurrentUser() {
      return this.$store.getters.isLoggedIn &&
        this.user.id === this.$store.state.currentUser.id
    },
    avatarUrl() {
      return this.user.avatar && this.user.avatar.url
        ? this.user.avatar.url : null
    }
  },
  methods: {
    async setUser(id) {
      const response = await getUser(id).catch(res => res)

      if (response.status === 200) {
        this.user = response.data.data.user
        this.rooms = response.data.data.rooms
      }

      // ユーザーが見つからなかった
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: 'ユーザーが見つかりませんでした', type: 'warning'})
        this.$router.push('/').catch(() => null)
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    }
  },
  async created() {
    await this.setUser(this.$route.params.id)
  },
  watch: {
    '$route': async function (to) {
      await this.setUser(to.params.id)
    }
  }
}
</script>

<style scoped>
.user-page {
  margin-top: 30px;
}
.user-profile {
  margin-left: 5px;
  margin-right: 5px;
  padding: 30px 30px 10px;
  border-bottom: 1px solid #eee;
}

.user-box {
  display: flex;
}

.user-info {
  padding-left: 30px;
  display: flex;
  align-items: center;
}

.name {
  margin: 0;
  font-size: 30px;
}

.email {
  color: #777;
}

.edit-button {
  display: flex;
  justify-content: flex-end;
}

.user-rooms {
  width: 90%;
  margin: 0 auto;
}

.user-rooms > h3 {
  margin-top: 20px;
}
</style>