<template>
  <v-container>
    <v-card color="white" class="pa-3 mb-5">
      <div class="d-flex justify-space-between date pa-3">
        <v-btn icon @click="prev">
          <v-icon large>mdi-chevron-left</v-icon>
        </v-btn>
        <v-card-title class="pa-0"> {{ date }} , {{ day }} </v-card-title>
        <v-btn icon @click="next">
          <v-icon large>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-row>
        <v-col>
          <v-sheet>
            <v-calendar
              ref="calendar"
              v-model="date"
              type="day"
              :events="this.$store.state.events"
              :event-color="getEventColor"
              :event-overlap-threshold="30"
              interval-height="200"
              @click:event="ShowContent"
            >
              <template v-slot:event="{ event }">
                <div class="pl-1 black--text d-flex">
                  <span class="font-weight-bold">{{ event.task.title }}</span>
                  <v-icon :color="event.color" x-small class="ml-2"
                    >mdi-circle</v-icon
                  >
                  <span class="mr-2">{{ event.task.Category.name }}</span>
                  <span>{{ taskDiff(event) }}</span>
                </div>
              </template>
              <template v-slot:day-body="{ date, week }">
                <div
                  class="v-current-time"
                  :class="{ first: date === week[0].date }"
                  :style="{ top: nowY }"
                ></div>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>

    <CategoryModal
      v-show="categoryModal"
      @closeCategory="closeCategoryModal"
    ></CategoryModal>
    <CreateCategoryModal v-show="createCategoryModal"></CreateCategoryModal>
    <TaskModal
      v-show="taskModal"
      @close="closeModal"
      @updateTaskTitle="updateTask"
      @updateCategoryName="updateTaskCategory"
      @updateTaskDuration="updateTaskDuration"
      @updateTaskStartTime="updateTaskFromStart"
      @updateTaskEndTime="updateTaskFromEnd"
      @updateTaskFromDate="updateTaskFromDate"
    ></TaskModal>
  </v-container>
</template>

<script>
import axios from "axios";
const CategoryModal = () => import("@/components/CategoryModal.vue");
const CreateCategoryModal = () =>
  import("@/components/CreateCategoryModal.vue");
const TaskModal = () => import("./TaskModal.vue");

