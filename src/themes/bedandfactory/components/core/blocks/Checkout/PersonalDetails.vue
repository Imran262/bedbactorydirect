<template>
  <div class="personal-details">
    <div class="non-selected-tick" />
    <div class="row pl20 pr20">
      <!-- <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{
            'bg-cl-th-accent': isActive || isFilled,
            'bg-cl-tertiary': !isFilled && !isActive
          }"
        >
          1
        </div>
      </div>-->
      <div class="col-xs-12 col-sm-9 col-md-12">
        <div class="row">
          <div class="col-xs-12 col-md-12" :class="{ 'cl-bg-tertiary': !isFilled && !isActive }">
            <h3 class="m0 mb5">{{ $t('Your Details') }}</h3>
          </div>
          <div class="col-xs-12 col-md-5 pr45">
            <div class="lh30 flex" v-if="isFilled && !isActive">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5">{{ $t('Edit personal details') }}</span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20 pr20" v-if="isActive">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 mb30">
            <div class="border-top" />
          </div>
          <base-input
            class="col-xs-12 col-md-6 mb10 name-filed"
            type="text"
            :autofocus="true"
            name="first-name"
            :placeholder="$t('First name *')"
            v-model.trim="personalDetails.firstName"
            @blur="$v.personalDetails.firstName.$touch()"
            autocomplete="given-name"
            :validations="[
              {
                condition:
                  $v.personalDetails.firstName.$error &&
                  !$v.personalDetails.firstName.required,
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
            :placeholder="$t('Last name *')"
            v-model.trim="personalDetails.lastName"
            @blur="$v.personalDetails.lastName.$touch()"
            autocomplete="family-name"
            :validations="[
              {
                condition:
                  $v.personalDetails.lastName.$error &&
                  !$v.personalDetails.lastName.required,
                text: $t('Field is required')
              }
            ]"
          />

          <base-input
            class="col-xs-12 mb10"
            type="email"
            name="email-address"
            :placeholder="$t('Email address *')"
            v-model="personalDetails.emailAddress"
            @blur="$v.personalDetails.emailAddress.$touch()"
            autocomplete="email"
            @keyup.enter="sendDataToCheckout"
            :validations="[
              {
                condition:
                  $v.personalDetails.emailAddress.$error &&
                  !$v.personalDetails.emailAddress.required,
                text: $t('Field is required')
              },
              {
                condition:
                  !$v.personalDetails.emailAddress.email &&
                  $v.personalDetails.emailAddress.$error,
                text: $t('Please provide valid e-mail address.')
              }
            ]"
          />

          <base-checkbox
            v-if="!currentUser"
            class="col-xs-12 mb15"
            id="createAccountCheckbox"
            v-model="createAccount"
          >{{ $t('I want to create an account') }}</base-checkbox>

          <template v-if="createAccount && !currentUser">
            <base-input
              class="col-xs-12 mb10 mt10"
              type="password"
              name="password"
              ref="password"
              :placeholder="$t('Password *')"
              v-model="password"
              @blur="$v.password.$touch()"
              autocomplete="new-password"
              :validations="[
                {
                  condition: $v.password.$error && !$v.password.required,
                  text: $t('Field is required.')
                },
                {
                  condition: !$v.password.minLength,
                  text: $t('Password must have at least 8 letters.')
                }
              ]"
            />

            <base-input
              class="col-xs-12 mb25"
              type="password"
              name="password-confirm"
              :placeholder="$t('Repeat password *')"
              v-model="rPassword"
              autocomplete="new-password"
              :validations="[
                {
                  condition: $v.rPassword.$error && !$v.rPassword.required,
                  text: $t('Field is required.')
                },
                {
                  condition: !$v.rPassword.minLength,
                  text: $t('Password must have at least 8 letters.')
                },
                {
                  condition: !$v.rPassword.sameAsPassword,
                  text: $t('Passwords must be identical.')
                }
              ]"
            />

            <base-checkbox
              class="col-xs-12 mb15"
              id="acceptConditions"
              @blur="$v.acceptConditions.$touch()"
              v-model="acceptConditions"
              :validations="[
                {
                  condition:
                    !$v.acceptConditions.required && $v.acceptConditions.$error,
                  text: $t('You must accept the terms and conditions.')
                }
              ]"
            >
              {{ $t('I accept ') }}
              <span
                class="link pointer"
                @click.prevent="$bus.$emit('modal-toggle', 'modal-terms')"
              >
                <router-link :to="localizedRoute('/i/terms')">{{ $t('Terms and conditions') }}</router-link>
              </span>*
            </base-checkbox>
          </template>
        </div>
      </div>
    </div>
    <div class="row" v-show="isActive">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-9 col-md-10">
        <div class="row my30 pl10">
          <div class="col-xs-12 col-md-7 px20 button-container">
            <button-full
              data-testid="personalDetailsSubmit"
              @click.native="sendDataToCheckout(); checkedFn();"
              :disabled="
                createAccount ? $v.$invalid : $v.personalDetails.$invalid
              "
            >
              {{
              $t(
              isVirtualCart ? 'Continue to payment' : 'Continue to Delivery'
              )
              }}
            </button-full>
          </div>
          <div class="col-xs-12 col-md-5 center-xs end-md checkout-btn-text" v-if="!currentUser">
            <p class="h4 cl-accent">
              {{ $t('or') }}
              <span class="link pointer" @click.prevent="gotoAccount">
                {{
                $t('login to your account')
                }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20" v-if="!isActive && isFilled">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-9 col-md-11">
        <div class="row fs16 mb35">
          <div class="col-xs-12 h4">
            <p>
              <span class="firstName-text">
                {{
                personalDetails.firstName
                }}
              </span>
              <span class="lastName-text">{{ personalDetails.lastName }}</span>
            </p>
            <div>
              <span class="pr15">{{ personalDetails.emailAddress }}</span>
              <tooltip>{{ $t('We will send you details regarding the order') }}</tooltip>
            </div>
            <template v-if="createAccount && !currentUser">
              <base-checkbox
                class="mt25"
                id="createAccountCheckboxInfo"
                v-model="createAccount"
                disabled
              >{{ $t('Create a new account') }}</base-checkbox>
              <p class="h5 cl-tertiary">
                {{
                $t(
                'The new account will be created with the purchase. You will receive details on e-mail.'
                )
                }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails';

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import ButtonFull from 'theme/components/theme/ButtonFull';
import Tooltip from 'theme/components/core/Tooltip';
import { mapGetters } from 'vuex';
import axios from 'axios';
export default {
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart',
      getCartToken: 'cart/getCartToken',
      getPersonalDetails: 'checkout/getPersonalDetails',
      isLoggedIn: 'user/isLoggedIn'
    })
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
    },
    password: {
      required,
      minLength: minLength(8)
    },
    rPassword: {
      required,
      minLength: minLength(8),
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      required
    }
  },
  methods: {
    checkedFn: function() {
      var to_detail_elem = document.getElementsByClassName(
        'checkout-top-detail'
      )[0];
      to_detail_elem.classList.add('top-detail-active');
      var tick_elem = document.getElementsByClassName('non-selected-tick')[0];
      tick_elem.classList.add('tick-active');
    }
  }
};
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
  font-family: 'Poppins', sans-serif;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  position: relative;
  h3 {
    color: #676767;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
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
  input:focus ~ label[data-v-63eab3fe],
  input:not(.empty) ~ label[data-v-63eab3fe] {
    top: -15px;
    font-size: 14px;
    color: #4dba87;
  }
  span {
    // color: #676767;
  }
  label {
    color: #676767;
    font-size: 16px;
  }
  input:checked + label {
    &:before {
      background-color: #4dba87;
      border-color: #4dba87;
      cursor: pointer;
    }
    &:after {
      background-color: #4dba87;
    }
  }
  .button-container {
    button {
      background-color: #4DBA87;
      border-radius: 5px;
      padding: 12px 0px;
      :hover {
        border-radius: 5px;
        background-color: #4dba87;
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
</style>
