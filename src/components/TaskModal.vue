<template>
  <div>
    <v-card class="modal__inner">
      <div class="modal__close" @click="$emit('close')">×</div>
      <h4 class="mb-2">Details</h4>
      <v-text-field
        type="text"
        :value="taskTitle"
        @change="(value) => (taskTitle = value)"
        label="Task"
      ></v-text-field>
      <v-select
        :items="categoriesItem"
        item-text="name"
        item-value="id"
        label="Category"
        v-model.lazy="select_id"
      ></v-select>
      <h4 class="mb-2">Durations</h4>
      <div class="d-flex">
        <v-text-field
          type="text"
          label="duration"
          outlined
          class="duration-input"
          :value="Duration"
          @change="(value) => (Duration = value)"
        ></v-text-field>
        <v-text-field
          type="text"
          label="start"
          class="time-input"
          :value="StartTime"
          @change="(value) => (StartTime = value)"
        ></v-text-field>
        <v-icon> mdi-arrow-right-thin </v-icon>
        <v-text-field
          type="text"
          v-model.lazy="EndTime"
          label="end"
          class="time-input"
          :value="EndTime"
          @change="(value) => (EndTime = value)"
        ></v-text-field>
      </div>
      <div class="date-div">
        <v-text-field
          type="date"
          class="date-div__date-input"
          label="date"
          :value="date"
          @change="(value) => (date = value)"
          dense
        ></v-text-field>
      </div>
      <v-btn class="delete-btn" color="error" block @click="deleteTask(taskID)"
        >Delete
        <v-icon class="ml-2">mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-card>
    <div class="modal__background" @click="$emit('close')"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {};
  },
  computed: {
    taskID() {
      return this.$store.state.editTask.id;
    },
    categoriesItem() {
      return this.$store.state.editTaskCategory.categories;
    },
    Duration: {
      get: function () {
        let hour = Math.floor(this.$store.state.editTask.subtime / 60 / 60);
        let minute = Math.floor((this.$store.state.editTask.subtime / 60) % 60);
        minute < 10 ? (minute = "0" + minute) : minute;
        let second = Math.floor(this.$store.state.editTask.subtime % 60);
        second < 10 ? (second = "0" + second) : second;
        return hour + ":" + minute + ":" + second;
      },
      set: function (value) {
        let hour = value.toString().split(":")[0];
        let minute = value.toString().split(":")[1];
        let second = value.toString().split(":")[2];

        this.$emit(
          "updateTaskDuration",
          this.$store.state.editTask.id,
          hour,
          minute,
          second
        );
      },
    },
    StartTime: {
      get: function () {
        if (this.$store.state.editTask.start_time) {
          let timeDate = this.$store.state.editTask.start_time.split("-");
          let timeDateAfterT = timeDate[2].split("T");
          let dateTime = timeDateAfterT[1].split(":");
          let dateTImeHour = dateTime[0];
          let dateTImeMinute = dateTime[1];
          return dateTImeHour + ":" + dateTImeMinute;
        }
        return "";
      },
      set: function (value) {
        let hour = value.toString().split(":")[0];
        let minute = value.toString().split(":")[1];

        this.$emit(
          "updateTaskStartTime",
          this.$store.state.editTask.id,
          hour,
          minute
        );
      },
    },
    EndTime: {
      get: function () {
        if (this.$store.state.editTask.end_time) {
          let timeDate = this.$store.state.editTask.end_time.split("-");
          let timeDateAfterT = timeDate[2].split("T");
          let dateTime = timeDateAfterT[1].split(":");
          let dateTImeHour = dateTime[0];
          let dateTImeMinute = dateTime[1];
          return dateTImeHour + ":" + dateTImeMinute;
        }
        return "";
      },
      set: function (value) {
        let hour = value.toString().split(":")[0];
        let minute = value.toString().split(":")[1];

        this.$emit(
          "updateTaskEndTime",
          this.$store.state.editTask.id,
          hour,
          minute
        );
      },
    },
    taskTitle: {
      get: function () {
        const title = this.$store.state.editTask.title;
        return title;
      },
      set: function (value) {
        this.$emit("updateTaskTitle", value, this.$store.state.editTask.id);
      },
    },
    date: {
      get() {
        if (this.$store.state.editTask.start_time) {
          let timeDate = this.$store.state.editTask.start_time
            .toString()
            .split("-");
          let year = timeDate[0];
          let month = timeDate[1];
          let day = timeDate[2].split("T")[0];
          let date = year + "-" + month + "-" + day;
          return date;
        }
        return "";
      },
      set(value) {
        this.$emit("updateTaskFromDate", value, this.$store.state.editTask.id);
      },
    },
    categories() {
      let categoryName = [];
      for (
        let i = 0;
        i < this.$store.state.editTaskCategory.categories.length;
        i++
      ) {
        categoryName.push(
          this.$store.state.editTaskCategory.categories[i].name
        );
      }
      return categoryName;
    },
    select_id: {
      get() {
        return this.$store.state.editTaskCategory.id;
      },
      set(value) {
        console.log(value);
        this.$emit("updateCategoryName", value, this.$store.state.editTask.id);
      },
    },
  },
  methods: {
    deleteTask(taskId) {
      const taskData = new URLSearchParams();
      taskData.append("taskId", taskId);

      axios.post("http://localhost:8000/deleteTask", taskData).then(() => {
        this.$emit("close");
        this.$store.dispatch("getTasks");
      });
      this.$store.state.editTask = [];
      this.$store.state.editTaskCategory = [];
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

/* Duration inputに関するCSS */
.time-input {
  width: 25%;
  margin: auto 5px;
}
.duration-input {
  width: 22%;
  min-width: 85px;
  margin: 13px 5px auto 0px;
}
.date-div {
  position: relative;
  height: 45px;
}
.date-div__date-input {
  position: absolute;
  left: 50%;
  top: 40%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 60%;
}
.v-text-field.date-input {
  margin: 0;
  padding: 0;
}
.categories-list {
  cursor: pointer;
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
