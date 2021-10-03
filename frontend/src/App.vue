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
import 'normalize.css' // reset.css
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
