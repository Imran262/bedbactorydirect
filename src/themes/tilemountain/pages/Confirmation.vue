<template>
  <div id="checkout">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-xs-12 col-lg-7 delivery-detail-col">
          <!-- <div class="checkout-title py5 px20">
            <h1>
              {{ $t("Confirm Order") }}
            </h1>
          </div> -->
          <shipping
            :shippingData="paypalResponse"
            ref="shippingData"
            :is-active="true"
          />
          <payment :payment-data="paypalResponse" :is-active="true" />
          <div id="custom-steps" />
        </div>
        <div
          class="hidden-xs col-sm-12 col-md-12 col-lg-5 col-xs-12 bg-cl-secondary cart-summary cart-summary-col"
        >
          <cart-summary
            :activatePaymentBtn="activatePaymentBtn"
            :activatePaymentBtnTitle="activatePaymentBtnTitle"
            :activePaymentSection="activePaymentSection"
            :shippingMethod="shipping_methods"
            :hasPhone="hasPhoneNumber"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonFull from "theme/components/theme/ButtonFull"
import CartSummary from "theme/components/core/blocks/Checkout/CartSummary"
import Shipping from "theme/components/core/blocks/Checkout/Shipping"
import Payment from "theme/components/core/blocks/Checkout/ConfirmPayment"
import Checkout from "@vue-storefront/core/pages/Checkout"
import { registerModule } from "@vue-storefront/core/lib/modules"
import { OrderModule } from "@vue-storefront/core/modules/order"
import i18n from "@vue-storefront/i18n"
import EventBus from "@vue-storefront/core/compatibility/plugins/event-bus"
import axios from "axios"
import { mapGetters, mapActions } from 'vuex'
import config from "config"
import { log } from "util"
export default {
  components: {
    ButtonFull,
    CartSummary,
    Payment,
    Shipping,
  },
  data () {
    return {
      paypalResponse: {},
      cartOrder: {},
      sortedData: {},
      activePaymentSection: false,
      activatePaymentBtn: false,
      activatePaymentBtnTitle: "",
    }
  },
  mixins: [Checkout],
  beforeRouteEnter (to, from, next) {
    if (to.fullPath.includes('token')) {
      next()
    }
    else {
      next({ name: 'home' })
    }
  },
  beforeCreate () {
    registerModule(OrderModule)
  },

  computed: {
    ...mapGetters({
      getShippingDetails: 'checkout/getShippingDetails',
    }),
    payerId () {
      return this.$route.query.PayerID
    },
    paymentId () {
      return this.$route.query.paymentId
    },
    token () {
      return this.$route.query.token
    },
    hasPhoneNumber () {
      return this.paypalResponse.phone ? this.paypalResponse.phone : this.getShippingDetails.phoneNumber
    },

    shipping_methods () {
      return this.shippingMethod.carrier_code
        ? this.shippingMethod.carrier_code
        : this.shipping.shippingCarrier
    }
  },
  mounted () {
    this.expressCheckout()
    this.$bus.$on('prepare-cart-order', this.prepareCartOrder)
  },
  methods: {
    notifyEmptyCart () {
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: this.$t(
          "Shopping cart is empty. Please add some products before entering Checkout"
        ),
        action1: { label: this.$t("OK") },
      })
    },
    notifyOutStock (chp) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: chp.name + this.$t(" is out of stock!"),
        action1: { label: this.$t("OK") },
      })
    },
    notifyNotAvailable () {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t("Some of the ordered products are not available!"),
        action1: { label: this.$t("OK") },
      })
    },
    notifyStockCheck () {
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: this.$t(
          "Stock check in progress, please wait while available stock quantities are checked"
        ),
        action1: { label: this.$t("OK") },
      })
    },
    notifyNoConnection () {
      this.$store.dispatch("notification/spawnNotification", {
        type: "warning",
        message: this.$t(
          "There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now."
        ),
        action1: { label: this.$t("OK") },
      })
    },
    gotoAccount () {
      this.$bus.$emit("modal-toggle", "modal-signup")
    },
    expressCheckout () {
      let url = `${config.api.url}${config.paypalManual.endpoints.getPaymentDetails}`
      let data = { token: this.token }
      EventBus.$emit(
        "notification-progress-start",
        i18n.t("Getting details...")
      )
      axios
        .post(url, data)
        .then((response) => {
          EventBus.$emit("notification-progress-stop")
          let data = response.data.result
          data = data.split("&")
          this.paypalResponse = {
            firstname: data
              .filter((element) => {
                return element.includes("FIRSTNAME")
              })[0]
              .split("=")[1],
            lastname: data
              .filter((element) => {
                return element.includes("LASTNAME")
              })[0]
              .split("=")[1],

            email: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("EMAIL")
                })[0]
                .split("=")[1]
            ),
            token: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("TOKEN")
                })[0]
                .split("=")[1]
            ),
            phone: data.filter((element) => {
              return element.includes("PHONENUM")
            })
              ? decodeURIComponent(
                data.filter((element) => {
                  return element.includes("PHONENUM")
                })[0]
              ).split("=")[1]
              : "",
            zip: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("SHIPTOZIP")
                })[0]
                .split("=")[1]
            ),
            city: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("SHIPTOCITY")
                })[0]
                .split("=")[1]
            ),
            country: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("SHIPTOCOUNTRYNAME")
                })[0]
                .split("=")[1]
            ),
            payer_id: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("PAYERID")
                })[0]
                .split("=")[1]
            ),
            street: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("SHIPTOSTREET")
                })[0]
                .split("=")[1]
            ),
            country_code: decodeURIComponent(
              data
                .filter((element) => {
                  return element.includes("SHIPTOCOUNTRYCODE")
                })[0]
                .split("=")[1]
            ),
            apartment: data.filter((element) => {
              return element.includes("SHIPTOSTREET2")
            })
              ? decodeURIComponent(
                data.filter((element) => {
                  return element.includes("SHIPTOSTREET2")
                })[0]
              ).split("=")[1]
              : "",
          }
        })
        .catch(() => {
          this.$router.push({ path: "/" })
        })
    },

    prepareCartOrder () {
      let details = this.paypalResponse
      let additionalMethod = {
        // magento 2 fields expects
        paypal_express_checkout_token: this.paypalResponse.token,
        button: 1,
        paypal_express_checkout_payer_id: this.paypalResponse.payer_id,
        paypal_express_checkout_redirect_required: false,
      }
      this.cartOrder = {
        user_id: this.$store.state.user.current
          ? this.$store.state.user.current.id.toString()
          : "",
        cart_id: this.$store.state.cart.cartServerToken
          ? this.$store.state.cart.cartServerToken.toString()
          : "",
        products: this.$store.state.cart.cartItems,
        addressInformation: {
          billingAddress: {
            region: this.payment.state,
            region_id: this.payment.region_id ? this.payment.region_id : 0,
            country_id: this.paypalResponse.country_code,
            street: [
              this.paypalResponse.street,
              this.paypalResponse.apartment
                ? this.paypalResponse.apartment
                : "",
            ],
            company: this.payment.company,
            telephone: this.paypalResponse.phone ? this.paypalResponse.phone : this.getShippingDetails.phoneNumber,
            postcode: this.paypalResponse.zip,
            city: this.paypalResponse.city,
            firstname: this.paypalResponse.firstname,
            lastname: this.paypalResponse.lastname,
            email: this.paypalResponse.email,
            region_code: this.payment.region_code
              ? this.payment.region_code
              : "",
            vat_id: this.payment.taxId,
          },
          shipping_method_code: this.shippingMethod.method_code
            ? this.shippingMethod.method_code
            : this.shipping.shippingMethod,
          shipping_carrier_code: this.shippingMethod.carrier_code
            ? this.shippingMethod.carrier_code
            : this.shipping.shippingCarrier,
          payment_method_code: "paypal_express",
          payment_method_additional: additionalMethod,
          shippingExtraFields: this.shipping.extraFields,
        },
      }
      if (!this.isVirtualCart) {
        this.cartOrder.addressInformation.shippingAddress = {
          region: this.payment.state,
          region_id: this.payment.region_id ? this.payment.region_id : 0,
          country_id: this.paypalResponse.country_code,
          street: [
            this.paypalResponse.street,
            this.paypalResponse.apartment ? this.paypalResponse.apartment : "",
          ],
          company: this.payment.company,
          telephone: this.paypalResponse.phone ? this.paypalResponse.phone : this.getShippingDetails.phoneNumber,
          postcode: this.paypalResponse.zip,
          city: this.paypalResponse.city,
          firstname: this.paypalResponse.firstname,
          lastname: this.paypalResponse.lastname,
          email: this.paypalResponse.email,
          region_code: this.payment.region_code ? this.payment.region_code : "",
        }
      }
      // localStorage.setItem('cartOrder', JSON.stringify(this.cartOrder))
      this.placeCartOrder()
    },
  },
};
</script>


