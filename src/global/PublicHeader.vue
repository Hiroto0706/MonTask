<template>
  <v-app-bar app extension-height="90">
    <v-app-bar-nav-icon @click="drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>
      <router-link to="/" class="title font-weight-bold text-h5"
        >MonTask</router-link
      >
    </v-toolbar-title>

    <template v-slot:extension>
      <div class="d-flex align-baseline input-content pl-2">
        <div class="input-content__task flex-column">
          <v-text-field
            placeholder="Task"
            type="text"
            rounded
            dense
            outlined
            hide-details="auto"
            class="input-content__task__main mb-2"
            v-model="runTaskName"
            color="black"
            @focus="openTask"
          />
          <v-text-field
            placeholder="Category"
            type="text"
            rounded
            dense
            class="input-content__task__category mb-2"
            :class="{
              'red--text': runTaskColorName == 'red',
              'pink--text': runTaskColorName == 'pink',
              'purple--text': runTaskColorName == 'purple',
              'indigo--text': runTaskColorName == 'indigo',
              'blue--text': runTaskColorName == 'blue',
              'cyan--text': runTaskColorName == 'cyan',
              'teal--text': runTaskColorName == 'teal',
              'green--text': runTaskColorName == 'green',
              'lime--text': runTaskColorName == 'lime',
              'orange--text': runTaskColorName == 'orange',
              'brown--text': runTaskColorName == 'brown',
              'black--text': runTaskColorName == 'black',
            }"
            v-model="runTaskCategoryName"
            :background-color="runTaskColorBackGround"
            readonly
            hide-details="auto"
            @focus="openCategory"
          >
            <template v-slot:prepend-inner>
              <v-icon small class="circle" :color="runTaskColorName">
                mdi-circle
              </v-icon>
            </template>
          </v-text-field>
        </div>
        <v-text-field
          type="text"
          rounded
          dense
          class="input-content__time"
          v-model="time"
          v-show="!run"
          readonly
        />
        <v-text-field
          type="text"
          rounded
          dense
          class="input-content__time"
          v-model="time"
          v-show="run"
          readonly
        />
        <v-btn
          class="mx-2 input-content__btn"
          fab
          small
          color="error"
          depressed
          v-show="!run"
          @click="startTask"
        >
          <v-icon dark> mdi-play </v-icon>
        </v-btn>
        <v-btn
          class="mx-2 input-content__btn"
          fab
          small
          depressed
          color="success"
          v-show="run"
          @click="stopTask"
        >
          <v-icon dark> mdi-stop </v-icon>
        </v-btn>
      </div>
    </template>

    <CategoryList v-show="this.$store.state.categoryList"></CategoryList>
    <TaskList v-show="this.$store.state.taskList"></TaskList>
  </v-app-bar>
</template>

<script>
import axios from "axios";
const CategoryList = () => import("@/global/CategoryList.vue");
const TaskList = () => import("@/global/TaskList.vue");

