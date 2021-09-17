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
        <div class="favorite">
          <v-icon v-show="!flag" @click="favorite" color="red" dense>mdi-heart-outline</v-icon>
          <v-icon v-show="flag" @click="unfavorite" color="red" dense>mdi-heart</v-icon>
          <span>{{ count }}</span>
        </div>
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
    id: {
      type: Number,
      required: true
    },
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
    },
    isFavorited: {
      type: Boolean,
      default: false
    },
    favoriteCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      flag: false,
      count: 0
    }
  },
  computed: {
    createdDate() {
      return dateTime(this.createdAt)
    }
  },
  methods: {
    favorite() {
      this.$http.post('/api/v1/comments/' + this.id + '/favorites')
      this.count++
      this.flag = true
    },
    unfavorite() {
      this.$http.delete('/api/v1/comments/' + this.id + '/favorite')
      this.count--
      this.flag = false
    }
  },
  created() {
    this.flag = this.isFavorited
    this.count = this.favoriteCount
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
  white-space: pre-wrap;
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
  display: flex;
}

.favorite {
  margin-left: 10px;
}
</style>
