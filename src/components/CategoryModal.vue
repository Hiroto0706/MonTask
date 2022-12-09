<template>
  <transition name="fade">
    <div>
      <v-card class="modal__inner">
        <div class="modal__close" @click="$emit('closeCategory')">×</div>
        <h4 class="mb-2">Category</h4>
        <v-text-field
          type="text"
          label="Category Name"
          :value="categoryName"
          @change="(value) => (categoryName = value)"
        ></v-text-field>

        <h4 class="mb-2">Color</h4>
        <div class="color mb-2 d-flex justify-space-between">
          <v-icon x-large :color="colorName">mdi-circle</v-icon>
          <CategoryColor @changeColor="changeColor"></CategoryColor>
        </div>
        <v-btn class="delete-btn" color="error" block @click="deleteCategory">
          Delete
          <v-icon class="ml-2">mdi-trash-can-outline</v-icon>
        </v-btn>
      </v-card>
      <div class="modal__background" @click="$emit('closeCategory')"></div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
const CategoryColor = () => import("@/global/CategoryColor.vue");

export default {
  components: {
    CategoryColor,
  },
  computed: {
    categoryName: {
      get() {
        if (this.$store.state.editCategory.name) {
          return this.$store.state.editCategory.name;
        }
        return "";
      },
      set: async function (value) {
        const category = new URLSearchParams();
        category.append("categoryID", this.$store.state.editCategory.id);
        category.append("name", value);
        await axios
          .post("http://localhost:8000/updateCategoryName", category)
          .then(() => {
            this.$store.dispatch("getTasks");
          });
      },
    },
    colorName: {
      get() {
        if (
          this.$store.state.editCategory.color_id ||
          this.$store.state.editCategory.color_id == 0
        ) {
          let id = this.$store.state.editCategory.color_id;
          return this.$store.state.color[id].name;
        }
        return "";
      },
    },
  },
  methods: {
    changeColor(id) {
      this.colorName = this.$store.state.color[id].name;
    },
    deleteCategory: async function () {
      const category = new URLSearchParams();
      category.append("id", this.$store.state.editCategory.id);

      await axios
        .post("http://localhost:8000/deleteCategory", category)
        .then(() => {
          this.$store.dispatch("getTasks");
        });
      this.$store.state.categoryEdit = false;
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
