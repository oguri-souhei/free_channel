<template>
  <div class="avatar">
    <template v-if="url">
      <v-avatar :size="size">
        <img :src="avatarUrl" alt="">
      </v-avatar>
    </template>
    <template v-else>
      <v-avatar color="indigo" :size="size">
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    url: String,
    size: {
      type: Number,
      default: 70
    }
  },
  computed: {
    avatarUrl() {
      return this.url
    }
  }
}
</script>