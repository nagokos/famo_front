<template>
  <v-card
    outlined
    elevation="1"
    :max-height="$vuetify.breakpoint.mobile ? '' : 450"
  >
    <v-list-item two-line>
      <v-list-item-avatar
        class="mr-2"
        style="cursor: pointer"
        :size="45"
        @click="pushUserPage(review.reviewee)"
      >
        <v-img :src="review.reviewee.avatar" />
      </v-list-item-avatar>
      <v-list-item-content class="mt-1">
        <v-list-item-title class="text-body-2 font-weight-bold">
          <span style="cursor: pointer" @click="pushUserPage(review.reviewee)">
            {{ review.reviewee.name }}
          </span>
          さんへのレビュー
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption mt-1">
          {{ $dayjs(review.createdAt).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text class="py-0">
      <p class="text-caption">
        {{ review.reviewee.profile.team }} /
        {{ review.reviewee.profile.position }}
      </p>
      <v-divider />
    </v-card-text>
    <v-card-actions class="pl-3 mt-2 pb-0">
      <v-rating
        :value="+review.rate"
        background-color="#ef5350"
        color="#ef5350"
        readonly
        half-increments
        dense
      />
      <span class="ml-1 text-h6 font-weight-bold">
        {{ review.rate }}
      </span>
      <span
        v-if="!$vuetify.breakpoint.mobile"
        class="text-caption mt-1 ml-3"
        style="color: rgba(0, 0, 0, 0.6)"
      >
        試合日 {{ review.gameDate }}
      </span>
    </v-card-actions>
    <v-card-text
      class="py-0 mt-2"
      :style="
        $vuetify.breakpoint.mobile ? '' : 'height: 200px; max-height: 200px;'
      "
    >
      <p v-if="$vuetify.breakpoint.mobile" class="text-caption">
        試合日 {{ review.gameDate }}
      </p>
      <p>
        {{
          review.content.length >= 280
            ? `${review.content.substr(0, 280)}...`
            : review.content
        }}
        <span
          v-if="review.content.length > 280"
          class="text-caption mt-1 ml-3 blue--text text--darken-2"
          style="cursor: pointer"
          @click="$refs.showReviewDialog.open()"
        >
          もっとみる
        </span>
      </p>
    </v-card-text>
    <v-card-actions class="mr-3 mb-1">
      <v-spacer />
      <v-avatar
        size="40"
        class="mr-3"
        style="cursor: pointer"
        @click="pushUserPage(review.reviewer)"
      >
        <v-img :src="review.reviewer.avatar" />
      </v-avatar>
      <span
        :class="
          $vuetify.breakpoint.mobile
            ? 'text-subtitle-2 font-weight-bold'
            : 'text-subtitle-1 font-weight-bold'
        "
        style="cursor: pointer"
        @click="pushUserPage(review.reviewer)"
      >
        {{ review.reviewer.name }}
      </span>
    </v-card-actions>
    <the-show-review-dialog
      ref="showReviewDialog"
      :review="review"
      :user="review.reviewer"
    />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import TheShowReviewDialog from "./TheShowReviewDialog";

export default {
  components: {
    TheShowReviewDialog,
  },
  props: {
    review: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    ...mapGetters({ currentUser: "user/currentUser" }),
  },
  methods: {
    pushUserPage(user) {
      if (this.currentUser.id === user.id)
        return this.$router.push({ name: "myReview" });
      if (user.role === "player") {
        const leagueEigo = this.leagueNameEigo(user.profile.league.name);
        this.$router.push({
          name: "playerReview",
          params: {
            league: leagueEigo,
            categoryId: user.profile.category.id,
            groupId: user.profile.groupId,
            userId: user.id,
          },
        });
      } else {
        this.$router.push({
          name: "reviewerReview",
          params: { userId: user.id },
        });
      }
    },
  },
};
</script>
