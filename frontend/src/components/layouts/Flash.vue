<template>
  <div class="flash">
    <v-alert v-show="flag" :type="flash.type">{{ flash.msg }}</v-alert>
  </div>
</template>

<script>
export default {
  name: 'Flash',
  data() {
    return {
      flag: false // flashの表示・非表示
    }
  },
  computed: {
    flash() {
      return this.$store.state.flash
    }
  },
  watch: {
    // flashが更新されたら表示、3000ミリ秒後に非表示に
    flash() {
      this.flag = true
      setTimeout(() => {
        this.flag = false
      }, 3000)
    }
  },
  created() {
    if (this.flash.msg.length !== 0) {
      this.flag = true
      setTimeout(() => {
        this.flag = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.flash {
  min-width: 300px;
  position: fixed;
  left: 5px;
  bottom: 5px;
  z-index: 100;
}
</style>