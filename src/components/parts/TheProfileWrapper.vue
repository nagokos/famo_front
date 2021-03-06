<template>
  <div v-if="loading">
    <div class="contents">
      <v-list color="#FAFAFA">
        <v-list-item>
          <!-- アバター -->
          <v-list-item-avatar :size="$vuetify.breakpoint.mobile ? 100 : 110">
            <v-img :src="user.avatar" />
          </v-list-item-avatar>
          <!-- タイトル -->
          <v-list-item-content>
            <profile-title
              v-if="!$vuetify.breakpoint.mobile"
              :class="user.role === 'player' ? 'mt-8 py-0' : ''"
              :user="user"
            />
          </v-list-item-content>
          <profile-action
            :user="user"
            :is-follow="isFollow"
            :class="
              !$vuetify.breakpoint.mobile && user.role === 'player'
                ? 'mt-12'
                : ''
            "
            @create-review="pushReview"
          />
        </v-list-item>
        <profile-title
          v-if="$vuetify.breakpoint.mobile"
          class="ml-3"
          :user="user"
        />
      </v-list>
      <v-container class="px-4 pt-0">
        <v-row>
          <v-col cols="12" lg="8">
            <!-- 自己紹介文 -->
            <introduction
              v-if="!introductionForm"
              :user="user"
              @open-form="openIntroduction"
            />
            <!-- 自己紹介編集 -->
            <introduction-edit
              v-if="introductionForm"
              ref="introductionEdit"
              :introduction.sync="userEdit.introduction"
              @send-introduction="$emit('update-introduction', userEdit)"
              @close-form="closeIntroduction"
            />
            <div v-if="$vuetify.breakpoint.mobile" class="my-3">
              <v-btn
                :ripple="false"
                class="font-weight-bold"
                depressed
                block
                @click="$refs.showProfileDialog.open()"
              >
                ユーザー情報をみる
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="!$vuetify.breakpoint.mobile" cols="4">
            <!-- テーブル -->
            <profile-table
              :profile="user.profile"
              :total-count="totalCount"
              :average="average"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="mx-auto" style="max-width: 1018px">
      <v-divider />
      <!-- タブ -->
      <profile-tab :user="user" />
    </div>
    <v-divider />
    <div class="contents mt-5">
      <v-container :class="$vuetify.breakpoint.mobile ? 'pt-0' : ''">
        <v-row>
          <!-- 選手カード -->
          <v-col
            v-if="!isRelation"
            cols="12"
            md="4"
            :class="$vuetify.breakpoint.mobile ? '' : 'pr-10'"
          >
            <review-search-mobile
              v-show="!isRelation && $vuetify.breakpoint.mobile"
              :q="q"
              :game-dates="gameDates"
            />
            <review-search
              v-show="!isRelation && !$vuetify.breakpoint.mobile"
              v-bind.sync="q"
              :game-dates="gameDates"
            />
          </v-col>
          <v-col
            v-if="!isRelation"
            cols="12"
            md="8"
            :class="$vuetify.breakpoint.mobile ? '' : 'pl-0'"
          >
            <keep-alive v-for="(review, index) in reviews" :key="index">
              <review-card
                v-if="!isRelation"
                :user="user"
                :review="review"
                @delete-review="filterReview"
              />
            </keep-alive>
            <template v-if="totalCount >= 20">
              <v-divider class="mt-10" />
              <v-card outlined color="#f1f4f8">
                <v-pagination
                  v-model="page"
                  :length="totalPages"
                  color="#3949AB"
                  class="my-5"
                  @input="pagination($event)"
                />
              </v-card>
              <v-divider />
            </template>
            <v-col v-if="reviews.length === 0" align="center">
              レビューがありません
            </v-col>
          </v-col>
          <keep-alive>
            <relation-card
              v-if="$route.path.includes('/following')"
              ref="following"
              @emit-follow="setFollowingIds"
              @reset-ids="followersIds = []"
            />
          </keep-alive>
          <keep-alive>
            <relation-card
              v-if="$route.path.includes('/followers')"
              ref="followers"
              @emit-follow="setFollowersIds"
              @reset-ids="followingIds = []"
            />
          </keep-alive>
        </v-row>
      </v-container>
    </div>
    <the-show-profile-dialog
      ref="showProfileDialog"
      :user="user"
      :total-count="totalCount"
      :average="average"
    />
  </div>
</template>

<script>
import ProfileAction from "../parts/ProfileAction";
import ProfileTitle from "../parts/ProfileTitle";
import ProfileTable from "../parts/ProfileTable";
import Introduction from "../parts/Introduction";
import IntroductionEdit from "../parts/IntroductionEdit";
import ProfileTab from "../parts/ProfileTab";
import ReviewCard from "../parts/ReviewCard";
import RelationCard from "../parts/RelationCard";
import ReviewSearch from "./ReviewSearch";
import ReviewSearchMobile from "./ReviewSearchMobile";
import TheShowProfileDialog from "./TheShowProfileDialog";
import { mapGetters } from "vuex";

