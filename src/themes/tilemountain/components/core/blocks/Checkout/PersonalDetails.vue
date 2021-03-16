<template>
  <div class="personal-details">
    <div class="row pl30 pr30">
      <div class="col-xs-12 col-sm-9 col-md-12">
        <div class="row">
          <div class="col-xs-12 col-md-12">
            <h3 class="mt10 mb10">
              {{ $t('Delivery Details') }}
            </h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row mobile-border">
      <div class="col-xs-12 col-sm-12 col-md-12 mb30">
        <div class="border-top" />
      </div>
    </div>
    <div class="row pl30 pr30">
      <base-input
        class="col-xs-12 col-md-6 mb10"
        type="text"
        :autofocus="true"
        name="first-name"
        :placeholder="$t('First Name')"
        v-model.trim="personalDetails.firstName"
        @blur="$v.personalDetails.firstName.$touch()"
        autocomplete="given-name"
        :validations="[
          {
            condition: $v.personalDetails.firstName.$error && !$v.personalDetails.firstName.required,
            text: $t('Field is required')
          },
          {
            condition: !$v.personalDetails.firstName.minLength,
            text: $t('Name must have at least 2 letters.')
          }
        ]"
      />
      <base-input
        class="col-xs-12 col-md-6 mb10"
        type="text"
        name="last-name"
        :placeholder="$t('Last Name')"
        v-model.trim="personalDetails.lastName"
        @blur="$v.personalDetails.lastName.$touch()"
        autocomplete="family-name"
        :validations="[{
          condition: $v.personalDetails.lastName.$error && !$v.personalDetails.lastName.required,
          text: $t('Field is required')
        }]"
      />
      <base-input
        class="col-xs-12 mb10"
        type="email"
        name="email-address"
        :placeholder="$t('Email')"
        :emailformate ="$t('name@example.com')"
        v-model="personalDetails.emailAddress"
        @blur="$v.personalDetails.emailAddress.$touch()"
        autocomplete="email"
        @keyup.enter="sendDataToCheckout"
        @keyup="checkIfFieldsAreFilled"
        :validations="[
          {
            condition: $v.personalDetails.emailAddress.$error && !$v.personalDetails.emailAddress.required,
            text: $t('Field is required')
          },
          {
            condition: !$v.personalDetails.emailAddress.email && $v.personalDetails.emailAddress.$error,
            text: $t('Please provide valid e-mail address.')
          }
        ]"
      />
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'

export default {
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput
  },
  mixins: [PersonalDetails],
  validations: {
    personalDetails: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      }
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this.$v.$invalid) {
        this.checkIfFieldsAreFilled();
      }
    }, 500);
  },
  methods: {
    checkIfFieldsAreFilled () {
      if (this.personalDetails.firstName && this.personalDetails.lastName && this.$v.personalDetails.emailAddress.email) {
        this.sendDataToCheckout();
      }
    }
  }
}
</script>

<style lang="scss">
.link {
  text-decoration: underline;
}

.disabled[data-v-6cfcae9e] {
  background-color: gray !important;
}

.personal-details {
  background: #fff;
  padding: 12px 0px 0px 0px;
  //-webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  //-moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  //box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  position: relative;
  border-top: 1px solid #bdbdbd;
  border-left: 1px solid #bdbdbd;
  border-right: 1px solid #bdbdbd;

  h3 {
    color: #4a4a4a;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: oblik;
    margin: 5px 0px;
  }

  .cl-tertiary {
    margin-top: 15px;

    .material-icons {
      margin-top: 0px;
    }
  }

  .border-top {
    border-top: 1px solid #bdbdbd;
  }

  // input:focus ~ label[data-v-63eab3fe],
  // input:not(.empty) ~ label[data-v-63eab3fe] {
  //   top: -15px;
  //   font-size: 14px;
  //   color: #00998c;
  // }
  span {
    // color: #676767;
  }

  label {
    color: #676767;
    font-size: 16px;
  }

  input:checked + label {
    &:before {
      background-color: #00998c;
      border-color: #00998c;
      cursor: pointer;
    }

    &:after {
      background-color: #00998c;
    }
  }

  .button-container {
    button {
      background-color: #00bfb3;
      border-radius: 5px;
      padding: 12px 0px;

      :hover {
        border-radius: 5px;
        background-color: #00998c;
      }
    }
  }
}

.border-box {
  // color: #676767;
}

.pl10 {
  padding-left: 10px;
}

.pr45 {
  padding-right: 45px;
}

.login-prompt {
  @media (min-width: 1200px) {
    margin-top: 30px;
  }
}

.non-selected-tick {
  background: url(/assets/checkout-non-selected-tick.png) no-repeat 100% 100%;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}

.tick-active {
  background: url(/assets/checkout-selectd-tick.png) no-repeat 100% 100% !important;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}

@media (min-width: 767px) and (max-width: 991px) {
  .personal-details {
    .button-container {
      button {
        font-size: 14px;
        min-width: 125px !important;
      }
    }
  }
  .checkout-btn-text {
    .cl-accent {
      font-size: 14px;
      padding: 0px;
      margin: 0px;
    }
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .personal-details {
    .button-container {
      button {
        font-size: 14px;
        min-width: 125px !important;
      }
    }
  }
  .checkout-btn-text {
    .cl-accent {
      font-size: 14px;
      padding: 0px;
      margin: 10px 0px;
    }
  }
}
@media(max-width: 767px){
  .personal-details .mobile-border {
    display: none;
  }
  .personal-details h3 {
    color: #2a275c;
    font-size: 20.44px;
    margin-bottom: 15px;
  }
  .personal-details .base-input {
    margin-top: 10px;
    min-height: auto;
  }
  .personal-details input{
    border-radius: 0px !important;
  }
  .personal-details .pl30,
  .personal-details .pr30{
    padding-right: 15px;
    padding-left: 15px;
  }
}
</style>
