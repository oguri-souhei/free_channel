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

        <v-btn class="easyLogin" v-if="!isLoggedIn" color="primary" @click="easyLogin">簡単ログイン</v-btn>

        <router-link class="icon" to="/rooms">
          <v-icon>mdi-magnify</v-icon>
        </router-link>

        <router-link class="icon" to="/about">
          <v-icon>mdi-help-circle</v-icon>
        </router-link>

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
  },
  methods: {
    async easyLogin() {
      const response = await this.$http.post('/api/v1/auth/login', { user: { email: 'foo@bar.com', password: 'password' }}).catch(err => err.response)

      if (response.status === 200) {
        const user = response.data.data
        this.$store.dispatch('setCurrentUser', user)
        this.$store.dispatch('setFlash', { msg: 'ログインしました', type: 'success' })
      }

      else if (response.status === 401) {
        this.$store.dispatch('setFlash', { msg: 'アドレスまたはパスワードが違います', type: 'error' })
      }
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.title {
  text-decoration: none;
  color: #000;
}

.icon {
  margin-right: 5px;
}

.easyLogin {
  margin-right: 15px;
}
</style>