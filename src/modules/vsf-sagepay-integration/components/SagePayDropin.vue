<template>
  <div class="sagepay-form">
    <form id="sagepay" method="post" @submit.prevent="handleOnSubmit">
      <p>
        <label for="cardholderName">Name</label>
        <base-input
          type="text"
          name="cardholderName"
          ref="cardholderName"
          v-model="cardholderName"
          @blur="$v.cardholderName.$touch()"
          autocomplete="new-cardholderName"
          :validations="[
            {
              condition:
                $v.cardholderName.$error && !$v.cardholderName.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.cardholderName.minLength,
              text: $t('Name must have at least 3 letters.')
            }
          ]"
        />
      </p>
      <p>
        <label for="cardNumber">Card Number</label>
        <base-input
          type="number"
          name="cardNumber"
          ref="cardNumber"
          v-model="cardNumber"
          @blur="$v.cardNumber.$touch()"
          autocomplete="new-cardNumber"
          :validations="[
            {
              condition: $v.cardNumber.$error && !$v.cardNumber.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.cardNumber.minLength,
              text: $t('Card Number must have at least 13 digits.')
            }
          ]"
        />
      </p>
      <p>
        <label for="expiryDate">Expiry Date</label>
        <base-input
          type="text"
          name="expiryDate"
          ref="expiryDate"
          v-model="expiryDate"
          @blur="$v.expiryDate.$touch()"
          autocomplete="new-expiryDate"
          :validations="[
            {
              condition: $v.expiryDate.$error && !$v.expiryDate.required,
              text: $t('Field is required')
            }
          ]"
        />
      </p>
      <p>
        <label for="securityCode">Security Code</label>
        <base-input
          type="number"
          name="securityCode"
          ref="securityCode"
          v-model="securityCode"
          @blur="$v.securityCode.$touch()"
          autocomplete="new-securityCode"
          :validations="[
            {
              condition: $v.securityCode.$error && !$v.securityCode.required,
              text: $t('Field is required')
            },
            {
              condition: !$v.securityCode.minLength,
              text: $t('Security Code must have at least 3 letters.')
            }
          ]"
        />
      </p>
      <p>
        <button-full
          data-testid="sagepaySubmit"
          type="submit"
          class="sagepay-submit"
          :disabled="$v.$invalid"
        >
          {{ $t('Place Order') }}
        </button-full>
      </p>
    </form>
    <div class="dsecure-modal" :class="{'hidden': !is3DAuth}">
      <form :action="formAction" method="POST">
        <input type="hidden" name="PaReq" v-model="PaReq">
        <input type="hidden" name="TermUrl" v-model="TermUrl">
        <input type="hidden" name="Md" v-model="Md">
        <input type="submit" value="submit" ref="formButton" class="hidden">
      </form>
      <iframe id="sagepaysuitepi-3Dsecure-iframe" name="sagepaysuitepi-3Dsecure-iframe" />
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import ButtonFull from 'theme/components/theme/ButtonFull';
import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { mapGetters } from 'vuex';
import config from 'config';
import axios from 'axios';

