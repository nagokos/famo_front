import Vue from "vue";
import App from "./App.vue";

// Vue-router
import VueRouter from "vue-router";
import router from "./router/index";
Vue.use(VueRouter);

// Axios
import Axios from "./plugins/axios";
Vue.prototype.$axios = Axios;

// Vuex
import Vuex from "vuex";
import store from "./store/index";
Vue.use(Vuex);

import globalMethods from "./mixins/global-valiables";
Vue.mixin(globalMethods);

// VeeValidate
import VeeValidate from "./plugins/vee-validate";
Vue.mixin(VeeValidate);

// InfiniteLoading
import InfiniteLoading from "vue-infinite-loading";
Vue.use(InfiniteLoading);

// dayjs
import dayjs from "./plugins/dayjs";
Vue.prototype.$dayjs = dayjs;

// vue-cropper
import VueCropper from "vue-cropper";

import vuetify from "./plugins/vuetify";
Vue.use(VueCropper);

document.addEventListener("DOMContentLoaded", () => {
  const app = new Vue({
    el: "#app",
    vuetify,
    router,
    store,
    render: (h) => h(App),
  });
  app.$mount("#app");
});
