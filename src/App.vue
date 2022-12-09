<template>
  <v-app>
    <router-view name="navigation"></router-view>
    <router-view name="header"></router-view>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
};
</script>

<style>
main,
body {
  background-color: rgb(206, 219, 206);
  color: rgb(37, 39, 36);
}
.input-content {
  width: 100%;
}
.input-content__task {
  width: 85%;
}
.input-content__task__category .v-input__slot {
  background-color: #e8e8e8;
}
.input-content__task__category .v-input__slot:hover {
  background-color: #d9d9d9;
}
.input-content__time {
  width: 10%;
  min-width: 75px;
}
.input-content__time.v-text-field--rounded
  > .v-input__control
  > .v-input__slot {
  padding: 0 0px;
}
.input-content__time input {
  text-align: center;
}
.input-content__btn {
  min-width: 40px;
  width: 5%;
}
.v-btn:hover {
  opacity: 0.8;
}
</style>
