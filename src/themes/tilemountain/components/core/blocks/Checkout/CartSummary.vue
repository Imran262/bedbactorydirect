<template>
  <div class="cart-summary-main" id="cart-summary-main">
    <div class="brdr-cl-primary pb20 cart-summary-inner">
      <h3 class="cl-accent summary-title">
        {{ $t("Order Review:") }}
      </h3>
      <div class="order-summary-inner">
        <div class="order-summary-details">
          <table class="cart-summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
          </table>
          <product
            v-for="product in productsInCart"
            :key="product.sku"
            :product="product"
          />
        </div>
        <div
          v-if="productsInCart && productsInCart.length"
          class="checkout serif cl-accent"
        >
          <div
            v-for="(segment, index) in totals"
            :key="index"
            class="subtotal-main pt15 pb10 pl20 pr40"
            v-if="segment.code !== 'grand_total' && segment.code !== 'tax'"
          >
            <div class="row">
              <div class="col-xs cl-accent col-md-6 col-lg-6 subtotal">
                <div v-if="segment.code === 'shipping'">
                  <template
                    v-if="(segment.title.indexOf('Back Order') !== -1) == true"
                  >
                    Delivery - awaiting date
                  </template>
                  <template
                    v-else-if="
                      (segment.title.indexOf('Kerbside') !== -1) == true
                    "
                  >
                    Kerbside Pallet Delivery
                  </template>
                  <template
                    v-else-if="(segment.title.indexOf('DPD') !== -1) == true"
                  >
                    DPD Delivery
                  </template>
                  <template
                    v-else-if="
                      (segment.title.indexOf('Royal Mail') !== -1) == true
                    "
                  >
                    Royal Mail
                  </template>
                  <template v-else> Delivery </template>
                </div>
                <div v-else-if="segment.code === 'tax'">VAT</div>
                <div v-else>
                  {{ segment.title }}
                </div>
              </div>
              <div
                v-if="segment.value != null && segment.code === 'shipping'"
                class="col-xs align-right right-text cl-accent h4 subtotal"
              >
                {{
                  segment.value === 0 ? "Free Delivery" : segment.value | price
                }}
              </div>
              <div
                v-else-if="segment.value != null"
                class="col-xs align-right right-text cl-accent h4 subtotal"
              >
                {{ segment.value | price }}
              </div>
            </div>
          </div>
          <div
            class="pt20 pb20 pl20 pr40 weight-400 h3 grand-total-main subtotal-main"
            v-for="(segment, index) in totals"
            :key="index"
            v-if="segment.code === 'grand_total'"
          >
            <div class="row">
              <div
                class="col-xs col-md-6 col-lg-8 grand-total-price grand-total"
              >
                {{ $t("Grand Total") }}
              </div>
              <div
                class="col-xs col-md-6 col-lg-4 align-right grand-total-price"
              >
                {{ segment.value | price }}
              </div>
            </div>
          </div>
          <FullToCutConverter
            :cart-items="productsInCart"
            v-if="$route.name !== 'confirmorder'"
          />
        </div>
        <div
          class="cart-bottom-detail paypal-btn"
          v-if="$route.name === 'confirmorder'"
        >
          <div class="cart-bottom-detail-inner">
            <button-full
              @click="prepareCartOrder"
              data-testid="orderReviewSubmit"
              class="btn"
              :disabled="!shippingMethod || !$v.phoneValidate.required"
            >
              {{ $t("Place the order") }}
            </button-full>
          </div>
        </div>
        <div
          class="cart-bottom-detail"
          v-if="activePaymentSection && activatePaymentBtnTitle === 'PayPal'"
        >
          <div class="cart-bottom-detail-inner paypal-btn">
            <span @click="handleOrderSubmit">
              <paypal-button />
            </span>
          </div>
        </div>

        <div
          class="cart-bottom-detail"
          v-if="
            activatePaymentBtn && activatePaymentBtnTitle === 'Cash on delivery'
          "
        >
          <div class="cart-bottom-detail-inner">
            <button
              @click="proceedPayment()"
              class="btn"
              v-if="activatePaymentBtn && activePaymentSection"
            >
              {{ activatePaymentBtnTitle }}
            </button>
          </div>
        </div>
        <div
          class="cart-bottom-detail"
          v-else-if="
            activatePaymentBtn && activatePaymentBtnTitle === 'Order Sample'
          "
        >
          <div class="cart-bottom-detail-inner">
            <button
              @click="proceedPayment()"
              class="btn"
              v-if="activatePaymentBtn && activePaymentSection"
            >
              {{ activatePaymentBtnTitle }}
            </button>
          </div>
        </div>
        <div
          class="cart-bottom-detail"
          v-else-if="
            activatePaymentBtn &&
              activatePaymentBtnTitle === 'Check / Money order'
          "
        >
          <div class="cart-bottom-detail-inner">
            <button
              class="btn"
              v-if="activatePaymentBtn && activePaymentSection"
            >
              {{ activatePaymentBtnTitle }}
            </button>
          </div>
        </div>
        <div
          class="cart-bottom-detail"
          v-else-if="
            activatePaymentBtn && activatePaymentBtnTitle === 'Buy Now'
          "
        >
          <div class="cart-bottom-detail-inner">
            <button
              @click="proceedPayment()"
              class="btn"
              v-if="activatePaymentBtn && activePaymentSection"
            >
              {{ activatePaymentBtnTitle }}
            </button>
          </div>
        </div>
        <div class="cart-bottom-detail" v-else>
          <div class="cart-bottom-detail-inner">
            <button
              class="btn"
              @click="proceedPayment()"
              v-if="
                activatePaymentBtnTitle !== '' &&
                  activatePaymentBtn &&
                  activePaymentSection &&
                  activatePaymentBtnTitle !== 'PayPal' &&
                  activatePaymentBtnTitle !== 'SagePay'
              "
            >
              {{ activatePaymentBtnTitle }}
            </button>
          </div>
        </div>
      </div>
      <div class="cart-bottom-text">
        <p>
          By selecting the Buy Now button, you agree to our
          <router-link to="/privacy-policy" target="_blank"
            ><span>Privacy Policy</span></router-link
          >
          and
          <router-link to="/terms" target="_blank"
            ><span>Terms and Conditions</span></router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { CartSummary } from "@vue-storefront/core/modules/checkout/components/CartSummary";
