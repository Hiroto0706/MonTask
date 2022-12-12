<template>
  <v-select
    :items="this.$store.state.color"
    item-text="name"
    item-value="id"
    label="Color"
    rounded
    outlined
    hide-details="auto"
    class="mx-5"
    v-model="colorID"
  ></v-select>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      status: "",
    };
  },
  computed: {
    colorID: {
      get() {
        return this.$store.state.editCategory.color_id;
      },
      set: async function (value) {
        this.$store.state.editCategory.color_id = value;

        const categoryColor = new URLSearchParams();
        categoryColor.append(
          "colorID",
          this.$store.state.editCategory.color_id
        );
        categoryColor.append("categoryID", this.$store.state.editCategory.id);

        await axios
          .post("http://localhost:8000/updateColor", categoryColor)
          .then(() => {
            this.$store.dispatch("getTasks");
            if (
              this.$store.state.editCategory.name ==
              this.$store.state.runTaskCategoryName
            ) {
              this.$store.dispatch("getRunTaskColorID", value);
              this.$store.dispatch(
                "getRunTaskColorName",
                this.$store.state.color[value].name
              );
              this.$store.dispatch(
                "getRunTaskColorBackGround",
                this.$store.state.color[value].back_ground
              );
            }
          });
      },
    },
  },
};
</script>
