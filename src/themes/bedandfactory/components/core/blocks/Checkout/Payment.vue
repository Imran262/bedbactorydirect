<template>
  <div class="payment pt20 billing-payment" id="scrollToPayment">
    <div class="non-selected-tick" />
    <div class="row pl20 pr20">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row">
          <div
            class="col-xs-12 col-md-7"
            :class="{ 'cl-bg-tertiary': !isFilled && !isActive }"
          >
            <h3 class="m0 mb5">{{ $t("Billing Details") }}</h3>
          </div>
          <div class="col-xs-12 col-md-12 pr30">
            <div class="lh30 flex start-lg" v-if="isFilled && !isActive">
              <a href="#" class="cl-tertiary flex" @click.prevent="edit">
                <span class="pr5">{{ $t("Edit payment") }}</span>
                <i class="material-icons cl-tertiary">edit</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20 pr20" v-if="isActive">
      <div class="col-xs-11 col-sm-12 col-md-10">
        <div class="row" v-if="isActive">
          <base-checkbox
            class="col-xs-12 mb15"
            id="sendToShippingAddressCheckbox"
            v-model="sendToShippingAddress"
            @click="setIsBillingSame()"
            v-if="!isVirtualCart"
            >{{ $t("Billing address is same as delivery address") }}</base-checkbox
          >

          <base-checkbox
            v-if="hasBillingData()"
            class="col-xs-12 mb15"
            id="sendToBillingAddressCheckbox"
            v-model="sendToBillingAddress"
            @click="setIsBillingSame()"
            >{{ $t("Use my billing data") }}</base-checkbox
          >
          <template v-if="!isBillingSame">
            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="first-name"
              :placeholder="$t('First name *')"
              v-model.trim="payment.firstName"
              @blur="$v.payment.firstName.$touch()"
              autocomplete="given-name"
              :validations="[
                {
                  condition:
                    $v.payment.firstName.$error && !$v.payment.firstName.required,
                  text: $t('Field is required'),
                },
                {
                  condition: !$v.payment.firstName.minLength,
                  text: $t('Name must have at least 2 letters.'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="last-name"
              :placeholder="$t('Last name *')"
              v-model.trim="payment.lastName"
              @blur="$v.payment.lastName.$touch()"
              autocomplete="family-name"
              :validations="[
                {
                  condition:
                    $v.payment.lastName.$error && !$v.payment.lastName.required,
                  text: $t('Field is required'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 mb10"
              type="text"
              name="street-address"
              :placeholder="$t('Street name and House/Apartment number *')"
              v-model.trim="payment.streetAddress"
              @blur="$v.payment.streetAddress.$touch()"
              autocomplete="address-line1"
              :validations="[
                {
                  condition:
                    $v.payment.streetAddress.$error &&
                    !$v.payment.streetAddress.required,
                  text: $t('Field is required'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 mb10"
              type="text"
              name="apartment-number"
              :placeholder="$t(' ')"
              v-model.trim="payment.apartmentNumber"
              autocomplete="address-line2"
            />

            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="city"
              :placeholder="$t('City *')"
              v-model.trim="payment.city"
              @blur="$v.payment.city.$touch()"
              autocomplete="address-level2"
              :validations="[
                {
                  condition: $v.payment.city.$error && !$v.payment.city.required,
                  text: $t('Field is required'),
                },
                {
                  condition: $v.payment.city.$error && $v.payment.city.required,
                  text: $t('Please provide valid city name'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="state"
              :placeholder="$t('State / Province')"
              v-model.trim="payment.state"
              autocomplete="address-level1"
            />

            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="zip-code"
              :placeholder="$t('Zip-code *')"
              v-model.trim="payment.zipCode"
              @blur="$v.payment.zipCode.$touch()"
              autocomplete="postal-code"
              :validations="[
                {
                  condition:
                    $v.payment.zipCode.$error && !$v.payment.zipCode.required,
                  text: $t('Field is required'),
                },
                {
                  condition: !$v.payment.zipCode.minLength,
                  text: $t('Zip-code must have at least 3 letters.'),
                },
              ]"
            />

            <base-select
              class="col-xs-12 col-sm-6 mb10"
              name="countries"
              :options="countryOptions"
              :selected="payment.country"
              :placeholder="$t('Country *')"
              :validations="[
                {
                  condition:
                    $v.payment.country.$error && !$v.payment.country.required,
                  text: $t('Field is required'),
                },
              ]"
              v-model="payment.country"
              autocomplete="country-name"
              @blur="$v.payment.country.$touch()"
              @change="
                $v.payment.country.$touch();
                changeCountry();
              "
            />

            <base-input
              class="col-xs-12 mb10"
              type="tel"
              pattern="\d*"
              name="phone-number"
              :placeholder="$t('Phone Number *')"
              v-model.trim="payment.phoneNumber"
              autocomplete="tel"
              @blur="$v.payment.phoneNumber.$touch()"
              :validations="[
                {
                  condition:
                    $v.payment.phoneNumber.$error &&
                    !$v.payment.phoneNumber.required,
                  text: $t('Field is required'),
                },
                {
                  condition:
                    $v.payment.phoneNumber.$error &&
                    !$v.payment.phoneNumber.maxLength,
                  text: $t('Phone number maximum length is 11 digits'),
                },
              ]"
            />
          </template>
          <!-- <base-checkbox
            class="col-xs-12 mb15"
            id="generateInvoiceCheckbox"
            v-model="generateInvoice"
            >{{
              $t("I want to generate an invoice for the company")
            }}</base-checkbox
          > -->

          <template v-if="generateInvoice">
            <base-input
              class="col-xs-12 mb10"
              type="text"
              name="company-name"
              :placeholder="$t('Company name *')"
              v-model.trim="payment.company"
              @blur="$v.payment.company.$touch()"
              autocomplete="organization"
              :validations="[
                {
                  condition:
                    $v.payment.company.$error && !$v.payment.company.required,
                  text: $t('Field is required'),
                },
              ]"
            />

            <base-input
              class="col-xs-12 mb10"
              type="text"
              name="tax-id"
              :placeholder="$t('Tax identification number *')"
              v-model.trim="payment.taxId"
              @blur="$v.payment.taxId.$touch()"
              autocomplete="tax-id"
              :validations="[
                {
                  condition:
                    $v.payment.taxId.$error && !$v.payment.taxId.required,
                  text: $t('Field is required'),
                },
                {
                  condition: !$v.payment.taxId.minLength,
                  text: $t(
                    'Tax identification number must have at least 3 letters.'
                  ),
                },
              ]"
            />

            <div class="col-xs-12 mb25">
              <label class="fs16">{{
                $t("We will send you the invoice to given e-mail address")
              }}</label>
            </div>
          </template>
          <div class="col-xs-12">
            <h4>{{ $t("Promotional Code") }}</h4>
            <div class="row py20">
              <div v-if="OnlineOnly && !addCouponPressed" class="col-xs-12">
                <button
                  class="p10 brdr-none serif fs-medium cl-white bg-cl-puerto-rico voucher-code-btn"
                  type="button"
                  @click="addDiscountCoupon"
                >
                  {{ $t("I Have a Code") }}
                </button>
              </div>
              <div
                v-if="OnlineOnly && addCouponPressed"
                class="col-xs-12 pt30 coupon-wrapper"
              >
                <div class="coupon-input">
                  <label class="h6 cl-secondary">
                    {{ $t("Enter your coupon if you have one") }}
                  </label>
                  <base-input
                    type="text"
                    id="couponinput"
                    :autofocus="true"
                    v-model.trim="couponCode"
                    @keyup.enter="setCoupon"
                  />
                </div>
                <button-outline
                  color="light"
                  class="cl-white"
                  :class="[!couponCode ? 'bgcolor' : '']"
                  :disabled="!couponCode"
                  @click.native="setCoupon"
                  >{{ $t("Apply Voucher") }}</button-outline
                >
              </div>
            </div>
          </div>
          <div class="col-xs-12">
            <h4>{{ $t("Payment method") }}</h4>
          </div>
          <div
            class="mb8 cl-error required-field-error"
            v-if="$v.payment.$invalid"
          >
            Please Enter All required fields*
          </div>
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            class="col-md-12 payment-method-inner"
          >
            <label
              class="radioStyled payment-method-icons"
              v-if="method.code !== 'braintree' && method.code !== 'braintree_paypal' && method.code !==  'braintree_cc_vault'"
            >
              <template v-if="method.code === 'braintree'">
                <p class="paymentTitle">Pay By Card (Braintree)</p></template
              >
              <template v-else-if="method.code === 'paypal_express'">
                <p class="paymentTitle">Paypal</p></template
              >
              <template v-else
                ><p class="paymentTitle">
                  {{ method.title ? method.title : method.name }}
                </p></template
              >
              <input
                type="radio"
                :value="method.code"
                name="payment-method"
                v-model="payment.paymentMethod"
                @click="enablePaymentMethod(method.code)"
                @change="
                  $v.payment.paymentMethod.$touch();
                  changePaymentMethod();
                "
                :disabled="$v.payment.$invalid"
              />
              <span
                class="checkmark"
                :class="!radioCheckedFlag ? 'allunchecked' : ''"
              />
              <div
                class="bank-card"
                v-if="method.code === 'checkoutcom_card_payment'"
              >
                <ul>
                  <li>
                    <img src="/assets/footer/footer-master-card-icon.png" />
                  </li>
                  <li>
                    <img src="/assets/footer/footer-master-pro-icon.png" />
                  </li>
                  <li>
                    <img src="/assets/footer/footer-visa-icon.png" />
                  </li>
                </ul>
              </div>

              <div class="bank-card" v-if="method.code === 'paypal_express'">
                <ul>
                  <li>
                    <img src="/assets/footer/footer-paypal-icon.png" />
                  </li>
                </ul>
              </div>
              <template v-if="method.code === 'braintree'">
                <span v-if="showPaymentCard">
                  <div class="order-review right-padding pt20 mb35">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                      <div class="row paddingLeft pr20">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                          <div class="row mb15 mt20">
                            <div class="col-xs-12">
                              <div class="row">
                                <div class="cartsummary-wrapper">
                                  <braintree-dropin
                                    ref="braintreeREF"
                                    @configured="setOption()"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12">
                    <div class="row pb35">
                      <div class="col-xs-12 col-md-8 px20">
                        <slot name="placeOrderButton">
                          <button-full
                            data-testid="orderReviewSubmit"
                            class="place-order-btn"
                            >{{ $t("Place the order") }}</button-full
                          >
                        </slot>
                      </div>
                    </div>
                  </div>
                </span>
              </template>
              <template v-if="method.code === 'checkoutcom_card_payment'">
                <span v-if="showCheckoutCom">
                  <CheckoutPaymentDropin v-if="!$v.payment.$invalid" />
                </span>
              </template>
              <!-- {{method.code}}
              {{showPaypal}} -->
              <template v-if="method.code === 'paypal_express'">
                <span v-if="showPaypal">
                  <paypal-button v-if="!$v.payment.$invalid" />
                </span>
              </template>

              <!-- <span @click="handleOrderSubmit">
                <paypal-button
                  v-if="
                    payment.paymentMethod === 'paypal_express' &&
                    payment.paymentMethod === method.code &&
                    !$v.payment.$invalid &&
                    radioCheckedFlag
                  "
                />
              </span>
              <p
                v-if="
                  payment.paymentMethod === 'paypal_express' &&
                  payment.paymentMethod === method.code &&
                  !$v.payment.$invalid &&
                  radioCheckedFlag
                "
              >
                Please note! &nbsp;Once you click the 'paypal' button a new
                window will open for you to complete your order
              </p> -->
            </label>
          </div>
          <span
            class="validation-error"
            v-if="!$v.payment.paymentMethod.required"
            >{{ $t("Field is required") }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength ,maxLength } from "vuelidate/lib/validators";
import {
  unicodeAlpha,
  unicodeAlphaNum,
} from "@vue-storefront/core/helpers/validators";
import { Payment } from "@vue-storefront/core/modules/checkout/components/Payment";
import i18n from "@vue-storefront/i18n";
import BaseCheckbox from "theme/components/core/blocks/Form/BaseCheckbox";
import BaseInput from "theme/components/core/blocks/Form/BaseInput";
import BaseSelect from "theme/components/core/blocks/Form/BaseSelect";
import ButtonFull from "theme/components/theme/ButtonFull";
import Tooltip from "theme/components/core/Tooltip";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import VueOfflineMixin from "vue-offline/mixin";
import ButtonOutline from "theme/components/theme/ButtonOutline";
import BraintreeDropin from "src/modules/vsf-p-braintree/components/Dropin";
import CheckoutPaymentDropin from "src/modules/vsf-checkout-integration/components/CheckoutPaymentDropin";
import PaypalButton from "src/modules/vsf-payment-paypal/components/Button";

export default {
  data() {
    return {
      radioCheckedFlag: false,
      addCouponPressed: false,
      couponCode: "",
      isCouponApplied: null,
      showPaymentCard: false,
      showCheckoutCom: false,
      showPaypal: false,
      showSubmitButton: false,
      loaderCount: 0,
      isBillingSame: false,
    };
  },
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    ButtonFull,
    Tooltip,
    ButtonOutline,
    BraintreeDropin,
    CheckoutPaymentDropin,
    PaypalButton,
  },
  mixins: [Payment],
  async created() {
    let checkoutCdn = document.createElement("script");
    checkoutCdn.setAttribute(
      "src",
      "https://cdn.checkout.com/js/framesv2.min.js"
    );
    await document.head.appendChild(checkoutCdn);
  },
  props: {
    OnlineOnly: {
      type: Boolean,
    },
  },
  computed: {
    countryOptions() {
      return this.countries.map((item) => {
        return {
          value: item.code,
          label: item.name,
        };
      });
    },
  },
  validations() {
    if (!this.generateInvoice) {
      return {
        payment: {
          firstName: {
            required,
            minLength: minLength(2),
            unicodeAlpha,
          },
          lastName: {
            required,
            unicodeAlpha,
          },
          country: {
            required,
          },
          streetAddress: {
            required,
            unicodeAlphaNum,
          },

          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum,
          },
          city: {
            required,
            unicodeAlpha,
          },
          paymentMethod: {
            required,
          },
          phoneNumber: {
            required,
            maxLength: maxLength(11)
          }
        },
      };
    } else {
      return {
        payment: {
          firstName: {
            required,
            minLength: minLength(2),
            unicodeAlpha,
          },
          lastName: {
            required,
            unicodeAlpha,
          },
          company: {
            required,
            unicodeAlphaNum,
          },
          taxId: {
            required,
            minLength: minLength(3),
          },
          country: {
            required,
          },
          streetAddress: {
            required,
            unicodeAlphaNum,
          },
          zipCode: {
            required,
            minLength: minLength(3),
            unicodeAlphaNum,
          },
          city: {
            required,
            unicodeAlpha,
          },
          paymentMethod: {
            required,
          },
          phoneNumber: {
            required,
            maxLength: maxLength(11)
          }
        },
      };
    }
  },
  methods: {
    setIsBillingSame() {
      // console.log('running checkbox....',this.isBillingSame);
      return this.isBillingSame = !this.isBillingSame;
    },
    setOption() {
      console.log("987766 Emit recieved");
      this.$bus.$emit(
              "notification-progress-stop",
              this.$t("loading braintree...")
            );
      let braintreeOptions = document.querySelectorAll(".braintree-option");
      console.log("Braintree options",braintreeOptions,typeof braintreeOptions);
      braintreeOptions.forEach((option,index) => {
        console.log("option no ",index," is ", option, typeof option,"\n", option.classList);
        option.classList.forEach((classs,classIndex) => {
          console.log("class at index ",classIndex," is ",classs,"\n","classs.search('card') != -1",classs.search("card") != -1);
          if (classs.search("card") != -1) {
            // console.log("option is ",option);
            console.log("classs.search('card') != -1 condition matched");
            option.click();
            this.$bus.$emit(
              "notification-progress-stop",
              this.$t("loading braintree...")
            );
            this.showSubmitButton = true;
    //        console.log ("112233 ",document.querySelectorAll(".braintree-large-button")[0].classList);
            document.querySelectorAll(".braintree-large-button")[0].classList.add("hide-button");
            console.log ("112233 ",document.querySelectorAll(".braintree-large-button")[0].classList);
          }
        });
      });
    },
    enablePaymentMethod(method) {
      this.sendDataToCheckout();
      this.paymentcheckedFn();
      this.showSubmitButton = false;
      this.showCheckoutCom = false;
      this.showPaypal = false;
      if (method === "braintree") {
        if (!this.showPaymentCard) {
          this.$bus.$emit(
            "notification-progress-start",
            this.$t("loading braintree...")
          );
        }
        this.showPaymentCard = true;
        this.showCheckoutCom = false;
        this.showPaypal = false;
      } else if (method === "checkoutcom_card_payment") {
        this.showCheckoutCom = true;
        this.showPaypal = false;
        this.showPaymentCard = false;
      } else if (method === "paypal_express") {
        //   console.log("1122 pay pal ");
        this.showPaymentCard = false;
        this.showCheckoutCom = false;
        this.showPaypal = true;
      } else {
        // console.log("1122 else  ");
        this.showPaymentCard = false;
        this.showCheckoutCom = false;
        this.showPaypal = false;
      }
    },
    ...mapActions({
      applyCoupon: "cart/applyCoupon",
    }),
    paymentcheckedFn: function () {
      this.radioCheckedFlag = true;
    },
    async setCoupon() {
      try {
        const couponApplied = await this.applyCoupon(this.couponCode);
        this.addCouponPressed = false;
        this.couponCode = "";
        console.log("couponApplied", couponApplied);
        if (couponApplied === true) {
          this.$store.dispatch("notification/spawnNotification", {
            type: "success",
            message: i18n.t("Coupon Applied"),
            action1: { label: i18n.t("OK") },
          });
        }
      } catch (error) {
        if (!this.getCoupon) {
          this.$store.dispatch("notification/spawnNotification", {
            type: "warning",
            message: i18n.t(
              "You've entered an incorrect coupon code. Please try again."
            ),
            action1: { label: i18n.t("OK") },
          });
        }
      }
    },
    addDiscountCoupon() {
      this.addCouponPressed = true;
    },
    onSuccess() {},
    onFailure(result) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(result.result),
        action1: { label: this.$t("OK") },
      });
    },
  },
  destroyed() {
    this.radioCheckedFlag = false;
  },
};
</script>
<style lang="scss" >
.hide-button{
  display: none;
}

