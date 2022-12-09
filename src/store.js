import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios-auth";
import axiosRefresh from "./axios-refresh";
import axiosServer from "axios";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //モーダルの表示
    drawer: false,
    categoryEdit: false,
    taskEdit: false,
    categoryList: false,
    createCategory: false,
    taskList: false,

    //ログイン関係
    loginUserId: 0,
    idToken: null,
    registerError: null,
    loginError: null,

    //タスク、カテゴリー関係
    tasks: [],
    categories: [],
    run: null,
    runTaskStartTime: "",
    runTask: [],
    runCategory: [],
    runTaskCategory: [],

    //タスク編集のためのやつ
    editTask: [],
    editTaskCategory: [],
    editCategory: [],
    sumtime: 0,

    //ランタスクの入力に関するやつ
    runTaskName: "",
    runTaskCategoryName: "",
    runTaskColorID: 12,
    runTaskColorName: "",
    runTaskColorBackGround: "",
    first: true,

    //タスクを日付ごとに分ける機能に関するやつ
    days: [],
    tasksPerDate: [],
    tasksInDay: [],
    fixedTasks: [],
    arrayTasks: [],
    openingTasks: [],

    //タスクを被りなしで格納するためのやつ
    tasksUnique: [],

    //色関係
    color: [
      { id: 0, name: "red", back_ground: "red lighten-5" },
      { id: 1, name: "pink", back_ground: "pink lighten-5" },
      { id: 2, name: "purple", back_ground: "purple lighten-5" },
      { id: 3, name: "indigo", back_ground: "indigo lighten-5" },
      { id: 4, name: "blue", back_ground: "blue lighten-5" },
      { id: 5, name: "cyan", back_ground: "cyan lighten-5" },
      { id: 6, name: "teal", back_ground: "teal lighten-5" },
      { id: 7, name: "green", back_ground: "green lighten-5" },
      { id: 8, name: "lime", back_ground: "lime lighten-5" },
      { id: 9, name: "orange", back_ground: "orange lighten-5" },
      { id: 10, name: "brown", back_ground: "brown lighten-4" },
      { id: 11, name: "black", back_ground: "grey lighten-1" },
      { id: 12, name: "none", back_ground: "none" },
    ],

    //カテゴリーリスト関係
    listCategoryColor: [],
    createCategoryColor: "black",
    createCategoryColorID: 0,

    //グラフデータに関するやつ
    graphData: [],

    //タイムラインに関するやつ
    date: "",
    events: [],
    graphPage: false,
  },
  getters: {
    idToken: (state) => state.idToken,
    runTaskName: (state) => state.runTaskName,
    runTaskCategoryName: (state) => state.runTaskCategoryName,
    runTaskColorID: (state) => state.runTaskColorID,
    runTaskColorName: (state) => state.runTaskColorName,
    runTaskColorBackGround: (state) => state.runTaskColorBackGround,
    date: (state) => state.date,
  },
  mutations: {
    updateIdToken(state, idToken) {
      state.idToken = idToken;
    },
    setRunTaskName: function (state, runTaskName) {
      state.runTaskName = runTaskName;
    },
    setRunTaskCategoryName: function (state, runTaskCategoryName) {
      state.runTaskCategoryName = runTaskCategoryName;
    },
    setRunTaskColorID: function (state, runTaskColorID) {
      state.runTaskColorID = runTaskColorID;
    },
    setRunTaskColorName: function (state, runTaskColorName) {
      state.runTaskColorName = runTaskColorName;
    },
    setRunTaskColorBackGround: function (state, runTaskColorBackGround) {
      state.runTaskColorBackGround = runTaskColorBackGround;
    },
    setDate: function (state, date) {
      state.date = date;
    },
  },
  actions: {
    async autoLogin({ commit, dispatch }) {
      const idToken = localStorage.getItem("idToken");
      if (!idToken) return;
      const now = new Date();
      const expiryTimeMs = localStorage.getItem("expiryTimeMs");
      const isExpired = now.getTime() >= expiryTimeMs;
      const refreshToken = localStorage.getItem("refreshToken");
      if (isExpired) {
        await dispatch("refreshIdToken", refreshToken);
      } else {
        const expiresInMs = expiryTimeMs - now.getTime();
        setTimeout(() => {
          dispatch("refreshIdToken", refreshToken);
        }, expiresInMs);
        commit("updateIdToken", idToken);
      }

      if (localStorage.getItem("userId")) {
        this.state.getTasks;
      }
    },
    login: async function ({ dispatch }, authData) {
      await axios
        .post(
          "/accounts:signInWithPassword?key=AIzaSyDiSMyoS5rW9qf2JPrvhf4jGo9Sfga6Bpw",
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          }
        )
        .then((response) => {
          dispatch("setAuthData", {
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            refreshToken: response.data.refreshToken,
          });
          router.push("/");

          const idData = axiosServer.post("http://localhost:8000/login", {
            email: response.data.email,
          });
          this.state.loginUserId = idData;
          this.state.loginError = false;
        })
        .catch((error) => {
          this.state.loginError = true;
          return error;
        });
      return this.state.loginUserId;
    },
    async refreshIdToken({ dispatch }, refreshToken) {
      await axiosRefresh
        .post("/token?key=AIzaSyDiSMyoS5rW9qf2JPrvhf4jGo9Sfga6Bpw", {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        })
        .then((response) => {
          dispatch("setAuthData", {
            idToken: response.data.id_token,
            expiresIn: response.data.expires_in,
            refreshToken: response.data.refresh_token,
          });
        });
    },
    register: async function ({ dispatch }, authData) {
      await axios
        .post("/accounts:signUp?key=AIzaSyDiSMyoS5rW9qf2JPrvhf4jGo9Sfga6Bpw", {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true,
        })
        .then((response) => {
          dispatch("setAuthData", {
            idToken: response.data.idToken,
            expiresIn: response.data.expiresIn,
            refreshToken: response.data.refreshToken,
          });
          router.push("/");

          const idData = axiosServer.post("http://localhost:8000/signup", {
            email: response.data.email,
          });
          this.state.loginUserId = idData;
          this.state.registerError = false;
        })
        .catch((error) => {
          this.state.registerError = true;
          return error;
        });

      return this.state.loginUserId;
    },
    logout({ commit }) {
      commit("updateIdToken", null);
      localStorage.removeItem("idToken");
      localStorage.removeItem("expiryTimeMs");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      this.dispatch("getRunTaskName", "");
      this.dispatch("getRunTaskCategoryName", "");
      router.replace("/login");
    },
    setAuthData({ commit, dispatch }, authData) {
      const now = new Date();
      const expiryTimeMs = now.getTime() + authData.expiresIn * 1000;
      commit("updateIdToken", authData.idToken);
      localStorage.setItem("idToken", authData.idToken);
      localStorage.setItem("expiryTimeMs", expiryTimeMs);
      localStorage.setItem("refreshToken", authData.refreshToken);
      setTimeout(() => {
        dispatch("refreshIdToken", authData.refreshIdToken);
      }, authData.expiresIn * 1000);
    },

    //タスクを取得する処理
    getTasks: async function () {
      const userId = new URLSearchParams();
      userId.append("userId", localStorage.getItem("userId"));
      const axiosTasks = axios.post("http://localhost:8000/getTasks", userId);

      const task = await axiosTasks;
      this.state.tasks = task.data.tasks;

      this.state.runTask = task.data;
      this.state.run = task.data.status;
      this.state.runTaskCategory = task.data.categories;
      if (this.state.runTaskCategoryName == "") {
        this.state.runTaskColorID = 12;
        this.state.runTaskColorName =
          this.state.color[this.state.runTaskColorID].name;
        this.state.runTaskColorBackGround =
          this.state.color[this.state.runTaskColorID].back_ground;
      }
      if (!this.state.run) {
        this.dispatch("getRunTaskName", this.state.runTaskName);
        this.dispatch("getRunTaskCategoryName", this.state.runTaskCategoryName);
        this.dispatch("getRunTaskColorID", this.state.runTaskColorID);
        this.dispatch("getRunTaskColorName", this.state.runTaskColorName);
        this.dispatch(
          "getRunTaskColorBackGround",
          this.state.runTaskColorBackGround
        );
      } else {
        const colorID = this.state.runTaskColorID;
        const colorName = this.state.runTaskColorName;
        const colorBackground = this.state.runTaskColorBackGround;
        if (
          (this.state.color[task.data.Category.color_id].name != colorName &&
            colorName != "none") ||
          (task.data.title != this.state.runTaskName &&
            this.state.runTaskName != "") ||
          (task.data.Category.name != this.state.runTaskCategoryName &&
            this.state.runTaskCategoryName != "")
        ) {
          this.dispatch("getRunTaskName", this.state.runTaskName);
          this.dispatch("getRunTaskColorID", colorID);
          this.dispatch("getRunTaskColorName", colorName);
          this.dispatch("getRunTaskColorBackGround", colorBackground);
          this.dispatch(
            "getRunTaskCategoryName",
            this.state.runTaskCategoryName
          );
        } else {
          if (
            this.state.runTask.status &&
            this.state.runTaskName == "" &&
            !this.state.first
          ) {
            this.dispatch("getRunTaskName", this.state.runTaskName);
          } else {
            this.dispatch("getRunTaskName", task.data.title);
            this.dispatch("getRunTaskColorID", task.data.Category.color_id);
            this.dispatch(
              "getRunTaskColorName",
              this.state.color[task.data.Category.color_id].name
            );
            this.dispatch(
              "getRunTaskColorBackGround",
              this.state.color[task.data.Category.color_id].back_ground
            );
            this.dispatch("getRunTaskCategoryName", task.data.Category.name);
            this.state.first = false;
          }
        }
      }

      //タスクを日付ごとに分けるための処理
      this.state.days = [];
      if (this.state.tasks.length != 0) {
        for (let i = 0; i < this.state.tasks.length; i++) {
          let timeData = this.state.tasks[i].start_time.split("-");
          let timeDataDay = timeData[2].split("T")[0];
          let timeDataYear = timeData[0];
          let timeDataMonth = timeData[1];

          if (this.state.tasks[i].status == false) {
            this.state.days.push(
              timeDataYear + "/" + timeDataMonth + "/" + timeDataDay
            );
          }
        }
        this.state.days = Array.from(new Set(this.state.days));

        let index = 0;
        this.state.tasksPerDate = [];
        for (let i = 0; i < this.state.days.length; i++) {
          this.state.tasksInDay = [];

          for (let j = index; j < this.state.tasks.length; j++) {
            let timeData = this.state.tasks[j].start_time.split("-");
            let timeDataDay = timeData[2].split("T")[0];
            let timeDataYear = timeData[0];
            let timeDataMonth = timeData[1];

            if (
              timeDataYear + "/" + timeDataMonth + "/" + timeDataDay !==
                this.state.days[i] &&
              this.state.tasks[j].status == false
            ) {
              index = j;
              break;
            }
            if (this.state.tasks[j].status == false) {
              this.state.tasksInDay.push(this.state.tasks[j]);
            }
          }
          this.state.tasksPerDate.push(this.state.tasksInDay);
        }
        this.dispatch("putTogetherTask");
      }

      //タスクを被りなしで格納するための処理
      this.state.tasksUnique = [];
      for (let i = 0; i < this.state.tasks.length; i++) {
        if (this.state.tasksUnique.length == 0) {
          this.state.tasksUnique.push(this.state.tasks[i]);
        } else {
          let match = false;
          for (let j = 0; j < this.state.tasksUnique.length; j++) {
            if (
              this.state.tasks[i].title == this.state.tasksUnique[j].title &&
              this.state.tasks[i].Category.name ==
                this.state.tasksUnique[j].Category.name
            ) {
              match = true;
              break;
            }
          }
          if (!match) {
            this.state.tasksUnique.push(this.state.tasks[i]);
            continue;
          }
        }
        if (this.state.tasksUnique.length >= 18) {
          break;
        }
      }
    },
    updateTasksPerDate: async function () {
      this.dispatch("getTasks");
    },
    getRunTaskName: function ({ commit }, runTaskName) {
      commit("setRunTaskName", runTaskName);
    },
    getRunTaskCategoryName: function ({ commit }, runTaskCategoryName) {
      commit("setRunTaskCategoryName", runTaskCategoryName);
    },
    getRunTaskColorID: function ({ commit }, runTaskColorID) {
      commit("setRunTaskColorID", runTaskColorID);
    },
    getRunTaskColorName: function ({ commit }, runTaskColorName) {
      commit("setRunTaskColorName", runTaskColorName);
    },
    getRunTaskColorBackGround: function ({ commit }, runTaskColorBackGround) {
      commit("setRunTaskColorBackGround", runTaskColorBackGround);
    },
    //タイムラインのデータを取得するための処理
    setData: async function ({ commit }, date) {
      commit("setDate", date);
      let events = [];
      for (let i = 0; i < this.state.tasks.length; i++) {
        let taskDateStart = new Date(this.state.tasks[i].start_time);
        let taskDateEnd = new Date(this.state.tasks[i].end_time);
        const startDate =
          taskDateStart.getFullYear() +
          "-" +
          +(taskDateStart.getMonth() + 1) +
          "-" +
          taskDateStart.getDate();
        const endDate =
          taskDateEnd.getFullYear() +
          "-" +
          +(taskDateEnd.getMonth() + 1) +
          "-" +
          taskDateEnd.getDate();
        if (startDate == this.state.date || endDate == this.state.date) {
          const start =
            startDate +
            " " +
            taskDateStart.getHours() +
            ":" +
            taskDateStart.getMinutes();
          const end =
            endDate +
            " " +
            taskDateEnd.getHours() +
            ":" +
            taskDateEnd.getMinutes();
          const diff = taskDateEnd.getTime() - taskDateStart.getTime();
          const event = {
            name: this.state.tasks[i].title,
            category: this.state.tasks[i].Category.name,
            color: this.state.color[this.state.tasks[i].Category.color_id].name,
            background:
              this.state.color[this.state.tasks[i].Category.color_id]
                .back_ground,
            start: start,
            end: end,
            diff: diff,
            task: this.state.tasks[i],
          };
          events.push(event);
        }
      }
      return events;
    },
    //タスクをまとめるの日必要な処理
    putTogetherTask() {
      let arrayTasks = [];
      let fixedTasks = [];
      for (let i = 0; i < this.state.tasksPerDate.length; i++) {
        for (let j = 0; j < this.state.tasksPerDate[i].length; j++) {
          //1回目は必ずタスクを格納させる
          if (fixedTasks.length == 0) {
            const start = new Date(this.state.tasksPerDate[i][j].start_time);
            const date =
              start.getFullYear() +
              "/" +
              (start.getMonth() + 1) +
              "/" +
              start.getDate();
            const task = {
              title: this.state.tasksPerDate[i][j].title,
              category: this.state.tasksPerDate[i][j].Category.name,
              sum: this.state.tasksPerDate[i][j].subtime,
              date: date,
              show: false,
              Tasks: [],
            };
            task.Tasks.push(this.state.tasksPerDate[i][j]);
            fixedTasks.push(task);
            continue;
          }
          let match = false;
          for (let k = 0; k < fixedTasks.length; k++) {
            const start = new Date(this.state.tasksPerDate[i][j].start_time);
            const date =
              start.getFullYear() +
              "/" +
              (start.getMonth() + 1) +
              "/" +
              start.getDate();
            //全く同じタスクの時の処理
            if (
              fixedTasks[k].title == this.state.tasksPerDate[i][j].title &&
              fixedTasks[k].category ==
                this.state.tasksPerDate[i][j].Category.name &&
              date == fixedTasks[k].date
            ) {
              match = true;
              fixedTasks[k].sum += this.state.tasksPerDate[i][j].subtime;
              fixedTasks[k].Tasks.push(this.state.tasksPerDate[i][j]);
              break;
            }
          }
          //どれにも一致しなかったら新しいタスクを追加する
          if (match == false) {
            const start = new Date(this.state.tasksPerDate[i][j].start_time);
            const date =
              start.getFullYear() +
              "/" +
              (start.getMonth() + 1) +
              "/" +
              start.getDate();
            const task = {
              title: this.state.tasksPerDate[i][j].title,
              category: this.state.tasksPerDate[i][j].Category.name,
              sum: this.state.tasksPerDate[i][j].subtime,
              date: date,
              show: false,
              Tasks: [],
            };
            task.Tasks.push(this.state.tasksPerDate[i][j]);
            fixedTasks.push(task);
            continue;
          }
        }
      }

      let dateArray = []; //タスクを日付ごとにまとめる
      let date = fixedTasks[0].date; //現在調べてる日付
      let sum = 0;
      for (let i = 0; i < fixedTasks.length; i++) {
        if (date != fixedTasks[i].date) {
          arrayTasks.push({
            date: date,
            sum: sum,
            Tasks: dateArray,
          });
          dateArray = [];
          sum = 0;
          date = fixedTasks[i].date;
        }
        dateArray.push(fixedTasks[i]);
        sum += fixedTasks[i].sum;
      }
      dateArray = [];
      this.state.arrayTasks = arrayTasks;

      //タスクリストの開いた状態を維持するための処理
      for (let i = 0; i < this.state.openingTasks.length; i++) {
        for (let j = 0; j < this.state.arrayTasks.length; j++) {
          if (
            this.state.arrayTasks[j].date == this.state.openingTasks[i].date
          ) {
            for (let k = 0; k < this.state.arrayTasks[j].Tasks.length; k++) {
              if (
                this.state.arrayTasks[j].Tasks[k].title ==
                  this.state.openingTasks[i].title &&
                this.state.arrayTasks[j].Tasks[k].category ==
                  this.state.openingTasks[i].category
              ) {
                this.state.arrayTasks[j].Tasks[k].show = true;
              }
            }
          }
        }
      }
    },
  },
});
