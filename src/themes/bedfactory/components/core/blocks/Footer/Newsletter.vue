<template>
  <form @submit.prevent="subscribe(onSuccesfulSubmission)" novalidate>
    <div class="enter-email-address">
      <input
        type="text"
        name="email"
        autocomplete="email"
        v-model="email"
        :class="$v.email.email && email.length > 1 ? 'validEmail' : !$v.email.email && email.length > 0 ? 'invalidEmail' :'' "
        @click="inputEmailclick"
        placeholder="Enter your email address..."
      />
      <button
        type="submit"
        :disabled="this.$v.$invalid"
        :class="this.$v.$invalid ? 'subscribeBtnDisabled' :'subscribeBtnEnabled' "
      >
        <img src="/assets/footer/footer-links-arrow-icon.png" />
      </button>
    </div>
    <!-- <div class="enter-email-address">
      <base-input
        focus
        type="email"
        name="email"
        v-model="email"
        autocomplete="email"
        :placeholder="$t('E-mail address *')"
        :validations="[
              {
                condition: $v.email.$error && !$v.email.required,
                text: $t('Field is required.')
              },
              {
                condition: !$v.email.email && $v.email.$error,
                text: $t('Please provide valid e-mail address.')
              }
            ]"
      />
    </div>-->
    <!-- <button-full
      class="subscribenewbtn"
      type="submit"
      :disabled="this.$v.$invalid"
      @click.native="$v.email.$touch"
    >{{ $t('Subscribe') }}</button-full>-->
  </form>
</template>
<script>
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus';
import Subscribe from '@vue-storefront/core/modules/newsletter/mixins/Subscribe';
import i18n from '@vue-storefront/i18n';

import ButtonFull from 'theme/components/theme/ButtonFull.vue';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput.vue';

export default {
  beforeDestroy() {
    this.$off('validation-error');
  },
  methods: {
    onSuccesfulSubmission(isSubscribed) {
      if (isSubscribed) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t(
            'You have been successfully subscribed to our newsletter!'
          ),
          action1: { label: i18n.t('OK') }
        });
      }
    },
    inputEmailclick() {
      console.log('Ali', this.email, this.$v.email.email, 'Event ', event);
      event.toElement.classList.add('invalidEmail');
    }
  },
  components: {
    ButtonFull,
    BaseInput
  },
  mixins: [SubscriptionStatus, Subscribe]
};
</script>
<style scoped>
.enter-email-address input {
  width: 100%;
  margin: 0;
  padding: 0px 10px;
  float: left;
  border-radius: 5px 0px 0px 5px;
  height: 40px;
  border: 1px solid #cccccc;
  font-size: 16px;
  box-shadow: none;
}

.enter-email-address input:focus,
.enter-email-address input:visited {
  box-shadow: none;
  outline: none;
}

.enter-email-address button {
  background: #4dba87;
  height: 42px;
  border: 0;
  padding: 0 20px;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: inline;
}

.enter-email-address {
  position: relative;
  display: flex;
}
button.subscribeBtnDisabled {
  background: #4dba8775 !important;
}

input.invalidEmail {
  border: 1px solid #ff1313 !important;
}
</style>
