<template>
  <v-container>
    <v-card
      color="white"
      class="pa-5 mb-5"
      style="max-width: 600px; margin: auto"
    >
      <v-card-title class="font-weight-bold text-h5 justify-center"
        >Profile</v-card-title
      >
      <v-card-title class="text-h5 pl-5">Your Information</v-card-title>
      <v-text-field
        label="Your Email"
        outlined
        type="email"
        class="px-5"
        v-model="userEmail"
      ></v-text-field>
      <v-row class="justify-end pr-8 pt-3 pb-5">
        <v-btn depressed color="success" rounded
          ><v-icon class="mr-1">mdi-pencil-outline</v-icon> Update
        </v-btn>
      </v-row>
      <v-spacer></v-spacer>
      <v-row class="justify-end py-10 px-8">
        <v-btn depressed block color="error" x-large rounded @click="logout">
          <v-icon class="mr-2">mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userEmail: "",
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
  created: async function () {
    const id = new URLSearchParams();
    id.append("id", localStorage.getItem("userId"));
    const userEmail = await axios.post(
      "http://localhost:8000/getUserEmail",
      id
    );
    this.userEmail = userEmail.data;
  },
};
</script>

<style scoped>
.password {
  margin-bottom: 50px;
}
</style>
