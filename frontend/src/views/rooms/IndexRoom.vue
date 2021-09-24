<template>
  <div class="index-room">
      <div class="rooms">
      <Room v-for="room in rooms" :key="room.id"
        :id="room.id"
        :name="room.name"
        :category="room.category"
        :createdAt="room.created_at"
        :commentCount="room.comment_count"
      ></Room>
    </div>
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
import Room from '@/components/rooms/Room.vue'

export default {
  name: 'indexRoom',
  components: {
    Room
  },
  data() {
    return {
      rooms: [],
      page: 1,
      length: 6
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
    }
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
.rooms {
  width: 90%;
  margin: 0 auto;
}
</style>