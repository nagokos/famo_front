<template>
  <div v-if="loading" class="league">
    <the-bread-crumb :bread-crumbs="breadCrumbs" />
    <v-container>
      <v-row>
        <player-search
          :league="league"
          :leagues="leagues"
          :teams="teams"
          v-bind.sync="q"
        />
        <router-view
          :users="users"
          :teams="teams"
          :area="league"
          :q="q"
          :page.sync="page"
          :total-count="totalCount"
          :total-pages="totalPages"
          :current-page="currentPage"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TheBreadCrumb from "../globals/TheBreadCrumb";
import PlayerSearch from "../parts/PlayerSearch";

export default {
  components: {
    TheBreadCrumb,
    PlayerSearch,
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.toTop();
    if (to.params.league !== from.params.league) {
      this.getData();
    } else {
      this.getPlayers();
    }
  },
  data() {
    return {
      loading: false,
      users: [],
      league: {},
      leagues: [],
      teams: [],
      q: {
        leagueId: "",
        position: "",
        teamId: "",
        rating: false,
      },
      page: 1,
      totalPages: 1,
      currentPage: 1,
      totalCount: 0,
    };
  },
  computed: {
    isRating() {
      return this.$route.path.includes("ratings");
    },
    breadCrumbs() {
      return [
        {
          text: "TOP",
          to: "/",
          disabled: false,
        },
        {
          text: this.league.name,
          to: this.$route.path,
          disabled: false,
        },
      ];
    },
  },
  created() {
    this.getData();
  },
  methods: {
    setQuery() {
      this.page = this.$route.query.page ? +this.$route.query.page : 1;
      this.q.position = this.positionTransForm(this.$route.query.position);
      this.q.teamId = this.teamTransForm();
    },
    teamTransForm() {
      const team = this.teams.find(
        (team) => team.name === this.$route.query.team
      );
      return team ? team.id : "";
    },
    positionTransForm(name) {
      let position = "";
      switch (name) {
        case "GK":
          position = 0;
          break;
        case "DF":
          position = 1;
          break;
        case "MF":
          position = 2;
          break;
        case "FW":
          position = 3;
          break;
      }
      return position;
    },
    async getData() {
      this.loading = false;
      await this.getTeams();
      await this.setQuery();
      await this.getPlayers();
      await this.getLeague();
      await this.getLeagues();
      this.loading = true;
    },
    async getLeagues() {
      const response = await this.$axios.get("/api/v1/leagues");
      this.leagues = response.data.leagues;
    },
    async getPlayers() {
      this.page = this.$route.query.page ? +this.$route.query.page : 1;
      const leagueId = this.getLeagueId(this.$route.params.league);
      this.q.leagueId = leagueId;
      this.isRating ? (this.q.rating = true) : (this.q.rating = false);
      const response = await this.$axios.get("/api/v1/players", {
        params: {
          q: this.q,
          page: this.page,
        },
      });
      this.totalCount = +response.headers["total-count"];
      this.currentPage = +response.headers["current-page"];
      this.totalPages = +response.headers["total-pages"];
      this.users = response.data.users;
    },
    async getTeams() {
      const leagueId = this.getLeagueId(this.$route.params.league);
      const response = await this.$axios.get(
        `/api/v1/leagues/${leagueId}/teams`
      );
      this.teams = response.data.teams;
      const unspecified = { name: "指定なし", id: "" };
      this.teams.unshift(unspecified);
    },
    async getLeague() {
      const leagueId = this.getLeagueId(this.$route.params.league);
      const response = await this.$axios.get(`/api/v1/leagues/${leagueId}`);
      this.league = response.data.league;
    },
  },
};
</script>

<style scoped>
.league {
  max-width: 1050px;
  margin: 0 auto;
}
</style>
