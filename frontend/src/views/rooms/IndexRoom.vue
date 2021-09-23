<template>
  <div class="rooms">
    <div v-for="room in rooms" :key="room.id">
      <Room :name="room.name" :createdAt="room.created_at" :commentCount="room.comment_count"></Room>
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
      rooms: []
    }
  },
  methods: {
    async setRooms() {
      const response = await this.$http.get('/api/v1/rooms').catch(err => err.response)

      if (response.status === 200) {
        this.rooms = response.data.data
      }

      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/')
      }
    }
  },
  created() {
    this.setRooms()
  }
}
</script>