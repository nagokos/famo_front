<template>
  <v-card height="550" elevation="1" outlined>
    <v-card-title class="font-weight-bold justify-center">
      新規登録
    </v-card-title>
    <v-divider />
    <div class="signup mx-auto">
      <v-col cols="12" align="center">
        <p style="color: #616161" class="text-body-1 font-weight-medium">
          アカウントをお持ちでない方は
          <br />
          新規登録をしてください
        </p>
        <v-btn
          dark
          x-large
          :ripple="false"
          block
          color="#EF5350"
          class="font-weight-bold"
          @click="$refs.signupDialog.open()"
        >
          新規会員登録
        </v-btn>
      </v-col>
      <v-col cols="12">
        <p style="font-size: 10px">
          ※ 会員登録することでFamoの
          <span
            class="blue--text text--darken-2"
            style="cursor: pointer"
            @click="$router.push({ name: 'terms' })"
          >
            利用規約
          </span>
          ・
          <span
            class="blue--text text--darken-2"
            style="cursor: pointer"
            @click="$router.push({ name: 'privacy' })"
          >
            プライバシーポリシー
          </span>
          に同意するものとします。
        </p>
        <p style="font-size: 10px">
          ※ アカウント認証メールが届かない・再取得される方は
          <br />
          <strong
            style="cursor: pointer"
            class="red--text"
            @click="$refs.activationEmailDialog.open()"
          >
            こちら
          </strong>
          をクリック
        </p>
      </v-col>
    </div>
    <signup-dialog ref="signupDialog" />
    <the-resend-activation-email-dialog ref="activationEmailDialog" />
  </v-card>
</template>

<script>
import SignupDialog from "./SignupDialog";
import TheResendActivationEmailDialog from "./TheResendActivationEmailDialog";

export default {
  components: {
    SignupDialog,
    TheResendActivationEmailDialog,
  },
};
</script>

<style scoped>
.signup {
  max-width: 300px;
  margin-top: 125px;
}
</style>
