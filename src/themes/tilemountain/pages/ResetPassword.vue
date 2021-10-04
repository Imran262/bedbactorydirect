<template>
<div class="container mt10">
  <div class="row">
  <div class="reset-password col-md-12 col-xs-12">
    <h2 class="reset-password__heading">
      {{ $t('Reset password') }}
    </h2>
    <form class="reset-password__form col-md-12 flex pl0">
      <div class="reset-password__row col-md-5 new-password">
        <base-input
          class="mb10"
          type="password"
          name="password"
          v-model="password"
          @blur="$v.password.$touch()"
          :placeholder="$t('New Password')"
          :validations="[{
            condition: !$v.password.required && $v.password.$error,
            text: $t('Field is required.')
          }]"
        />
      </div>
      <div class="reset-password__row col-md-5 confirmPassword">
        <base-input
          class="mb10"
          type="password"
          name="password-confirm"
          v-model="rPassword"
          @blur="$v.password.$touch()"
          @keyup.enter="!$v.$invalid ? resetPassword() : null"
          :placeholder="$t('Confirm New password')"
          :validations="[
            {
              condition: !$v.rPassword.required && $v.rPassword.$error,
              text: $t('Field is required.')
            },
            {
              condition: !$v.rPassword.sameAsPassword && $v.rPassword.$error,
              text: $t('Passwords must be identical.')
            }
          ]"
        />
      </div>
    </form>
    <div class="reset-password__row reset-button">
    <ButtonFull
      theme="dark"
      :disabled="$v.$invalid"
      @click.native="resetPassword"
    >
      {{ $t('Reset password') }}
    </ButtonFull>
  </div>
  </div>
  </div>
  </div>
</template>

<script>
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore';
import i18n from '@vue-storefront/i18n';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {

  name: 'ResetPassword',

  data () {
    return {
      email: this.$route.query.email,
      password: '',
      rPassword: ''
    };
  },

  components: {
    ButtonFull,
    BaseInput
  },

  validations: {
    password: {
      minLength: minLength(8),
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    }
  },

  methods: {

    async resetPassword () {
      const { storeCode } = currentStoreView();

      // 1. Change password
      //  a) Sign in if success
      //  b) Display error if fail

      // Start progress notification
      const { id: changingNotificationId } = await this.$store.dispatch('notification/spawnNotification', {
        action1: { label: i18n.t('OK') },
        message: i18n.t('Changing password in progress ...'),
        type: 'success',
        hasNoTimeout: true
      });

      try {
        // Send request to the VSF-API
        let response = await this.$store.dispatch('user/createPassword', {
          email: this.email,
          newPassword: this.password,
          resetToken: this.$route.query.token
        })

        this.$store.dispatch('notification/removeNotificationById', changingNotificationId);

        if (response.code === 500) {
          const responseMessage = response.result && response.result.errorMessage && response.result.errorMessage.includes('No such entity with email')
            ? i18n.t('Provided email does not exist')
            : response.result.errorMessage

          this.$store.dispatch('notification/spawnNotification', {
            action1: { label: i18n.t('OK') },
            message: responseMessage,
            type: 'error'
          });
        } else if (response.code === 200) {
          console.log("78945676 notificationData");
          this.$store.dispatch('notification/spawnNotification', {
            action1: { label: i18n.t('OK') },
            message: i18n.t('Sucessfully changed password'),
            type: 'success'
          });

          if (this.$store.state.config.users.loginAfterCreatePassword) {
            console.log("7894567674 notificationData",changingNotificationId);
            const { id: authNotificationId } = this.$store.dispatch('notification/spawnNotification', {
              action1: { label: i18n.t('OK') },
              message: i18n.t('Authorization in progress ...'),
              type: 'success',
              // hasNoTimeout: true
            });

            // Now we are singing in
            try {
              let loginResult = await this.$store.dispatch('user/login', {
                username: this.email,
                password: this.password
              });
              this.$store.dispatch('notification/removeNotificationById', authNotificationId);

              if (loginResult.code !== 200) {
                console.log("789456769 notificationData",changingNotificationId);
                this.$store.dispatch('notification/spawnNotification', {
                  action1: { label: i18n.t('OK') },
                  message: i18n.t('Something went wrong, sorry'),
                  type: 'error'
                });
              } else {
                this.$router.push(this.localizedRoute('/'));
              }
            } catch (err) {
              this.$store.dispatch('notification/removeNotificationById', authNotificationId);

              this.$store.dispatch('notification/spawnNotification', {
                action1: { label: i18n.t('OK') },
                message: i18n.t('Something went wrong, sorry'),
                type: 'error'
              });
            }
          } else {
            this.$router.push(this.localizedRoute('/'));
          }
        }
      } catch (err) {
        // Never invoked (?)
        console.log("78945676 notificationData",changingNotificationId);
        await this.$store.dispatch('notification/removeNotificationById', changingNotificationId);
        console.log("78945678 notificationData",{
          action1: { label: i18n.t('OK') },
          message: i18n.t('Something went wrong, sorry'),
          type: 'error'
        });
        await this.$store.dispatch('notification/spawnNotification', {
          action1: { label: i18n.t('OK') },
          message: i18n.t('Something went wrong, sorry'),
          type: 'error'
        });
      }
    }
  },

  async asyncData ({ context, route }) {
    // route.query.token & email are needed for this route
    // Otherwise redirect to the home
    const { storeCode } = currentStoreView();
    if (context) {
      if (!route.query.token || !route.query.email) {
        context.server.response.redirect(localizedRoute('/'));
      }
    }
  }
};
</script>

<style scoped>
.reset-password__form{
  padding-top: 12px;
}
  .reset-password {
    padding: 20px 30px;
  }
  .reset-password h2 {
  font-family: oblik;
  font-size: 41px;
  color: #29275b;
}
.reset-button button {
  background: #02a89a;
  width: 100%;
  color: #ffff;
  font-size: 19px;
  padding: 19.5px;
  font-weight: bold;
  border-radius: 3px;
  max-width: 308px;
}
.new-password{
  padding-left: 0;
}
@media(max-width: 767px){
  .container {
    display: block;
  }
  .reset-password {
    padding-top: 0;
  }
  .reset-password h2 {
    font-size: 20px;
    margin-top: 9px;
  }
  .reset-password__form {
    display: inline;
  }
  .new-password {
    padding-top: 25px;
  }
.reset-button button {
    min-width: 166px !important;
    padding: 10px !important;
    font-size: 12px !important;
    width: 50% !important;
}
}
</style>
<style lang="scss">
.reset-button .disabled {
  background: #02a89a;
}
// .reset-button .button-disabled{
//   opacity: 1;
// }
.reset-password__form {
  .base-input {
    min-height: 5.5rem;
  }
  input {
    background: #ebebeb !important;
    border: 1px solid #ebebeb;
    padding: 26px;
  }
  input:focus ~ label,
  input:not(.empty) ~ label {
    top: -23px !important;
    font-size: 16px !important;
    color: #6b6b6c;
    font-weight: bold;
  }
  label {
    top: -23px !important;
    font-size: 16px !important;
    color: #6b6b6c !important;
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
    border-color: #ebebeb !important;
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
      font-size: 12px !important;
      top: -17px;
    }
  }
}
</style>