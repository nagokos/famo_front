<template>
  <v-menu
    offset-y
    left
    bottom
    v-if="currentUser"
    :close-on-content-click="false"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge overlap dot color="red" class="mr-4" :value="badge">
        <v-icon
          color="#FAFAFA"
          size="27"
          v-bind="attrs"
          v-on="on"
          @click="menu = true"
        >
          mdi-bell-outline
        </v-icon>
      </v-badge>
    </template>
    <v-list
      max-width="300"
      class="py-0"
      max-height="600"
      style="overflow-y: auto"
    >
      <v-list-item class="py-1 justify-space-between">
        <v-col class="text-caption font-weight-bold">お知らせ</v-col>
        <v-col
          align="end"
          class="text-caption font-weight-bold blue--text text--darken-2"
          style="cursor: pointer"
          @click="allCheckedNotification"
          >すべて既読</v-col
        >
      </v-list-item>
      <v-divider></v-divider>
      <template v-for="(notification, index) in notifications">
        <v-list-item
          :key="`notification-${notification.id}`"
          class="py-4"
          :ripple="false"
          :style="
            notification.checked
              ? 'cursor: pointer; background: #ECEFF1;'
              : 'cursor: pointer;'
          "
          @click="checkedNotification(notification)"
        >
          <v-avatar size="45">
            <v-img :src="notification.visitor.avatar"> </v-img>
          </v-avatar>
          <v-list-item-content class="text-caption ml-2">
            {{ notification.id
            }}{{ notification.visitor.name }}さんからレビューが届きました
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
      <v-list-item
        v-if="currentPage !== totalPage"
        :ripple="false"
        class="py-1 justify-center"
        style="cursor: pointer"
        @click="getNotification"
      >
        <span
          class="text-caption blue--text text--darken-2"
          style="cursor: pointer"
          >もっとみる</span
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  created() {
    this.getNotification();
    this.checkNotification();
  },
  data() {
    return {
      notifications: [],
      badge: false,
      menu: false,
      currentPage: 0,
      totalPage: 0,
    };
  },
  computed: {
    ...mapGetters({ currentUser: "user/currentUser" }),
  },
  methods: {
    async checkNotification() {
      const response = await this.$axios.get(
        "/api/v1/users/current/notifications/check"
      );
      this.badge = response.data;
    },
    async getNotification() {
      this.currentPage += 1;
      const response = await this.$axios.get(
        "/api/v1/users/current/notifications",
        {
          params: {
            page: this.currentPage,
          },
        }
      );
      this.currentPage = +response.headers["current-page"];
      this.totalPage = +response.headers["total-pages"];
      console.log(this.totalPage);
      response.data.notifications.forEach((notification) =>
        this.notifications.push(notification)
      );
    },
    async checkedNotification(notification) {
      try {
        const response = await this.$axios.patch(
          `/api/v1/users/current/notifications/${notification.id}`
        );
        const index = this.notifications.findIndex(
          (notification) => notification.id == response.data.notification.id
        );
        this.notifications.splice(index, 1, response.data.notification);
        this.$router.push({ name: "myReview" }, () => {});
        this.menu = false;
      } catch (error) {
        console.log(error.response);
      }
    },
    async allCheckedNotification() {
      const response = await this.$axios.patch(
        "/api/v1/users/current/notifications/checked"
      );
      response.data.notifications
      this.currentPage = +response.headers["current-page"];
      this.totalPage = +response.headers["total-pages"];
      this.notifications = response.data.notifications;
      this.badge = false;
    },
  },
};
</script>
