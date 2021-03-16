<template>
  <div id="checkout">
    <div class="container">
      <div class="row" v-show="!isThankYouPage">
        <div class="col-sm-7 col-xs-12 pb70">
          <div class="checkout-title py5 px20">
            <h1>
              {{ $t('Confirm Order') }}
            </h1>
          </div>
          <shipping class="line relative" :is-active="true" v-if="!isVirtualCart" />
          <payment class="line relative" :is-active="activeSection.payment" />
         <button-full
                @click.native="placeCartOrder"
                data-testid="orderReviewSubmit"
                class="place-order-btn"
                
              >
                {{ $t('Place the order') }}
              </button-full>
          <div id="custom-steps" />
        </div>
        <div class="hidden-xs col-sm-5 bg-cl-secondary">
          <!-- <cart-summary :activatePaymentBtn="activatePaymentBtn"
            :activatePaymentBtnTitle="activatePaymentBtnTitle"
            :activePaymentSection="activePaymentSection" /> -->
        </div>
      </div>
    </div>
    <!-- <thank-you-page v-show="isThankYouPage" /> -->
  </div>
</template>

<script>
import Checkout from '@vue-storefront/core/pages/Checkout'
import CurrentPage from 'theme/mixins/currentPage';
import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetails'
import Shipping from 'theme/components/core/blocks/Checkout/ConfirmShipping'
import Payment from 'theme/components/core/blocks/Checkout/ConfirmPayment'
import OrderReview from 'theme/components/core/blocks/Checkout/OrderReview'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import ButtonFull from 'theme/components/theme/ButtonFull'
import config from 'config';

export default {
  components: {
    PersonalDetails,
    Shipping,
    Payment,
    ButtonFull,
    OrderReview,
    CartSummary,
    ThankYouPage
  },
  data () {
    return {
      activePaymentSection: false,
      activatePaymentBtn: false,
      activatePaymentBtnTitle: ''
    }
  },
  // mixins: [Checkout, CurrentPage],
  beforeCreate () {
    registerModule(OrderModule)
  },
  mounted () {
    this.$store.commit('ui/setMicrocart', false)
    this.$store.commit('ui/setSidebar', false)
this.prepareCartOrder()
  // console.log(this.$route.params.details)
  },
  methods: {
      paymentBtnUpdate (data) {
      this.activatePaymentBtn = data.btn;
      this.activatePaymentBtnTitle = data.title;
    },
    autoFillBillingDetails (paymentData) {
      this.$bus.$emit('autoFillBilling', paymentData)
    },
      checkIfDateSelected (data) {
      if (data === true) {
        this.activePaymentSection = true;
      } else {
        this.activePaymentSection = false;
      }
      this.activatePaymentBtn = false;
    },
     prepareCartOrder () {
       let details = this.$route.params.details
      this.cartOrder = {
        user_id: this.$store.state.user.current ? this.$store.state.user.current.id.toString() : '',
        cart_id: this.$store.state.cart.cartServerToken ? this.$store.state.cart.cartServerToken.toString() : '',
        products: this.$store.state.cart.cartItems,
        id:details.id,
        payer_id:details.payer.payer_info.payer_id,
        addressInformation: {
          billingAddress: {
            region: this.payment.state,
            region_id: this.payment.region_id ? this.payment.region_id : 0,
            country_id: details.payer.payer_info.shipping_address.country_code,
            street: [details.payer.payer_info.shipping_address.line1, details.payer.payer_info.shipping_address.line2 ? details.payer.payer_info.shipping_address.line2 :''],
            company: this.payment.company,
            telephone: this.payment.phoneNumber ? this.payment.phoneNumber : '',
            postcode: details.payer.payer_info.shipping_address.postal_code,
            city: details.payer.payer_info.shipping_address.city,
            firstname: details.payer.payer_info.first_name,
            lastname: details.payer.payer_info.last_name,
            email: details.payer.payer_info.email,
            region_code: this.payment.region_code ? this.payment.region_code : '',
            vat_id: this.payment.taxId
          },
          shipping_method_code: this.shippingMethod.method_code ? this.shippingMethod.method_code : this.shipping.shippingMethod,
          shipping_carrier_code: this.shippingMethod.carrier_code ? this.shippingMethod.carrier_code : this.shipping.shippingCarrier,
          payment_method_code: this.getPaymentMethod(),
          payment_method_additional: this.payment.paymentMethodAdditional,
          shippingExtraFields: this.shipping.extraFields
        }
      }
      if (!this.isVirtualCart) {
        this.cartOrder.addressInformation.shippingAddress = {
          region: details.payer.payer_info.shipping_address.state,
          region_id: this.payment.region_id ? this.payment.region_id : 0,
          country_id: details.payer.payer_info.shipping_address.country_code,
          street: [details.payer.payer_info.shipping_address.line1, this.payment.apartmentNumber ? this.payment.apartmentNumber :''],
          company: this.payment.company,
          telephone: this.payment.phoneNumber ? this.payment.phoneNumber : '343434343',
          postcode: details.payer.payer_info.shipping_address.postal_code,
          city: details.payer.payer_info.shipping_address.city,
          firstname: details.payer.payer_info.first_name,
          lastname: details.payer.payer_info.last_name,
          email: details.payer.payer_info.email,
          region_code: this.payment.region_code ? this.payment.region_code : ''
        }
      }
      // localStorage.setItem('cartOrder', JSON.stringify(this.cartOrder))
    },
    notifyEmptyCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Shopping cart is empty. Please add some products before entering Checkout'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyOutStock (chp) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: chp.name + this.$t(' is out of stock!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNotAvailable () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Some of the ordered products are not available!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyStockCheck () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Stock check in progress, please wait while available stock quantities are checked'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
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
  display: flex;
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
      color: #27998B;
      font-weight: 600;
      letter-spacing: 1px;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    input:checked ~ .checkmark {
      background-color: #4C5053;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: auto !important;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: 1px solid #4C5053 !important;
      margin-left: 15px;

      &:after {
        content: '' !important;
        position: absolute;
        display: none;
        top: 4px !important;
        left: 9px !important;
        width: 4px !important;
        height: 10px !important;
        border-radius: 0 !important;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        background: transparent !important;
      }
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
      color: #27998B;
      font-weight: 600;
      letter-spacing: 1px;
    }

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
      border: 1px solid #ED008C;;
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
      border: 1px solid #ED008C !important;
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
        background: #ED008C !important;
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
    color: #27998B;
    font-weight: 600;
    letter-spacing: 1px;

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
  width: 63%;
  max-width: 63%;
  flex-basis: 63%;

  .delivery-detail-checkout {
    // border: 1px solid #bdbdbd;
    padding: 85px 0px 30px 0px;
  }
}

.cart-summary-col {
  width: 37%;
  max-width: 37%;
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

@media(min-width: 767px) and (max-width: 991px) {
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
}

@media (min-width: 320px) and (max-width: 480px) {
  #checkout .radioStyled {
    font-size: 12px;
    padding-left: 22px;
  }
  #checkout .radioStyled .checkmark:after {
    top: 0px;
    left: 0px;
    width: 15px;
    height: 15px;
  }
  .bank-card ul li img {
    width: 22px;
  }
}
</style>
