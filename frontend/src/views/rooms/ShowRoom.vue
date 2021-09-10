<template>
  <div class="show-room">
    <h2>{{ room.name }}</h2>
    <h2>{{ room.category }}</h2>
  </div>
</template>

<script>
export default {
  name: 'ShowRoom',
  data() {
    return {
      room: {}
    }
  },
  methods: {
    async setRoom() {
      const response = await this.$http.get('/api/v1/rooms/' + this.$route.params.id).catch(err => err.response)

      if (response.status === 200) {
        const room = response.data.data
        this.room = room
      }

      // ルームが見つからなかった
      else if (response.status === 404) {
        this.$store.dispatch('setFlash', { msg: 'ルームが見つかりませんでした', type: 'error' })
        this.$router.push('/')
      }

      // その他のエラー
      else {
        this.$store.dispatch('setFlash', { msg: '未知のエラー', type: 'error' })
        this.$router.push('/')
      }
    }
  },
  created() {
    this.setRoom()
  }
}
</script>