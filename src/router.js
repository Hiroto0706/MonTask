import Vue from "vue";
import Router from "vue-router";
import store from "./store";

// Component
// import ListComponent from "./components/ListComponent";
// import GraphComponent from "./components/GraphComponent";
// import ProfileComponent from "./components/ProfileComponent";
// import LoginComponent from "./components/LoginComponent";
// import RegisterComponent from "./components/RegisterComponent";
// import PublicSideNavigation from "./global/PublicSideNavigation";
// import PublicHeader from "./global/PublicHeader";
// import SideNavigation from "./global/SideNavigation";
// import NormalHeader from "./global/NormalHeader";

//遅延ローディング
const ListComponent = () => import("./components/ListComponent");
const GraphComponent = () => import("./components/GraphComponent");
const TimeLineComponent = () => import("./components/TimeLineComponent");
const ProfileComponent = () => import("./components/ProfileComponent");
const LoginComponent = () => import("./components/LoginComponent");
const RegisterComponent = () => import("./components/RegisterComponent");
const PublicSideNavigation = () => import("./global/PublicSideNavigation");
const PublicHeader = () => import("./global/PublicHeader");
const SideNavigation = () => import("./global/SideNavigation");
const NormalHeader = () => import("./global/NormalHeader");

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      components: {
        default: ListComponent,
        navigation: PublicSideNavigation,
        header: PublicHeader,
      },
      beforeEnter(to, from, next) {
        store.state.graphPage = false;
        if (store.getters.idToken) {
          next();
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/graph",
      components: {
        default: GraphComponent,
        navigation: PublicSideNavigation,
        header: PublicHeader,
      },
      beforeEnter(to, from, next) {
        store.state.graphPage = false;
        if (store.getters.idToken) {
          next();
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/timeline",
      components: {
        default: TimeLineComponent,
        navigation: PublicSideNavigation,
        header: PublicHeader,
      },
      beforeEnter(to, from, next) {
        if (store.getters.idToken) {
          store.state.graphPage = true;
          next();
        } else {
          store.state.graphPage = false;
          next("/login");
        }
      },
    },
    {
      path: "/profile",
      components: {
        default: ProfileComponent,
        navigation: PublicSideNavigation,
        header: PublicHeader,
      },
      beforeEnter(to, from, next) {
        store.state.graphPage = false;
        if (store.getters.idToken) {
          next();
        } else {
          next("/login");
        }
      },
    },
    {
      path: "/register",
      components: {
        default: RegisterComponent,
        navigation: SideNavigation,
        header: NormalHeader,
      },
      beforeEnter(to, from, next) {
        store.state.graphPage = false;
        if (store.getters.idToken) {
          next("/");
        } else {
          next();
        }
      },
    },
    {
      path: "/login",
      components: {
        default: LoginComponent,
        navigation: SideNavigation,
        header: NormalHeader,
      },
      beforeEnter(to, from, next) {
        store.state.graphPage = false;
        if (store.getters.idToken) {
          next("/");
        } else {
          next();
        }
      },
    },
  ],
});
