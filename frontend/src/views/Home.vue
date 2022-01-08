<template>
  <div class="home">
    <!-- ログインしていないときのトップページ -->
    <div class="top-page">
      <div class="app-name">
        <h1 class="outlined">ふりーちゃんねる</h1>
      </div>
      <div class="buttons">
        <v-btn color="primary" to="/rooms" id="search-rooms">部屋を探す</v-btn>
        <v-btn color="primary" to="/rooms/new" id="new-room">部屋を作る</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class Home extends Vue {}
</script>

<style scoped>
h1 {
  text-align: center;
}
.outlined {
  color: #000;
  letter-spacing: 4px;
  text-shadow:
       2px  2px 1px #fff,
      -2px  2px 1px #fff,
       2px -2px 1px #fff,
      -2px -2px 1px #fff,
       2px  0px 1px #fff,
       0px  2px 1px #fff,
      -2px  0px 1px #fff,
       0px -2px 1px #fff;
}
.top-page {
  background-image: url('https://picsum.photos/1200/700');
  background-size: cover;
  width: 100%;
  height: 100vh;
  margin-top: -104px;
  padding-top: 50vh;
}
.buttons {
  display: flex;
  margin-top: 30px;
  justify-content: center;
}
.buttons > a:nth-child(1) {
  margin-right: 5px;
}
.buttons > a:nth-child(2) {
  margin-left: 5px;
}
</style>