export default {
  components: {
    CategoryList,
    TaskList,
  },
  data() {
    return {
      time: "0:00:00",
    };
  },
  mounted: function () {
    this.$store.dispatch("getTasks");

    setInterval(this.calculateTime, 1000);
  },
  computed: {
    run() {
      return this.$store.state.runTask.status;
    },
    runTaskName: {
      get() {
        return this.$store.state.runTaskName;
      },
      set(value) {
        this.$store.dispatch("getRunTaskName", value);
      },
    },
    runTaskCategoryName: {
      get() {
        return this.$store.state.runTaskCategoryName;
      },
      set(value) {
        this.$store.dispatch("getRunTaskCategoryName", value);
      },
    },
    runTaskColorID: {
      get() {
        return this.$store.state.runTaskColorID;
      },
    },
    runTaskColorName: {
      get() {
        return this.$store.state.runTaskColorName;
      },
    },
    runTaskColorBackGround: {
      get() {
        return this.$store.state.runTaskColorBackGround;
      },
    },
  },
  methods: {
    drawer() {
      this.$store.state.drawer = !this.$store.state.drawer;
    },
    startTask: async function () {
      const taskData = new URLSearchParams();
      taskData.append("title", this.runTaskName);
      taskData.append("name", this.runTaskCategoryName);
      taskData.append("userId", localStorage.getItem("userId"));
      const task = await axios.post("http://localhost:8000/post", taskData);

      this.$store.dispatch("getRunTaskName", task.data.title);
      this.$store.dispatch("getRunTaskCategoryName", task.data.Category.name);

      this.$store.dispatch("getTasks").then(() => {
        this.$store
          .dispatch("setData", this.$store.state.date, this.$store.state.date)
          .then((response) => {
            this.$store.state.events = response;
          });
      });

      this.$store.state.run = true;
      this.$store.state.taskList = false;
      this.$store.state.categoryList = false;
    },
    stopTask: async function () {
      const taskData = new URLSearchParams();
      taskData.append("title", this.runTaskName);
      taskData.append("name", this.runTaskCategoryName);
      taskData.append("userId", localStorage.getItem("userId"));
      taskData.append("time", this.time);

      await axios.post("http://localhost:8000/stopTask", taskData).then(() => {
        this.$store.dispatch("getRunTaskName", "");
        this.$store.dispatch("getRunTaskCategoryName", "");
        this.$store.dispatch("getRunTaskColorID", 12);
        this.$store.dispatch(
          "getRunTaskColorName",
          this.$store.state.color[12].name
        );
        this.$store.dispatch(
          "getRunTaskColorBackGround",
          this.$store.state.color[12].back_ground
        );
      });

      this.$store.dispatch("getTasks").then(() => {
        this.$store
          .dispatch("setData", this.$store.state.date, this.$store.state.date)
          .then((response) => {
            this.$store.state.events = response;
          });
      });

      this.time = "0:00:00";
      this.$store.state.categoryList = false;
      this.$store.state.taskList = false;
      this.$store.state.run = false;
    },
    calculateTime() {
      if (this.$store.state.run == false) {
        this.time = "0:00:00";
        return;
      }

      const startTime = new Date(this.$store.state.runTask.start_time);

      let now = new Date();

      let diff = now.getTime() - startTime.getTime();
      let diffSecond = Math.floor((Math.abs(diff) / 1000) % 60);
      diffSecond < 10 ? (diffSecond = "0" + diffSecond) : diffSecond;
      let diffMinute = Math.floor((Math.abs(diff) / (60 * 1000)) % 60);
      diffMinute < 10 ? (diffMinute = "0" + diffMinute) : diffMinute;
      let diffHour = Math.floor(Math.abs(diff) / (60 * 60 * 1000));

      this.time = diffHour + ":" + diffMinute + ":" + diffSecond;
    },
    openTask() {
      this.$store.state.categoryList = false;
      this.$store.state.taskList = true;
    },
    openCategory() {
      this.$store.state.taskList = false;
      this.$store.state.categoryList = true;
    },
    close() {
      this.$store.state.categoryList = false;
      this.$store.state.taskList = false;
      this.$store.state.categoryEdit = false;
    },
  },
};
</script>

<style scoped>
.title {
  text-decoration: none;
  color: #000000de;
}

.circle {
  position: absolute;
  left: 8px;
  top: 5px;
}

.red--text >>> input {
  color: #f44336;
  font-weight: bold;
}
.pink--text >>> input {
  color: #e91e63;
  font-weight: bold;
}
.purple--text >>> input {
  color: #9c27b0;
  font-weight: bold;
}
.indigo--text >>> input {
  color: #3f51b5;
  font-weight: bold;
}
.blue--text >>> input {
  color: #2196f3;
  font-weight: bold;
}
.cyan--text >>> input {
  color: #00bcd4;
  font-weight: bold;
}
.teal--text >>> input {
  color: #009688;
  font-weight: bold;
}
.green--text >>> input {
  color: #4caf50;
  font-weight: bold;
}
.lime--text >>> input {
  color: #cddc39;
  font-weight: bold;
}
.orange--text >>> input {
  color: #ff9800;
  font-weight: bold;
}
.brown--text >>> input {
  color: #795548;
  font-weight: bold;
}
.black--text >>> input {
  color: #000000;
  font-weight: bold;
}
</style>
