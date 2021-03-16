<template>
  <div class="payment pt20 billing-payment line relative">

    <div class="row pl30 pr20" >
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row fs16 mb35">
            <div class="col-xs-6 col-lg-6 ">
              <h3>{{ $t('Payment method') }}</h3>
            </div>
            <div class="col-xs-6 col-lg-6">
               <div class="lh30 flex end-lg payment-edit">
              <a href="#" class="cl-tertiary flex" @click.prevent="editPayment">
                <span class="pr5">
                  {{ $t('Edit payment') }}
                </span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
            </div>

            <div class="col-md-6 mb15">
              <label class="radioStyled"> {{  $t('paypal express checkout')}}
                <input class="radio-btn" type="radio" value="" checked disabled name="chosen-payment-method">
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators'
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'
import config from 'config';

export default {
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    ButtonFull,
    Tooltip
  },
  mixins: [Payment],
  computed: {
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    },
  },
    props: {
    paymentData: {
      type: Object,
      required: false,
      }
    },
    methods:{
      editPayment() {
               let token = this.$route.query.token
                  if(config.paypalManual.mode === 'sandbox') {
              window.location.href = `https://${config.paypalManual.approvalUrl.sandbox}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`
              } else {
                window.location.href = `https://${config.paypalManual.approvalUrl.live}/cgi-bin/webscr?cmd=_express-checkout&token=${token}`
              }
      }
    },

  validations () {
    if (!this.generateInvoice) {
      return {
        payment: {
          firstName: {
            required,
            minLength: minLength(2),
            unicodeAlpha
          },
          lastName: {
            required,
            unicodeAlpha
          },
          country: {
            required
          },
          phoneNumber: {
            required
          },
          streetAddress: {
            required,
            unicodeAlphaNum
          },
          apartmentNumber: {
            required,
            unicodeAlphaNum
          },
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      }
    } else {
      return {
        payment: {
          firstName: {
            required,
            minLength: minLength(2),
            unicodeAlpha
          },
          lastName: {
            required,
            unicodeAlpha
          },
          company: {
            required,
            unicodeAlphaNum
          },
          taxId: {
            required,
            minLength: minLength(3)
          },
          country: {
            required
          },
          phoneNumber: {
            required
          },
          streetAddress: {
            required,
            unicodeAlphaNum
          },
          apartmentNumber: {
            required,
            unicodeAlphaNum
          },
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum
          },
          city: {
            required,
            unicodeAlpha
          },
          paymentMethod: {
            required
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.payment-first-name {
  display: none;
}

.payment-last-name {
  display: none;
}
.payment-edit{
  float: right;
  margin-top: 17px;
}
.crafty-postcodelookup input.postalcode-lookup {
  border: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid;
  border-color: #bdbdbd;
  margin-bottom: 10px;
}

.crafty-postcodelookup {
  padding: 0px 10px 5px 10px;
  position: relative;
  width: 100%;
}

.crafty-postcodelookup input.postalcode-lookup:focus {
  outline: none;
  border-color: #4dba87;
}

div#crafty_postcode_result_display_1 {
  width: 100%;
  padding: 0px 0px 10px 0px;
  margin-top: 15px;
}

button.find-address {
  background: #54575b;
  border: none;
  padding: 15px 35px;
  color: #fff;
  position: absolute;
  margin-top: 20px;
  margin-left: 15px;
}

.payment {
  background: #fff;
  padding: 12px 0px 0px 0px;
  margin: 25px 0px;
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  position: relative;
  border: 1px solid #bdbdbd;

  h3 {
  font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: 'oblik';
    color: #3A3E3D;
  }

  .promo-code {
    padding-top: 20px;
    font-family: Arial, Helvetica, sans-serif;
    padding-right: 28px;
    span {
      cursor: pointer;
      font-size: 16px;
      float: right;
      padding: 0;
      position: relative;
    }
  }

  .border-top {
    border-top: 1px solid #bdbdbd;
  }

  .select-wrapper {
    select {
      color: #676767;
    }
  }

  .sb-payment-method-label {
    color: #4a4a4a !important;
    font-weight: 500 !important;
  }

  h4 {
    color: #676767;
    font-weight: 600;
  }

  input {
    font-size: 16px;
  }

  input:focus ~ label[data-v-63eab3fe],
  input:not(.empty) ~ label[data-v-63eab3fe] {
    top: -15px;
    font-size: 14px;
    color: #00998c;
  }

  span {
    color: #676767;
  }

  label {
    color: #676767;
    font-size: 16px;
  }

  .checkmark {
    &:after {
      background: #00998c !important;
    }
  }

  button {
    background-color: #2a275c;
    border-radius: 0px;
    font-size: 18px;
    padding: 0px;
    font-weight: 700;

    height: 48px;
    min-width: auto;
    border: none;

    :hover {
      background-color: #27998B;
    }
  }
}

input:checked + label {
  &::before {
    background-color: #00998c;
    border-color: #00998c;
    cursor: pointer;
  }

  &::after {
    background-color: #00998c;
  }
}

.border-box {
  // color: #676767;
}

.sb-payment-method-label {
  display: flex !important;
  justify-content: flex-start;
}

.bank-card ul {
  padding-left: 15px;
  margin: 0;
}

.bank-card ul li {
  list-style-type: none;
  float: left;
}

.bank-card ul li img {
  margin-left: 5px;
}

.required-field-error {
  margin-left: 10px;
  margin-bottom: 15px;
  font-size: 12px;
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

.code-button {
  margin-left: 15px;
}

span.postcodelookup-required {
  width: 100%;
  float: left;
}

.billing-payment .payment-phone-number {
  margin-top: 20px;
}

@media (min-width: 320px) and (max-width: 480px) {
  .bank-card ul {
    padding-left: 5px;
  }
  .bank-card ul li img {
    width: 22px;
  }
}

/*Payment all unchecked */
.allunchecked:after {
  display: none !important;
}

@media (min-width: 575px) and (max-width: 767px) {
  .radioStyled.sb-payment-method-label {
    font-size: 10px !important;
    line-height: 20px !important;
  }
  .bank-card ul li img {
    width: 22px;
  }
}

/*Payment all unchecked */
@media (min-width: 320px) and (max-width: 767px) {
  .find-address {
    margin-left: -10px !important;
    width: 100%;
    display: inline-block;
    margin-top: 0px !important;
  }
  .crafty-postcodelookup input.postalcode-lookup {
    width: 100%;
    display: block;
    padding-left: 0;
    padding-right: 0;
  }
  .street-name {
    margin-top: 40px;
  }
  .billing-payment input {
    margin-top: 10px;
  }
}
.radio-btn {
    height: 13px;
}
.payment .promo-code span:after {
  position: absolute;
  content: '';
  border-bottom: 1px solid #bcb5b5;
  width: 100%;
  transform: translateX(-50%);
  bottom: 0px;
  left: 50%;
}
@media (max-width: 374px) {
  .promo-code {
    padding-right: 8px;
    span {
      font-size: 11.5px !important;
    }
  }
  .payment .promo-code span:after {
    bottom: 0px;
    left: 50%;
    max-width: 158px;
  }
}
</style>
