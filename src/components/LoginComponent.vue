<template>
  <v-container>
    <v-card color="white" class="py-5 px-10">
      <v-card-title class="font-weight-bold text-h5 justify-center my-3"
        >Login</v-card-title
      >
      <v-text-field
        label="Email"
        outlined
        type="text"
        v-model="email"
        hide-details="auto"
        class="mb-10"
      ></v-text-field>
      <v-text-field
        label="Password"
        outlined
        type="password"
        v-model="password"
        hide-details="auto"
        class="mb-10"
      ></v-text-field>
      <v-card-text
        v-show="this.$store.state.loginError"
        class="mb-10 red--text font-weight-bold"
        >{{ errorText }}</v-card-text
      >
      <v-row class="justify-end pr-3 mt-2 mb-6">
        <v-btn large class="align-right" color="success" @click="login"
          >Login</v-btn
        >
      </v-row>
      <v-card-text class="text-center">
        初めての方は
        <router-link to="/register">こちら</router-link>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errorText: "何か問題が発生しました。もう一度お試しください。",
    };
  },
  methods: {
    login: async function () {
      const idData = await this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });

      localStorage.setItem("userId", idData.data);
      this.$store.dispatch("getTasks");
    },
  },
};
</script>