</style>
<style lang="scss" scoped>
.allunchecked:after {
  display: none !important;
}
.radioStyled {
  padding-left: 0px !important;
}
.paddingLeft {
  padding-left: 3%;
}
.paymentTitle {
  padding-left: 30px;
  margin: 0;
}
.order-review {
  background: #fff;
  padding: 12px 0px 0px 0px;
  font-family: "Poppins", sans-serif;
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
    font-family: "Poppins", sans-serif;
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
      background-color: #00bfb3;
      border-radius: 5px;
      padding: 12px 0px;
      :hover {
        border-radius: 5px;
        background-color: #4dba87;
      }
    }
  }
}
.cartsummary-wrapper .cart-summary-main {
  @media (min-width: 320px) {
    display: none;
  }
}
.bgcolor {
  background-color: #C8EADC !important;
}
.payment-first-name {
  display: none;
}
.payment-last-name {
  display: none;
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
  font-family: "Poppins", sans-serif;
  margin: 25px 0px;
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
    font-family: "Poppins", sans-serif;
  }
  .border-top {
    border-top: 1px solid #bdbdbd;
  }
  .select-wrapper {
    select {
      color: #676767;
    }
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
    color: #4dba87;
  }
  span {
    color: #676767;
  }
  label {
    color: #676767;
    font-size: 16px;
    float: left;
  }
  .checkmark {
    &:after {
      background: #4dba87 !important;
    }
  }
  button {
    background-color: #00bfb3;
    border-radius: 5px;
    font-size: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    :hover {
      border-radius: 5px;
      background-color: #4dba87;
    }
  }
}
input:checked + label {
  &::before {
    background-color: #4dba87;
    border-color: #4dba87;
    cursor: pointer;
  }
  &::after {
    background-color: #4dba87;
  }
}
.border-box {
  // color: #676767;
}
.sb-payment-method-label {
  display: flex !important;
  justify-content: end;
}
.payment-method-icons {
  width: 100%;
}
.bank-card {
  display: flex;
  left: 217px;
  float: left;
  display: block;
  position: absolute;
  top: 0;
  right: auto;
}
.bank-card ul {
  padding-left: 15px;
  margin: 0;
}
.bank-card ul li {
  list-style-type: none;
  float: left;
  display: inline-block;
}
.bank-card ul li img {
  margin-left: 5px;
}
.required-field-error {
  margin-left: 10px;
  margin-bottom: 15px;
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
  .paymentTitle {
    padding-left: 26px;
    margin: 0;
  }
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
  .right-padding {
    margin-right: 25px;
  }
}
@media (min-width: 320px) and (max-width: 767px) {
  .paymentTitle {
    /* padding-left: 26px; */
    margin: 0;
  }
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
@media (min-width: 768px) and (max-width: 992px) {
  .bank-card ul li img {
    width: 35px;
  }
}
</style>