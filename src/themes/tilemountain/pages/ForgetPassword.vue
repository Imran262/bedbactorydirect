<template>
  <div class="Forget-Main">
    <div class="container flex mt10">
      <div class="RegisterDetails col-md-12">
        <h1>Reset Password</h1>
        <div class="newCustomers col-md-12 pl0">
          <p>
            Enter your email to receive instructions on how to reset your
            password.
          </p>
          <div class="LoginDetails col-md-12 p0">
            <no-ssr>
              <ForgotPass />
            </no-ssr>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
// import ButtonFull from "theme/components/theme/ButtonFull";
import ForgotPass from "theme/components/core/blocks/Auth/ForgotPass";
import NoSSR from "vue-no-ssr";
export default {
  computed: {
    // ...mapState({
    //   activeElem: (state) => state.ui.authElem,
    // }),
  },
  components: {
    ForgotPass,
    "no-ssr": NoSSR,
  },
};
</script>

<style lang="scss" scoped>
.Forget-Main {
  h1 {
    font-family: oblik;
    font-size: 41px;
    color: #29275b;
  }
  .newCustomers {
    h4 {
      font-size: 27px;
      color: #737374;
      font-family: Arial, Helvetica, sans-serif;
    }
    p {
      font-size: 18px;
      color: #6b6b6c;
      line-height: 1.9;
    }
  }
  @media (max-width: 767px) {
    .ForgetpasswordForm {
      padding-top: 15px;
    }
    h1 {
      font-size: 20px;
    }
    .newCustomers {
      p {
        font-size: 12px;
      }
    }
  }
}
</style>
