<template>
  <v-tabs>
    <v-tabs-slider style="opacity:0"></v-tabs-slider>

    <v-tab :to="{ name: 'User', params: { id: user.id }}">アカウント</v-tab>
    <v-tab @click="logout">ログアウト</v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'LoggedIn',
  data() {
    return {
      user: this.$store.state.currentUser
    }
  },
  methods: {
    async logout() {
      const response = await this.$http.delete('/api/v1/auth/logout').catch(err => err.response)

      // ログアウト成功時
      if (response.status === 200) {
        this.$store.dispatch('setCurrentUser', null)
        this.$store.dispatch('setFlash', { msg: 'ログアウトしました', type: 'success' })
      }
      // ログアウト失敗時
      else {
        this.$store.dispatch('setFlash', { msg: 'ログアウトに失敗しました', type: 'error' })
      }

      this.$router.push('/').catch(() => null)
    }
  }
}
</script>
