<template>
  <div class="ForgetpasswordForm">
    <div class="modal-content bg-cl-primary pt30 pb60 px65 pl0 cl-secondary">
      <template v-if="!passwordSent">
        <form @submit.prevent="sendEmail" novalidate>
          <div class="col-md-5 email pl0 mb20">
            <!-- <p class="mb45">
              {{ $t('Enter your email to receive instructions on how to reset your password.') }}
            </p> -->

            <base-input
              type="email"
              name="email"
              v-model="email"
              focus
              :placeholder="$t('Email address')"
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
          </div>
          <button-full class="mb35 resetbutton" type="submit">
            {{ $t("Reset password") }}
          </button-full>
          <!-- <div class="center-xs">
            {{ $t('or') }}
            <a href="#" @click.prevent="switchElem">
              {{ $t('return to log in') }}
            </a>
          </div> -->
        </form>
      </template>
      <template v-if="passwordSent">
        <form class="py20">
          <p class="py30 mb0">
            {{
              $t(
                "We've sent password reset instructions to your email. Check your inbox and follow the link."
              )
            }}
          </p>
          <button-full
            class="mb35 backlogin"
            type="link"
            :link="{ name: 'login' }"
            @click.native="switchElem"
          >
            {{ $t("Back to login") }}
          </button-full>
        </form>
      </template>
    </div>
  </div>
</template>

<script>
import ButtonFull from "theme/components/theme/ButtonFull.vue";
import BaseInput from "../Form/BaseInput.vue";
import { required, email } from "vuelidate/lib/validators";
import { Logger } from "@vue-storefront/core/lib/logger";
import i18n from "@vue-storefront/i18n";

export default {
  validations: {
    email: {
      required,
      email,
    },
  },
  methods: {
    close() {
      this.$bus.$emit("modal-hide", "modal-signup");
    },
    sendEmail() {
      // todo: send email with reset password instructions

      if (this.$v.$invalid) {
        this.$v.$touch();
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: i18n.t("Please fix the validation errors"),
          action1: { label: i18n.t("OK") },
        });
        return;
      }

      this.$bus.$emit(
        "notification-progress-start",
        i18n.t("Resetting the password ... ")
      );
      this.$store
        .dispatch("user/resetPassword", { email: this.email })
        .then((response) => {
          this.$bus.$emit("notification-progress-stop");
          if (response.code === 200) {
            // this.passwordSent = true;
            localStorage.setItem('emailSendTo', this.email)
            this.$router.push(this.localizedRoute('/customer/account/login'))
          } else {
            this.$store.dispatch("notification/spawnNotification", {
              type: "error",
              message:
                i18n.t(response.result) ||
                i18n.t("Error while sending reset password e-mail"),
              action1: { label: i18n.t("OK"), action: "close" },
            });
          }
        })
        .catch((err) => {
          Logger.error(err)();
          this.$bus.$emit("notification-progress-stop");
        });
    },
    switchElem() {
      this.$store.commit("ui/setAuthElem", "login");
    },
  },
  name: "ForgotPass",
  data() {
    return {
      email: "",
      passwordSent: false,
    };
  },
  components: {
    ButtonFull,
    BaseInput,
  },
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
.resetbutton {
  background: #02a89a;
  width: 100%;
  color: #ffffff;
  font-size: 19px;
  padding: 19.5px;
  font-weight: bold;
  border-radius: 3px;
  max-width: 308px;
}
.backlogin {
  background: #02a89a;
  width: 100%;
  color: #ffffff;
  font-size: 19px;
  padding: 19.5px;
  font-weight: bold;
  border-radius: 3px;
  max-width: 308px;
}
.modal-content {
  @media (max-width: 400px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
@media (max-width: 767px) {
  .modal-content {
    padding-top: 0;
    p {
      padding-top: 0;
      font-size: 12px;
    }
  }
  .email {
    margin-bottom: 0;
  }
  .resetbutton {
    min-width: 166px;
    padding: 10px;
    font-size: 12px;
    width: 50%;
  }
  .backlogin {
    min-width: 166px;
    padding: 10px;
    font-size: 12px;
    width: 50%;
  }
}
</style>
<style lang="scss">
.ForgetpasswordForm {
  .base-input {
    min-height: 5.5rem;
  }
  input {
    background: #ebebeb;
    border: 1px solid #ebebeb;
    padding: 26px;
  }
  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -23px;
    font-size: 16px;
    color: #6b6b6c;
    font-weight: bold;
  }
  label {
    top: -23px;
    font-size: 16px;
    color: #6b6b6c;
    font-weight: bold;
  }
  label:after {
    content: "*";
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 0px;
    font-size: 17px;
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
  }
}
</style>
