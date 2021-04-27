<template>
  <div
    class="payment pt20 billing-payment"
    id="paymentId"
    :class="hasFreePaymentMethod ? 'paymentSectionHide' : 'paymentSectionShow'"
  >
    <div class="row pl20 pr20">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row">
          <div class="col-xs-6 col-md-6 payment-heading">
            <h3 class="payment-top">
              {{ $t('Payment Method') }}
            </h3>
          </div>
          <div class="col-xs-6 col-md-6 promo-code">
            <span @click="addDiscountCoupon"
              >Have a promotional / gift code?</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="freePaymentForm">
          <template v-if="generateInvoice">
            <form method="post" name="addressPayment" class="form-row row">
              <base-checkbox
                class="col-xs-12 mb15 copy-checkbox"
                id="sendToShippingAddressCheckbox"
                v-model="sendToShippingAddress"
                v-if="!isVirtualCart"
              >
                {{ $t('Same details as delivery') }}
              </base-checkbox>
              <!--@click is To validate the phoneNumber that it is less than 11 digits-->
              <base-checkbox
                v-if="hasBillingData()"
                @click="$v.payment.phoneNumber.$touch()"
                class="col-xs-12 mb15"
                id="sendToBillingAddressCheckbox"
                v-model="sendToBillingAddress"
              >
                {{ $t('Use my billing data') }}
              </base-checkbox>
              <div class="crafty-postcodelookup" id="postalcode">
                <label>Postcode</label>
                <input
                  type="text"
                  id="search-bar1"
                  name="postcode"
                  class="postalcode-lookup"
                  placeholder=""
                  v-model="payment.zipCode"
                  @click="postalcodelookup"
                  @input="postalcodelookup"
                />
                <button
                  type="button"
                  class="find-address"
                  onclick="cp_obj_2.doLookup()"
                  @touchenter="activateFindAddress"
                  @mouseenter="activateFindAddress"
                >
                  Find Address
                </button>
                <span
                  v-if="payment.zipCode === ''"
                  class="postcodelookup-required"
                  >Field is required</span
                >
              </div>
              <div
                class="postcode-select"
                id="crafty_postcode_result_display_2"
              >
                &nbsp;
              </div>
              <div
                class="datafields relative base-input col-xs-12 col-md-12 col-sm-12"
              >
                <base-input
                  class="col-xs-12 col-sm-6 mb10 payment-first-name"
                  type="text"
                  name="first-name"
                  :placeholder="$t('First name *')"
                  v-model.trim="payment.firstName"
                  @blur="$v.payment.firstName.$touch()"
                  autocomplete="given-name"
                  :validations="[
                    {
                      condition:
                        $v.payment.firstName.$error &&
                        !$v.payment.firstName.required,
                      text: $t('Field is required'),
                    },
                    {
                      condition: !$v.payment.firstName.minLength,
                      text: $t('Name must have at least 2 letters.'),
                    },
                  ]"
                />

                <base-input
                  class="col-xs-12 col-sm-6 mb10 payment-last-name"
                  type="text"
                  name="last-name"
                  :placeholder="$t('Last name *')"
                  v-model.trim="payment.lastName"
                  @blur="$v.payment.lastName.$touch()"
                  autocomplete="family-name"
                  :validations="[
                    {
                      condition:
                        $v.payment.lastName.$error &&
                        !$v.payment.lastName.required,
                      text: $t('Field is required'),
                    },
                  ]"
                />

                <base-input
                  class="col-xs-12 mb10 street-name"
                  type="text"
                  name="company-name"
                  :placeholder="$t('Company')"
                  v-model.trim="payment.company"
                  autocomplete="company-name"
                />

                <base-input
                  class="col-xs-12 mb10 apartment-no"
                  type="text"
                  name="street-address"
                  :placeholder="$t('Street name and House/Apartment number')"
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
                  class="col-xs-12 mb10 apartment-no-2"
                  type="text"
                  name="apartment-number"
                  :placeholder="$t('')"
                  v-model.trim="payment.apartmentNumber"
                  autocomplete="address-line2"
                />

                <base-input
                  class="col-xs-12 col-sm-12 mb10 city"
                  type="text"
                  name="city"
                  :placeholder="$t('City')"
                  v-model.trim="payment.city"
                  @blur="$v.payment.city.$touch()"
                  autocomplete="address-level2"
                  :validations="[
                    {
                      condition:
                        $v.payment.city.$error && !$v.payment.city.required,
                      text: $t('Field is required'),
                    },
                    {
                      condition:
                        $v.payment.city.$error && $v.payment.city.required,
                      text: $t('Please provide valid city name'),
                    },
                  ]"
                />

                <base-input
                  class="col-xs-12 col-sm-6 mb10 hidden"
                  type="text"
                  name="zip-code"
                  :placeholder="$t('Post Code')"
                  v-model.trim="payment.zipCode"
                  @blur="$v.payment.zipCode.$touch()"
                  autocomplete="postal-code"
                  :validations="[
                    {
                      condition:
                        $v.payment.zipCode.$error &&
                        !$v.payment.zipCode.required,
                      text: $t('Field is required'),
                    },
                    {
                      condition: !$v.payment.zipCode.minLength,
                      text: $t('Post Code must have at least 3 letters.'),
                    },
                  ]"
                />

                <base-select
                  class="col-md-6 col-xs-12 col-sm-12 mb10 country"
                  name="countries"
                  :options="countryOptions"
                  :selected="'GB'"
                  :placeholder="$t('Country')"
                  :validations="[
                    {
                      condition:
                        $v.payment.country.$error &&
                        !$v.payment.country.required,
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
                  class="col-xs-12 col-sm-12 mb15 payment-phone-number"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  onkeydown="return event.keyCode !== 69"
                  name="phone-number"
                  :placeholder="$t('Phone Number')"
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
              </div>
            </form>
          </template>

          <div class="col-xs-12">
            <div class="py20 pb10 pl20 pr20" v-if="promoShow">
              <div
                v-if="OnlineOnly && addCouponPressed"
                class="row coupon-wrapper"
              >
                <div class="coupon-input col-md-6 col-xs-8">
                  <!-- <label class="h6 cl-secondary">
                    {{
                    $t('Enter your coupon if you have one')
                    }}
                  </label>-->
                  <base-input
                    type="text"
                    id="couponinput"
                    :autofocus="true"
                    v-model.trim="couponCode"
                    @keyup.enter="setCoupon"
                  />
                </div>
                <button-outline
                  class="cl-white col-md-4 col-xs-4"
                  :disabled="!couponCode"
                  @click.native="setCoupon"
                >
                  {{ $t('Apply ') }}
                </button-outline>
              </div>
            </div>
          </div>
          <div
            class="mb8 cl-error required-field-error"
            v-if="$v.payment.$invalid || !isValid"
          >
            Please Enter All required fields*
          </div>
          <div
            v-for="(method, index) in paymentMethods"
            :key="index"
            class="col-md-12"
            v-if="method.code==='checkoutcom_card_payment' || method.code==='paypal_express'"
          >
            <label class="radioStyled sb-payment-method-label">
              {{ method.title ? method.title : method.name }}
              <input
                type="radio"
                :value="method.code"
                name="payment-method"
                ref="paymentMethodRef"
                v-model="payment.paymentMethod"
                @change="
                  $v.payment.paymentMethod.$touch();
                  changePaymentMethod();
                "
                @click="paymentcheckedFn(), paymentMethodCheck(method.title)"
                :disabled="$v.payment.$invalid || !isValid"
              />
              <span
                class="checkmark black-border-checkmark"
                :class="!radioCheckedFlag ? 'allunchecked' : ''"
              />
              <div
                class="bank-card"
                v-if="method.code === 'checkoutcom_card_payment'"
              >
                <ul>
                  <li>
                    <img
                      src="/assets/footer/footer-master-card-icon.png"
                      alt="master card"
                    />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-master-pro-icon.png"
                      alt="master pro"
                    />
                  </li>
                  <li>
                    <img src="/assets/footer/footer-visa-icon.png" alt="visa" />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-paypal-icon.png"
                      alt="paypal"
                    />
                  </li>
                </ul>
              </div>
              <div class="bank-card" v-if="method.code === 'braintree'">
                <ul>
                  <li>
                    <img
                      src="/assets/footer/footer-master-card-icon.png"
                      alt="master card"
                    />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-master-pro-icon.png"
                      alt="master pro"
                    />
                  </li>
                  <li>
                    <img src="/assets/footer/footer-visa-icon.png" alt="visa" />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-paypal-icon.png"
                      alt="paypal"
                    />
                  </li>
                </ul>
              </div>
              <div class="bank-card" v-if="method.code === 'paypal_express'">
                <ul>
                  <li>
                    <img
                      src="/assets/footer/footer-paypal-icon.png"
                      alt="paypal"
                    />
                  </li>
                </ul>
              </div>
              <div class="bank-card" v-if="method.code === 'sagepaysuitepi'">
                <ul>
                  <li>
                    <img
                      src="/assets/footer/footer-master-card-icon.png"
                      alt="master card"
                    />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-master-pro-icon.png"
                      alt="master pro"
                    />
                  </li>
                  <li>
                    <img src="/assets/footer/footer-visa-icon.png" alt="visa" />
                  </li>
                  <li>
                    <img
                      src="/assets/footer/footer-paypal-icon.png"
                      alt="paypal"
                    />
                  </li>
                </ul>
              </div>
            </label>
            <!--<CheckoutPaymentDropin
              v-if="
                payment.paymentMethod === 'checkoutcom_card_payment' &&
                  payment.paymentMethod === method.code &&
                  !$v.payment.$invalid &&
                  radioCheckedFlag
              "
            />-->
            <!--<span @click="handleOrderSubmit">
              <paypal-button
                v-if="
                  payment.paymentMethod === 'paypal_express' &&
                    payment.paymentMethod === method.code &&
                    !$v.payment.$invalid &&
                    radioCheckedFlag
                "
              />
            </span>-->
            <div
              class="payment-sage"
              v-if="
                payment.paymentMethod === 'checkoutcom_card_payment' &&
                payment.paymentMethod === method.code &&
                !$v.payment.$invalid &&
                radioCheckedFlag
              "
            >
              <CheckoutCom
                :payment="payment.paymentMethod"
                v-if="payment.paymentMethod === 'checkoutcom_card_payment'"
              />
            </div>
            <p
              v-if="
                payment.paymentMethod === 'paypal_express' &&
                payment.paymentMethod === method.code &&
                !$v.payment.$invalid &&
                radioCheckedFlag
              "
            >
              Please note! &nbsp;Once you click the 'paypal' button a new window
              will open for you to complete your order
            </p>
          </div>
          <div class="payment-sage" v-if="radioCheckedFlag">
            <SagePayDropin
              class="payment-sage-inner"
              :payment="payment.paymentMethod"
              v-if="payment.paymentMethod === 'sagepaysuitepi'"
            />
          </div>
          <span
            class="validation-error"
            v-if="!$v.payment.paymentMethod.required"
            >{{ $t('Field is required') }}</span
          >
        </div>
      </div>
    </div>
    <div class="sagepay-container row pl20">
      <div class="hidden-xs col-sm-2 col-md-1" />
    </div>
  </div>
</template>

<script>
import { required, minLength, email, maxLength } from 'vuelidate/lib/validators'
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators'
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment'
import i18n from '@vue-storefront/i18n'
import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import VueOfflineMixin from 'vue-offline/mixin'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
import PaypalButton from '../../../../../../modules/vsf-paypal-method/components/Button'
// import CheckoutPaymentDropin from 'src/modules/vsf-checkout-integration/components/CheckoutPaymentDropin';

import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { registerModule } from '@vue-storefront/core/lib/modules'
import Composite from '@vue-storefront/core/mixins/composite'
import CheckoutCom from '../../../../../../modules/vsf-payment-checkout-com/components/CardFrame'
const SagePayDropin = () => import('./SagePayment')

export default {
  data () {
    return {
      radioCheckedFlag: false,
      addCouponPressed: false,
      couponCode: '',
      isCouponApplied: null,
      paymentMethodSelected: false,
      promoShow: false,
      count: 0,
      proceedToPaymentButton: false
    }
  },
  components: {
    BaseCheckbox,
    BaseInput,
    BaseSelect,
    ButtonFull,
    Tooltip,
    ButtonOutline,
    PaypalButton,
    // CheckoutPaymentDropin,
    SagePayDropin,
    OrderReview,
    CheckoutCom
  },
  mixins: [ Payment, VueOfflineMixin, OrderReview, Composite ],
  mounted () {
    this.sendToShippingAddress = true
    this.$bus.$on('checkout-before-placeOrder', async () => {
      if(this.getPersonalDetails.createAccount) {
        await this.register()
      }
    })
    this.$bus.$on('autoFillBilling', async (data) => {
      this.sendToShippingAddress = true
      this.sendDataToCheckout('free')
    })
    this.payment.country = 'GB'
  },
  beforeCreate () {
    registerModule(OrderModule)
  },
  computed: {
    ...mapGetters({
      appliedCoupon: 'cart/getCoupon',
      getPersonalDetails: 'checkout/getPersonalDetails'
    }),
    emailAddress () {
      return this.getPersonalDetails.emailAddress
    },
    isValid () {
      if((this.$v.emailAddress.$invalid && !this.$v.emailAddress.required) || (this.$v.emailAddress.$invalid && !this.$v.emailAddress.email)) {
        return false
      } else {
        return true
      }

    },
    hasFreePaymentMethod () {
      if(this.paymentMethods && this.paymentMethods.length > 0) {
        let freePaymentMethod = this.paymentMethods.filter((pm) => {
          return pm.code === 'free'
        })
        if(freePaymentMethod.length > 0) {
          if(this.$refs.paymentMethodRef) {
            this.$refs.paymentMethodRef.forEach((single) => {
              if(single.value === 'free') {
                if(document.getElementById('paymentId')) {
                  document.getElementById('paymentId').style.display = 'none'
                }
                single.click()
              }
            })
          }
        }
        return freePaymentMethod.length > 0
      }
    },
    countryOptions () {
      this.payment.firstName = this.getPersonalDetails.firstName.trim()
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.payment.lastName = this.getPersonalDetails.lastName.trim()
      return this.countries.map(item => {
        return {
          value: item.code,
          label: item.name
        }
      })
    },
    getPaymentDetails () {
      const paymentDetails = this.$store.getters[ 'checkout/getPaymentDetails' ]
      const cartToken = this.$store.getters[ 'cart/getCartToken' ]
      const personalDetails = this.$store.getters[
        'checkout/getPersonalDetails'
      ]
      return {
        cartId: cartToken,
        email: personalDetails.emailAddress,
        paymentMethod: {
          method: paymentDetails.paymentMethod
        },
        billingAddress: {
          countryId: paymentDetails.country,
          region: paymentDetails.state,
          street: [
            paymentDetails.streetAddress,
            paymentDetails.apartmentNumber
          ],
          telephone: paymentDetails.phoneNumber,
          postcode: paymentDetails.zipCode,
          city: paymentDetails.city,
          firstname: paymentDetails.firstName,
          lastname: paymentDetails.lastName,
          saveInAddressBook: null
        }
      }
    }
  },
  validations: {
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
      streetAddress: {
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
      },
      phoneNumber: {
        required,
        maxLength: maxLength(11)
      }
    },
    emailAddress: {
      required,
      email
    }
  },
  methods: {
    activateFindAddress () {
      this.postalcodelookup()
    },
    ...mapActions({
      applyCoupon: 'cart/applyCoupon'
    }),
    async handleOrderSubmit () {
      await this.placeOrder()
    },
    codeshow () {
      this.promoShow = true
    },
    paymentcheckedFn: function() {
      if(!this.radioCheckedFlag) {
        this.sendDataToCheckout()
      }
      this.radioCheckedFlag = true
    },
    paymentMethodCheck: function(data) {
      let proceedbtnTitle = ''
      this.$refs.paymentMethodRef.forEach((single) => {
        if(single.checked) {
          if(single.value === 'checkoutcom_card_payment') {
            proceedbtnTitle = 'Buy Now'
          } else if(single.value === 'paypal_express') {
            proceedbtnTitle = 'PayPal'
          } else if(single.value === 'sagepaysuitepi') {
            proceedbtnTitle = 'SagePay'
          } else if(single.value === 'cashondelivery') {
            proceedbtnTitle = 'Cash on delivery'
          } else if(single.value === 'checkmo') {
            proceedbtnTitle = 'Check / Money order'
          } else if(single.value === 'free') {
            proceedbtnTitle = 'Order Sample'
          } else {
            proceedbtnTitle = 'Payment'
          }
        }
      })
      this.$emit('paymentMethodChecked', {
        btn: true,
        title: proceedbtnTitle
      })
    },
    async setCoupon () {
      try {
        const couponApplied = await this.applyCoupon(this.couponCode)
        this.addCouponPressed = false
        this.couponCode = ''
        if(couponApplied === true) {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'success',
            message: i18n.t('Coupon Applied'),
            action1: { label: i18n.t('OK') }
          })
        }
      } catch(error) {
        if(!this.getCoupon) {
          this.$store.dispatch('notification/spawnNotification', {
            type: 'warning',
            message: i18n.t(
              'You\'ve entered an incorrect coupon code. Please try again.'
            ),
            action1: { label: i18n.t('OK') }
          })
        }
      }
    },
    async postalcodelookup () {
      if(this.count++ < 1) {
        console.log('From payment lookup')
        const craftyplugin_args = document.createElement('script')
        craftyplugin_args.innerHTML = `var cp_access_token = "0408b-db3a6-cc0af-02842";
          var cp_obj_2 = CraftyPostcodeCreate();
          cp_obj_2.set("access_token", cp_access_token);
          cp_obj_2.set("result_elem_id", "crafty_postcode_result_display_2");
          cp_obj_2.set("busy_img_url", "/assets/crafty_postcode_busy.gif");
          cp_obj_2.set("first_res_line", "----- Please Select Your Address ----");
          cp_obj_2.set("res_autoselect", "0");
          cp_obj_2.set("hide_result", 1);
          cp_obj_2.set("form", "addressPayment");
          cp_obj_2.set("elem_company"  , "company-name");
          cp_obj_2.set("elem_street1"  , "street-address");
          cp_obj_2.set("elem_street2"  , "apartment-number");
          cp_obj_2.set("elem_town"     , "city");cp_obj_2.set("elem_county"   , "state");
          cp_obj_2.set("elem_postcode" , "postcode");cp_obj_2.set("single_res_autoselect" , 1);
          cp_obj_2.set("hide_result", "1");
           cp_obj_2.set("on_result_ready", function(){
            document.getElementById('find-address').disabled = false;
            document.getElementById("postalcode").style.marginBottom = 0 + "px";
            document.getElementById("crafty_postcode_result_display_2").style.display = "block";
            const crafty = document.querySelector("#crafty_postcode_result_display_2");
            const p = document.createElement('p');
            p.innerText = "Can't find your address? Enter manually below";
            crafty.append(p);
            });
           cp_obj_2.set("on_result_selected", function(){
           document.getElementById("crafty_postcode_result_display_2").style.display = "none";
           document.getElementById("postalcode").style.marginBottom = 17 + "px";
           var ele1 = document.getElementsByName('city')[0];
           ele1vale = ele1.value;
           if (ele1vale !== ''){
              ele1.classList.remove('empty');
              console.log('sasasasasassasasasasasasasa')
              document.getElementsByName('countries')[0].value == 'JE'
           }
           var ele2 = document.getElementsByName('zip-code')[0];
           ele2vale = ele2.value;
           if (ele2vale !== '') {
                ele2.classList.remove('empty');
           }
           var ele3 = document.getElementsByName('street-address')[0];
           ele3vale = ele3.value;
           if (ele3vale !== ''){
                ele3.classList.remove('empty');
           }
           var ele4 = document.getElementsByName('apartment-number')[0];
           ele4vale = ele4.value;
           if(ele4vale !== '') {
                ele4.classList.remove('empty');
           }
           var ele5 = document.getElementsByName('state')[0];
           ele5vale = ele5.value;
           if(ele5vale !== '') {
                ele5.classList.remove('empty');
           }
           var ele6 = document.getElementsByName('company-name')[0];
           ele6vale = ele6.value;
           if (ele6vale !== '') {
                ele6.classList.remove('empty');
           }
           console.log('cp_obj_2',cp_obj_2)
           document.getElementById('search-bar1').click();
           });`
        document.head.appendChild(craftyplugin_args)
      }
      // if(this.sendToShippingAddress) {
      var ele1 = document.getElementsByName('street-address')[ 1 ].value
      this.payment.streetAddress = ele1
      var ele2 = document.getElementsByName('apartment-number')[ 1 ].value
      this.payment.apartmentNumber = ele2
      var ele3 = document.getElementsByName('city')[ 1 ].value
      this.payment.city = ele3
      if(this.payment.city === 'JERSEY' || this.payment.city === 'Jersey' || this.payment.city === 'jersey') {
        this.payment.country = 'JE'
      } else if(this.payment.city === 'GUERNSEY' || this.payment.city === 'Guernsey' || this.payment.city === 'guernsey') {
        this.payment.country = 'GG'
      } else {
        this.payment.country = 'GB'
      }
      var ele4 = document.getElementsByName('state')[ 0 ].value
      this.payment.state = ele4
      var ele5 = document.getElementById('search-bar1').value
      this.payment.zipCode = ele5
      var ele6 = document.getElementsByName('company-name')[ 1 ].value
      this.payment.company = ele6
      await this.$store.commit('checkout/checkout/SAVE_PAYMENT_DETAILS', {
        apartmentNumber: ele2,
        city: ele3,
        streetAddress: ele1,
        company: ele6,
        state: ele4,
        zipCode: ele5
      })
      // }
    },
    addDiscountCoupon () {
      this.addCouponPressed = true
      this.promoShow = true
    },
    onSuccess () {
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    }
  },
  destroyed () {
    this.radioCheckedFlag = false
  }
};
</script>
<style lang="scss" scoped>
.payment-first-name {
  display: none;
}

