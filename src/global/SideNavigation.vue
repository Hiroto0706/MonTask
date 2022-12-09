<template>
  <v-navigation-drawer v-model="$store.state.drawer" app>
    <v-container>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Menu </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title">
          <v-tab>
            <router-link
              :to="item.url"
              style="text-decoration: none; color: black"
              class="d-flex"
            >
              <v-list-item-icon class="pl-2">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </router-link>
          </v-tab>
        </v-list-item>
      </v-list>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Register",
          icon: "mdi-account-plus",
          url: "/register",
        },
        { title: "Login", icon: "mdi-login-variant", url: "/login" },
      ],
      right: null,
    };
  },
};
</script>

<style scoped>
.v-tab {
  width: 100%;
  transition: ease 0.2s;
}
.v-tab:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