<style lang="scss">
@import '~theme/css/base/text';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$bg-secondary: color(secondary, $colors-background);
$color-tertiary: color(tertiary);
$color-secondary: color(secondary);
$color-error: color(error);
$color-white: color(white);
$color-black: color(black);
.cart-summary {
  display: flex !important;
  justify-content: flex-end;
}

#checkout {
  background: #f1f1f1;
  font-family: Arial, Helvetica, sans-serif !important;

  .number-circle {
    width: 35px;
    height: 35px;

    @media (max-width: 768px) {
      width: 25px;
      height: 25px;
      line-height: 25px;
    }
  }

  .delivery-methods-detail {
    .radioStyled {
      display: block;
      position: relative;
      padding-left: 0px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 15px;
      line-height: 30px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      color: #eb008b;
      font-weight: 600;
      letter-spacing: 1px;
      font-family: Arial, Helvetica, sans-serif;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    input:checked ~ .checkmark {
      background-color: transparent;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: auto !important;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: 1px solid #4c5053 !important;
      margin-left: 15px;
    }
    input:checked ~ .checkmark:after {
      content: '' !important;
      position: absolute;
      display: none;
      top: 4px !important;
      left: 9px !important;
      width: 4px !important;
      height: 10px !important;
      border-radius: 0 !important;
      border: solid #4c5053;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      background: transparent !important;
    }
  }

  .calendar-right-inner {
    .radioStyled {
      display: block;
      position: relative;
      padding-left: 40px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 15px;
      line-height: 30px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      color: #27998b;
      font-weight: 600;
      letter-spacing: 1px;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
      border: 1px solid #ed008c;
    }

    input:checked ~ .checkmark {
      background-color: transparent;
    }

    .checkmark {
      position: absolute;
      top: 6px !important;
      left: 0 !important;
      height: 18px !important;
      width: 18px !important;
      border-radius: 50%;
      border: 1px solid #ed008c !important;
      margin-left: 0px !important;

      &:after {
        content: '' !important;
        position: absolute;
        display: none;
        top: 3.5px !important;
        left: 3.82px !important;
        width: 10px !important;
        height: 10px !important;
        border-radius: 50% !important;
        background: #ed008c !important;
        border: none !important;
        border-width: none !important;
      }
    }
  }

  .radioStyled {
    display: block;
    position: relative;
    padding-left: 65px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 15px;
    line-height: 30px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #27998b;
    font-weight: 600;
    letter-spacing: 1px;
    font-family: Arial, Helvetica, sans-serif;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: 1px solid $bg-secondary;
      margin-left: 15px;

      &:after {
        content: '';
        position: absolute;
        display: none;
        top: 3px;
        left: 3px;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background: $color-secondary;
      }
    }

    input:checked ~ .checkmark:after {
      display: block;
    }
  }
}

