<template>
  <v-container>
    <v-card color="white" class="py-5 px-10">
      <v-card-title class="font-weight-bold text-h5 justify-center my-3"
        >Register</v-card-title
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
        v-show="this.$store.state.registerError"
        class="mb-10 red--text font-weight-bold"
        >{{ errorText }}</v-card-text
      >
      <v-row class="justify-end pr-3 mt-2 mb-6">
        <v-btn large class="align-right" color="success" @click="register"
          >Register</v-btn
        >
      </v-row>
      <v-card-text class="text-center">
        すでにアカウントをお持ちの方は
        <router-link to="/login">こちら</router-link>
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
      error: false,
    };
  },
  methods: {
    register: async function () {
      const idData = await this.$store.dispatch("register", {
        email: this.email,
        password: this.password,
      });

      console.log(idData.data);
      localStorage.setItem("userId", idData.data);
    },
  },
};
</script>