export default {
  name: 'SagePayDropin',
  components: {
    BaseInput,
    ButtonFull
  },
  data: function () {
    const storeView = currentStoreView();
    return {
      formAction:
        'https://test.sagepay.com/mpitools/accesscontroler?action=pareq',
      is3DAuth: false,
      Md: null,
      PaReq: null,
      TermUrl: null,
      cardholderName: null,
      cardNumber: null,
      expiryDate: null,
      securityCode: null,
      creditCardType: null,
      merchantSessionKey: null,
      cardIdentifier: null,
      currency: storeView.i18n.currencyCode
    };
  },
  validations: {
    cardholderName: {
      required,
      minLength: minLength(3)
    },
    cardNumber: {
      required,
      minLength: minLength(13)
    },
    expiryDate: {
      required
    },
    securityCode: {
      required,
      minLength: minLength(3)
    }
  },
  mounted () {
    var payButton = document.getElementById('pay-button');
    var form = document.getElementById('sagepay-form');
  },
  methods: {
    checkForm: function (e) {
      if (this.name && this.age) {
        return true;
      }
      this.errors = [];
      if (!this.cardholderName) {
        this.errors.push('Please enter your card name.');
      }
      if (!this.cardNumber) {
        this.errors.push('Please enter your card number.');
      }
      if (!this.expiryDate) {
        this.errors.push('Please enter your card expiry date.');
      }
      if (!this.securityCode) {
        this.errors.push('Please enter your card security code.');
      }
      e.preventDefault();
    },
    async handleOnSubmit () {
      console.log('config.sagepay.ThreeDSecure', config.sagepay.ThreeDSecure);
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Processing order...')
      );
      let self = this;
      await this.$store.dispatch(
        'sagepay/updateEmailAddress',
        this.getEmailInfo
      );
      await this.$store.dispatch(
        'sagepay/updateShippingDetails',
        this.getShippingInformation
      );
      await this.$store.dispatch(
        'sagepay/updatePaymentInformation',
        this.getPaymentInfo
      );
      const idRes = await this.$store.dispatch(
        'sagepay/getIdentifierAndSessionKey',
        this.getCardDetails
      );
      if (idRes) {
        this.merchantSessionKey = idRes.merchantSession.merchantSessionKey;
        this.cardIdentifier = idRes.cardIdentifier.cardIdentifier;
        this.creditCardType = idRes.cardIdentifier.cardType;
      }
      try {
        const paymentRes = await this.$store.dispatch(
          'sagepay/doPayment',
          this.getPaymentProcessingData
        );
        if (!paymentRes.transaction_id) {
          this.$store.commit('ui/setLoader', false);
          this.$store.dispatch('notification/spawnNotification', {
            type: 'error',
            message: paymentRes.error_message,
            action1: { label: 'OK' }
          });
        } else if (
          paymentRes.transaction_id &&
          paymentRes.status === '3DAuth'
        ) {
          this.$bus.$emit('notification-progress-stop', {});
          // this.is3DAuth = true;
          // this.$store.commit('ui/setOverlay', true)
          this.Md = await paymentRes.transaction_id;
          this.PaReq = await paymentRes.par_eq;
          this.TermUrl =
            (await config.sagepay.ThreeDSecure) +
            `?transactionId=${paymentRes.transaction_id}&orderId=${
              paymentRes.order_id
            }&quoteId=${paymentRes.quote_id}&isViewFront=${true}`;
          // this.TermUrl = 'http://localhost:3000/'
          this.formAction = await paymentRes.acs_url;
          await this.$store.dispatch('cart/clear', {
            recreateAndSyncCart: true
          }); // just clear the items without sync
          await this.$store.dispatch('cart/sync', { forceClientState: true });

          let {
            success,
            message,
            increment_id,
            order_id,
            order,
            confirmation
          } = await axios.get(
            'https://vue.wallsandfloors.co.uk/vueapi/ext/sagepay/orderDetails?orderId=' +
              paymentRes.order_id
          );

          await localStorage.setItem(
            'lastOrderItem',
            JSON.stringify({
              order,
              confirmation,
              platformTotals: this.$store.state.cart.platformTotals,
              orderHistory: this.$store.state.user.orders_history
            })
          );
          await this.$refs.formButton.click();
        } else {
          this.$bus.$emit('notification-progress-stop', {});
          this.$store.dispatch('cart/clear', { recreateAndSyncCart: true }); // just clear the items without sync
          this.$store.dispatch('cart/sync', { forceClientState: true });
          this.$store.dispatch('checkout/setThankYouPage', true);
        }
      } catch (error) {
        console.log(error);
      }
      // if (paymentRes) {
      //   this.$bus.$emit('checkout-do-placeOrder', {
      //     card_identifier: paymentRes.paymentMethod.cardIdentifier,
      //     transactionId: paymentRes.transactionId,
      //     transaction_Id: paymentRes.transactionId,
      //     card_type: paymentRes.paymentMethod.cardType})
      // }
    }
  },
  computed: {
    ...mapGetters({
      getShippingMethods: 'shipping/getShippingMethods',
      getPersonalDetails: 'checkout/getPersonalDetails',
      getShippingDetails: 'checkout/getShippingDetails',
      getCartToken: 'cart/getCartToken',
      getUserToken: 'user/getToken',
      getPaymentDetails: 'checkout/getPaymentDetails'
    }),
    getCardDetails () {
      return {
        cardDetails: {
          cardholderName: this.cardholderName,
          cardNumber: this.cardNumber,
          expiryDate: this.expiryDate,
          securityCode: this.securityCode
        }
      };
    },
    getPaymentProcessingData () {
      return {
        cartId: this.getCartToken,
        userToken: this.getUserToken,
        requestData: {
          merchant_session_key: this.merchantSessionKey,
          card_identifier: this.cardIdentifier,
          cc_type: this.getCreditCardType,
          cc_last_four: this.getCreditCardLastFour,
          cc_exp_year: this.getCreditCardExpiryYear,
          cc_exp_month: this.getCreditCardExpiryMonth
        }
      };
    },
    getCreditCardType () {
      return this.creditCardType;
    },
    getCreditCardLastFour () {
      return this.cardNumber.slice(this.cardNumber.length - 4);
    },
    getCreditCardExpiryYear () {
      return this.expiryDate.slice(this.expiryDate.length - 2);
    },
    getCreditCardExpiryMonth () {
      return this.expiryDate.slice(0, 2);
    },
    getPaymentMethod () {
      if (this.merchantSessionKey && this.cardIdentifier) {
        return {
          card: {
            merchantSessionKey: this.merchantSessionKey,
            cardIdentifier: this.cardIdentifier
          }
        };
      }
      return null;
    },
    grandTotal () {
      let cartTotals = this.$store.getters['cart/getTotals'];
      return cartTotals.find(seg => seg.code === 'grand_total').value;
    },
    getBillingAddresses () {
      const paymentDetails = this.$store.getters['checkout/getPaymentDetails'];
      return {
        address1: paymentDetails.streetAddress,
        address2: paymentDetails.apartmentNumber,
        city: paymentDetails.city,
        postalCode: paymentDetails.zipCode,
        country: paymentDetails.country,
        state: paymentDetails.state
      };
    },
    getEmailInfo () {
      return {
        cartId: this.getCartToken,
        requestData: {
          email: this.getPersonalDetails.emailAddress
        }
      };
    },
    getShippingInformation () {
      return {
        userToken: this.getUserToken,
        cartId: this.getCartToken,
        addressInformation: {
          shipping_address: {
            region: this.getShippingDetails.state,
            region_id: this.getShippingDetails.region_id,
            country_id: this.getShippingDetails.country,
            street: [
              this.getShippingDetails.streetAddress,
              this.getShippingDetails.apartmentNumber
            ],
            telephone: this.getShippingDetails.phoneNumber,
            postcode: this.getShippingDetails.zipCode,
            city: this.getShippingDetails.city,
            firstname: this.getShippingDetails.firstName,
            lastname: this.getShippingDetails.lastName,
            email: this.getPersonalDetails.emailAddress,
            region_code: this.getShippingDetails.region_id
          },
          billing_address: {},
          shipping_carrier_code: this.getShippingDetails.shippingCarrier,
          shipping_method_code: this.getShippingDetails.shippingMethod
        }
      };
    },
    getPaymentInfo () {
      return {
        cartId: this.getCartToken,
        email: this.getPersonalDetails.emailAddress,
        userToken: this.getUserToken,
        paymentMethod: {
          method: this.getPaymentDetails.paymentMethod
        },
        billingAddress: {
          countryId: this.getPaymentDetails.country,
          region: this.getPaymentDetails.state,
          street: [
            this.getPaymentDetails.streetAddress,
            this.getPaymentDetails.apartmentNumber
          ],
          telephone: this.getPaymentDetails.phoneNumber,
          postcode: this.getPaymentDetails.zipCode,
          city: this.getPaymentDetails.city,
          firstname: this.getPaymentDetails.firstName,
          lastname: this.getPaymentDetails.lastName,
          saveInAddressBook: null
        }
      };
    }
  }
};
</script>

