<template>
  <div class="header">
    <el-menu class="el-menu-demo" mode="horizontal" active-text-color="none">
      <el-menu-item index="1">
        <router-link to="/">FreeChannel</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <el-input placeholder="ルームを検索"></el-input>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="#">
          <el-button type="primary" round>アカウント登録</el-button>
        </router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/login">
          <el-button type="primary" round plain>ログイン</el-button>
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>