.payment-last-name {
  display: none;
}

.crafty-postcodelookup input.postalcode-lookup {
  //border: 0px;
  //padding-top: 10px;
  //padding-bottom: 10px;
  //border-bottom: 1px solid;
  //border-color: #bdbdbd;
  //margin-bottom: 10px;
  padding: 0 10px;
  border-bottom: 1px solid;
  border-color: #bdbdbd;
  float: left;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  margin-top: 19px;
  width: 100px;
}

.crafty-postcodelookup {
  padding: 0px 10px 5px 10px;
  position: relative;
  width: 100%;
  margin-top: 20px;
}

.crafty-postcodelookup input.postalcode-lookup:focus {
  outline: none;
  border-color: #bdbdbd;
}

div#crafty_postcode_result_display_2 {
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
    color: #3a3e3d;
    padding-left: 8px;
  }
  .datafields {
    .street-name {
      margin-top: 13px;
      padding-left: 0;
    }
    .apartment-no {
      margin-top: 23px;
      margin-bottom: 0;
      padding-left: 0;
    }
    .apartment-no-2 {
      padding-left: 0;
    }
    .city {
      margin-top: 23px;
      padding-left: 0;
    }
    .State {
      margin-top: 23px;
      padding-left: 0;
    }
    .country {
      margin-top: 23px;
      padding-left: 0;
    }
    .payment-phone-number {
      margin-top: 44px;
      padding-left: 0;
    }
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
    color: #a49a9a;
  }

  label {
    color: #3a3e3d;
    font-size: 16px;
    position: absolute;
    font-size: 14px;
    font-weight: 600;
  }

  .checkmark {
    &:after {
      background: #00998c !important;
    }
  }

  button {
    background-color: #29275b;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    margin-left: 5px;
    padding: 15px;

    :hover {
      background-color: #27998b;
    }
  }
}
.freePaymentForm {
  padding: 0 29px;
}
.crafty-postcodelookup label:after {
  content: '*';
  color: #ef0b0b;
  position: absolute;
  right: -10px;
  bottom: 3px;
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
  .freePaymentForm {
    padding: 0 7px 0 14px;
  }
  .find-address {
    width: 29%;
    display: inline-block;
    font-size: 12px !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    margin-left: 12px !important;
    margin-top: 19px !important;
    height: 45px;
  }
  .crafty-postcodelookup input.postalcode-lookup {
    width: 45%;
    display: block;
    padding-left: 0;
    padding-right: 0;
    border-radius: 0;
  }
  .paymentSectionShow .datafields input {
    margin: 0;
  }
  .street-name {
    margin-top: 40px;
  }
  .billing-payment input {
    margin-top: 10px;
  }
  .payment h3 {
    color: #2a275c !important;
    font-size: 20.44px !important;
    padding-left: 0;
  }
  .payment .promo-code {
    flex-basis: 47%;
    max-width: 47%;
    padding-right: 0;
    padding-left: 0px;
    padding-top: 26px;
  }
  .payment .payment-heading {
    padding: 0px 3px !important;
    flex-basis: 53%;
    max-width: 53%;
  }
  .payment .promo-code {
    span {
      font-size: 11.3px !important;
    }
  }
  .coupon-wrapper {
    margin-top: -40px;
    .coupon-input {
      padding: 0px;
    }
    button {
      background-color: #2ba897;
      border-radius: 3px;
      height: 28px;
      width: 100px;
      margin-top: 20px;
      font-size: 12px;
    }
  }
}
@media screen and (min-width: 320px) and (max-width: 767px) {
  .payment-sage-inner {
    padding-left: 18px;
  }
}
@media screen and (min-width: 400px) and (max-width: 767px) {
  .payment .promo-code {
    padding-right: 10px;
  }
}
</style>
<style lang="scss">
.paymentSectionShow {
  .datafields {
    input {
      border: 1px solid #bdbdbd;
      border-radius: 3px;
      padding: 0px 10px;
      color: #9b9b9b;
      font-size: 14px;
      height: 48px;
      line-height: 1;
      &:hover,
      &:focus {
        border: 1px solid #bdbdbd;
      }
      @media (min-width: 320px) and (max-width: 767px) {
        border-radius: 0;
      }
    }
    label {
      position: absolute;
      top: -30px;
      color: #3a3e3d;
      font-size: 14px;
      font-weight: 600;
      &:after {
        content: '*';
        color: #ef0b0b;
        position: absolute;
        right: -10px;
        bottom: 3px;
      }
    }
    input:focus ~ label,
    input:not(.empty) ~ label {
      top: -21px;
      color: #3a3e3d;
      font-size: 14px;
      @media (max-width: 767px) {
        top: -14px;
      }
    }
    .select-wrapper select {
      border: 1px solid #bdbdbd;
      border-radius: 3px;
      padding: 0px 10px;
      color: #9b9b9b;
      font-size: 14px;
      background: url(/assets/arrows-01.svg) no-repeat right;
      background-position: 95% 46%;
      -webkit-appearance: none;
      height: 48px;
      @media (min-width: 320px) and (max-width: 767px) {
        border-radius: 0;
      }
    }
    .select-wrapper:after {
      content: none;
    }
    .select-wrapper select:focus ~ label,
    .select-wrapper select:not(.empty) ~ label {
      top: -21px;
      color: #3a3e3d;
      font-size: 14px;
      @media (min-width: 320px) and (max-width: 767px) {
        left: 0;
      }
    }
  }
}
@media (max-width: 767px) {
  .paymentSectionShow .datafields .apartment-no input:focus ~ label,
  .paymentSectionShow .datafields .apartment-no input:not(.empty) ~ label {
    top: -6px;
  }
}
@media (max-width: 350px) {
  .paymentSectionShow .datafields .apartment-no label:after {
    right: 0px;
    left: 53px;
  }
  .paymentSectionShow .datafields .apartment-no input:focus ~ label,
  .paymentSectionShow .datafields .apartment-no input:not(.empty) ~ label {
    top: -18px;
  }
}
.paymentSectionShow .datafields .apartment-no-2 label:after {
  content: none;
  color: #ef0b0b;
  position: absolute;
  right: -10px;
  bottom: 3px;
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
  .payment .payment-heading {
    flex-basis: 38% !important;
    max-width: 38% !important;
  }
  .payment .promo-code {
    flex-basis: 62% !important;
    max-width: 61% !important;
  }
  .promo-code {
    padding-right: 2px !important;
    padding-top: 26px !important;
  }
  .payment .promo-code span:after {
    bottom: 0px;
    left: 50%;
    max-width: 164px;
  }
}
</style>
