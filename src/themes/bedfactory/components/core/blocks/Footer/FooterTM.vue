<template>
  <footer
    class="footerContainer"
    :class="{ 'brdr-top-1 brdr-cl-secondary': isCheckoutPage }"
  >
    <trustPoilet :identifier="'trust_pilot'" />
    <div
      class="footer-main"
      id="footer-main-desktop"
      v-show="windowWidth >= 768"
    >
      <div class="container">
        <div class="row">
          <footerlink :identifier="'tm_footer_links'" />
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <div class="newsLetterCont">
              <div class="row">
                <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12">
                  <h2>Stay In Touch</h2>
                  <span class="getInfo">
                    Get info about offers, giveaways and new products
                  </span>
                  <form action="">
                    <input
                      type="email"
                      placeholder="Type your email here"
                      class="newsLetterInput w-100 emailInput"
                    />
                    <input
                      type="submit"
                      value="Sign Up"
                      class="newsLetterInput signUpBtn"
                    />
                  </form>
                  <div class="emailMsg success">
                    <img src="/assets/green-tick.svg" alt="" />
                    <span>You’ve successfully joined our mailing list</span>
                  </div>
                  <div class="emailMsg error">
                    <img src="/assets/red-tick.svg" alt="" />
                    <span>Please enter a valid email address</span>
                  </div>
                  <span class="getInfoSmall">
                    We won’t share your details with anyone else.
                  </span>
                  <!-- <h2>Follow Us</h2> -->
                </div>
                <div class="col-xs-12 col-sm-6 col-md-12 col-lg-12 mt35">
                  <h2 class="acceptedcards">
                    <img src="/assets/lock.svg" />
                    <span>Secure Payment By</span>
                  </h2>
                  <!-- <img v-lazy="this.cardsAccept" alt="payments" /> -->

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-footer" v-show="windowWidth < 768">
      <div class="container">
        <div class="row">
          <!-- <div class="w-100 footerPaddings"> -->
          <div class="col-12 mobileFooterForm">
            <h2>Stay In Touch</h2>
            <span class="getInfo">
              Get info about offers, giveaways and new products
            </span>
            <form action="">
              <input
                type="email"
                placeholder="Type your email here"
                class="newsLetterInput w-100 emailInput"
              />
              <input
                type="submit"
                value="Sign Up"
                class="newsLetterInput signUpBtn"
              />
            </form>
            <div class="emailMsg success">
              <img src="/assets/green-tick.svg" alt="" />
              <span>You’ve successfully joined our mailing list</span>
            </div>
            <div class="emailMsg error">
              <img src="/assets/red-tick.svg" alt="" />
              <span>Please enter a valid email address</span>
            </div>
            <span class="getInfoSmall">
              We won’t share your details with anyone else.
            </span>
          </div>
          <div class="col-12 mobileFooterForm">
            <footerlinkmobile :identifier="'tm_footer_links'" />
          </div>
          <!-- </div> -->
          <div class="col-12 securePaymentMobile">
            <img src="/assets/lock.svg" />

            <span>Secure Payments By</span>
            <div class="socialicons">
              <!-- <img
                                v-lazy="cardsAccept"
                                class="mobilepaymentcards"
                                alt="payments"
                                /> -->
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
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="container">
        <div class="row">
          <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
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
          <div
            class="col-xs-6 col-sm-6 col-md-4 col-lg-4 mobieBottomFooterCont"
          >
            <div class="align-center">
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
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <sociallinks :identifier="'follow-us-social-links-TM'" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";
import {
  currentStoreView,
  localizedRoute
} from "@vue-storefront/core/lib/multistore";
import CurrentPage from "theme/mixins/currentPage";
import LanguageSwitcher from "../../LanguageSwitcher.vue";
import BackToTop from "theme/components/core/BackToTop";

import config from "config";
import CmsBlock from "theme/components/core/blocks/Cms/Block";

