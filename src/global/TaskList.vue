<template>
  <div>
    <div class="modal__background" @click="close"></div>
    <v-card class="task-list">
      <div class="modal__close" @click="close">×</div>
      <h3 class="mb-2">Tasks</h3>
      <hr />
      <div class="scroll">
        <v-list
          v-for="(task, index) in this.$store.state.tasksUnique"
          :key="index"
          class="task"
        >
          <div class="mb-1" @click="clickTask(task)" v-show="taskShow(task)">
            <span class="mx-2 font-weight-bold">{{ task.title }}</span>
            <v-icon x-small class="pa-2" :color="colorName(task)">
              mdi-circle
            </v-icon>
            <span
              class="font-weight-bold"
              :class="{
                'red--text': colorName(task) == 'red',
                'pink--text': colorName(task) == 'pink',
                'purple--text': colorName(task) == 'purple',
                'indigo--text': colorName(task) == 'indigo',
                'blue--text': colorName(task) == 'blue',
                'cyan--text': colorName(task) == 'cyan',
                'teal--text': colorName(task) == 'teal',
                'green--text': colorName(task) == 'green',
                'lime--text': colorName(task) == 'lime',
                'orange--text': colorName(task) == 'orange',
                'brown--text': colorName(task) == 'brown',
                'black--text': colorName(task) == 'black',
              }"
              >{{ task.Category.name }}</span
            >
          </div>
        </v-list>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    colorName() {
      return function (task) {
        let colorID = task.Category.color_id;
        return this.$store.state.color[colorID].name;
      };
    },
    taskShow() {
      return function (task) {
        if (
          task.title.indexOf(this.$store.state.runTaskName) != -1 ||
          this.$store.state.runTaskName == ""
        ) {
          return true;
        } else {
          return false;
        }
      };
    },
  },
  methods: {
    clickTask(task) {
      this.$store.dispatch("getRunTaskName", task.title);
      this.$store.dispatch("getRunTaskCategoryName", task.Category.name);
      this.$store.dispatch("getRunTaskColorID", task.Category.color_id);
      this.$store.dispatch(
        "getRunTaskColorName",
        this.$store.state.color[task.Category.color_id].name
      );
      this.$store.dispatch(
        "getRunTaskColorBackGround",
        this.$store.state.color[task.Category.color_id].back_ground
      );
      this.close();
    },
    close() {
      this.$store.state.taskList = false;
    },
  },
};
</script>

<style scoped>
.task-list {
  padding: 10px;
  background-color: white;
  position: fixed;
  top: 150px;
  left: 30px;
  width: 50%;
  min-width: 330px;
  max-height: 600px;
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
.scroll {
  max-height: 480px;
  overflow: scroll;
}
.task {
  cursor: pointer;
}
.task:hover {
  background-color: #efefef;
}
.task span {
  padding-top: 3px;
  width: 85%;
}
.task .icon {
  width: 30px;
}
.v-list {
  padding: 0px;
}
</style>
