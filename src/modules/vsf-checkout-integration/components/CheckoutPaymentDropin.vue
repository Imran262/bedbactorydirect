<template>
  <form id="payment-form" method="POST" action="https://merchant.com/charge-card">
    <div class="one-liner">
      <div class="input-container card-number">
        <div class="icon-container">
          <img id="icon-card-number" src="/assets/card.svg" alt="PAN" />
        </div>
        <div class="card-number-frame" />
        <div class="icon-container payment-method">
          <img id="logo-payment-method" />
        </div>
        <div class="icon-container">
          <img id="icon-card-number-error" src="/assets/error.svg" />
        </div>
      </div>
      <div class="date-and-code">
        <div>
          <div class="input-container expiry-date">
            <div class="icon-container">
              <img id="icon-expiry-date" src="/assets/exp-date.svg" alt="Expiry date" />
            </div>
            <div class="expiry-date-frame" />
            <div class="icon-container">
              <img id="icon-expiry-date-error" src="/assets/error.svg" />
            </div>
          </div>
        </div>

        <div>
          <div class="input-container cvv">
            <div class="icon-container">
              <img id="icon-cvv" src="/assets/cvv.svg" alt="CVV" />
            </div>
            <div class="cvv-frame" />
            <div class="icon-container">
              <img id="icon-cvv-error" src="/assets/error.svg" />
            </div>
          </div>
        </div>
      </div>
      <!-- add submit button -->
      <button class="payment-method-button" id="pay-button" disabled>Checkout Securely</button>
      <div>
        <span class="error-message error-message__card-number" />
        <span class="error-message error-message__expiry-date" />
        <span class="error-message error-message__cvv" />
      </div>
      <p class="success-payment-message" />
    </div>

    <!-- <iframe v-if="url" :src="url" height="400" width="400" id="myFrame" /> -->
  </form>
</template>

