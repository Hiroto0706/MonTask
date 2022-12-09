<template>
  <v-container>
    <v-card
      color="white"
      v-for="(arrayTasks, arrayTasksIndex) in this.$store.state.arrayTasks"
      :key="arrayTasksIndex"
      class="text--primary pa-3 mb-6"
    >
      <div class="d-flex justify-space-between">
        <h3 class="px-2 pt-2">{{ arrayTasks.date }}</h3>
        <p class="px-2 pt-2">{{ sumTime(arrayTasks.Tasks) }}</p>
      </div>

      <div
        class="my-3 task justify-space-between"
        v-for="(arrayTask, arrayTaskIndex) in arrayTasks.Tasks"
        :key="arrayTaskIndex"
      >
        <!-- 要素が一つしかない時 -->
        <v-card v-if="arrayTask.Tasks.length == 1">
          <div
            class="my-3 task d-flex justify-space-between"
            @click="ShowContent(arrayTask.Tasks[0])"
          >
            <div class="task_category pl-4 py-1">
              <span class="task">{{ arrayTask.title }}</span
              ><br />
              <div class="d-flex category">
                <v-icon x-small :color="categoryColor(arrayTask.Tasks[0])"
                  >mdi-circle</v-icon
                >
                <span
                  class="pl-1 category__text"
                  :class="{
                    'red--text': categoryColor(arrayTask.Tasks[0]) == 'red',
                    'pink--text': categoryColor(arrayTask.Tasks[0]) == 'pink',
                    'purple--text':
                      categoryColor(arrayTask.Tasks[0]) == 'purple',
                    'indigo--text':
                      categoryColor(arrayTask.Tasks[0]) == 'indigo',
                    'blue--text': categoryColor(arrayTask.Tasks[0]) == 'blue',
                    'cyan--text': categoryColor(arrayTask.Tasks[0]) == 'cyan',
                    'teal--text': categoryColor(arrayTask.Tasks[0]) == 'teal',
                    'green--text': categoryColor(arrayTask.Tasks[0]) == 'green',
                    'lime--text': categoryColor(arrayTask.Tasks[0]) == 'lime',
                    'orange--text':
                      categoryColor(arrayTask.Tasks[0]) == 'orange',
                    'brown--text': categoryColor(arrayTask.Tasks[0]) == 'brown',
                    'black--text': categoryColor(arrayTask.Tasks[0]) == 'black',
                  }"
                  >{{ arrayTask.category }}</span
                >
              </div>
            </div>
            <v-card-text class="text-right">{{
              subTime(arrayTask.sum)
            }}</v-card-text>
          </div>
        </v-card>

        <!-- 要素が複数ある時 -->
        <div v-else class="mb-3">
          <v-card>
            <div class="my-1 task d-flex justify-space-between">
              <div
                class="ma-3 py-1 px-3 list-sum"
                :class="{ open: arrayTask.show }"
                @click="showList(arrayTask)"
              >
                {{ arrayTask.Tasks.length }}
              </div>
              <div class="task_category py-1" @click="showList(arrayTask)">
                <span class="task">{{ arrayTask.title }}</span
                ><br />
                <div class="d-flex category">
                  <v-icon x-small :color="categoryColor(arrayTask.Tasks[0])"
                    >mdi-circle</v-icon
                  >
                  <span
                    class="pl-1 category__text"
                    :class="{
                      'red--text': categoryColor(arrayTask.Tasks[0]) == 'red',
                      'pink--text': categoryColor(arrayTask.Tasks[0]) == 'pink',
                      'purple--text':
                        categoryColor(arrayTask.Tasks[0]) == 'purple',
                      'indigo--text':
                        categoryColor(arrayTask.Tasks[0]) == 'indigo',
                      'blue--text': categoryColor(arrayTask.Tasks[0]) == 'blue',
                      'cyan--text': categoryColor(arrayTask.Tasks[0]) == 'cyan',
                      'teal--text': categoryColor(arrayTask.Tasks[0]) == 'teal',
                      'green--text':
                        categoryColor(arrayTask.Tasks[0]) == 'green',
                      'lime--text': categoryColor(arrayTask.Tasks[0]) == 'lime',
                      'orange--text':
                        categoryColor(arrayTask.Tasks[0]) == 'orange',
                      'brown--text':
                        categoryColor(arrayTask.Tasks[0]) == 'brown',
                      'black--text':
                        categoryColor(arrayTask.Tasks[0]) == 'black',
                    }"
                    >{{ arrayTask.category }}</span
                  >
                </div>
              </div>
              <v-card-text class="text-right" @click="showList(arrayTask)">{{
                subTime(arrayTask.sum)
              }}</v-card-text>
            </div>
          </v-card>
          <!-- 親タスクの子タスクを表示するためのコード -->
          <div v-show="isShow(arrayTask)">
            <v-card
              v-for="(task, childTaskIndex) in arrayTask.Tasks"
              :key="childTaskIndex"
              elevation="0"
            >
              <div
                class="my-1 task d-flex justify-space-between"
                @click="ShowContent(task)"
              >
                <div class="task_category pl-4 py-1">
                  <span class="task">{{ task.title }}</span
                  ><br />
                  <div class="d-flex category">
                    <v-icon x-small :color="categoryColor(task)"
                      >mdi-circle</v-icon
                    >
                    <span
                      class="pl-1 category__text"
                      :class="{
                        'red--text': categoryColor(task) == 'red',
                        'pink--text': categoryColor(task) == 'pink',
                        'purple--text': categoryColor(task) == 'purple',
                        'indigo--text': categoryColor(task) == 'indigo',
                        'blue--text': categoryColor(task) == 'blue',
                        'cyan--text': categoryColor(task) == 'cyan',
                        'teal--text': categoryColor(task) == 'teal',
                        'green--text': categoryColor(task) == 'green',
                        'lime--text': categoryColor(task) == 'lime',
                        'orange--text': categoryColor(task) == 'orange',
                        'brown--text': categoryColor(task) == 'brown',
                        'black--text': categoryColor(task) == 'black',
                      }"
                      >{{ task.Category.name }}</span
                    >
                  </div>
                </div>
                <v-card-text class="text-right">{{
                  subTime(task.subtime)
                }}</v-card-text>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-card>

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
    <CategoryModal
      v-show="categoryModal"
      @closeCategory="closeCategoryModal"
    ></CategoryModal>
    <CreateCategoryModal v-show="createCategoryModal"></CreateCategoryModal>
  </v-container>
