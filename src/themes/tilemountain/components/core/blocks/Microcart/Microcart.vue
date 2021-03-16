<template>
  <div
    class="microcart cl-accent relative"
    :class="[productsInCart.length ? 'bg-cl-secondary' : 'bg-cl-primary']"
    data-testid="microcart"
    @mouseover="openMicrocartCustom"
    @mouseout="leaveMicrocartCustom"
  >
    <div class="microcart-inner">
      <transition name="fade">
        <div v-if="isEditMode" class="overlay" @click="closeEditMode"/>
      </transition>
      <!-- <div class="row bg-cl-primary actions">
      <div class="col-xs end-xs">
        <button
          type="button"
          class="p0 brdr-none bg-cl-transparent close"
          @click="closeMicrocartExtend"
          data-testid="closeMicrocart"
        >
          <i class="material-icons py20 cl-accent">close</i>
        </button>
      </div>
    </div> -->
      <div class="middle-xs top-sm actions">
        <div class="col-xs-12 col-sm">
          <h2 v-if="productInCartNew.length && spendMoreMessage" class="cl-accent">
            {{ spendMoreMessage }}*<br/><small>Does not include some postcodes</small>
          </h2>
        </div>
        <!-- <div class="col-xs-12 col-sm mt35 mb35 mt0 end-sm clearcart-col">
        <clear-cart-button v-if="productsInCart.length" @click.native="clearCart" />
      </div> -->
      </div>

      <h4 v-if="!productInCartNew.length" class="cl-accent">
        {{ $t('Your shopping cart is empty.') }}
      </h4>
      <!-- <div
        v-if="!productInCartNew.length"
        class="empty-txt"
        @click="closeMicrocartExtend"
      >
        {{ $t('Don\'t hesitate and') }}
        <router-link :to="localizedRoute('/')">
          {{ $t('browse our catalog') }}
        </router-link>
        {{ $t('to find something beautiful for you!') }}
      </div> -->
      <ul v-if="productInCartNew.length" class="bg-cl-primary products">
        <product
          v-for="(product, index) in productInCartNew"
          :key="product.server_item_id || index"
          :product="product"
        />
      </ul>
      <!-- <div v-if="productsInCart.length" class="summary px40 cl-accent serif">
      <h3 class="m0 pt40 mb30 weight-400 summary-heading">{{ $t('Shopping summary') }}</h3>
      <div
        v-for="(segment, index) in totals"
        :key="index"
        class="row py20"
        v-if="segment.code !== 'grand_total'"
      >
        <div class="col-xs">
          {{ segment.title }}
          <button
            v-if="appliedCoupon && segment.code === 'discount'"
            type="button"
            class="p0 brdr-none bg-cl-transparent close delete-button ml10"
            @click="clearCoupon"
          >
            <i class="material-icons cl-accent">close</i>
          </button>
        </div>
        <div
          v-if="segment.value != null"
          class="col-xs align-right"
        >{{ segment.value | price(storeView) }}</div>
      </div>
      <div class="row py20">
        <div v-if="OnlineOnly && !addCouponPressed" class="col-xs-12">
          <button
            class="p0 brdr-none serif fs-medium-small cl-accent bg-cl-transparent"
            type="button"
            @click="addDiscountCoupon"
          >{{ $t('Add a discount code') }}</button>
        </div>
        <div v-if="OnlineOnly && addCouponPressed" class="col-xs-12 pt30 coupon-wrapper">
          <div class="coupon-input">
            <label class="h6 cl-secondary">{{ $t('Discount code') }}</label>
            <base-input
              type="text"
              id="couponinput"
              :autofocus="true"
              v-model.trim="couponCode"
              @keyup.enter="setCoupon"
            />
          </div>
          <button-outline
            color="dark"
            :disabled="!couponCode"
            @click.native="setCoupon"
          >{{ $t('Add discount code') }}</button-outline>
        </div>
      </div>
    </div> -->
      <div
        class="weight-700 middle-xs"
        v-for="(segment, index) in totals"
        :key="index"
        v-if="segment.code === 'subtotal'"
      >
        <div class="col-xs h4 total-price-label" v-if="productInCartNew.length">
          <h2>
            {{ $t('Basket Subtotal:') }}
            <!-- <span class="total-amount cart-empty" >{{ 0.00 | price(storeView) }} </span> -->
            <span class="total-amount">{{
                segment.value | price(storeView)
              }}</span>
          </h2>
        </div>
      </div>
      <div
        class="middle-xs actions checkout-detail-btn"
        v-if="productsInCart.length && !isCheckoutMode"
      >
        <!-- <div class="col-xs-12 col-md-4 first-md">
        <router-link :to="localizedRoute('/')" class="no-underline cl-secondary link">
          <span @click="closeMicrocartExtend">{{ $t('Return to shopping') }}</span>
        </router-link>
      </div> -->

        <div class="col-xs-12 col-md-9 check-btn">
          <!-- <div class="cart-button">
          <button-full
            class="checkoutbutton"
            :link="{ name: 'cart' }"
            @click.native="closeMicrocartExtend"
          >
            {{ $t('View cart') }}
          </button-full>
        </div> -->
          <div class="checkout-button" v-if="hasFreeSampleWithZeroSubTotal">
            <button-full
              class="checkoutbutton"
              @click="showSamplesModal()"
            >
              {{ $t('Get My Free Samples') }}
            </button-full>
          </div>
          <div class="checkout-button" v-else-if="hasFullSamplesOnlyInCart">
            <button-full
              class="checkoutbutton"
              @click="closeMicrocartExtend(); closemicro(); $router.push('/checkout');"
            >
              {{ $t('Proceed to Checkout') }}
            </button-full>
          </div>
          <div class="checkout-button" v-else>
            <button-full
              class="checkoutbutton1"
              @click="closeMicrocartExtend(); closemicro(); $router.push('/cart');"
            >
              {{ $t('View Basket') }}
            </button-full>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import i18n from '@vue-storefront/i18n';
