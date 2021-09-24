<template>
  <div class="room">
    <router-link :to="{ name: 'ShowRoom', params: { id } }">
      <div class="content">
        <h3>{{ name }}</h3>
      </div>
    </router-link>
    <div class="room-footer">
      <span class="category">{{ category }}</span>
      <span class="created">{{ createdDate }}</span>
      <span class="comment_count">{{ commentCount }}コメント</span>
    </div>
  </div>
</template>

<script>
import { dateTime } from '@/modules/date'

export default {
  name: 'Room',
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
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
    },
  },
  computed: {
    createdDate() {
      return dateTime(this.createdAt)
    }
  }
}
</script>

<style scoped>
a {
  color: #1800ae;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.room {
  margin-top: 15px;
  margin-bottom: 15px;
}

.category {
  color: darkgreen;
}

.created {
  color: #999;
  margin-left: 20px;
}

.comment_count {
  color: #333;
  margin-left: 20px;
}
</style>