</template>

<script>
const TaskModal = () => import("./TaskModal.vue");
const CategoryModal = () => import("@/components/CategoryModal.vue");
const CreateCategoryModal = () =>
  import("@/components/CreateCategoryModal.vue");
import axios from "axios";

export default {
  data() {
    return {
      categoryData: [],
    };
  },
  components: {
    TaskModal,
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
    taskModal() {
      return this.$store.state.taskEdit;
    },
    day() {
      return (index) => {
        const today = new Date();
        let month = today.getMonth() + 1;
        month < 10 ? (month = "0" + month) : month;
        let date = today.getDate();
        date < 10 ? (date = "0" + date) : date;
        today.setDate(today.getDate() - 1);
        const yesterday = today;
        let monthY = yesterday.getMonth() + 1;
        monthY < 10 ? (monthY = "0" + monthY.getMonth()) : monthY;
        let dateY = yesterday.getDate();
        dateY < 10 ? (dateY = "0" + dateY) : dateY;

        if (
          today.getFullYear() + "/" + month + "/" + date ==
          this.$store.state.days[index]
        ) {
          return "Today";
        } else if (
          yesterday.getFullYear() + "/" + monthY + "/" + dateY ==
          this.$store.state.days[index]
        ) {
          return "Yesterday";
        }
        return this.$store.state.days[index];
      };
    },
    sumTime() {
      return (tasks) => {
        let sum = 0;
        for (let i = 0; i < tasks.length; i++) {
          sum += tasks[i].sum;
        }
        let hour = 0;
        let minute = 0;
        hour = Math.floor(sum / 60 / 60);
        minute = Math.floor((sum / 60) % 60);
        minute < 10 ? (minute = "0" + minute) : minute;
        return hour + " h " + minute + " min";
      };
    },
    categoryColor() {
      return (task) => {
        if (task.Category.name === "") {
          return "transparent";
        }

        return this.$store.state.color[task.Category.color_id].name;
      };
    },
    subTime() {
      return function (subtime) {
        var second = Math.floor(subtime % 60);
        second < 10 ? (second = "0" + second) : second;
        var minute = Math.floor((subtime / 60) % 60);
        minute < 10 ? (minute = "0" + minute) : minute;
        var hour = Math.floor(subtime / 60 / 60);
        return hour + ":" + minute + ":" + second;
      };
    },
    isShow() {
      return function (task) {
        return task.show;
      };
    },
  },
  methods: {
    ShowContent(task) {
      this.$store.state.editTask = task;
      this.$store.state.editTaskCategory = task.Category;
      this.$store.state.taskEdit = true;
    },
    closeModal() {
      this.$store.state.taskEdit = false;
    },
    closeCategoryModal() {
      this.$store.state.categoryEdit = false;
    },
    showList(task) {
      task.show = !task.show;
      //一致するなら開いているタスクリストに追加する
      if (task.show == true) {
        this.$store.state.openingTasks.push(task);
      }
      //一致しなければリストから削除する
      else {
        for (let i = 0; i < this.$store.state.openingTasks.length; i++) {
          if (
            this.$store.state.openingTasks[i].title == task.title &&
            this.$store.state.openingTasks[i].category == task.category &&
            this.$store.state.openingTasks[i].date == task.date
          ) {
            this.$store.state.openingTasks.splice(i, 1);
          }
        }
      }
    },
    updateTask(value, id) {
      const taskData = new URLSearchParams();
      taskData.append("taskTitle", value);
      taskData.append("id", id);
      axios.post("http://localhost:8000/updateTask", taskData).then(() => {
        this.$store.dispatch("getTasks");
      });
    },
    updateTaskCategory(value, id) {
      const categoryData = new URLSearchParams();
      categoryData.append("category_id", value);
      categoryData.append("id", id);
      axios
        .post("http://localhost:8000/updateTaskCategory", categoryData)
        .then(() => {
          this.$store.dispatch("getTasks");
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
          this.$store.dispatch("getTasks");
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
          this.$store.dispatch("getTasks");
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
          this.$store.dispatch("getTasks");
        });
    },
    async updateTaskFromDate(value, id) {
      const timeDate = new URLSearchParams();
      timeDate.append("date", value);
      timeDate.append("id", id);
      await axios
        .post("http://localhost:8000/updateTaskFromDate", timeDate)
        .then(() => {
          this.$store.dispatch("getTasks");
        });
    },
  },
};
</script>

<style scoped>
.v-card {
  background-color: #f8f8f8;
  transition: ease 0.2s;
}
.list-sum {
  border: solid 1px rgb(180, 180, 180);
  border-radius: 5px;
}
.v-card:hover {
  background-color: #e2e2e2;
}
.open {
  color: #4caf50;
  background-color: rgb(225, 237, 225);
}
.v-card p {
  vertical-align: middle;
}

.task:hover {
  cursor: pointer;
}

.task_category {
  width: 80%;
}
.task_category .task {
  font-size: 0.85rem;
  font-weight: bold;
}
.task_category .category {
  font-size: 0.7rem;
  font-weight: bold;
}
</style>