import Product from "./Product";
import EventBus from "@vue-storefront/core/compatibility/plugins/event-bus";
import ButtonFull from "theme/components/theme/ButtonFull";
import PaypalButton from "@develodesign/vsf-payment-paypal/components/Button";
import FullToCutConverter from "src/modules/cut-full-sample/components/converter/FullToCutConverter";
import { Payment } from "@vue-storefront/core/modules/checkout/components/Payment";
import { OrderReview } from "@vue-storefront/core/modules/checkout/components/OrderReview";
import { isServer } from "@vue-storefront/core/helpers";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";
import config from "config";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  components: {
    Product,
    PaypalButton,
    ButtonFull,
    FullToCutConverter
  },
  mixins: [CartSummary, Payment, OrderReview],
  data() {
    return {
      paymentRadioChecked: false,
      scrollPosition: null
    };
  },
  props: {
    shippingMethod: {
      type: String,
      required: false
    },
    hasPhone: {
      type: String,
      required: false
    },
    activatePaymentBtn: {
      type: Boolean,
      required: true
    },
    activatePaymentBtnTitle: {
      type: String,
      required: true
    },
    activePaymentSection: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    this.updateScroll();
    // this.handleScroll();
    // window.addEventListener('scroll', this.handleScroll)
    // window.addEventListener('scroll', this.updateScroll)
  },
  computed: {
    phoneValidate() {
      return this.hasPhone ? this.hasPhone.replace(/[-]/g, "") : this.hasPhone;
    }
  },
  // destroyed () {
  //   // window.removeEventListener('scroll', this.handleScroll)
  //  },
  methods: {
    updateScroll() {
      if (this.$route.name === "checkout") {
        if (window.innerWidth > 768) {
          document.getElementById("app").style.overflowX = "unset";
        }
        // document.getElementById('app').style.overflowX  = "unset";
        document.getElementById("viewport").style.overflow = "unset";
      }
    },
    async handleOrderSubmit() {
      await this.placeOrder();
    },
    prepareCartOrder() {
      EventBus.$emit("prepare-cart-order");
    },
    proceedPayment() {
      this.placeOrder();
      // document.getElementById('sagepay-submit').click();
    },
    paypalPayment() {
      document.getElementsByClassName("paypal-button")[0].click();
    }
    // handleScroll (event) {
    //   var SAFETY_MARGIN = 20
    //   const FOOTER_HEIGHT = document.getElementsByClassName('footer-main') !== undefined && document.getElementsByClassName('footer-main').length > 0 ? document.getElementsByClassName('footer-main')[0]
    //     .offsetHeight : null
    //   if (FOOTER_HEIGHT) {
    //     SAFETY_MARGIN = FOOTER_HEIGHT + 200
    //   } else {
    //     SAFETY_MARGIN = 600
    //   }
    //   const scrollY = window.scrollY
    //   const visible = window.innerHeight
    //   const pageHeight = document.documentElement.scrollHeight
    //   const bottomOfPage = scrollY + SAFETY_MARGIN >= pageHeight - visible
    //   if (bottomOfPage === true) {
    //      document.getElementById('cart-summary-main').classList.add('topSticky')
    //      document.getElementById('cart-summary-main').classList.remove('bottomSticky')
    //   } else {
    //     document.getElementById('cart-summary-main').classList.add('bottomSticky')
    //     document.getElementById('cart-summary-main').classList.remove('topSticky')
    //   }
    // }
  },
  validations: {
    phoneValidate: {
      required,
      maxLength: maxLength(11)
    }
  }
};
</script>