import { isModuleRegistered } from '@vue-storefront/core/lib/modules';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import InstantCheckout from 'src/modules/instant-checkout/components/InstantCheckout.vue';
import { registerModule } from '@vue-storefront/core/lib/modules';

import BaseInput from 'theme/components/core/blocks/Form/BaseInput';
import ClearCartButton from 'theme/components/core/blocks/Microcart/ClearCartButton';
import ButtonFull from 'theme/components/theme/ButtonFull';
import ButtonOutline from 'theme/components/theme/ButtonOutline';
import Product from 'theme/components/core/blocks/Microcart/Product';
import EditMode from './EditMode';
import { InstantCheckoutModule } from 'src/modules/instant-checkout';
import { CartService } from '@vue-storefront/core/data-resolver';
import { hasOnlySampleTypeInCart } from 'src/modules/cut-full-sample/helpers/index';

export default {
  components: {
    Product,
    ButtonFull
  },
  mixins: [VueOfflineMixin, EditMode, onEscapePress],
  data () {
    return {
      addCouponPressed: false,
      couponCode: '',
      componentLoaded: false,
      showCheckoutModel: false,
      isInstantCheckoutRegistered: isModuleRegistered('InstantCheckoutModule')
    };
  },
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  beforeCreate () {
    registerModule(InstantCheckoutModule);
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true;
    });
    this.$bus.$on('CutSizeSampleAddedToCart', (val) => {
      this.$nextTick(() => {
        this.showSamplesModal()
      });
    });
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      isOpen: 'cart/getIsMicroCartOpen'
    }),
    productInCartNew () {
      let productsNew = this.productsInCart;
      let productsNewArray = [];
      productsNew.forEach((product) => {
        let product_qty = product.qty;
        if (product.totals && product.totals.options) {
          let productTotalQty = product.totals.qty;
          if (product_qty !== productTotalQty) {
            delete product.totals;
            productsNewArray.push(product);
          } else {
            productsNewArray.push(product);
          }
        } else {
          productsNewArray.push(product);
        }
      });
      return productsNewArray;
    },
    storeView () {
      return currentStoreView();
    },
    hasFreeSampleWithZeroSubTotal () {
      if (hasOnlySampleTypeInCart && typeof hasOnlySampleTypeInCart === 'function') {
        let hasFreeSamplesOnlyInCart = hasOnlySampleTypeInCart({
          cartItems: this.productsInCart,
          sampleType: 'Cut Size'
        });

        if (!hasFreeSamplesOnlyInCart) {
          return false;
        }
        return (
          this.totals.filter((item, index) => {
            return item.code === 'subtotal' && item.value === 0;
          }).length > 0 && hasFreeSamplesOnlyInCart
        );
      }
      return false;
    },
    hasFullSamplesOnlyInCart () {
      if (hasOnlySampleTypeInCart && typeof hasOnlySampleTypeInCart === 'function') {
        return hasOnlySampleTypeInCart({
          cartItems: this.productsInCart,
          sampleType: 'Full Size'
        });
      }
      return false;
    },
    spendMoreMessage () {
      // grand_total
      let grandTotal = this.totals.filter((item, index) => {
        return item.code === 'grand_total';
      })[0];
      if (grandTotal.extension_attributes && grandTotal.extension_attributes.spend_more_message) {
        return grandTotal.extension_attributes.spend_more_message
      }
      return null
    },
    currRoute () {
      return this.$route.name;
    }
  },
  methods: {
    ...mapActions({
      applyCoupon: 'cart/applyCoupon'
    }),
    showSamplesModal () {
      if (this.hasFreeSampleWithZeroSubTotal) {
        this.$bus.$emit('modal-show', 'modal-quickcheckoutmodel');
      }
    },
    addDiscountCoupon () {
      this.addCouponPressed = true;
    },
    clearCoupon () {
      this.$store.dispatch('cart/removeCoupon');
      this.addCouponPressed = false;
    },
    toggleMicrocart () {
      this.$store.dispatch('ui/toggleMicrocart');
    },
    openMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display = 'block';
    },
    leaveMicrocartCustom (event) {
      document.getElementsByClassName('microcart-sidebar')[0].style.display = 'none';
    },
    async setCoupon () {
      const couponApplied = await this.applyCoupon(this.couponCode);
      this.addCouponPressed = false;
      this.couponCode = '';
      if (!couponApplied) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: i18n.t(
            'You\'ve entered an incorrect coupon code. Please try again.'
          ),
          action1: { label: i18n.t('OK') }
        });
      }
    },
    closeMicrocartExtend () {
      this.toggleMicrocart();
      this.$store.commit('ui/setSidebar', false);
      this.addCouponPressed = false;
    },
    async closemicro () {
      let a = await document.getElementsByClassName('microcart-sidebar')[0];
      a.style.display = 'none'
    },
    onEscapePress () {
      this.$store.dispatch('ui/closeMicrocart');
    },
    clearCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t(
          'Are you sure you would like to remove all the items from the shopping cart?'
        ),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: {
          label: i18n.t('OK'),
          action: async () => {
            // We just need to clear cart on frontend and backend.
            // but cart token can be reused
            await this.$store.dispatch('cart/clear', { disconnect: false });
          }
        },
        hasNoTimeout: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";

