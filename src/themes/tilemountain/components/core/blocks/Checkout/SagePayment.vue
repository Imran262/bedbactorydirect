<template>
  <div class="sagepayemnt-container">
    <!--    <button @click="sageButtonClick">-->
    <!--      Fetch Sagepay Form-->
    <!--    </button>-->
    <div id="main">
      <form>
        <!--        <h4>Card Details</h4>-->
        <div id="sp-container"></div>
        <div id="submit-container" class="hidden">
          <input
            class="no-outline button-full block brdr-none w-80 bg-cl-mine-shaft :bg-cl-th-secondary ripple weight-400 h4 cl-white sans-serif fs-medium sagepay-submit mt10"
            style="background-color: #CFD42D"
            type="submit"
            :disabled="submitDisable"
            value="Submit"
          />
        </div>
      </form>
      <div class="hidden" id="crafty_loader" ref="spinner"></div>
      <div class="hidden" id="crafty_loader_after" ref="spinner_one"></div>
    </div>
    <div class="dsecure-modal" :class="{ hidden: !is3DAuth }">
      <form :action="formAction" method="POST">
        <input type="hidden" name="PaReq" v-model="PaReq"/>
        <input type="hidden" name="TermUrl" v-model="TermUrl"/>
        <input type="hidden" name="Md" v-model="Md"/>
        <input type="submit" value="submit" ref="formButton" class="hidden"/>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {currentStoreView} from '@vue-storefront/core/lib/multistore';
import config from 'config';
import {mapGetters} from 'vuex';

