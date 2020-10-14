<template>
  <div class="cart-summary-main">
    <div class="brdr-cl-primary pb20">
      <h3 class="cl-accent ml30 summary-title">{{ $t('Order Summary') }}</h3>
      <div class="order-summary-inner">
        <product v-for="product in productsInCart" :key="product.sku" :product="product" />
        <div v-if="productsInCart && productsInCart.length" class="checkout pt10 serif cl-accent">
          <div
            v-for="(segment, index) in totals"
            :key="index"
            class="row pt15 pb10 pl10 pr20"
            v-if="segment.code !== 'grand_total' && segment.title !== 'VAT'"
          >
            <div class="col-xs cl-accent col-md-6 col-lg-8 align-right">
              <div v-if="segment.code === 'shipping'">Delivery</div>
              <div v-else>{{ segment.title }}</div>
            </div>
            <div
              v-if="segment.value != null && segment.code === 'shipping'"
              class="col-xs align-right cl-accent h4"
            >
              {{
              segment.value * 1.2 === 0
              ? 'Free Delivery'
              : (segment.value * 1.2) | price
              }}
            </div>
            <div
              v-else-if="segment.value != null"
              class="col-xs align-right cl-accent h4"
            >{{ segment.value | price }}</div>
            <!-- <div
              v-if="segment.value != null"
              class="col-xs align-right cl-accent h4"
            >{{ segment.value | price }}</div>-->
          </div>

          <div
            class="row pt20 pb20 pl30 pr20 weight-400 h3 grand-total-main"
            v-for="(segment, index) in totals"
            :key="index"
            v-if="segment.code === 'grand_total'"
          >
            <div class="col-xs col-md-6 col-lg-8 align-right grand-total-price grand-total">{{ segment.title }}</div>
            <div class="col-xs col-md-6 col-lg-4 align-right grand-total-price">{{ segment.value | price }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="order-summary-bottom py50 px25">
      <h4 class="h3 m0">
        {{ $t('Safety') }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 class="h3 mb0" v-if="!isVirtualCart">
        {{ $t('Shipping') }}
      </h4>
      <p class="cl-tertiary lh20" v-if="!isVirtualCart">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 class="h3 mb0">
        {{ $t('Returns') }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
    </div>-->
  </div>
</template>

<script>
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary';
import Product from './Product';

export default {
  components: {
    Product
  },
  mixins: [CartSummary]
};
</script>

<style lang="scss" scoped>
.summary-title {
  @media (max-width: 767px) {
    margin-left: 0;
  }
  color: #676767;
  font-size: 36px;
  margin-top: 23px;
  margin-bottom: 25px;
}
.order-summary-inner {
  background: #fff;
  font-family: 'Poppins', sans-serif;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
}
.order-summary-bottom {
  background: #fff;
  font-family: 'Poppins', sans-serif;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  padding: 25px;
  // margin: 0 25px 25px 25px;
}
.grand-total-price{
  font-size:22px;
}
.cart-summary-main {
  width: 88%;
}
@media(min-width: 575px) and (max-width: 767px){
  .grand-total-price{
    font-size:14px;
  }
  .col-xs.cl-accent div{
    font-size: 14px;
  }
   .col-xs.cl-accent{
    font-size: 14px;
  }
}
@media (min-width: 320px) and (max-width: 767px) {
  .cart-summary-main {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
  .grand-total {
    white-space: nowrap;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .grand-total-main {
    padding-left: 0;
  }
  .grand-total-price{
    font-size:14px;
  }
  .col-xs.cl-accent div{
    font-size: 14px;
  }
   .col-xs.cl-accent{
    font-size: 14px;
  }
}
</style>
