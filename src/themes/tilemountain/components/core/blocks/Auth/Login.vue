<template>
  <div class="LoginForm">
    <header class="modal-header h1 serif weight-700 bg-cl-secondary">
      {{ $t("Registered Customers") }}
      <div class="closeLogin" v-if="this.$route.name === 'checkout'">
        <i
          slot="close"
          class="modal-close material-icons cl-bg-tertiary"
          @click="close"
        >
          close
        </i>
      </div>
    </header>
    <div v-if="hasRedirect" class="pt10 pb10 px65 redirect-error">
      <p class="h5 mb0 mt0">
        {{ $t("You need to be logged in to see this page") }}
      </p>
    </div>
    <div class="modal-content bg-cl-primary cl-secondary">
      <p class="pb40 loginheading">
        If you already have an account with us, please log in.
      </p>
      <form @submit.prevent="login" novalidate>
        <base-input
          class="mb10 filldata"
          type="email"
          name="email"
          focus
          v-model="email"
          @blur="$v.email.$touch()"
          :placeholder="$t('Email address ')"
          :validations="[
            {
              condition: !$v.email.required && $v.email.$error,
              text: $t('Field is required.'),
            },
            {
              condition: !$v.email.email && $v.email.$error,
              text: $t('Please provide valid e-mail address.'),
            },
          ]"
        />
        <base-input
          class="mb10 passwordbox"
          type="password"
          name="password"
          v-model="password"
          @blur="$v.password.$touch()"
          :placeholder="$t('Password ')"
          :validations="[
            {
              condition: !$v.password.required && $v.password.$error,
              text: $t('Field is required.'),
            },
          ]"
        />
        <div class="row rem-group">
          <base-checkbox class="mb20 remember" id="remember" v-model="remember">
            {{ $t("Remember me") }}
          </base-checkbox>
          <p id="info">What is this?</p>
        </div>
        <div class="alignnext">
          <button
            type="submit"
            data-testid="loginSubmit"
            class="
              no-outline
              button-full
              block
              brdr-none
              w-100
              px10
              py20
              bg-cl-mine-shaft
              :bg-cl-th-secondary
              ripple
              weight-400
              h4
              cl-white
              sans-serif
              fs-medium
              mb20
              loginconfirm
            "
          >
            Login
          </button>
          <a
            href="/customer/account/create"
            class="
              no-outline
              button-full
              block
              brdr-none
              w-100
              px10
              py20
              bg-cl-mine-shaft
              ripple
              weight-400
              h4
              cl-white
              sans-serif
              fs-medium
              mb20
              createaccount
              no-underline
              pointer
              align-center
              border-box
            "
            data-testid="subscribeSubmit"
            >Create an Account</a
          >
        </div>
        <!-- <button-full
          class="mb20 loginconfirm"
          type="submit"
          data-testid="loginSubmit"
        >
          {{ $t("Login") }}
        </button-full> -->
      </form>
    </div>
    <div
      class="col-xs-12 col-sm-12 flex end-xs middle-xs forgetpassword"
      @click="remindPassword"
    >
      <router-link :to="localizedRoute('/forgetpassword')">
        {{ $t("Forgot Your Password?") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import Login from "@vue-storefront/core/compatibility/components/blocks/Auth/Login";

import ButtonFull from "theme/components/theme/ButtonFull.vue";
import BaseCheckbox from "../Form/BaseCheckbox.vue";
import BaseInput from "../Form/BaseInput.vue";
import { required, email } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import i18n from "@vue-storefront/i18n";
import {
  currentStoreView,
  localizedRoute,
} from "@vue-storefront/core/lib/multistore";

export default {
  mixins: [Login],
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    ...mapGetters({
      isLogged: "user/isLoggedIn",
    }),
  },
  data() {
    return {
      hasRedirect: !!localStorage.getItem("redirect"),
    };
  },
  mounted() {
    if (this.isLogged) {
      this.$router.push(localizedRoute("/", currentStoreView().storeCode));
    }
    if (this.$route && this.$route.query && this.$route.query.quotelogin) {
      this.callLoginQuote(this.$route.query.quotelogin);
    }
  },
  methods: {
    callLoginQuote(getTokenCustomer) {
      this.$bus.$emit(
        "notification-progress-start",
        i18n.t("Customer Login in progress ...")
      );
      if (this.isLogged) {
        this.$bus.$emit("notification-progress-stop");
        this.$router.push(this.localizedRoute("/my-account/quotations/"));
        this.close();
      } else {
        this.$store
          .dispatch("user/login", {
            username: "test",
            password: getTokenCustomer,
          })
          .then((result) => {
            this.$bus.$emit("notification-progress-stop", {});

            if (result.code !== 200) {
              this.onFailure(result);
            } else {
              this.onSuccess();
              this.$bus.$emit("notification-progress-stop");
              this.$router.push(this.localizedRoute("/my-account/quotations/"));
              this.close();
            }
          })
          .catch((err) => {
            Logger.error(err, "user")();
            this.onFailure({
              result:
                "Unexpected authorization error. Check your Network conection.",
            });
            // TODO Move to theme
            this.$bus.$emit("notification-progress-stop");
          });
      }
    },
    close(e) {
      console.log("14589 Log in function Close" ,document.getElementsByTagName("BODY")[0],document.getElementsByTagName("BODY")[0].style);
      document.getElementsByTagName("BODY")[0].style.overflow ="scroll"
      console.log("14589 Log in function Close After" ,document.getElementsByTagName("BODY")[0],document.getElementsByTagName("BODY")[0].style);
      if (e) localStorage.removeItem("redirect");
      this.$bus.$emit("modal-hide", "modal-signup");
    },
    login() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        console.log("78945676 notificationData fix validation errors");
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t("Please fix the validation errors"),
          action1: { label: this.$t("OK") },
        });
        return;
      }
      this.callLogin();
    },
    remindPassword() {
      if (!(typeof navigator !== "undefined" && navigator.onLine)) {
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t(
            "Reset password feature does not work while offline!"
          ),
          action1: { label: this.$t("OK") },
        });
      } else {
        this.callForgotPassword();
        this.$bus.$emit("modal-hide", "modal-signup");
      }
    },
    onSuccess() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "success",
        message: this.$t("You are logged in!"),
        action1: { label: this.$t("OK") },
      });
    },
    onFailure(result) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(result.result),
        action1: { label: this.$t("OK") },
      });
    },
  },
  components: {
    ButtonFull,
    BaseCheckbox,
    BaseInput,
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
}
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-error: color(error);
$white: color(white);
.LoginForm {
  width: 100%;
  max-width: 568px;
  float: right;
  margin-bottom: 100px;
  .closeLogin {
    color: #fefefe;
    float: right;
    top: 18px;
    right: 30px;
    position: absolute;
    font-size: 36px;
    height: 44px;
    width: 44px;
    border: none;
    font-weight: bold;
    border-radius: 24px;
    background-color: #ee4c56 !important;
    i {
      color: #ffffff;
      display: block;
      margin-left: 10px;
      margin-top: 9px;
    }
  }
  .loginconfirm {
    background: #57c9c0;
    width: 100%;
    color: #ffffff;
    font-size: 19.92px;
    padding: 19.5px;
    font-weight: bold;
    border-radius: 3px;
    max-width: 308px;
    font-family: Arial;
  }
  .forgetpassword {
    position: relative;
    a {
      position: absolute;
      bottom: 26px;
      right: 25px;
      font-family: Arial;
      font-weight: bold;
    }
  }
  #info {
    margin-top: 7px;
    font-size: 16px;
    color: #c7c8c9;
    margin-left: 5px;
    font-style: italic;
    font-family: Arial;
    cursor: pointer;
  }
  @media (max-width: 1199px) and(min-width: 992px) {
    .modal-content {
      .rem-group {
        padding-left: 8px;
      }
    }
    .forgetpassword {
      a {
        right: 5%;
        top: -27px;
      }
    }
  }
  @media (max-width: 991px) and (min-width: 768px) {
    .modal-content {
      .rem-group {
        padding-left: 11px;
      }
    }
    .forgetpassword {
      a {
        right: 3%;
        top: -27px;
      }
    }
  }
  @media (max-width: 767px) and (min-width: 320px) {
    width: 100%;
    max-width: 100%;
    float: none;
    margin-bottom: 40px;
    .modal-header {
      font-size: 14px;
      padding-left: 21px;
    }
    .modal-content {
      max-width: calc(100% - 50.8px);
      padding-left: 21px;
      padding-right: 23px;
      padding-bottom: 38px;
      p {
        font-size: 12px;
      }
      .passwordbox {
        min-height: 3.3rem;
        margin-bottom: 0;
      }
      .rem-group {
        padding-left: 8px;
      }
    }
    #info {
      margin-top: 6px;
      font-size: 11px;
      color: #c7c8c9;
      font-style: unset;
      cursor: pointer;
    }
    .loginconfirm {
      min-width: 166px;
      padding: 10px;
      font-size: 12px;
      width: 50%;
    }
    .forgetpassword {
      font-size: 12px;
    }
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 27px;
  font-family: oblik;
  background: #29275b;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: #ffffff;
  padding: 26px;
}
.modal-content {
  border: 3.4px solid #d7d6d6;
  width: 100%;
  max-width: 490px;
  border-top: none;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  border-radius: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding-left: 36px;
  padding-right: 36px;
  padding-top: 20px;
  padding-bottom: 54px;
  .loginheading {
    color: #333333;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
  }
}
.modal-close {
  cursor: pointer;
}
.modal-content {
  @media (max-width: 400px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
.redirect-error {
  background-color: $color-error;
  color: $white;
}
  @media (max-width: 1199px) and(min-width: 992px) {
   .LoginDetails .modal-content {
       padding: 13px;
       max-width: 440px;
    }
  }
  @media (max-width: 991px) and (min-width: 768px) {
   .LoginDetails .modal-content {
      padding: 8px;
      max-width: 341px;
    }
    .LoginDetails .modal-header {
      font-size: 20px;
      width: 86.2%;
    }
  }
  @media (max-width: 767px){
.modal-container  .createaccount{
    padding: 10px !important;
    font-size: 12px !important;
    width: 50% !important;
}
  }
   .LoginDetails  .button-full {
    min-width: 250px !important;
  }
  @media (max-width: 400px) {
 .LoginDetails .button-full {
    min-width: 180px !important;
    padding-left: 30px  !important;
  }
  }
     .modal-container   .button-full {
    min-width: 0 !important;
  }
  @media (max-width: 400px) {
 .modal-container  .button-full {
    min-width: 0 !important;
    padding-left: 10px  !important;
  }
  }

</style>
<style lang="scss">
.LoginForm {
  .base-input {
    min-height: 5.9rem;
  }
  .base-input.passwordbox {
    min-height: 0px;
    margin-bottom: 8px;
  }
  input {
    background: #ebebeb;
    border: 1px solid #ebebeb;
    padding: 28.5px;
  }
  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -29px;
    font-size: 20px;
    color: #6b6b6c;
    font-weight: bold;
    font-family: Arial;
  }
  label {
    top: -29px;
    font-size: 20px;
    color: #6b6b6c;
    font-weight: bold;
    font-family: Arial;
  }
  label:after {
    content: "*";
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 0px;
    font-size: 17px;
  }
  .remember {
    padding-left: 8px;
    @media (max-width: 1200px) and (min-width: 320px) {
      padding-left: 0px;
    }
  }
  .remember label {
    padding-left: 28px;
  }
  .remember label:before {
    height: 17px;
    width: 17px;
  }
  .remember label:after {
    content: none;
  }
  input:hover,
  input:focus {
    outline: none;
    border-color: #ebebeb;
  }
  input:checked + label:before {
    background: #00adee;
    border: 1px solid #00adee;
  }
  input:checked + label:after {
    background: #00adee;
    content: "";
    position: absolute;
    top: 7px;
    left: 3px;
    width: 11px;
    height: 5px;
    border: 2px solid #fff;
    border-top: none;
    border-right: none;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  @media (max-width: 767px) {
    input {
      padding: 10px;
    }
    .base-input {
      min-height: 4.7rem;
    }
    label {
      font-size: 12px;
      top: -17px;
    }
    input:focus ~ label,
    input:not(.empty) ~ label {
      font-size: 12px;
      top: -17px;
    }
    label:before {
      width: 15px;
      height: 15px;
    }
    input:checked + label:after {
      top: 8px;
      left: 3px;
      width: 10px;
      height: 4px;
    }
  }
}
.required-Field {
  color: #ee4c56 !important;
}
.LoginForm .alignnext {
    display: flex;
    grid-gap: 10px;
}
.LoginDetails .createaccount {
    display: none;
}
.LoginForm .createaccount {
    background: #24224d;
    width: 100%;
    color: #ffffff;
    font-size: 19.92px;
    padding: 19.5px;
    font-weight: bold;
    border-radius: 3px;
    max-width: 308px;
    font-family: Arial;
    min-width: auto !important;
}
</style>
