<template>
  <button @click="perehodClicker">Авторedfsdизация</button>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {};
  },
  methods: {
    perehodHome() {
      this.$router.push("/Home");
    },

    perehodClicker() {
      this.$router.push("/Auth");
    },
  },
  mounted() {},
};
</script>
<style scoped>
.h1 {
  font-family: Arial, Helvetica, sans-serif;
  color: red;
}
</style>