<script>
import config from "config";
import { mapGetters } from "vuex";
import i18n from "@vue-storefront/i18n";
/* eslint-disable no-undef */
export default {
  data() {
    return {
      url: null
    };
  },
  async mounted() {
    var payButton = document.getElementById("pay-button");
    var form = document.getElementById("payment-form");
    Frames.init(config.checkout.publicKey);

    Frames.addEventHandler(Frames.Events.CARD_VALIDATION_CHANGED, event => {
      console.log("CARD_VALIDATION_CHANGED: %o", event);

      payButton.disabled = !Frames.isCardValid();
    });

    Frames.addEventHandler(Frames.Events.PAYMENT_METHOD_CHANGED, event => {
      console.log("this function call", event);
      var pm = event.paymentMethod;
      let container = document.querySelector(".icon-container.payment-method");
      if (!pm) {
        if (container) container.classList.remove("show");
        var logo = document.getElementById("logo-payment-method");
        logo.style.setProperty("display", "none");
      } else {
        if (container) container.classList.add("show");

        var logoNew = document.getElementById("logo-payment-method");
        if (pm) {
          var name = pm.toLowerCase();
          logoNew.setAttribute("src", "assets/" + name + ".svg");
          logoNew.setAttribute("alt", pm || "payment method");
        }
        logoNew.style.removeProperty("display");
      }
    });

    Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, event => {
      var el = document.querySelector(".success-payment-message");
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      try {
        const res = await Frames.submitCard();
        await this.handleOnSubmit(res);
      } catch (error) {
        console.log(error);
      }
    });
  },
  methods: {
    async handleOnSubmit(res) {
      this.$bus.$emit(
        "notification-progress-start",
        this.$t("Processing order...")
      );
      let self = this;
      try {
        await this.$store.dispatch(
          "checkout-payment-module/updateEmailAddress",
          this.getEmailInfo
        );
        await this.$store.dispatch(
          "checkout-payment-module/updateShippingDetails",
          this.getShippingInformation
        );
        await this.$store.dispatch(
          "checkout-payment-module/updatePaymentInformation",
          this.getPaymentInfo
        );

        try {
          const paymentProcessingData = {
            cartId: this.getCartToken,
            userToken: this.getUserToken,
            requestData: {
              methodId: "checkoutcom_card_payment",
              cardToken: res.token,
              cardBin: res.bin,
              saveCard: false,
              source: "checkoutcom_card_payment"
            }
          };
          const paymentRes = await this.$store.dispatch(
            "checkout-payment-module/doPayment",
            paymentProcessingData
          );
          console.log(paymentRes.success);
          if (
            paymentRes.success === true &&
            paymentRes.url &&
            paymentRes.url !== ""
          ) {
            // For registering user after order is successfully placed
            await this.$bus.$emit("checkout-before-placeOrder");

            this.$bus.$emit("notification-progress-stop", {});
            await this.$store.dispatch("cart/clear", {
              recreateAndSyncCart: true
            }); // just clear the items without sync
            await this.$store.dispatch("cart/sync", { forceClientState: true });
            await localStorage.setItem(
              "lastOrderItem",
              JSON.stringify({
                order: paymentRes.order,
                confirmation: paymentRes.confirmation,
                platformTotals: this.$store.state.cart.platformTotals,
                orderHistory: this.$store.state.user.orders_history
              })
            );
            // await this.$store.commit('order/orders/LAST_ORDER_CONFIRMATION', {
            //   order: paymentRes.order,
            //   confirmation: paymentRes.confirmation
            // });
            window.location.href = await paymentRes.url;
          } else if (paymentRes.success === true) {
            await this.$bus.$emit("checkout-before-placeOrder");

            this.$bus.$emit("notification-progress-stop", {});
            this.$store.dispatch("cart/clear", { recreateAndSyncCart: true }); // just clear the items without sync
            this.$store.dispatch("cart/sync", { forceClientState: true });
            this.$store.dispatch("checkout/setThankYouPage", true);
            await this.$store.commit("order/orders/LAST_ORDER_CONFIRMATION", {
              order: paymentRes.order,
              confirmation: paymentRes.confirmation,
              platformTotals: this.$store.state.cart.platformTotals,
              orderHistory: this.$store.state.user.orders_history
            });
          }
          if (paymentRes.errors) {
            this.$bus.$emit("notification-progress-stop", {});
            this.$store.dispatch("notification/spawnNotification", {
              type: "error",
              message: i18n.t(paymentRes.message),
              action1: { label: i18n.t("OK") }
            });
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    ...mapGetters({
      getShippingMethods: "shipping/getShippingMethods",
      getPersonalDetails: "checkout/getPersonalDetails",
      getShippingDetails: "checkout/getShippingDetails",
      getCartToken: "cart/getCartToken",
      getUserToken: "user/getToken",
      getPaymentDetails: "checkout/getPaymentDetails"
    }),
    getCardDetails() {
      return {
        cardDetails: {
          cardholderName: this.cardholderName,
          cardNumber: this.cardNumber,
          expiryDate: this.expiryDate,
          securityCode: this.securityCode
        }
      };
    },
    grandTotal() {
      let cartTotals = this.$store.getters["cart/getTotals"];
      return cartTotals.find(seg => seg.code === "grand_total").value;
    },
    getBillingAddresses() {
      const paymentDetails = this.$store.getters["checkout/getPaymentDetails"];
      return {
        address1: paymentDetails.streetAddress,
        address2: paymentDetails.apartmentNumber,
        city: paymentDetails.city,
        postalCode: paymentDetails.zipCode,
        country: paymentDetails.country,
        state: paymentDetails.state
      };
    },
    getEmailInfo() {
      return {
        cartId: this.getCartToken,
        requestData: {
          email: this.getPersonalDetails.emailAddress
        }
      };
    },
    getShippingInformation() {
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
            company: this.getShippingDetails.company,
            telephone: this.getShippingDetails.phoneNumber,
            postcode: this.getShippingDetails.zipCode,
            city: this.getShippingDetails.city,
            firstname: this.getShippingDetails.firstName.trim(),
            lastname: this.getShippingDetails.lastName.trim(),
            email: this.getPersonalDetails.emailAddress,
            region_code: this.getShippingDetails.region_id
          },
          billing_address: {},
          shipping_carrier_code: this.getShippingDetails.shippingCarrier,
          shipping_method_code: this.getShippingDetails.shippingMethod
        }
      };
    },
    getPaymentInfo() {
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
          company: this.getPaymentDetails.company,
          telephone: this.getPaymentDetails.phoneNumber,
          postcode: this.getPaymentDetails.zipCode,
          city: this.getPaymentDetails.city,
          firstname: this.getPaymentDetails.firstName.trim(),
          lastname: this.getPaymentDetails.lastName.trim(),
          saveInAddressBook: null
        }
      };
    }
  }
};
</script>

<style scoped>
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
#payment-form {
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

[id$="-error"] {
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
