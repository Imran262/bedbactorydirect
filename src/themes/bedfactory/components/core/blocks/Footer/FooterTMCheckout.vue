<template>
  <footer
    class="footerContainer"
    :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }"
  >
    <trustPoilet :identifier="'trust_pilot'" />
    <div class="container">
      <div class="row alignItemCenter">
        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4 mobileOrder2">
          <div>
            <router-link
              :to="localizedRoute('/')"
              :title="$t('Home Page')"
              class="no-underline inline-flex"
            >
              <img width="97" height="51" src="/assets/footer-logo-3.svg" />
            </router-link>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 mobileOrder1">
          <h2 class="acceptedcards">
            <img src="/assets/lock.svg" />
            <span>Secure Payment By</span>
          </h2>
          <!-- <div class="acccards">
                        <img v-lazy="this.cardsAccept" alt="payments" />
                    </div> -->
          <div class="acccards">
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-visa.svg"
                alt="Visa Card"
                title="Visa Card"
              />
            </div>
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-mastercard.svg"
                alt="Mastercard"
                title="Mastercard"
              />
            </div>
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-maestro.svg"
                alt="Maestro Card"
                title="Maestro Card"
              />
            </div>
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-paypal.svg"
                alt="Paypal Card"
                title="Paypal Card"
              />
            </div>
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-amex.svg"
                alt="Amex Card"
                title="Amex Card"
              />
            </div>
            <div class="paymentIcons">
              <img
                src="/assets/payment-icon-v12.svg"
                alt="V12 Card"
                title="V12 Card"
              />
            </div>
          </div>
        </div>
        <div
          class="col-xs-6 col-sm-6 col-md-4 col-lg-4 mobieBottomFooterCont mobileOrder3"
        >
          <div class="align-right">
            <p class="copyright1">
              &#169; {{ getCurrentYear }} Bed Factory Direct Ltd
            </p>
            <router-link
              :to="localizedRoute('/privacy-policy')"
              :title="$t('Privacy Policy')"
              class="inline-flex copyright2"
            >
              Privacy & Cookies
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";
import { localizedRoute } from "@vue-storefront/core/lib/multistore";
import CurrentPage from "theme/mixins/currentPage";
import LanguageSwitcher from "../../LanguageSwitcher.vue";
import BackToTop from "theme/components/core/BackToTop";

import config from "config";

import FollowUsLik from "src/themes/bedfactory/components/core/blocks/Footer/FollowUsLink";

import trustPoilet from "src/themes/bedfactory/components/core/blocks/Trustpilot";
import footerlink from "theme/components/core/blocks/Cms/FooterLinks";
import footerlinkmobile from "src/themes/bedfactory/components/core/blocks/Cms/FooterLinkMobile";
import BlockTitle from "theme/components/core/blocks/Cms/BlockTitle";
import { getPathForStaticPage } from "theme/helpers";
import sociallinks from "src/themes/bedfactory/components/core/blocks/Cms/SocialLinks";

// import NewsLetter from "theme/components/core/blocks/Footer/NewsLetter";
export default {
  mixins: [CurrentPage, footerlink, footerlinkmobile],
  name: "MainFooterCheckout",
  data() {
    return {
      cardsAccept: "/assets/images/payments.svg",
      windowWidth: 0
    };
  },
  beforeMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    goToAccount() {
      this.$bus.$emit("modal-toggle", "modal-signup");
    },
    getLinkFor(path) {
      return localizedRoute(getPathForStaticPage(path));
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      isLogged: "user/isLoggedIn",
      totals: "cart/getTotals"
    }),
    multistoreEnabled() {
      return config.storeViews.multistore;
    },
    getVersionInfo() {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    },
    getCurrentYear() {
      return new Date().getFullYear();
    }
  },
  components: {
    LanguageSwitcher,
    BackToTop,
    footerlink,
    footerlinkmobile,
    BlockTitle,
    FollowUsLik,
    trustPoilet,
    sociallinks
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Oblik";
  src: url("/assets/fonts/Oblik_Bold.otf");
  font-display: block;
}

@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

.securePaymentMobile > span {
  font-size: 1rem;
  color: #fff;
}
.securePaymentMobile {
  margin-top: 2rem;
  text-align: center;
}
form {
  background: #fff;
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}
input:focus-visible,
input:focus,
input:focus-within {
  outline-offset: unset !important;
  outline: unset !important;
}
:-webkit-direct-focus {
  outline: unset !important;
  outline-color: unset !important;
  outline-width: 0 !important;
}
.newsLetterInput {
  line-height: 33px;
  height: 33px;
  color: #191919;
  border: 0;
}
.acceptedcards {
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: center;
  margin-top: 0;
}
.acceptedcards > span {
  margin-left: 0.3rem;
  font-size: 1rem;
}
.signUpBtn.newsLetterInput {
  background: #4dba87;
  color: #fff;
}
.signUpBtn.newsLetterInput:hover,
.signUpBtn.newsLetterInput:active,
.signUpBtn.newsLetterInput:focus {
  background: #2ea970;
  border-radius: 0 !important;
}
span.getInfo {
  color: #fff;
  font-size: 0.875rem;
}
.footerContainer {
  background-color: #0b1a44;
}

.pinterest,
.youtube,
.linkedin {
  margin-bottom: 8px !important;
}
.fa {
  color: #434243;
  font-size: 30px;
}

.copyright1 {
  color: #fff;
  text-align: right;
  padding-top: 14px;
  font-size: 12px;
  font-family: "Roboto";
  padding: 0;
  margin: 0;
}
.copyright2 {
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-family: "Roboto";
  text-decoration: underline;
}
.acccards {
  display: flex;
  align-items: center;
  justify-content: center;
}
.acccards > .paymentIcons:first-child {
  margin-left: 0px;
}
.paymentIcons {
  margin-left: 1px;
}
.row.alignItemCenter {
  align-items: center;
}

@media screen and (max-width: 767px) {
  .mobileOrder1 {
    order: 1;
    padding-right: 0;
    padding-left: 0;
    border-bottom: 1px solid #040e2c;
    padding-bottom: 1rem;
    padding-top: 0.5rem;
    margin-bottom: 1rem;
  }
  .mobileOrder2 {
    order: 2;
  }
  .mobileOrder3 {
    order: 3;
  }
  .securePaymentMobile[data-v-00866570] {
    border-bottom: 1px solid;
    padding-bottom: 0.5rem;
  }
  .mobieBottomFooterCont {
    text-align: right;
  }
  .mobieBottomFooterCont > div {
    display: inline-block;
    text-align: right;
  }
  .pinterest,
  .youtube,
  .linkedin {
    margin-bottom: 0 !important;
  }
  .row.alignItemCenter {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

@media only screen and (min-width: 992px) {
  .alignItemCenter {
    min-height: 100px;
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .alignItemCenter {
    align-items: center;
    min-height: 85px;
  }
}
</style>