export default {
  components: {
    ProfileTable,
    ProfileAction,
    ProfileTitle,
    Introduction,
    IntroductionEdit,
    ProfileTab,
    ReviewCard,
    RelationCard,
    ReviewSearch,
    ReviewSearchMobile,
    TheShowProfileDialog,
  },
  props: {
    user: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      isFollow: false,
      introductionForm: false,
      userEdit: { ...this.user },
      average: 0,
      reviews: [],
      followingIds: [],
      followersIds: [],
      gameDates: [],
      q: {
        sort: "created",
        gameDate: "",
      },
      page: 1,
      totalPages: 1,
      totalCount: 0,
    };
  },
  computed: {
    ...mapGetters({ currentUser: "user/currentUser" }),
    isRelation() {
      return (
        this.$route.path.includes("/following") ||
        this.$route.path.includes("/followers")
      );
    },
    isMypage() {
      return this.$route.path.includes("/profile");
    },
  },
  watch: {
    $route(to) {
      if (to.path.includes("/following")) {
        this.$nextTick(() => {
          this.$refs.following.switchFollow(this.followersIds);
        });
      } else if (to.path.includes("/followers")) {
        this.$nextTick(() => {
          this.$refs.followers.switchFollow(this.followingIds);
        });
      }
      if (!this.isRelation) {
        this.getReviews();
        this.getGameDates();
      }
    },
  },
  created() {
    this.setData();
  },
  methods: {
    async setData() {
      await this.checkFollow();
      await this.getGameDates();
      await this.setQuery();
      await this.getReviews();
      await this.getAverage();
      this.loading = true;
    },
    setQuery() {
      this.page = this.$route.query.page ? +this.$route.query.page : 1;
      this.q.sort = this.$route.query.sort ? this.$route.query.sort : "created";
      this.q.gameDate = this.$route.query.game_date;
    },
    setFollowingIds(id) {
      this.followingIds.push(id);
    },
    setFollowersIds(id) {
      this.followersIds.push(id);
    },
    openIntroduction() {
      this.introductionForm = true;
      this.userEdit = { ...this.user };
    },
    closeIntroduction() {
      this.introductionForm = false;
    },
    introductionErrors(errors) {
      this.$refs.introductionEdit.setErrors(errors);
    },
    filterReview(deleteReview) {
      this.reviews = this.reviews.filter(
        (review) => review.id !== deleteReview.id
      );
    },
    pushReview(review) {
      this.reviews.unshift(review);
      this.getGameDates();
    },
    toReview() {
      if (this.$vuetify.breakpoint.mobile) {
        window.scrollTo({
          top: 268,
          behavior: "auto",
        });
      } else {
        window.scrollTo({
          top: 285,
          behavior: "auto",
        });
      }
    },
    pagination(event) {
      this.toReview();
      const query = {
        game_date: this.$route.query.game_date,
        sort: this.$route.query.sort,
        page: event,
      };
      this.$router.push({ name: this.$route.name, query: query });
    },
    async getAverage() {
      if (this.user.role === "player") return;
      if (this.isMypage) {
        const response = await this.$axios.get(
          "/api/v1/users/current/rating_averages"
        );
        this.average = response.data;
      } else {
        const response = await this.$axios.get(
          `/api/v1/users/${this.$route.params.userId}/rating_averages`
        );
        this.average = response.data;
      }
    },
    async getGameDates() {
      if (this.isMypage) {
        const response = await this.$axios.get(
          "/api/v1/users/current/game_dates"
        );
        this.gameDates = response.data.dates;
      } else {
        const response = await this.$axios.get(
          `/api/v1/users/${this.$route.params.userId}/game_dates`
        );
        this.gameDates = response.data.dates;
      }
    },
    async getReviews() {
      this.page = this.$route.query.page ? +this.$route.query.page : 1;
      if (this.isMypage) {
        const response = await this.$axios.get(
          "/api/v1/users/current/reviews",
          {
            params: {
              q: this.q,
              page: this.page,
            },
          }
        );
        this.totalCount = +response.headers["total-count"];
        this.totalPages = +response.headers["total-pages"];
        this.reviews = response.data.reviews;
      } else {
        const response = await this.$axios.get(
          `/api/v1/users/${this.$route.params.userId}/reviews`,
          {
            params: {
              q: this.q,
              page: this.page,
            },
          }
        );
        this.totalCount = +response.headers["total-count"];
        this.totalPages = +response.headers["total-pages"];
        this.reviews = response.data.reviews;
      }
    },
    async checkFollow() {
      if (!this.currentUser) return;
      if (!this.isMypage) {
        const response = await this.$axios.get(
          `/api/v1/users/${this.$route.params.userId}/relationships/check`
        );
        this.isFollow = response.data.status;
      }
    },
  },
};
</script>

<style scoped>
.contents {
  max-width: 1050px;
  margin: 0 auto;
}
</style>
