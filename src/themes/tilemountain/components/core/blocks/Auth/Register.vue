<template>
  <div class="RegisterForm">
    <div class="modal-content bg-cl-primary pt30 pb60 px65 pl0 cl-secondary">
      <form @submit.prevent="register" novalidate>
        <div class="row mb10 col-md-9 pl0">
          <base-input
            class="col-md-6 col-xs-12 firstname"
            type="text"
            name="first-name"
            autocomplete="given-name"
            v-model="firstName"
            @blur="$v.firstName.$touch()"
            focus
            :placeholder="$t('First Name')"
            :validations="[
              {
                condition: !$v.firstName.required && $v.firstName.$error,
                text: $t('Field is required.'),
              },
              {
                condition: !$v.firstName.minLength,
                text: $t('Name must have at least 2 letters.'),
              },
              {
                condition: !$v.firstName.alpha && $v.firstName.$error,
                text: $t('Accepts only alphabet characters.'),
              },
            ]"
          />
          <base-input
            class="col-md-6 col-xs-12"
            type="text"
            name="last-name"
            autocomplete="last-name"
            v-model="lastName"
            @blur="$v.lastName.$touch()"
            :placeholder="$t('Last Name')"
            :validations="[
              {
                condition: !$v.lastName.required && $v.lastName.$error,
                text: $t('Field is required.'),
              },
              {
                condition: !$v.lastName.alpha && $v.lastName.$error,
                text: $t('Accepts only alphabet characters.'),
              },
            ]"
          />
        </div>
        <div class="row col-md-5 email pl0">
          <base-input
            class="mb10 col-xs-12"
            type="email"
            name="email"
            autocomplete="email"
            v-model="email"
            @blur="$v.email.$touch()"
            :placeholder="$t('Email Address')"
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
        <div class="row mb10 col-md-9 pl0 password-group">
          <base-input
            class="col-md-6 col-xs-12 firstpassword"
            type="password"
            name="password"
            ref="password"
            autocomplete="new-password"
            v-model="password"
            @blur="$v.password.$touch()"
            :placeholder="$t('Password')"
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
          <div class="passsword-validate">
            <label>(Minimum password length is 7 characters)</label>
          </div>
          <base-input
            class="col-md-6 col-xs-12"
            type="password"
            name="password-confirm"
            autocomplete="new-password"
            v-model="rPassword"
            @blur="$v.rPassword.$touch()"
            :placeholder="$t('Confirm Password')"
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
        </div>
        <base-checkbox
          class="mb10 terms"
          id="terms"
          v-model="conditions"
          @blur="$v.conditions.$reset()"
          @change="$v.conditions.$touch()"
          :validations="[
            {
              condition: !$v.conditions.sameAs && $v.conditions.$error,
              text: $t('You must accept the terms and conditions.'),
            },
          ]"
        >
          {{ $t('I accept terms and conditions') }}
        </base-checkbox>
        <button-full class="mb20 col-md-6 registerbutton" type="submit">
          {{ $t('Login') }}
        </button-full>
      </form>
      <p class="btn-message">
        By proceeding you are agreeing to our
        <router-link :to="localizedRoute('/i/terms_and_condition')" class="term"
        >Terms & Conditions
        </router-link
        >&nbsp;and
        <router-link :to="localizedRoute('/i/privacy_policy')" class="privacy"
        >Privacy Policy
        </router-link
        >
      </p>
    </div>
  </div>
</template>
<script>
import Register from '@vue-storefront/core/compatibility/components/blocks/Auth/Register'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox.vue'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import { mapGetters } from 'vuex'
import {
  currentStoreView,
  localizedRoute,
} from '@vue-storefront/core/lib/multistore'
import {
  required,
  email,
  minLength,
  sameAs,
  alpha,
} from 'vuelidate/lib/validators'

export default {
  validations: {
    email: {
      required,
      email,
    },
    firstName: {
      minLength: minLength(2),
      required,
      alpha,
    },
    lastName: {
      required,
      alpha,
    },
    password: {
      minLength: minLength(8),
      required,
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
    conditions: {
      sameAs: sameAs(() => true),
    },
  },
  mixins: [Register],
  components: {
    ButtonFull,
    BaseCheckbox,
    BaseInput,
  },
  computed: {
    ...mapGetters({
      isLogged: 'user/isLoggedIn',
    }),
  },
  mounted () {
    if (this.isLogged) {
      this.$router.push(localizedRoute('/', currentStoreView().storeCode))
    }
  },
  methods: {
    register () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') },
        })
        return
      }
      this.callRegister()
    },
    onSuccess () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('You are logged in!'),
        action1: { label: this.$t('OK') },
      })
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
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

.btn-message {
  font-style: italic;
  font-size: 12px;
  color: #8b8c8e;
  margin-top: 0;
  margin-bottom: 18px;
  @media (min-width: 767px) {
    font-size: 13px;
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

.registerbutton {
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

  .password-group {
    position: relative;

    .passsword-validate {
      position: absolute;
      left: 95px;
      top: -25px;

      label {
        font-size: 13px;
        color: #c7c8c9;
        margin-left: 5px;
        font-style: italic;
        font-weight: 100;
        width: 100%;
        min-width: 255px;
        @media (max-width: 1200px) and (min-width: 992px) {
          left: -234px;
          top: -18px;
          font-size: 10px;
        }
        @media (max-width: 991px) and (min-width: 768px) {
          left: -148px;
          top: -16px;
          font-size: 7px;
        }
        @media (max-width: 767px) and (min-width: 320px) {
          font-size: 10px;
        }
      }

      ::after {
        content: none;
      }
    }
  }
}

@media (max-width: 767px) {
  .modal-content {
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 16px;
  }
  .firstname {
    margin-bottom: 8px;
  }
  .RegisterForm {
    .password-group {
      .passsword-validate {
        left: 75px;
        top: -22px;
      }

      .firstpassword {
        margin-bottom: 30px;
      }
    }
  }
  .registerbutton {
    min-width: 166px;
    padding: 10px;
    font-size: 12px;
    width: 50%;
  }
  .btn-message {
    font-size: 9px;
  }
}
</style>
<style lang="scss">
.RegisterForm {
  .base-input {
    min-height: 5.5rem;
  }

  .password-group {
    .base-input {
      min-height: 3.5rem;
    }
  }

  input {
    background: #ebebeb;
    border: 1px solid #ebebeb;
    padding: 28px;
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
    content: '*';
    color: #ef0b0b;
    position: absolute;
    right: -10px;
    bottom: 0px;
    font-size: 17px;
  }

  .terms label:after {
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

  .email {
    input {
      width: 90.5%;
      @media (max-width: 767px) {
        width: 100%;
      }
    }
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
      top: 6px;
      left: 2px;
      width: 10px;
      height: 4px;
    }
  }
}
</style>

