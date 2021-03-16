<template>
  <div class="container">
    <div class="coming-back-section">
      <div v-if="!currentUser">
        <p class="coming-back">Create your account</p>
        <p class="set-password">
          Set a password here and we’ll create an account for you to check your
          orders and make it even easier to checkout next time.
        </p>
      </div>
      <div class="bg-cl-primary cl-secondary coming-data" v-if="!currentUser">
        <form @submit.prevent="register" novalidate>
          <base-input
            class="mb10 input-box"
            type="password"
            name="password"
            ref="password"
            autocomplete="new-password"
            v-model="password"
            @blur="$v.password.$touch()"
            :placeholder="$t('Choose a password*')"
            :validations="[
              {
                condition: !$v.password.required && $v.password.$error,
                text: $t('Field is required.'),
              },
              {
                condition: !$v.password.minLength && $v.password.$error,
                text: $t('Password must have at least 8 letters.'),
              },
            ]"
          />
          <base-input
            class="input-box"
            type="password"
            name="password-confirm"
            autocomplete="new-password"
            v-model="rPassword"
            @blur="$v.rPassword.$touch()"
            :placeholder="$t('Confirm password*')"
            :validations="[
              {
                condition: !$v.rPassword.required && $v.rPassword.$error,
                text: $t('Field is required.'),
              },
              {
                condition: !$v.rPassword.sameAsPassword && $v.rPassword.$error,
                text: $t('Passwords must be identical.'),
              },
            ]"
          />
          <div class="create-button">
            <button-full class="mb5 create-account" type="submit">{{
              $t('Create My Account')
            }}</button-full>
          </div>
          <p class="btn-message">
            By proceeding you are agreeing to our
            <router-link
              :to="localizedRoute('/i/terms_and_condition')"
              class="term"
              >Terms & Conditions</router-link
            >&nbsp;and
            <router-link
              :to="localizedRoute('/i/privacy_policy')"
              class="privacy"
              >Privacy Policy.</router-link
            >
          </p>
        </form>
      </div>
      <span v-else>{{
        $t('You are logged in as {firstname}', currentUser)
      }}</span>
    </div>
  </div>
</template>
<script>
import ButtonFull from "theme/components/theme/ButtonFull.vue"
import BaseInput from "theme/components/core/blocks/Form/BaseInput.vue"
import { required, email, minLength, sameAs } from "vuelidate/lib/validators"
import i18n from "@vue-storefront/i18n"
import { Logger } from "@vue-storefront/core/lib/logger"
import { mapState } from "vuex"

export default {
  data() {
    return {
      password: "",
      rPassword: ""
    }
  },
  name: "RegisterAccountSuccess",
  props: ["personalDetails"],
  validations: {
    password: {
      minLength: minLength(8),
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs("password")
    }
  },
  components: {
    ButtonFull,
    BaseInput
  },
  computed: {
    ...mapState({
      isOpenLogin: (state) => state.ui.signUp,
      currentUser: (state) => state.user.current,
    }),
  },
  methods: {
    register() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t("Please fix the validation errors"),
          action1: { label: this.$t("OK") }
        })
        return
      }
      this.registerAccount()
    },
    registerAccount() {
      this.$bus.$emit(
        "notification-progress-start",
        i18n.t("Registering the account ...")
      )
      this.$store
        .dispatch("user/register", {
          email: this.personalDetails.email,
          password: this.password,
          firstname: this.personalDetails.firstName,
          lastname: this.personalDetails.lastName
        })
        .then(result => {
          Logger.debug(result, "user")()
          this.$bus.$emit("notification-progress-stop")
          if (result.code !== 200) {
            this.onFailure(result)
            // If error includes a word 'password', focus on a corresponding field
            if (result.result.includes("password")) {
              this.$refs["password"].setFocus("password")
              this.password = ""
              this.rPassword = ""
            }
          } else {
            this.$store.dispatch("user/login", {
              username: this.personalDetails.email,
              password: this.password
            })
            this.onSuccess()
          }
        })
        .catch(err => {
          this.onFailure({
            result:
              "Unexpected authorization error. Check your Network conection."
          })
          this.$bus.$emit("notification-progress-stop")
          Logger.error(err, "user")()
        })
    },
    onSuccess() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "success",
        message: this.$t("You are logged in!"),
        action1: { label: this.$t("OK") }
      })
      this.$router.replace("/")
    },
    onFailure(result) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(result.result),
        action1: { label: this.$t("OK") }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.coming-back {
  font-weight: 600;
  font-family: 'oblik';
  font-size: 20px;
  margin: 0px;
  color: #2a285a;
  @media (min-width: 767px) {
    font-size: 27px;
  }
}
p {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: #434343;
}
.set-password {
  color: #54575b;
}
.coming-data {
  .relative {
    width: 100%;
    float: left;
    margin-right: 2%;
    // margin-bottom: 0px;
  }
}
.create-button {
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  max-height: 3rem;
  @media (min-width: 767px) {
    max-height: 5rem;
  }
}
.create-account {
  background: #02a89a;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  /* padding: 10px; */
  font-size: 17px;
  width: 100%;
  color: #fff;
  max-width: 165px;
  height: 33px;
  line-height: 0;
  @media (min-width: 767px) {
    font-size: 19px;
    max-width: 308px;
    height: 54px;
  }
}
.create-account:hover {
  background: #02a89a;
}
.btn-message {
  font-style: italic;
  font-size: 12px;
  color: #8b8c8e;
  margin-top: 0;
  margin-bottom: 18px;
  @media (min-width: 767px) {
    font-size: 14.18px;
  }
  .term {
    text-decoration: underline;
    color: #ed008c;
    font-weight: 600;
  }
  .privacy {
    text-decoration: underline;
    color: #ed008c;
    font-weight: 600;
  }
}

.coming-back-section .coming-data {
  background: transparent;
}
@media (max-width: 767px) {
  .btn-message {
    font-size: 11px;
    text-align: center;
  }
  .btn-message .term {
    text-decoration: underline;
    color: #8b8c8e;
    font-weight: 600;
  }
  .btn-message .privacy {
    text-decoration: underline;
    color: #8b8c8e;
    font-weight: 600;
  }
  .coming-back-section {
    padding: 0px 13px;
    padding-bottom: 10px;
  }
  .set-password {
    color: #54575b;
    margin-top: 8px;
  }
  .input-box label {
    font-size: 12px;
  }
  .create-account {
    max-width: 200px;
    font-size: 14px;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
  }
  .coming-back {
    font-weight: 600;
    font-family: 'oblik';
    font-size: 18px;
    margin: 0px;
  }
  .coming-data .relative {
    width: 100%;
    float: left;
    margin-right: 2%;
    margin-bottom: -7px;
  }
  .coming-back-section .relative.base-input.mb10.input-box {
    margin-bottom: -7px;
  }
}
</style>
