<template>
  <div class="order-review pt20 mb35">
    <div class="row pl20">
      <!-- <div class="col-xs-1 col-sm-2 col-md-1">
        <div
          class="number-circle lh35 cl-white brdr-circle align-center weight-700"
          :class="{ 'bg-cl-th-accent' : isActive || isFilled, 'bg-cl-tertiary' : !isFilled && !isActive }"
        >{{ (isVirtualCart ? 3 : 4) }}</div>
      </div>-->
      <div class="col-xs-12 col-sm-9 col-md-12">
        <div class="row">
          <div class="col-xs-12 col-md-12" :class="{ 'cl-bg-tertiary': !isFilled && !isActive }">
            <h3 class="m0 mb5">{{ $t("Review order") }}</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="row pl20 pr20" v-show="isActive">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div id="checkout-order-review-additional-container">
          <div id="checkout-order-review-additional">&nbsp;</div>
        </div>
        <div class="row mb15 mt20">
          <div class="col-xs-12">
            <!-- <p class="h4">{{ $t('Please check if all data are correct') }}</p> -->
            <div class="row">
              <div class="cartsummary-wrapper">
                <!-- <cart-summary /> -->
                <div class="payment">
                  <braintree-dropin />
                </div>
              </div>
              <!-- <base-checkbox
                class="col-xs-11 col-sm-12 col-md-8 bg-cl-secondary p15 mb35 ml10"
                id="acceptTermsCheckbox"
                @blur="$v.orderReview.terms.$touch()"
                v-model="orderReview.terms"
                :validations="[{
                  condition: !$v.orderReview.terms.required && $v.orderReview.terms.$error,
                  text: $t('Field is required')
                }]"
              >
                {{ $t('I agree to') }}
                <span
                  class="link pointer"
                  @click.prevent="$bus.$emit('modal-toggle', 'modal-terms')"
                >{{ $t('Terms and conditions') }}</span>
              </base-checkbox>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-show="isActive">
      <!-- <div class="hidden-xs col-sm-2 col-md-1" /> -->
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row pb35">
          <div class="col-xs-12 col-md-8 px20">
            <slot name="placeOrderButton">
              <button-full
                @click.native="
                  placeOrder();
                  checkedFn();
                "
                data-testid="orderReviewSubmit"
                class="place-order-btn"
              >{{ $t("Place the order") }}</button-full>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <modal name="modal-terms">
      <p slot="header">{{ $t("Terms and conditions") }}</p>
      <div slot="content">
        <p>
          This website ("website") is operated by Luma Inc., which includes Luma
          stores, and Luma Private Sales. This privacy policy only covers
          information collected at this website, and does not cover any
          information collected offline by Luma. All Luma websites are covered
          by this privacy policy.
        </p>
        <h2>Luma Security</h2>
        <p>
          Personal information provided on the website and online credit card
          transactions are transmitted through a secure server. We are committed
          to handling your personal information with high standards of
          information security. We take appropriate physical, electronic, and
          administrative steps to maintain the security and accuracy of
          personally identifiable information we collect, including limiting the
          number of people who have physical access to our database servers, as
          well as employing electronic security systems and password protections
          that guard against unauthorized access.
        </p>
        <h2>Luma Privacy Policy</h2>
        <p>
          To help us achieve our goal of providing the highest quality products
          and services, we use information from our interactions with you and
          other customers, as well as from other parties. Because we respect
          your privacy, we have implemented procedures to ensure that your
          personal information is handled in a safe, secure, and responsible
          manner. We have posted this privacy policy in order to explain our
          information collection practices and the choices you have about the
          way information is collected and used.
        </p>
        <p>
          As we continue to develop the Luma website and take advantage of
          advances in technology to improve the services we offer, this privacy
          policy likely will change. We therefore encourage you to refer to this
          policy on an ongoing basis so that you understand our current privacy
          policy.
        </p>
      </div>
    </modal>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import Composite from "@vue-storefront/core/mixins/composite";

import BaseCheckbox from "theme/components/core/blocks/Form/BaseCheckbox";
import ButtonFull from "theme/components/theme/ButtonFull";
import CartSummary from "theme/components/core/blocks/Checkout/CartSummary";
import Modal from "theme/components/core/Modal";
import { OrderReview } from "@vue-storefront/core/modules/checkout/components/OrderReview";
import { OrderModule } from "@vue-storefront/core/modules/order";
import { registerModule } from "@vue-storefront/core/lib/modules";
import BraintreeDropin from "src/modules/vsf-p-braintree/components/Dropin";

export default {
  components: {
    BaseCheckbox,
    ButtonFull,
    CartSummary,
    Modal,
    BraintreeDropin,
  },
  mixins: [OrderReview, Composite],
  validations: {
    // orderReview: {
    //   terms: {
    //     required
    //   }
    // }
  },
  beforeCreate() {
    registerModule(OrderModule);
  },
  methods: {
    onSuccess() {},
    onFailure(result) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(result.result),
        action1: { label: this.$t("OK") },
      });
    },
    checkedFn: function () {
      var to_detail_elem = document.getElementsByClassName(
        "checkout-top-detail"
      )[1];
      to_detail_elem.classList.add("top-detail-active");
      // var tick_elem = document.getElementsByClassName("non-selected-tick")[0];
      // tick_elem.classList.add("tick-active");
    },
  },
};
</script>

<style lang="scss" scoped>
.link {
  text-decoration: underline;
}

.cartsummary-wrapper .cart-summary-main {
  @media (min-width: 320px) {
    display: none;
  }
}
.order-review {
  background: #fff;
  padding: 12px 0px 0px 0px;
  font-family: "Poppins", sans-serif;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  position: relative;
  h3 {
    color: #676767;
    font-size: 22px;
    width: 100%;
    padding-bottom: 10px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
  }
  .cl-tertiary {
    margin-top: 15px;
    .material-icons {
      margin-top: 0px;
    }
  }
  .border-top {
    border-top: 1px solid #bdbdbd;
  }
  input:focus ~ label[data-v-63eab3fe],
  input:not(.empty) ~ label[data-v-63eab3fe] {
    top: -15px;
    font-size: 14px;
    color: #00998c;
  }
  span {
    // color: #676767;
  }
  label {
    color: #676767;
    font-size: 16px;
  }
  input:checked + label {
    &:before {
      background-color: #00998c;
      border-color: #00998c;
      cursor: pointer;
    }
    &:after {
      background-color: #00998c;
    }
  }
  .button-container {
    button {
      background-color: #00bfb3;
      border-radius: 5px;
      padding: 12px 0px;
      :hover {
        border-radius: 5px;
        background-color: #00998c;
      }
    }
  }
}
.non-selected-tick {
  background: url(/assets/checkout-non-selected-tick.png) no-repeat 100% 100%;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}
.tick-active {
  background: url(/assets/checkout-selectd-tick.png) no-repeat 100% 100% !important;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 30px;
}
.top-detail-active {
  background: url(/assets/checkout-top-detail-img.png) no-repeat !important;
}
.top-detail-active span {
  color: #01998c !important;
}
</style>
