<template>
  <v-card height="550" elevation="1" outlined>
    <v-card-title class="font-weight-bold justify-center">
      ログイン
    </v-card-title>
    <v-divider />
    <div class="login mx-auto mt-12">
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" align="center">
                <ValidationProvider
                  v-slot="{ errors }"
                  vid="email"
                  :rules="{
                    required: true,
                    formFormat:
                      /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/i,
                  }"
                  name="メールアドレス"
                >
                  <v-text-field
                    v-model="user.email"
                    label="メールアドレス"
                    outlined
                    background-color="#F2F4F8"
                    required
                    :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12" class="py-0">
                <ValidationProvider
                  v-slot="{ errors }"
                  vid="password"
                  :rules="{
                    required: true,
                    min: 8,
                    formFormat: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,}$/i,
                  }"
                  name="パスワード"
                >
                  <v-text-field
                    v-model="user.password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    label="パスワード"
                    outlined
                    counter
                    background-color="#F2F4F8"
                    required
                    :error-messages="errors"
                    @click:append="show = !show"
                  />
                </ValidationProvider>
              </v-col>
              <v-col class="pt-0 pb-1">
                <span
                  class="text-caption blue--text text--darken-2"
                  style="cursor: pointer"
                  @click="
                    $router.push({
                      name: 'passwordReset',
                      params: { type: 'send_password_reset' },
                    })
                  "
                >
                  パスワードをお忘れですか？
                </span>
              </v-col>
              <v-col cols="12" class="pt-0">
                <v-btn
                  :dark="!inActive"
                  x-large
                  block
                  :ripple="false"
                  :disabled="inActive"
                  color="black"
                  class="font-weight-bold"
                  @click="handleSubmit(sendLoginData)"
                >
                  {{ inActive ? "アカウントを認証してください" : "ログイン" }}
                </v-btn>
                <p class="mb-0 mt-2" style="font-size: 10px">
                  ※ ログインできない場合は
                  <strong
                    style="cursor: pointer"
                    class="red--text"
                    @click="$refs.loginHelpDialog.open()"
                  >
                    こちら
                  </strong>
                  をクリック
                </p>
              </v-col>
              <v-col cols="6" class="pr-1">
                <v-btn
                  :ripple="false"
                  block
                  outlined
                  height="42"
                  class="font-weight-bold"
                  @click="snsLogin('line')"
                >
                  <v-img
                    src="@/assets/line.png"
                    max-width="25"
                    max-height="25"
                    class="ml-1"
                  />
                  <span class="mx-auto text-caption font-weight-bold"
                    >LINE</span
                  >
                </v-btn>
              </v-col>
              <v-col cols="6" class="mb-14 pl-1">
                <v-btn
                  outlined
                  block
                  height="42"
                  :ripple="false"
                  class="font-weight-bold text-capitalize"
                  @click="snsLogin('google')"
                >
                  <v-img
                    src="@/assets/google.png"
                    max-width="25"
                    max-height="25"
                    class="ml-1"
                  />
                  <span class="mx-auto text-caption font-weight-bold">
                    Google
                  </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </ValidationObserver>
    </div>
    <login-help-dialog ref="loginHelpDialog" />
  </v-card>
</template>

<script>
import LoginHelpDialog from "./LoginHelpDialog";

export default {
  components: {
    LoginHelpDialog,
  },
  data() {
    return {
      inActive: false,
      show: false,
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    sendLoginData() {
      this.$emit("login-data", this.user);
    },
    setErrors(errors) {
      this.$refs.observer.setErrors(errors);
    },
    setInActive() {
      this.inActive = true;
    },
    snsLogin(provider) {
      window.location.href = `${process.env.VUE_APP_API_ENDPOINT}/api/v1/oauth/${provider}`;
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 310px;
}
</style>
