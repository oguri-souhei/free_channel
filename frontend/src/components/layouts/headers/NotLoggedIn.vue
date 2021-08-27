<template>
  <v-tabs>
    <v-tabs-slider style="opacity:0"></v-tabs-slider>

    <v-tab to="/sign_up">アカウント登録</v-tab>
    <v-tab to="/login">ログイン</v-tab>
  </v-tabs>
</template>

<script>
export default {
  name: 'NotLoggedIn'
}
</script>
