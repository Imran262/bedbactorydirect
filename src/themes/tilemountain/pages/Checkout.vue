<template>
  <div id="checkout">
    <!-- <div class="col-md-12 center-xs checkout-top-icons hidden-xs">
      <div class="container">
        <ul>
          <li class="checkout-top-basket">
            <span>Your basket</span>
          </li>
          <li class="checkout-top-detail">
            <span>Your Details</span>
          </li>
          <li class="checkout-top-detail">
            <span>Order Complete</span>
          </li>
        </ul>
      </div>
    </div> -->
    <!-- <div class="col-md-12 checkout-shopping-return-main hidden-xs">
      <div class="container">
        <div class="row">
          <div class="col-xs-6 col-md-6 middle-xs return-shopping">
            <div>
              <router-link
                :to="localizedRoute('/')"
                class="cl-tertiary links"
              >{{ $t('Return to shopping') }}</router-link>
            </div>
          </div>
          <div
            v-if="!isThankYouPage"
            class="col-xs-6 col-md-6 end-xs return-shopping login-to-account"
          >
            <div>
              <a
                v-if="!currentUser"
                href="#"
                @click.prevent="gotoAccount"
                class="cl-tertiary links"
              >{{ $t('Login to your account') }}</a>
              <span v-else>{{ $t('You are logged in as {firstname}', currentUser) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="container">
      <div class="row" v-show="!isThankYouPage">
        <div class="col-sm-7 col-md-7 col-xs-12 delivery-detail-col">
          <div class="delivery-detail-checkout">
            <!-- <div class="checkout-title">
              <h1>{{ $t('Checkout') }}</h1>
            </div> -->
            <personal-details
              class="line relative"
              :is-active="activeSection.personalDetails"
              :focused-field="focusedField"
            />
            <shipping
              class="line relative"
              :is-active="activeSection.shipping"
              v-if="!isVirtualCart"
              @showBillingDetails="autoFillBillingDetails"
              @date-selected="checkIfDateSelected"
            />
            <!--          :is-active="activeSection.payment"-->
            <payment
              class="line relative"
              v-if="activePaymentSection"
              :is-active="true"
              @paymentMethodChecked="paymentBtnUpdate"
            />
            <div id="custom-steps" />
          </div>
        </div>
        <div
          class="hidden-xs col-sm-7 col-md-7 col-xs-12 bg-cl-secondary cart-summary cart-summary-col"
        >
          <cart-summary
            :activatePaymentBtn="activatePaymentBtn"
            :activatePaymentBtnTitle="activatePaymentBtnTitle"
            :activePaymentSection="activePaymentSection"
          />
        </div>
      </div>
    </div>
    <thank-you-page v-show="isThankYouPage" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'
import Checkout from '@vue-storefront/core/pages/Checkout'
import { bus } from '../index'
import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetails'
import Shipping from 'theme/components/core/blocks/Checkout/Shipping'
import Payment from 'theme/components/core/blocks/Checkout/Payment'
// import OrderReview from 'theme/components/core/blocks/Checkout/OrderReview';
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary'
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { mapGetters } from "vuex"
export default {
  components: {
    PersonalDetails,
    Shipping,
    Payment,
    // OrderReview,
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
  mixins: [Checkout, CurrentPage],
  beforeCreate () {
    registerModule(OrderModule)
  },
  methods: {
    paymentBtnUpdate (data) {
      this.activatePaymentBtn = data.btn
      this.activatePaymentBtnTitle = data.title
    },
    autoFillBillingDetails (paymentData) {
      this.$bus.$emit('autoFillBilling', paymentData)
    },
    checkIfDateSelected (data) {
      if (data === true) {
        this.activePaymentSection = true
      } else {
        this.activePaymentSection = false
      }
      this.activatePaymentBtn = false
    },
    notifyEmptyCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'Shopping cart is empty. Please add some products before entering Checkout'
        ),
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
        message: this.$t(
          'Stock check in progress, please wait while available stock quantities are checked'
        ),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'
        ),
        action1: { label: this.$t('OK') }
      })
    },
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    setCheckoutPage () {
      this.$store.commit('google-gtag/SET_CHECKOUT_PAGE', {
        cartItems: this.cartItems,
        totals: this.totals
      })
    }
  },
  computed: {
    ...mapGetters({
      totals: 'cart/getTotals',
      cartItems: "cart/getCartItems",
    }),
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    isThankYouPage () {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false
    },
    grandTotal () {
      let grandTotalVal = this.totals.find(t => t.code === 'grand_total')?.value
      return grandTotalVal || 0.00
    }
  },
  beforeMount () {
    // console.log('isThankYouPage' + this.$store.state.checkout.isThankYouPage);
    console.log('this.$store.state.cart', this.$store.state.cart)
    if (this.$store.state.checkout.isThankYouPage === false) {
      console.log('isThankYouPage_IF ')
      // this.$store.state.OrderDetail.orderdetail = this.$store.state.cart.platformTotals;
    }
  },
  watch: {
    grandTotal (to, from) {
      if (to !== from) {
        this.setCheckoutPage()
      }
    }
  },
  async mounted () {
    const craftyPlugin = document.createElement('script')
    craftyPlugin.setAttribute('src', '/assets/js/crafty_postcode.class.js')
    document.head.appendChild(craftyPlugin)
    const sagePayConfig = await config.sagepay
    let dropInJSUrl = 'https://pi-test.sagepay.com/api/v1/js/sagepay-dropin.js'
    if (sagePayConfig) {
      let selectedMode = sagePayConfig.selectedMode ? sagePayConfig.selectedMode : 'test'
      if (sagePayConfig[selectedMode]) {
        let selectedConfig = await sagePayConfig[selectedMode]
        if (selectedConfig.urls && selectedConfig.urls.dropinJs) {
          dropInJSUrl = selectedConfig.urls.dropinJs
        }
      }
    }
    let checkoutCdn = document.createElement('script')
    checkoutCdn.setAttribute(
      'src',
      dropInJSUrl
    )
    await document.head.appendChild(checkoutCdn)
    this.setCheckoutPage()
  },
  metaInfo: () => {
    // let recaptchaScript = document.createElement('script')
    // recaptchaScript.setAttribute('src', 'https://cdn.checkout.com/js/framesv2.min.js')
    // document.head.appendChild(recaptchaScript)

    if (config && config.paypal) {
      const storeView = currentStoreView()
      const { currencyCode } = storeView.i18n
      const clientId = config.paypal.hasOwnProperty('clientId') ? config.paypal.clientId : ''
      const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currencyCode}&disable-funding=card,credit`
      return {
        script: [
          {
            type: 'text/javascript',
            src: 'https://cdn.checkout.com/js/framesv2.min.js',
            defer: true,
            async: true
          },
          {
            type: 'text/javascript',
            src: sdkUrl,
            defer: true,
            async: true
          }
        ]
      }
    }
  }
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
      // padding-left: 0px;
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
      // left: auto !important;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: 1px solid #57c9c0  !important;
      margin-left: 15px;
    }
    input:checked ~ .checkmark:after {
      // content: '' !important;
      // position: absolute;
      // display: none;
      // top: 4px !important;
      // left: 9px !important;
      // width: 4px !important;
      // height: 10px !important;
      // border-radius: 0 !important;
      // border: solid #4c5053;
      // border-width: 0 3px 3px 0;
      // -webkit-transform: rotate(45deg);
      // -ms-transform: rotate(45deg);
      // transform: rotate(45deg);
      // background: transparent !important;
    }
  }

  .calendar-right-inner {
    .radioStyled {
      display: block;
      position: relative;
      // padding-left: 40px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 15px;
      line-height: 40px;
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
      height: 25px !important;
      width: 25px !important;
      border-radius: 50%;
      border: 1px solid #57c9c0 !important;
      margin-left: 0px !important;

      &:after {
        content: '' !important;
        position: absolute;
        display: none;
        top: 3px !important;
        left: 3px !important;
        width: 19px !important;
        height: 19px !important;
        border-radius: 50% !important;
        background: #57c9c0 !important;
        border: none !important;
        border-width: none !important;
      }
    }
  }

  .radioStyled {
    display: block;
    position: relative;
    // padding-left: 50px;
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
       background: #57c9c0 ;
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
    padding: 31px 0px 30px 0px;
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

@media (max-width: 480px) {
  #checkout .radioStyled .checkmark {
    // top: 4px !important;
    left: -18px;
  }
}
@media (min-width: 480px) and (max-width: 580px) {
  #checkout .radioStyled .checkmark {
    // top: 3px !important;
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
    // height: 20px;
    // width: 20px;
    // top: -2px;
    // left: -10px;
  }
  #checkout .delivery-methods-detail input:checked ~ .checkmark:after {
    // top: 2px !important;
    // left: 7px !important;
    // width: 4px !important;
  }
  #checkout .radioStyled .checkmark:after {
    // content: '';
    // top: 0px;
    // left: 0px;
    // width: 20px;
    // height: 20px;
  }
}

@media (max-width: 767px) {
  #checkout .radioStyled {
    font-size: 12px;
    padding-left: 20px;
  }
    #checkout .calendar-right-inner .checkmark {
      margin-left: 18px !important;
    }
        label.radioStyled.pre-del span {
      margin-left: 9px !important;
    }
}
@media (min-width: 320px) and (max-width: 480px) {
  #checkout .radioStyled {
    font-size: 2.35vw;
    padding-left: 20px !important;
  }
  .bank-card ul li img {
    width: 22px;
    margin-top: 7px;
    display: block;
  }
   label.radioStyled.pre-del span {
      margin-left: 30px !important;
    }
}
</style>