.checkoutbutton, .checkoutbutton:hover {
  background-color: #24224d;
}
.checkoutbutton1, .checkoutbutton1:hover {
  background-color: #24224d;
}
.checkoutbutton1{
  min-width: 100% !important;
}

.close {
  i {
    opacity: 0.6;
  }

  &:hover,
  &:focus {
    i {
      opacity: 1;
    }
  }
}

.mt0 {
  @media (max-width: 767px) {
    margin-top: 0;
  }
}

.clearcart {
  &-col {
    display: flex;
    align-self: center;
  }
}

.products {
  @media (max-width: 767px) {
    padding: 30px 15px;
  }
}

.actions {
  @media (max-width: 767px) {
    padding: 0 15px;
  }

  .link {
    @media (max-width: 767px) {
      display: flex;
      justify-content: center;
      padding: 20px 70px;
      &.checkout {
        margin-top: 55px;
        padding: 0;
      }
    }
  }
}

.summary {
  @media (max-width: 767px) {
    padding: 0 15px;
    font-size: 12px;
  }
}

.summary-heading {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-label {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-value {
  @media (max-width: 767px) {
    font-size: 24px;
  }
}

.delete-button {
  vertical-align: middle;
}

.coupon-wrapper {
  display: flex;

  .button-outline {
    text-transform: inherit;
    width: 50%;
  }

  .coupon-input {
    margin-right: 20px;
    width: 100%;
  }
}

.overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.cart-button {
  padding-right: 15px;
  width: 50% !important;
  display: flex;
  justify-content: center;
}

.checkout-button {
  width: 50%;
}

.microcart {
  border-top: 20px solid #ec008c !important;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #cccccc;
  .top-sm {
    h2 {
      margin: 20px 0px;
      color: #2a275c;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      text-align: center;
    }
  }

  h4 {
    margin: 20px 0px;
    color: #2a275c;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
  }

  .empty-txt {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    padding-bottom: 20px;
    color: #4a4a4a;
  }

  .products {
    padding: 0px;
    overflow-y: auto;
    max-height: 430px;
    margin-right: 15px;

    li {
      padding: 22px 0px;
      margin: 0px;
    }
  }

  // .quick-checkout-inner::-webkit-scrollbar-track {
  //   -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  //   background-color: #f5f5f5;
  //   border-radius: 5px;
  //   -webkit-overflow-scrolling:touch;
  // }

  // .quick-checkout-inner::-webkit-scrollbar {
  //   width: 5px;
  //   background-color: #f5f5f5;
  //   border-radius: 5px;

  // }

  // .quick-checkout-inner::-webkit-scrollbar-thumb {
  //   background-color: #676566;
  //   border-radius: 5px;
  // }
  .total-price-label {
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    padding: 25px 0px;
    h2 {
      text-align: center;
      margin: 0px;
      color: #4a4a4a;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;

      span {
        color: #2a275c;
        font-size: 20px;
        margin-left: 25px;
      }
    }
  }

  .checkout-detail-btn {
    padding: 20px 0px;
    .check-btn {
      margin: auto;
      .checkout-button {
        width: 100%;

        a {
          background: #2a275c;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 16px;
          padding: 18px;
          font-weight: bold;
          border-radius: 3px;
        }
      }
    }
  }
  .products::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
    border-radius: 5px;
  }

  .products::-webkit-scrollbar {
    width: 5px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }

  .products::-webkit-scrollbar-thumb {
    background-color: #676566;
    border-radius: 5px;
  }
  .microcart .products {
    padding: 10px 0px 0px 0px;
    overflow-y: auto;
    max-height: 430px;
    margin-right: 5px;
  }
}

@media (max-width: 767px) {
  .products {
    li {
      padding: 22px 0px 7px 0;
      margin: 0px;
    }
  }
  .pairbutton {
    display: block !important;
  }
  .cart-button {
    width: 100% !important;
  }
  .checkout-button {
    // width: 100%;
    padding-top: 10px;
  }
    .top-sm {
      h2 {
        font-size: 11px;
      }
    }

    .total-price-label {
      padding: 15px 0px !important;
      .cart-empty {
        display: none;
      }

      h2 {
        font-size: 12px !important;

        span {
          font-size: 14px !important;
        }
      }
    }
  .checkoutbutton1{
    padding: 11px;
  }
    .checkout-detail-btn {
      padding: 6px 0 15px 0 !important;
      .check-btn {
        display: flex;
        justify-content: center;

        .checkout-button {
          width: 70%;
          padding-left: 20px;
          padding-right: 20px;

          a {
            font-size: 11px;
            padding: 11px;
            width: 100%;
            max-width: 100%;
            min-width: 155px;
          }
        }
      }
    }

    h4 {
      font-size: 9.3px;
    }

    .empty-txt {
      display: none;
    }
    .microcart .products {
      max-height: 240px;
      overflow-x: hidden;
      margin-right: 11.5px;
    }
    .microcart .products::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
        background-color: #f5f5f5;
        border-radius: 5px;
    }

    .microcart .products::-webkit-scrollbar {
      width: 2px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }

    .microcart .products::-webkit-scrollbar-thumb {
      background-color: #676566;
      border-radius: 5px;
    }
  }

.mystyle {
  -webkit-overflow-scrolling: touch;
}
</style>
