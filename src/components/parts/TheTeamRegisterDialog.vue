<template>
  <v-dialog
    v-model="dialog"
    width="500"
    :fullscreen="$vuetify.breakpoint.mobile"
    :transition="
      $vuetify.breakpoint.mobile
        ? 'dialog-bottom-transition'
        : 'dialog-transition'
    "
    :persistent="true"
  >
    <v-card color="#FAFAFA">
      <v-btn icon :ripple="false" @click="close">
        <v-icon> mdi-close </v-icon>
      </v-btn>
      <v-card-title class="pt-0 pb-5 font-weight-bold justify-center text-h5">
        チーム登録
      </v-card-title>
      <v-divider />
      <v-card-text>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col class="mt-3" cols="12">
                  <span
                    class="font-weight-bold grey--text text--darken-1"
                    :style="
                      $vuetify.breakpoint.mobile
                        ? 'font-size: 10px;'
                        : 'font-size: 12px'
                    "
                  >
                    ※ 大会に記載しているチーム名で登録してください。
                    <br />
                    ※ 〇〇高校、〇〇U-18、〇〇ユースの形で登録してください。
                    <br />
                    ※ 2nd、3rdなどの区別はしないでください。
                  </span>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="都道府県"
                    vid="prefecture"
                  >
                    <v-select
                      v-model="team.prefectureId"
                      outlined
                      dense
                      label="都道府県"
                      required
                      :items="prefectures"
                      item-value="id"
                      item-text="name"
                      background-color="#F2F4F8"
                      :error-messages="errors"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|max:50"
                    vid="name"
                    name="チーム"
                  >
                    <v-text-field
                      v-model="team.name"
                      outlined
                      dense
                      required
                      label="チーム"
                      background-color="#F2F4F8"
                      :error-messages="errors"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" class="pt-0">
                  <v-btn
                    color="#3949AB"
                    class="font-weight-bold"
                    large
                    dark
                    :ripple="false"
                    block
                    @click="handleSubmit(sendTeamData)"
                  >
                    登録する
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    prefectures: {
      type: Array,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      team: {
        prefectureId: "",
        name: "",
      },
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.$refs.observer.reset();
      this.$refs.form.reset();
      this.dialog = false;
    },
    async sendTeamData() {
      try {
        const response = await this.$axios.post("/api/v1/teams", {
          team: this.team,
        });
        await this.$store.dispatch("flash/setFlash", {
          type: "success",
          message: "チームを登録しました",
        });
        this.$refs.form.reset();
        this.$emit("create-team", response.data.team);
      } catch (error) {
        if (error.response.data.errors) {
          this.$refs.observer.setErrors(error.response.data.errors);
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