export default {
  data: () => ({
    ready: false,
    events: [],
  }),
  components: {
    CategoryModal,
    CreateCategoryModal,
    TaskModal,
  },
  mounted() {
    this.$store.dispatch("getTasks").then(() => {
      //timelineに関するmounted
      this.ready = true;
      this.scrollToTime();
      this.updateTime();
      const day = new Date();
      this.$store.state.date =
        day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      this.$store.dispatch("setData", this.date).then((response) => {
        this.$store.state.events = response;
      });
    });

    setInterval(this.getTasks, 5000);
  },
  computed: {
    categoryModal() {
      return this.$store.state.categoryEdit;
    },
    createCategoryModal() {
      return this.$store.state.createCategory;
    },
    taskModal() {
      return this.$store.state.taskEdit;
    },
    //timeline機能に関するcomputed
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
    },
    date: {
      get() {
        return this.$store.state.date;
      },
      set(value) {
        let date = value.split("-");
        date[2] < 10 ? (date[2] = date[2].split("0")[1]) : date[2];
        this.$store.state.date = date[0] + "-" + date[1] + "-" + date[2];
      },
    },
    day() {
      let date = this.date.split("-");
      const day = new Date(date[0], date[1] - 1, date[2]);
      const week = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return week[day.getDay()];
    },
    taskDiff() {
      return function (event) {
        return (
          Math.floor(event.diff / 60 / 60 / 1000) +
          " h " +
          Math.floor((event.diff / 1000 / 60) % 60) +
          " min"
        );
      };
    },
  },
  methods: {
    ShowContent(task) {
      this.$store.state.editTask = task.event.task;
      this.$store.state.editTaskCategory = task.event.task.Category;
      this.$store.state.taskEdit = true;
    },
    closeCategoryModal() {
      this.$store.state.categoryEdit = false;
    },
    closeModal() {
      this.$store.state.taskEdit = false;
    },
    updateTask(value, id) {
      const taskData = new URLSearchParams();
      taskData.append("taskTitle", value);
      taskData.append("id", id);
      axios.post("http://localhost:8000/updateTask", taskData).then(() => {
        this.$store.dispatch("getTasks").then(() => {
          this.$store.dispatch("setData", this.date).then((response) => {
            this.$store.state.events = response;
          });
        });
      });
    },
    updateTaskCategory(value, id) {
      const categoryData = new URLSearchParams();
      categoryData.append("category_id", value);
      categoryData.append("id", id);
      this.events = [];
      axios
        .post("http://localhost:8000/updateTaskCategory", categoryData)
        .then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store.dispatch("setData", this.date).then((response) => {
              this.$store.state.events = response;
            });
          });
        });
    },
    async updateTaskDuration(id, hour, minute, second) {
      const timeDuration = new URLSearchParams();
      timeDuration.append("id", id);
      timeDuration.append("hour", hour);
      timeDuration.append("minute", minute);
      timeDuration.append("second", second);
      await axios
        .post("http://localhost:8000/updateTaskFromDuration", timeDuration)
        .then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store.dispatch("setData", this.date).then((response) => {
              this.$store.state.events = response;
            });
          });
        });
    },
    async updateTaskFromStart(id, hour, minute) {
      const timeDataStartTime = new URLSearchParams();
      timeDataStartTime.append("id", id);
      timeDataStartTime.append("hour", hour);
      timeDataStartTime.append("minute", minute);
      await axios
        .post("http://localhost:8000/updateTaskFromStart", timeDataStartTime)
        .then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store.dispatch("setData", this.date).then((response) => {
              this.$store.state.events = response;
            });
          });
        });
    },
    async updateTaskFromEnd(id, hour, minute) {
      const timeDataEndTime = new URLSearchParams();
      timeDataEndTime.append("id", id);
      timeDataEndTime.append("hour", hour);
      timeDataEndTime.append("minute", minute);
      await axios
        .post("http://localhost:8000/updateTaskFromEnd", timeDataEndTime)
        .then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store.dispatch("setData", this.date).then((response) => {
              this.$store.state.events = response;
            });
          });
        });
    },
    async updateTaskFromDate(value, id) {
      const timeDate = new URLSearchParams();
      timeDate.append("date", value);
      timeDate.append("id", id);
      await axios
        .post("http://localhost:8000/updateTaskFromDate", timeDate)
        .then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store.dispatch("setData", this.date).then((response) => {
              this.$store.state.events = response;
            });
          });
        });
    },
    //timelineに関する関数
    getCurrentTime() {
      return this.cal
        ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
        : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    prev() {
      let date = this.date.split("-");
      let newDate = new Date(date[0], date[1] - 1, +date[2] - 1);
      this.$store.state.date =
        newDate.getFullYear() +
        "-" +
        +(newDate.getMonth() + 1) +
        "-" +
        newDate.getDate();
      this.$store.dispatch("setData", this.date).then((response) => {
        this.$store.state.events = response;
      });

      let day = new Date();
      day =
        day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      if (day == this.date) {
        this.ready = true;
      } else {
        this.ready = false;
      }
    },
    next() {
      let date = this.date.split("-");
      let newDate = new Date(date[0], date[1] - 1, +date[2] + 1);
      this.$store.state.date =
        newDate.getFullYear() +
        "-" +
        +(newDate.getMonth() + 1) +
        "-" +
        newDate.getDate();
      this.$store.dispatch("setData", this.date).then((response) => {
        this.$store.state.events = response;
      });

      let day = new Date();
      day =
        day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
      if (day == this.date) {
        this.ready = true;
      } else {
        this.ready = false;
      }
    },
    getEventColor(event) {
      return event.background;
    },
    getTasks() {
      if (this.$store.state.graphPage) {
        const task = new URLSearchParams();
        task.append("id", this.$store.state.runTask.id);
        axios.post("http://localhost:8000/updateRunTask", task).then(() => {
          this.$store.dispatch("getTasks").then(() => {
            this.$store
              .dispatch("setData", this.$store.state.date)
              .then((response) => {
                this.$store.state.events = response;
              });
          });
        });
      }
    },
  },
};
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: red;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: red;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}

.date {
  width: 100%;
}
</style>
