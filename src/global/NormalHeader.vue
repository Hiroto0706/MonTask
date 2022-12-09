<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="font-weight-bold text-h5">MonTask</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "App",

  data: () => ({}),
  methods: {
    drawer() {
      this.$store.state.drawer = !this.$store.state.drawer;
    },
  },
};
</script>
