<template>
  <div class="header">
    <el-menu class="el-menu-demo" mode="horizontal" active-text-color="none">
      <!-- ログインしている時のヘッダ -->
      <template v-if="isLoggedIn">
        <el-menu-item index="1">
          <router-link to="/">FreeChannel</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <el-input placeholder="ルームを検索"></el-input>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="#">
            <el-button type="primary" round>ユーザー</el-button>
          </router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <el-button @click="logout" type="primary" round plain>ログアウト</el-button>
        </el-menu-item>
      </template>
      <!-- ログインしていない時のヘッダ -->
      <template v-else>
        <el-menu-item index="1">
          <router-link to="/">FreeChannel</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <el-input placeholder="ルームを検索"></el-input>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/sign_up">
            <el-button type="primary" round>アカウント登録</el-button>
          </router-link>
        </el-menu-item>
        <el-menu-item index="4">
          <router-link to="/login">
            <el-button type="primary" round plain>ログイン</el-button>
          </router-link>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    currentUser() {
      return this.$store.state.currentUser
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
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

      // 現在のページがトップページだと、duplicationエラーが起きる。。。
      this.$router.push('/').catch(() => null)
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>