import FooterBottom from "src/themes/bedfactory/components/core/blocks/Footer/FooterBottom";
import FooterLink from "src/themes/bedfactory/components/core/blocks/Footer/FooterLink";
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
  name: "MainFooter",
  data() {
    return {
      cardsAccept: "/assets/payment-methods.svg",
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
    // CmsBlock,
    // CustomerServiceBlock,
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
// my customization for footr starts here

.acccards {
  display: flex;
  align-items: center;
}
.acccards > .paymentIcons:first-child {
  margin-left: 0px;
}
.paymentIcons {
  margin-left: 1px;
}
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
input {
  -webkit-appearance: none;
  border-radius: 0;
}
.newsLetterInput {
  line-height: 33px;
  height: unset !important;
  color: #191919;
  border: 0;
}
.newsLetterInput.emailInput {
  padding-left: 0.5rem;
  padding-right: 1rem;
}
.acceptedcards {
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
}
.acceptedcards > span {
  margin-left: 0.3rem;
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
  cursor: pointer;
}
span.getInfo {
  color: #fff;
  font-size: 0.875rem;
}
span.getInfoSmall {
  color: #fff;
  font-size: 0.75rem;
}
.footerContainer {
  background-color: #0b1a44;
}
.footer-main {
  padding: 2rem 0 0;
  border-bottom: 0.5px solid #040e2c;
}
.footer-main h2 {
  font-family: "Oblik";
  color: #ffff;
  font-size: 1rem;
}
p {
  text-align: center;
  color: #54575b;
}
.emailMsg {
  color: #fff;
  font-size: 0.875rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.4rem;
  margin-top: 1rem;
}
.emailMsg.error,
.emailMsg.success {
  display: none;
}
.emailMsg > span {
  margin-left: 0.4rem;
}

#footer-main-desktop a:hover {
  text-decoration: none !important;
}
.pinterest,
.youtube,
.linkedin {
  margin-bottom: 8px !important;
}
.footer-main .social .instagram:hover {
  background: #e1306c;
}
.footer-main .social .linkedin:hover {
  background: #0077b5;
}
.footer-main .social .pinterest:hover {
  background: #bd081c;
}
.footer-main .social .facebook:hover {
  background: #3b5999;
}
.footer-main .social .play:hover {
  background: #cd201f;
}
.footer-main .social .youtube:hover {
  background: #cd201f;
}
.footer-main .social .twitter:hover {
  background: #55acee;
}
.copyright1 {
  color: #fff;
  text-align: center;
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
.acccards img {
  width: 100%;
}

.copyright > .container > .row {
  align-items: center;
}
.sociallinks {
  text-align: center;
  margin-top: 11px;
}

@media screen and (min-width: 768px) {
  .footer-main {
    display: block;
    padding-bottom: 0.6rem;
  }
  .mobile-footer {
    display: none;
  }
  .sociallinks {
    display: none;
  }
  .copyright2:hover {
    text-decoration: unset !important;
  }
}

@media screen and (max-width: 767px) {
  .footer-main {
    display: none;
  }
  .mobile-footer {
    display: block;
    padding-top: 1rem;
    margin-bottom: 1rem;
  }
  .footerPaddings {
    padding: 0px 8px;
  }
  .mobilepaymentcards {
    width: 86%;
    padding-left: 0px;
  }

  .sociallinks {
    display: block;
  }
  .pinterest,
  .youtube,
  .linkedin {
    margin-bottom: 0 !important;
  }
  .acccards {
    justify-content: center;
  }
  .socialicons {
    margin-top: 5px;
  }
  .mobileFooterForm > h2 {
    color: #fff;
    font-size: 1rem;
  }
  .securePaymentMobile {
    border-bottom: 1px solid #040e2c;
    padding-bottom: 0.9rem;
  }
  .col-12.mobileFooterForm {
    padding: 0 14px;
  }
  .copyright {
    padding: 0 6px;
  }
  .mobieBottomFooterCont {
    text-align: right;
  }
  .mobieBottomFooterCont > div {
    display: inline-block;
    text-align: right;
  }
  .content {
    text-align: left;
    line-height: 20px;
    font-size: 14px;
    -webkit-transition: all 0.35s;
    transition: all 0.35s;
    display: none;
    padding-left: 20px;
    margin-top: 10px;
  }
}

@media only screen and (min-width: 992px) {
  .copyright > .container > .row {
    min-height: 100px;
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .copyright > .container > .row {
    align-items: center;
    min-height: 85px;
  }
}

@media only screen and (min-width: 1200px) and (max-width: 1440px) {
  .newsLetterCont {
    width: 77%;
  }
}

@media only screen and (min-width: 1440px) {
  .newsLetterCont {
    width: 82%;
  }
}
</style>