<style scoped>
.hidden {
  display: none;
}
.dsecure-modal {
  position: fixed;
  z-index: 999;
  top: 25px;
  width: 100%;
}

.dsecure-modal iframe {
  width: 600px;
  height: 600px;
}
.sagepay-form p label {
  display: block;
  color: #676767;
}

.sagepay-form p {
  margin: 0;
}

.sagepay-form p input:focus {
  border: 0;
  border-bottom: 1px solid #d0d0d0;
  outline: 0;
}

.payment {
  width: 100%;
}
.sagepay-submit {
  background-color: #676767;
  border-radius: 5px;
  font-size: 16px;
  padding: 12px 35px;
  margin-bottom: 20px;
  width: auto !important;
  margin: 0;
  line-height: 12px;
  color: #fff;
}

  /*Custom*/

button#pay-button {
  background-color: #00bfb3;
  border-radius: 0;
  padding: 15px 50px;
  font-size: 18px;
  color: #fff;
  border: none;
  width: auto;
}
button#pay-button:disabled {
  background-color: #00bfb3;
  opacity: 0.6;
  border-radius: 0;
}

img#icon-card-number {
  width: 100%;
}
#sagepay-form {
  width: 280px;
}

.date-and-code {
  display: flex;
  margin-bottom: 8px;
}