<style lang="scss" scoped>
.cart-summary-inner {
  position: sticky;
  top: 0;
}
thead tr th {
  padding: 10px 8px;
  text-align: left;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

.summary-title {
  @media (max-width: 767px) {
    margin-left: 0;
    margin-top: 0px;
  }
  color: #fff;
  font-size: 22px;
  margin-top: 31px;
  margin-bottom: 0px;
  background: #2a275c;
  padding: 17px 30px;
  font-weight: 600;
  font-family: Arial;
}

.order-summary-inner {
  background: #fff;
  font-family: "Poppins", sans-serif;
  // -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  // -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  // box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  border: 1px solid #bdbdbd;
}

.order-summary-bottom {
  background: #fff;
  font-family: "Poppins", sans-serif;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  padding: 25px;
  // margin: 0 25px 25px 25px;
}

.grand-total-price {
  font-size: 22px;
}

.topSticky {
  position: absolute !important;
  bottom: 0px !important;
  //top: 1px !important;
}

.cart-summary-main {
  width: 440px;
  // position: fixed;
  // z-index: 1;
  // top: auto;
  height: auto;
  .paypal-btn {
    padding-right: unset !important;
    padding-left: unset !important;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
  .pr40 {
    padding-right: 40px;
  }

  .subtotal-main {
    border-bottom: 1px solid #bdbdbd;
    padding: 25px 20px;
    @media (max-width: 1199px) {
      padding: 25px 16px;
    }
  }
  .subtotal-main:first-child {
    border-top: 1px solid #bdbdbd;
  }
  .subtotal-main:last-child {
    border-bottom: 1px solid transparent;
  }

  // .right-text {
  //   font-weight: 500 !important;
  // }
  .subtotal {
    font-size: 15px;
    font-weight: 600;
    color: #4f4f4f;
    font-family: Arial;
    font-weight: bold;
  }

  .grand-total-main {
    padding: 25px 20px;
    color: #2a275c;
    @media (max-width: 1199px) {
      padding: 25px 16px;
    }
    .grand-total-price {
      font-size: 14px;
      font-weight: 700;
      color: #2a275c;
      font-family: Arial;
      &:last-child {
        font-size: 17px;
      }
    }
  }

  .cart-bottom-detail {
    padding-right: 60px;
    padding-left: 60px;

    .btn {
      background: #2a275c;
      color: #fff;
      padding: 18px;
      display: block;
      text-align: center;
      font-weight: 600;
      border-radius: 5px;
      width: 100%;
      border: none;
      margin: 12px 0px 25px;
    }
    .paypal-btn {
      margin-bottom: 20px !important;
    }
  }
  .cart-bottom-text {
    p {
      text-align: center;
      font-size: 12px;
      margin: 5px 20px 20px 20px;
      font-family: Arial, Helvetica, sans-serif;
      color: #5e5e61;
      line-height: 17px;
      a {
        color: #ed008c;
        text-decoration: none;
      }
    }
  }
}

.order-summary-details {
  width: 100%;
  overflow-x: hidden;
  padding: 0px;
  overflow-y: auto;
  //max-height: 261px;
}

.order-summary-details::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 5px;
}

.order-summary-details::-webkit-scrollbar {
  width: 5px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.order-summary-details::-webkit-scrollbar-thumb {
  background-color: #676566;
  border-radius: 5px;
}

.cart-summary-table {
  width: 100%;
  margin-top: 10px;
  padding-left: 12px;
  padding-right: 12px;
  @media (max-width: 1199px) {
    padding-left: 7px;
    padding-right: 7px;
  }
  tr {
    th {
      color: #2a275c;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}
.cart-summary-table tr th:first-child {
  width: 43%;
  color: #59595b;
  @media (max-width: 480px) {
    width: 37%;
  }
}
.cart-summary-table tr th:nth-child(2n) {
  width: 15%;
  text-align: left;
}
.cart-summary-table tr th:last-child {
  width: 16%;
  text-align: right;
}
@media (min-width: 991px) and (max-width: 1200px) {
  .cart-summary-main {
    width: 320px;
  }
  .order-summary-details {
    max-height: 388px;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .cart-summary-main {
    position: relative;
    top: 0;
    width: 100%;
    z-index: 1;

    .summary-title {
      margin-top: 0px;
    }
  }
  .topSticky {
    position: relative !important;
    bottom: auto !important;
    top: unset !important;
  }
  .order-summary-details {
    max-height: 261px;
  }
}

@media (min-width: 575px) and (max-width: 767px) {
  .grand-total-price {
    font-size: 14px;
  }
  .col-xs.cl-accent div {
    font-size: 14px;
  }
  .col-xs.cl-accent {
    font-size: 14px;
  }
}

@media (max-width: 767px) {
  .cart-summary-main {
    width: 100%;
  }
  .grand-total {
    white-space: nowrap;
  }
  .cart-summary-main {
    position: relative;
    top: 0;
  }
  .topSticky {
    position: relative !important;
    bottom: auto !important;
    top: unset !important;
  }
  // .order-summary-details {
  //   max-height: 100%;
  // }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .grand-total-main {
    padding-left: 0;
  }
  .grand-total-price {
    font-size: 14px;
  }
  .col-xs.cl-accent div {
    font-size: 14px;
  }
  .col-xs.cl-accent {
    font-size: 14px;
  }
}
</style>
<style>
#submit-container {
  padding: 0px 50px !important;
}
@media screen and (min-width: 375px) and (max-width: 767px) {
  #submit-container {
    padding: 0px 40px !important;
  }
}
@media (max-width: 374px) {
  #submit-container {
    padding: 0px 10px !important;
  }
}
#submit-container input {
  background-color: #2a275c !important;
  color: #fff;
  display: block;
  text-align: center;
  font-weight: 600;
  line-height: 1;
  border-radius: 5px;
  border: none;
  margin-bottom: 20px;
}
</style>
