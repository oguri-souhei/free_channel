<template>
  <div class="rooms">
    <Room v-for="room in rooms" :key="room.id"
      :id="room.id"
      :name="room.name"
      :category="room.category"
      :createdAt="room.created_at"
      :commentCount="room.comment_count"
    ></Room>
  </div>
</template>

<script>
import Room from '@/components/rooms/Room.vue'

export default {
  name: 'Rooms',
  props: {
    rooms: {
      type: Array,
      required: true
    }
  },
  components: {
    Room
  }
}
</script>