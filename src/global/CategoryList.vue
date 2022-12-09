<template>
  <div>
    <div class="modal__background" @click="close"></div>
    <v-card v-show="this.$store.state.categoryList" class="category-list">
      <div class="modal__close" @click="close">×</div>
      <h3 class="mb-2">Categories</h3>
      <hr />
      <v-list
        v-for="(category, index) in this.$store.state.runTaskCategory"
        :key="index"
        class="category"
      >
        <div class="d-flex">
          <v-icon
            x-small
            class="pl-2 icon"
            @click="clickCategory(category)"
            :color="colorName(category)"
          >
            mdi-circle
          </v-icon>
          <span
            class="pl-2 font-weight-bold"
            :class="{
              'red--text': colorName(category) == 'red',
              'pink--text': colorName(category) == 'pink',
              'purple--text': colorName(category) == 'purple',
              'indigo--text': colorName(category) == 'indigo',
              'blue--text': colorName(category) == 'blue',
              'cyan--text': colorName(category) == 'cyan',
              'teal--text': colorName(category) == 'teal',
              'green--text': colorName(category) == 'green',
              'lime--text': colorName(category) == 'lime',
              'orange--text': colorName(category) == 'orange',
              'brown--text': colorName(category) == 'brown',
              'black--text': colorName(category) == 'black',
            }"
            @click="clickCategory(category)"
            >{{ category.name }}</span
          >
          <v-btn
            icon
            class="ml-auto mr-2 icon"
            small
            @click="openSetting(category)"
          >
            <v-icon> mdi-dots-horizontal </v-icon>
          </v-btn>
        </div>
      </v-list>
      <v-btn color="success" block class="mt-2" @click="openCreateCategory"
        >Add
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryColor: [],
    };
  },
  computed: {
    colorName() {
      return function (category) {
        let colorID = category.color_id;
        return this.$store.state.color[colorID].name;
      };
    },
  },
  methods: {
    close() {
      this.$store.state.categoryList = false;
      this.$store.state.categoryEdit = false;
    },
    clickCategory(category) {
      this.$store.state.categoryList = false;

      this.$store.state.runTaskCategoryName = category.name;
      this.$store.state.runTaskCategoryID = category.id;
      this.$store.state.runTaskCategoryColorID = category.color_id;
      this.$store.dispatch("getRunTaskColorID", category.color_id);
      this.$store.dispatch(
        "getRunTaskColorName",
        this.$store.state.color[category.color_id].name
      );
      this.$store.dispatch(
        "getRunTaskColorBackGround",
        this.$store.state.color[category.color_id].back_ground
      );

      this.$emit("runTask");
    },
    openSetting(category) {
      this.$store.state.categoryEdit = true;
      this.$store.state.editCategory = category;
    },
    openCreateCategory() {
      this.$store.state.createCategory = true;
    },
  },
};
</script>

<style scoped>
.category-list {
  padding: 10px;
  background-color: white;
  position: fixed;
  top: 150px;
  left: 30px;
  width: 50%;
  min-width: 330px;
}

.modal__close {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}
.modal__background {
  position: absolute;
  right: 0px;
  top: 136px;
  width: 100%;
  height: 100vh;
  cursor: pointer;
}
.category {
  cursor: pointer;
}
.category:hover {
  background-color: #efefef;
}
.category span {
  padding-top: 3px;
  width: 85%;
}
.category .icon {
  width: 30px;
}
.v-list {
  padding: 0px;
}
</style>
