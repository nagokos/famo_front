<template>
  <div>
    <the-bread-crumb :bread-crumbs="breadCrumbs" />
    <the-profile-wrapper
      ref="profileWrapper"
      :user="currentUser"
      @update-introduction="updateIntroduction"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheBreadCrumb from "../globals/TheBreadCrumb";
import TheProfileWrapper from "../parts/TheProfileWrapper";

export default {
  components: {
    TheBreadCrumb,
    TheProfileWrapper,
  },
  computed: {
    ...mapGetters({ currentUser: "user/currentUser" }),
    breadCrumbs() {
      return [
        {
          text: "TOP",
          to: "/",
          disabled: false,
        },
        {
          text: "マイページ",
          to: this.$route.path,
          disabled: true,
        },
      ];
    },
  },
  mounted() {
    this.signupUser();
    this.loginUser();
  },
  methods: {
    signupUser() {
      if (document.cookie.includes("signup=1")) {
        this.$store.dispatch("flash/setFlash", {
          type: "success",
          message: "新規登録しました",
        });
        document.cookie = "signup=; max-age=0";
      }
    },
    loginUser() {
      if (document.cookie.includes("login=1")) {
        this.$store.dispatch("flash/setFlash", {
          type: "success",
          message: "ログインしました",
        });
        document.cookie = "login=; max-age=0";
      }
    },
    async updateIntroduction(userEdit) {
      try {
        await this.$store.dispatch("user/updateCurrentUser", userEdit);
        this.$store.dispatch("flash/setFlash", {
          type: "success",
          message: "更新しました",
        });
        this.$refs.profileWrapper.closeIntroduction();
      } catch (error) {
        if (error.response.data.errors) {
          this.$refs.profileWrapper.introductionErrors(
            error.response.data.errors
          );
        }
        this.$store.dispatch("flash/setFlash", {
          type: "error",
          message: error.response.data.message,
        });
      }
    },
  },
};
</script>