export default {
  name: 'SagePayment',
  computed: {
    ...mapGetters({
      getShippingMethods: 'shipping/getShippingMethods',
      getPersonalDetails: 'checkout/getPersonalDetails',
      getShippingDetails: 'checkout/getShippingDetails',
      getCartToken: 'cart/getCartToken',
      getUserToken: 'user/getToken',
      getPaymentDetails: 'checkout/getPaymentDetails',
    }),
    paymentMethod () {
      return this.payment;
    },
    getCardDetails () {
      return {
        cardDetails: {
          cardholderName: this.cardholderName,
          cardNumber: this.cardNumber,
          expiryDate: this.expiryDate,
          securityCode: this.securityCode,
        },
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
          cc_last_four: '0',
          cc_exp_year: '0',
          cc_exp_month: '0'
        },
        extension_attributes: {
          delivery_note: (this.getShippingDetails.narrowRoad) ? this.getShippingDetails.deliveryNoteHidden + '<br/>' + this.getShippingDetails.deliveryNote : this.getShippingDetails.deliveryNote + ' <br/> ' + this.getShippingDetails.noOneField
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
            cardIdentifier: this.cardIdentifier,
          },
        };
      }
      return null;
    },
    grandTotal () {
      let cartTotals = this.$store.getters['cart/getTotals'];
      return cartTotals.find((seg) => seg.code === 'grand_total').value;
    },
    getBillingAddresses () {
      const paymentDetails = this.$store.getters['checkout/getPaymentDetails'];
      return {
        address1: paymentDetails.streetAddress,
        address2: paymentDetails.apartmentNumber,
        city: paymentDetails.city,
        postalCode: paymentDetails.zipCode,
        country: paymentDetails.country,
        state: paymentDetails.state,
      };
    },
    getEmailInfo () {
      return {
        cartId: this.getCartToken,
        requestData: {
          email: this.getPersonalDetails.emailAddress,
        },
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
              this.getShippingDetails.apartmentNumber,
            ],
            telephone: this.getShippingDetails.phoneNumber,
            postcode: this.getShippingDetails.zipCode,
            city: this.getShippingDetails.city,
            firstname: this.getShippingDetails.firstName,
            lastname: this.getShippingDetails.lastName,
            email: this.getPersonalDetails.emailAddress,
            region_code: this.getShippingDetails.region_id,
          },
          billing_address: {},
          shipping_carrier_code: this.getShippingDetails.shippingCarrier,
          shipping_method_code: this.getShippingDetails.shippingMethod,
        },
      };
    },
    getPaymentInfo () {
      return {
        cartId: this.getCartToken,
        email: this.getPersonalDetails.emailAddress,
        userToken: this.getUserToken,
        paymentMethod: {
          method: this.getPaymentDetails.paymentMethod,
        },
        billingAddress: {
          countryId: this.getPaymentDetails.country,
          region: this.getPaymentDetails.state,
          street: [
            this.getPaymentDetails.streetAddress,
            this.getPaymentDetails.apartmentNumber,
          ],
          telephone: this.getPaymentDetails.phoneNumber,
          postcode: this.getPaymentDetails.zipCode,
          city: this.getPaymentDetails.city,
          firstname: this.getPaymentDetails.firstName,
          lastname: this.getPaymentDetails.lastName,
          saveInAddressBook: null,
        },
      };
    },
  },
  data: function () {
    const storeView = currentStoreView();
    return {
      formAction: config.sagepay.pareq,
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
      currency: storeView.i18n.currencyCode,
      resMerchantSessionKeys: undefined,
      username: null,
      password: null,
      authorization: null,
      merchantSessionKeysUrl: null,
      orderDetails: null,
      submitDisable: false,
      vendorName: null,
      sp: null
    };
  },
  props: {
    payment: {
      type: String,
      required: true,
    },
  },
  async created () {
    this.sageButtonClick();
  },
  watch: {
    paymentMethod (newVal, oldVal) {
      console.log('PaymentMethod Was Updated', newVal);
    },
  },
  methods: {
    async loadConfigs () {
      const sagePayConfig = await config.sagepay;
      if (sagePayConfig) {
        let selectedMode = sagePayConfig.selectedMode
          ? sagePayConfig.selectedMode
          : 'test';
        if (sagePayConfig[selectedMode]) {
          let selectedConfig = await sagePayConfig[selectedMode];

          if (selectedConfig.urls && selectedConfig.urls.merchantSessionKeys) {
            this.merchantSessionKeysUrl =
              selectedConfig.urls.merchantSessionKeys;
            this.orderDetails = selectedConfig.urls.orderDetails;
          }

          if (selectedConfig.vendorName) {
            this.vendorName = selectedConfig.vendorName;
          } else {
            this.vendorName = 'tilemountain';
          }

          // Loading the Credentials
          if (selectedConfig && selectedConfig.credentials) {
            this.username = selectedConfig.credentials.username;
            this.password = selectedConfig.credentials.password;
            this.authorization =
              'Basic ' +
              btoa(
                unescape(
                  encodeURIComponent(this.username + ':' + this.password)
                )
              );
          }
        }
        return true;
      }
    },
    async sageButtonClick () {
      this.showLoader();
      await this.loadConfigs();

      // Merchant Session Keys URL
      const url = await this.merchantSessionKeysUrl;
      let orderDetailsUrl = this.orderDetails;

      await axios
        .post(
          url,
          {
            vendorName: this.vendorName,
          },
          {
            headers: {
              Authorization: this.authorization,
              // 'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          this.resMerchantSessionKeys = res;
        })
        .catch((err) => {
          console.log('errorIs', err);
          this.hideLoader();
        });

      // our Server Calls
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

      if (
        this.resMerchantSessionKeys &&
        this.resMerchantSessionKeys.data &&
        this.resMerchantSessionKeys.data.merchantSessionKey
      ) {
        // Merchant Session Key
        this.merchantSessionKey = this.resMerchantSessionKeys.data.merchantSessionKey;
        this.hideLoader();
        let submitBtn = document.getElementById('submit-container');
        submitBtn.classList.remove('hidden');

        this.sp = sagepayCheckout({
          merchantSessionKey: this.resMerchantSessionKeys.data
            .merchantSessionKey,
          onTokenise: async (tokenisationResult) => {
            if (tokenisationResult.success) {
              this.startLoader();
              this.cardIdentifier = tokenisationResult.cardIdentifier;
              this.creditCardType = tokenisationResult.cardType;
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
                  this.Md = await paymentRes.transaction_id;
                  this.PaReq = await paymentRes.par_eq;
                  this.TermUrl =
                    (await config.sagepay.ThreeDSecure) +
                    `?transactionId=${paymentRes.transaction_id}&orderId=${
                      paymentRes.order_id
                    }&quoteId=${paymentRes.quote_id}&isViewFront=${true}`;
                  // this.TermUrl = 'http://localhost:3000/'
                  this.formAction = await paymentRes.acs_url;

                  // let orderDetailsUrl = await config.sagepay.orderDetails;

                  let {
                    success,
                    message,
                    increment_id,
                    order_id,
                    order,
                    confirmation,
                  } = await axios.get(
                    orderDetailsUrl + '?orderId=' + paymentRes.order_id
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
                  this.$store.dispatch('cart/clear', {
                    recreateAndSyncCart: true,
                  }); // just clear the items without sync
                  this.$store.dispatch('cart/sync', {forceClientState: true});
                  // this.$store.dispatch('checkout/setThankYouPage', true);
                  this.$router.push({name: 'Success', params: {orderId:paymentRes.order_id }});
                }
              } catch (error) {
                console.log('errorIs', error);
              }
              // this.stopLoader();
            } else {
              console.error(
                'Tokenisation failed',
                tokenisationResult.error.errorMessage
              );
              this.stopLoader();
            }
          }
        });
        this.sp.form();
      }
    },
    startLoader () {
      this.$bus.$emit('notification-progress-start', 'Processing Order ... ');
      // this.$nextTick(function () {
      //   this.$refs.spinner_one.classList.remove("hidden");
      // });
      this.submitDisable = true;
    },
    stopLoader () {
      // this.$nextTick(function () {
      //   this.$refs.spinner_one.classList.add("hidden");
      // });
      this.$bus.$emit('notification-progress-stop');
      this.submitDisable = false;
    },

    showLoader () {
      // console.log('divLoader', document.getElementById('crafty_loader'));
      // document.getElementById('crafty_loader').classList.remove('hidden');
      this.$nextTick(function () {
        this.$refs.spinner.classList.remove('hidden');
      });
      // this.$refs.spinner.classList.remove('hidden');
    },
    hideLoader () {
      this.$nextTick(function () {
        this.$refs.spinner.classList.add('hidden');
      });
    },
  },
  mounted () {
    this.loadConfigs();
  },
  destroyed () {
    console.log('ComponentDestroyed');
    this.sp.destroy();
  },
};
</script>
<style scoped>
div#crafty_loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #29275b;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

div#crafty_loader_after {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #29275b;
  width: 10px;
  height: 10px;
  -webkit-animation: spin-data-v-877bcfc0 2s linear infinite;
  animation: spin-data-v-877bcfc0 2s linear infinite;
  position: absolute;
  bottom: 16px;
  left: 16%;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