.line {
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 37px;
    z-index: -1;
    width: 1px;
    height: 100%;
    background-color: $bg-secondary;

    @media (max-width: 768px) {
      display: none;
    }
  }
}

.delivery-detail-col {
  .delivery-detail-checkout {
    padding: 130px 0px 30px 0px;
  }
}

.cart-summary-col {
  width: 37%;
  // max-width: 37%!important;
  position: relative;
}

.checkout-title {
  @media (max-width: 767px) {
    background-color: $bg-secondary;
    margin-bottom: 25px;

    h1 {
      font-size: 36px;
    }
  }
}

.checkout-title {
  h1 {
    color: #676767;
    font-size: 36px;
  }
}

.checkout-shopping-return-main {
  border-top: 1px solid #606060;
  border-bottom: 1px solid #606060;
  padding: 10px 0;
}

.return-shopping a {
  font-size: 26.1px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  color: #54575b;
  background: url(/assets/return-shopinig-back.png);
  background-repeat: no-repeat;
  padding-left: 30px;
  background-position: 0% 55%;
}

.checkout-top-icons ul {
  display: flex;
  justify-content: space-evenly;
}

.checkout-top-icons ul li.checkout-top-basket {
  list-style-type: none;
  background: url(/assets/checkout-top-basket-img.png) no-repeat;
  height: 55px;
}

.checkout-top-icons ul li.checkout-top-detail {
  list-style-type: none;
  background: url(/assets/checkout-top-order-complete-img.png) no-repeat;
  height: 55px;
}

.checkout-top-icons ul li.checkout-top-basket span {
  color: #01998c;
}

.checkout-top-icons ul li span {
  font-size: 28px;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
  line-height: 2;
  padding-left: 70px;
  color: #54575b;
}

.checkout-top-icons {
  padding-bottom: 10px;
  padding-top: 10px;
}

@media (min-width: 991px) and (max-width: 1200px) {
  #checkout .delivery-methods-detail .radioStyled {
    font-size: 12px;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .checkout-top-icons ul li.checkout-top-basket {
    background-size: 45px;
  }
  .checkout-top-icons ul li span {
    font-size: 22px;
    padding-left: 55px;
  }
  .checkout-top-icons ul li.checkout-top-detail {
    background-size: 45px;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .delivery-detail-col {
    width: 100%;
    max-width: 100%;
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
  }
  .cart-summary-col {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
}

@media (min-width: 320px) and (max-width: 767px) {
  .delivery-detail-col {
    width: 100%;
    max-width: 100%;
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
  }
  .cart-summary-col {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
  #checkout .delivery-methods-detail .radioStyled {
    font-size: 12px;
  }
  #checkout .radioStyled .checkmark {
    height: 20px;
    width: 20px;
  }
  #checkout .delivery-methods-detail input:checked ~ .checkmark:after {
    top: 2px !important;
    left: 7px !important;
    width: 4px !important;
  }
  #checkout .radioStyled .checkmark:after {
    content: '';
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  #checkout .radioStyled {
    font-size: 12px;
    padding-left: 50px;
  }
  .bank-card ul li img {
    width: 22px;
  }
}
</style>