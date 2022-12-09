<template>
  <transition name="fade">
    <div>
      <v-card class="modal__inner">
        <div class="modal__close" @click="close">×</div>
        <h4 class="mb-2">New Category</h4>
        <v-text-field
          type="text"
          label="New Category"
          v-model="categoryName"
        ></v-text-field>
        <div class="color mb-2 d-flex justify-space-between">
          <v-icon x-large :color="colorName">mdi-circle</v-icon>
          <v-select
            :items="this.$store.state.color"
            item-text="name"
            item-value="id"
            label="Color"
            rounded
            outlined
            hide-details="auto"
            class="mx-5"
            v-model="black"
            @change="changeColor"
          ></v-select>
        </div>
        <v-btn color="blue" block class="mt-2" @click="createCategory"
          ><span class="white--text">Create</span>
          <v-icon class="white--text">mdi-plus</v-icon>
        </v-btn>
      </v-card>
      <div class="modal__background" @click="close"></div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      black: 11,
      categoryName: "",
    };
  },
  props: {
    category: Object,
  },
  computed: {
    colorName() {
      return this.$store.state.createCategoryColor;
    },
  },
  methods: {
    close() {
      this.$store.state.createCategory = false;
    },
    changeColor(e) {
      console.log(e);
      this.$store.state.createCategoryColor = this.$store.state.color[e].name;
      this.$store.state.createCategoryColorID = e;
    },
    createCategory: async function () {
      const newCategory = new URLSearchParams();
      newCategory.append("colorID", this.$store.state.createCategoryColorID);
      newCategory.append("name", this.categoryName);
      newCategory.append("userID", localStorage.getItem("userId"));

      await axios
        .post("http://localhost:8000/createCategory", newCategory)
        .then(() => {
          this.$store.dispatch("getTasks");
          this.$store.state.createCategory = false;
          this.categoryName = "";
          this.$store.state.createCategoryColor = "black";
          this.black = 11;
        });
    },
  },
};
</script>

<style scoped>
.modal__inner {
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 30px;
  background-color: #fff;
  z-index: 15;
}

.modal__background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  cursor: pointer;
}

.modal__close {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}

.delete-btn {
  margin-right: 10%;
}

.color {
  padding: 30px 10%;
}

@media screen and (max-width: 1000px) {
  .update-btn,
  .delete-btn {
    margin: 0;
  }

  .modal__inner {
    max-width: 350px;
  }
}
</style>
