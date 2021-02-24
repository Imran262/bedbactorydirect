<template>
  <div id="checkout">
    <div class="col-md-12 center-xs checkout-top-icons hidden-xs">
      <div class="container">
        <ul>
          <li class="checkout-top-basket">
            <span>Your basket </span>
          </li>
          <li class="checkout-top-detail">
            <span>Your Details</span>
          </li>
          <li class="checkout-top-detail">
            <span>Order Complete</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-md-12 checkout-shopping-return-main hidden-xs">
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
              <span v-else>{{ $t('You are logged in as ',) }}
                {{currentUser.firstname}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row" v-show="!isThankYouPage">
        <div class="col-sm-7 col-xs-12">
          <div class="checkout-title">
            <h1>{{ $t('Checkout') }}</h1>
          </div>
          <personal-details
            class="line relative"
            :is-active="activeSection.personalDetails"
            :focused-field="focusedField"
          />
          <shipping
            class="line relative"
            :is-active="activeSection.shipping"
            v-if="!isVirtualCart"
          />
          <payment class="line relative" :OnlineOnly="OnlineOnly" :is-active="activeSection.payment" />
          <!-- <order-review class="line relative" :is-active="activeSection.orderReview" /> -->
          <div id="custom-steps" />
        </div>
        <div class="hidden-xs col-sm-5 col-xs-12 bg-cl-secondary cart-summary">
          <cart-summary />
        </div>
      </div>
    </div>
    <thank-you-page v-show="isThankYouPage" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CurrentPage from 'theme/mixins/currentPage';
import Checkout from '@vue-storefront/core/pages/Checkout';

import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetails';
import Shipping from 'theme/components/core/blocks/Checkout/Shipping';
import Payment from 'theme/components/core/blocks/Checkout/Payment';
import OrderReview from 'theme/components/core/blocks/Checkout/OrderReview';
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummary';
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage';
import { registerModule } from '@vue-storefront/core/lib/modules';
import { OrderModule } from '@vue-storefront/core/modules/order';

export default {
  components: {
    PersonalDetails,
    Shipping,
    Payment,
    OrderReview,
    CartSummary,
    ThankYouPage
  },
  mixins: [Checkout, CurrentPage],
  beforeCreate() {
    registerModule(OrderModule);
  },
  methods: {
    notifyEmptyCart() {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'Shopping cart is empty. Please add some products before entering Checkout'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    notifyOutStock(chp) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: chp.name + this.$t(' is out of stock!'),
        action1: { label: this.$t('OK') }
      });
    },
    notifyNotAvailable() {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Some of the ordered products are not available!'),
        action1: { label: this.$t('OK') }
      });
    },
    notifyStockCheck () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'Stock check in progress, please wait while available stock quantities are checked'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'
        ),
        action1: { label: this.$t('OK') }
      });
    },
    gotoAccount() {
      this.$bus.$emit('modal-toggle', 'modal-signup');
    }
  },
  computed: {
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    isThankYouPage() {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false;
    }
  },
  beforeMount() {
    // console.log('isThankYouPage' + this.$store.state.checkout.isThankYouPage);
    if (this.$store.state.checkout.isThankYouPage === false) {
      console.log('isThankYouPage_IF ');
      // this.$store.state.OrderDetail.orderdetail = this.$store.state.cart.platformTotals;
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
  .number-circle {
    width: 35px;
    height: 35px;

    @media (max-width: 768px) {
      width: 25px;
      height: 25px;
      line-height: 25px;
    }
  }
  .radioStyled {
    display: block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 16px;
    line-height: 30px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    input {
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
  color: #4DBA87;
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
@media (min-width: 320px) and (max-width: 767px) {
}
@media (min-width: 320px) and (max-width: 480px) {
  #checkout .radioStyled .checkmark {
    top: 5px;
    height: 15px;
    width: 15px;
  }
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