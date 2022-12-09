<template>
  <v-container>
    <v-card color="white" class="pa-3 mb-5">
      <v-row class="d-flex my-8" justify="center">
        <v-btn @click="seven" color="success" class="ma-2">Recent</v-btn>
        <v-btn @click="thisWeek" color="success" class="ma-2">This Week</v-btn>
        <v-btn @click="today" color="success" class="ma-2">Today</v-btn>
        <v-btn @click="yesterday" color="success" class="ma-2">Yesterday</v-btn>
      </v-row>
      <h2 class="pl-8">Graphs Chart</h2>
      <GraphChart class="pa-5 mb-10" ref="graph"></GraphChart>
      <h2 class="pl-8">Pie Chart</h2>
      <PieChart
        class="pa-5 mb-16"
        ref="pie"
        :styles="{ display: 'flex', 'justify-content': 'center' }"
      ></PieChart>
      <v-spacer></v-spacer>
    </v-card>

    <CategoryModal
      v-show="categoryModal"
      @closeCategory="closeCategoryModal"
    ></CategoryModal>
    <CreateCategoryModal v-show="createCategoryModal"></CreateCategoryModal>
  </v-container>
</template>

<script>
// import axios from "axios";

const GraphChart = () => import("./GraphChart");
const PieChart = () => import("./PieChart");
const CategoryModal = () => import("@/components/CategoryModal.vue");
const CreateCategoryModal = () =>
  import("@/components/CreateCategoryModal.vue");

export default {
  data() {
    return {};
  },
  components: {
    GraphChart,
    PieChart,
    CategoryModal,
    CreateCategoryModal,
  },
  computed: {
    categoryModal() {
      return this.$store.state.categoryEdit;
    },
    createCategoryModal() {
      return this.$store.state.createCategory;
    },
  },
  methods: {
    seven: async function () {
      this.$store.dispatch("getTasks").then(() => {
        this.$refs.graph.render(
          this.$store.state.days.slice(0, 7).reverse(),
          this.$store.state.tasksPerDate.slice(0, 7).reverse()
        );
        this.$refs.pie.render(
          this.$store.state.days.slice(0, 7).reverse(),
          this.$store.state.tasksPerDate.slice(0, 7).reverse()
        );
      });
    },
    thisWeek() {
      const lastDayData = this.$store.state.days[0].split("/");
      const lastDay = new Date(
        lastDayData[0],
        lastDayData[1] - 1,
        lastDayData[2]
      );

      lastDay.setDate(lastDay.getDate() - lastDay.getDay());
      let startDay = lastDay;
      let thisWeek = [];
      for (let i = 0; i < 7; i++) {
        let addDate = new Date(
          startDay.getFullYear(),
          startDay.getMonth(),
          startDay.getDate() + i
        );
        let month = addDate.getMonth() + 1;
        month < 10 ? (month = "0" + month) : month;
        let date = addDate.getDate();
        date < 10 ? (date = "0" + date) : date;
        addDate = addDate.getFullYear() + "/" + +month + "/" + date;
        thisWeek.push(addDate);
      }

      let tasksPerDate = [];
      for (let i = 0; i < thisWeek.length; i++) {
        this.$store.state.tasksInDay = [];

        for (let j = 0; j < this.$store.state.tasks.length; j++) {
          let timeData = this.$store.state.tasks[j].start_time.split("-");
          let timeDataDay = timeData[2].split("T")[0];
          let timeDataYear = timeData[0];
          let timeDataMonth = timeData[1];

          if (
            timeDataYear + "/" + timeDataMonth + "/" + timeDataDay ==
              thisWeek[i] &&
            this.$store.state.tasks[j].status == false
          ) {
            this.$store.state.tasksInDay.push(this.$store.state.tasks[j]);
            continue;
          }
        }
        tasksPerDate.push(this.$store.state.tasksInDay);
      }

      this.$refs.graph.render(thisWeek, tasksPerDate);
      this.$refs.pie.render(thisWeek, tasksPerDate);
    },
    today() {
      let today = new Date();
      let day = [];
      let month = today.getMonth() + 1;
      month < 10 ? (month = "0" + month) : month;
      let date = today.getDate();
      date < 10 ? (date = "0" + date) : date;
      today = today.getFullYear() + "/" + month + "/" + date;
      day.push(today);

      let tasksPerDate = [];
      this.$store.state.tasksInDay = [];
      for (let j = 0; j < this.$store.state.tasks.length; j++) {
        let timeData = this.$store.state.tasks[j].start_time.split("-");
        let timeDataDay = timeData[2].split("T")[0];
        let timeDataYear = timeData[0];
        let timeDataMonth = timeData[1];

        if (
          timeDataYear + "/" + timeDataMonth + "/" + timeDataDay == day[0] &&
          this.$store.state.tasks[j].status == false
        ) {
          this.$store.state.tasksInDay.push(this.$store.state.tasks[j]);
          continue;
        }
      }
      tasksPerDate.push(this.$store.state.tasksInDay);
      this.$refs.graph.render(day, tasksPerDate);
      this.$refs.pie.render(day, tasksPerDate);
    },
    yesterday() {
      let today = new Date();
      let day = [];
      today.setDate(today.getDate() - 1);
      let month = today.getMonth() + 1;
      month < 10 ? (month = "0" + month) : month;
      let date = today.getDate();
      date < 10 ? (date = "0" + date) : date;
      today = today.getFullYear() + "/" + month + "/" + date;
      day.push(today);

      let tasksPerDate = [];
      this.$store.state.tasksInDay = [];
      for (let j = 0; j < this.$store.state.tasks.length; j++) {
        let timeData = this.$store.state.tasks[j].start_time.split("-");
        let timeDataDay = timeData[2].split("T")[0];
        let timeDataYear = timeData[0];
        let timeDataMonth = timeData[1];

        if (
          timeDataYear + "/" + timeDataMonth + "/" + timeDataDay == day[0] &&
          this.$store.state.tasks[j].status == false
        ) {
          this.$store.state.tasksInDay.push(this.$store.state.tasks[j]);
          continue;
        }
      }
      tasksPerDate.push(this.$store.state.tasksInDay);
      this.$refs.graph.render(day, tasksPerDate);
      this.$refs.pie.render(day, tasksPerDate);
    },
    closeCategoryModal() {
      this.$store.state.categoryEdit = false;
    },
  },
};
</script>

<style scoped>
.pie div {
  text-align: center;
}
</style>