.date-and-code > div:nth-child(1) {
  width: 55.715%;
}
.date-and-code > div:nth-child(2) {
  width: 45.719%;
}

.input-container {
  position: relative;
  display: flex;
  height: 40px;
}
.icon-container:last-child {
  right: 0;
}
.icon-container.payment-method {
  right: 0;
}

.input-container.card-number {
  margin-bottom: 8px;
}
.input-container.expiry-date {
  margin-right: 4px;
}
.input-container.cvv {
  margin-left: 4px;
}

.card-number-frame {
  padding-left: 40px;
}
.expiry-date-frame {
  padding-left: 40px;
}
.cvv-frame {
  padding-left: 40px;
}

div + button {
  margin-top: 8px;
}

.icon-container {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 26px;
  margin: 0 7px;
}

.icon-container.payment-method {
  transform: translateY(-50%) rotateY(90deg);
  transition: opacity 0.15s ease-out;
  opacity: 0;
  top: 50%;
}

.icon-container.payment-method.show {
  opacity: 1;
  transition: all 0.4s ease-out;
  transform: translateY(-50%) rotateY(0deg);
}

.icon-container.payment-method img {
  width: 100%;
}

[id$='-error'] {
  display: none;
}

.frame {
  opacity: 0;
}

.frame--activated {
  opacity: 1;
  border-bottom: solid 1px #13395e;
  border-radius: 3px;
  box-shadow: 0 1px 3px 0 rgba(19, 57, 94, 0.2);
}

.frame--activated.frame--focus {
  border-bottom: solid 1px #13395e;
  box-shadow: 0 2px 5px 0 rgba(19, 57, 94, 0.15);
}

.frame--activated.frame--invalid {
  border: solid 1px #d96830;
  box-shadow: 0 2px 5px 0 rgba(217, 104, 48, 0.15);
}

.error-message {
  display: block;
  color: #c9501c;
  font-size: 0.9rem;
  margin: 8px 0 0 1px;
  font-weight: 300;
}

.success-payment-message {
  color: #13395e;
  line-height: 1.4;
}
.token {
  color: #b35e14;
  font-size: 0.9rem;
  font-family: monospace;
}

/**
IE11-targeted optimisations
 */
_:-ms-fullscreen,
:root .icon-container {
  display: block;
}

_:-ms-fullscreen,
:root .icon-container img {
  top: 50%;
  -ms-transform: translateY(-50%);
  position: absolute;
}

_:-ms-fullscreen,
#icon-card-number,
_:-ms-fullscreen,
#icon-expiry-date,
_:-ms-fullscreen,
#icon-cvv {
  left: 7px;
}

#checkout-frames-card-number::-ms-clear {
  display: none;
}

@media (max-width: 767px) {
  button#pay-button {
    width: 100%;
  }
}

</style>
