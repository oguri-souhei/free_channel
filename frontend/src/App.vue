<template>
  <div id="app">
    <v-app>
      <Header></Header>
      <Flash></Flash>
      <div class="content">
        <router-view/>
      </div>
    </v-app>
  </div>
</template>

<script>
import Header from './components/layouts/Header.vue'
import Flash from './components/layouts/Flash.vue'

export default {
  name: 'App',
  components: {
    Header,
    Flash
  }
}
</script>

<style scoped>
.content {
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>