<template>
  <div id="app">
    <Header></Header>
    <Flash></Flash>
    <router-view/>
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
