<template>
  <div class="comment-wrapper">
    <div class="user-box">
      <router-link :to="{ name: 'User', params: { id: userId } }">
        <Avatar :url="avatar.url"></Avatar>
        <p class="user-name">{{ userName }}</p>
      </router-link>
    </div>
    <div class="comment-content">
      <p class="sentence">{{ sentence }}</p>
      <div class="comment-info">
        <span class="created-date">{{ createdDate }}</span>
        <span>0 いいね</span>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/users/Avatar.vue'
import { dateTime } from '@/modules/date'

export default {
  components: {
    Avatar
  },
  props: {
    sentence: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    avatar: {
      type: Object
    },
    userId: {
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
a {
  text-decoration: none;
  color: #000;
}

p {
  font-weight: bold;
}

.comment-wrapper {
  display: flex;
  position: relative;
}

.user-box p {
  text-align: center;
}

.comment-content {
  padding-left: 15px;
}

.comment-info {
  position: absolute;
  bottom: 0; 
}
</style>
