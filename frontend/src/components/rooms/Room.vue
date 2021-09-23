<template>
  <div class="room">
    <h2>{{ name }}</h2>
    <p>{{ commentCount }} コメント</p>
    <p>{{ createdDate }}</p>
  </div>
</template>

<script>
import { dateTime } from '@/modules/date'

export default {
  name: 'Room',
  props: {
    name: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    commentCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    createdDate() {
      return dateTime(this.createdAt)
    }
  }
}
</script>

<style scoped>
.room {
  border-bottom: 1px solid #eee;
}
</style>