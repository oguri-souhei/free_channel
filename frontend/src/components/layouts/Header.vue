<template>
  <div class="header">
    <v-card style="border-radius:0;">
      <v-app-bar
        hide-on-scroll
      >

        <v-toolbar-title>
          <router-link to="/" class="title">ふりーちゃんねる</router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        <template v-slot:extension>
          <template v-if="isLoggedIn">
            <LoggedIn></LoggedIn>
          </template>
          <template v-else>
            <NotLoggedIn></NotLoggedIn>
          </template>
        </template>
      </v-app-bar>
    </v-card>
  </div>
</template>

<script>
import LoggedIn from './headers/LoggedIn.vue'
import NotLoggedIn from './headers/NotLoggedIn.vue'

export default {
  name: 'Header',
  components: {
    LoggedIn,
    NotLoggedIn
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>

<style scoped>
.title {
  text-decoration: none;
  color: #000;
}
</style>