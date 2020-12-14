<template>
  <div class="braintree" id="braintree" />
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { mapGetters } from 'vuex';
import { get } from 'https';
export default {
  name: 'BraintreeDropin',
  data() {
    const storeView = currentStoreView();
    return {
      loader: false,
      commit: true,
      nonce: '',
      currency: storeView.i18n.currencyCode,
      locale: storeView.i18n.defaultLocale.replace('-', '_'), // Convert to PayPal format of locale
      threeDSecureParameters: {}
    };
  },
  mounted() {
    this.configureBraintree();
  },
  computed: {
    ...mapGetters({
      getPersonalDetails: 'checkout/getPersonalDetails',
      getShippingDetails: 'checkout/getShippingDetails',
      getPaymentDetails: 'checkout/getPaymentDetails'
    }),
    grandTotal() {
      let cartTotals = this.$store.getters['cart/getTotals'];
      return cartTotals.find(seg => seg.code === 'grand_total').value;
    }
  },
  methods: {
    configureBraintree() {
      var self = this;
      this.threeDSecureParameters = {
        amount: this.grandTotal,
        email: this.getPersonalDetails.emailAddress,
        billingAddress: {
          givenName: this.getPaymentDetails.firstName, // ASCII-printable characters required, else will throw a validation error
          surname: this.getPaymentDetails.lastName, // ASCII-printable characters required, else will throw a validation error
          phoneNumber: this.getPaymentDetails.phoneNumber,
          streetAddress: this.getPaymentDetails.streetAddress,
          extendedAddress: this.getPaymentDetails.apartmentNumber,
          locality: this.getPaymentDetails.city,
          region: this.getPaymentDetails.state,
          postalCode: this.getPaymentDetails.zipCode,
          countryCodeAlpha2: this.getPaymentDetails.country
        },
        additionalInformation: {
          workPhoneNumber: this.getShippingDetails.phoneNumber,
          shippingGivenName: this.getShippingDetails.firstName,
          shippingSurname: this.getShippingDetails.lastName,
          shippingPhone: this.getShippingDetails.phoneNumber,
          shippingAddress: {
            streetAddress: this.getShippingDetails.streetAddress,
            extendedAddress: this.getShippingDetails.apartmentNumber,
            locality: this.getShippingDetails.city,
            region: this.getShippingDetails.state,
            postalCode: this.getShippingDetails.zipCode,
            countryCodeAlpha2: this.getShippingDetails.country
          }
        }
      };
      console.log('112233 Parameters are', this.threeDSecureParameters);
      this.$store
        .dispatch('braintree/generateToken')
        .then(resp => {
          var dropin = require('braintree-web-drop-in');
          console.debug('Code for braintree:' + resp);
          var button = document.querySelector('.place-order-btn');
          dropin
            .create({
              authorization: resp,
              container: '#braintree',
              threeDSecure: true,
              paypal: {
                flow: 'checkout',
                amount: this.getTransactions().amount.total,
                currency: this.getTransactions().amount.currency
              }
            })
            .then(dropinInstance => {
              // console.log("1122 About to emit");
              this.$emit('configured', true);
              button.addEventListener('click', () => {
                if (dropinInstance.isPaymentMethodRequestable()) {
                  setTimeout(() => {
                    let requestedPaymentMethod = dropinInstance
                    .requestPaymentMethod(
                      { threeDSecure: this.threeDSecureParameters },
                      (err, payload) => {
                        if (!err) {
                          console.debug(payload);
                          // Submit payload.nonce to your server
                          self.nonce = payload.nonce;
                          console.error('success');

                          self.$bus.$emit('checkout-do-placeOrder', {
                            payment_method_nonce: self.nonce
                          });
                        } else {
                          console.error('ErrorIs', err);
                        }
                      }
                    );
                    if (requestedPaymentMethod) {
                      requestedPaymentMethod.catch(requestPaymentMethodErr => {
                        // No payment method is available.
                        // An appropriate error will be shown in the UI.
                        console.error(
                          'catchingTheError',
                          requestPaymentMethodErr
                        );
                      });
                    }
                  }, 400);
                }
              });
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    },
    getTransactions() {
      return { amount: { total: this.grandTotal, currency: this.currency } };
    },
    getNonce() {
      return {
        nonce: this.nonce,
        total: this.grandTotal,
        currency: this.currency
      };
    },
    doPayment(data, actions) {
      return this.$store.dispatch('braintree/doPayment', this.getNonce());
    },
    onAuthorize(data, actions) {
      return true;
    },
    onCancel(data) {
      this.$emit('payment-braintree-cancelled', data);
    }
  }
};
</script>