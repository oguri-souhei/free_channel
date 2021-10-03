<template>
  <div class="index-room">
    <div class="search-form">
      <v-text-field
        placeholder="ルームを検索"
        outlined
        v-model="q"
        @keydown.enter.prevent="keyDownEnter"
        @keyup.enter="searchRooms"
      ></v-text-field>
    </div>
    <Rooms :rooms="rooms"></Rooms>
    <div class="pagination">
      <v-pagination
        v-model="page"
        :length="length"
        @input="setRooms"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Rooms from '@/components/rooms/Rooms.vue'

export default {
  name: 'indexRoom',
  components: {
    Rooms
  },
  data() {
    return {
      rooms: [],
      page: 1,
      length: 6,
      keyDownCode: null,
      q: ''
    }
  },
  methods: {
    async setRooms() {
      const response = await this.$http.get('/api/v1/rooms', { params: { page: this.page } }).catch(err => err.response)

      if (response.status === 200) {
        this.rooms = response.data.data.rooms
        this.length = response.data.data.length
      }

      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    },
    async searchRooms() {
      if (this.keyDownCode === 229) return

      this.page = 1
      const response = await this.$http.get('/api/v1/rooms/search', { params: { page: this.page, q: this.q } }).catch(err => err.response)

      if (response.status === 200) {
        this.rooms = response.data.data.rooms
        this.length = response.data.data.length
      }

      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/').catch(() => null)
      }
    },
    keyDownEnter(e) {
      this.keyDownCode = e.keyCode
    },
  },
  created() {
    this.setRooms()
  },
  watch: {
    rooms(newVal, oldVal) {
      if (oldVal.length === 0) return
      window.scroll(0, 0)
    }
  }
}
</script>

<style scoped>
.index-room {
  margin-top: 30px;
  margin-bottom: 30px;
}

.search-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 10px;
}

.rooms {
  width: 90%;
  margin: 0 auto;
}
</style>