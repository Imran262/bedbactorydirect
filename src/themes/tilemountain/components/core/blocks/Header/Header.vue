<template>
  <div>
  <div
    class="header"
    :class="
      !isCheckoutPage && $route.name !== 'confirmorder'
        ? 'notcheckoutheader'
        : 'ischeckoutheader'
    "
  >
    <header
      class="w-100 bg-cl-primary brdr-cl-secondary"
      :class="{
        relativeHeader: scrollPosition < 100,
        fixedHeader: scrollPosition > 100,
      }"
    >
      <div class="container px15">
        <div
          class="row between-xs middle-xs header-main"
          v-if="
            (!isCheckoutPage && $route.name !== 'confirmorder') ||
            isThankYouPage
          "
        >
          <div class="col-md-2 col-xs-4 pt5">
            <div class="logo-desktop">
              <logo width="150px" height="68px"/>
            </div>
          </div>
          <div class="search-bar col-md-5 col-xs-12 middle-xs">
            <div class="back-layout"></div>
            <div>
              <DesktopSearch @rightborder="rightborderfunction($event)"/>
            </div>
          </div>
          <div class="col-md-5 col-xs-8 pr-8 basket-loc-box">
            <div class="inline-flex sb-icons">
              <Telephone
                class="p15 icon pointer t-mobile"
                :identifier="'phone-number'"
              />
              <div class="flex inner-icons">
                <wishlist-icon class="icon pointer r-icons location-icon"/>
                <account-icon class="icon pointer r-icons1 account-icon"/>
                <microcart-icon class="icon pointer r-icons"/>
              </div>
            </div>
            <async-sidebar
              ref="asyncSideBar"
              :async-component="Microcart"
              :is-open="isMicrocartOpen"
              class="microcart-sidebar fullCloseCart"
              style="display: none"
              :class="
                productsInCart.length > 0 ? 'productsPresent' : 'productsAbsent'
              "
              @close="$store.commit('ui/setMicrocart')"
            />
          </div>
        </div>
        <div
          class="row between-xs middle-xs px15 py5"
          v-if="
            (isCheckoutPage || $route.name === 'confirmorder') &&
            !isThankYouPage
          "
        >
          <!-- <div class="col-xs-5 col-md-3 middle-xs">
            <div>
              <router-link :to="localizedRoute('/')" class="cl-tertiary links">
                {{ $t("Return to shopping") }}
              </router-link>
            </div>
          </div> -->
          <div class="col-xs-5 col-md-6">
            <!-- <logo width="auto" height="41px" /> -->
            <router-link :to="localizedRoute('/')" class="cl-tertiary links">
              <img
                width="133"
                height="60"
                class="checkout-logo"
                :src="checkoutLogoPath"
                alt="checkout logo"
              />
            </router-link>
          </div>
          <div class="col-xs-7 col-md-6 end-xs">
            <div>
              <Telephone :from-checkout-page="true" :identifier="'phone-number'" />
              <a
                v-if="!currentUser"
                href="#"
                @click.prevent="gotoAccount"
                class="cl-tertiary links"
              ><img src="/assets/checkout-user.png" alt="checkout user"
              /></a>
              <span v-else>{{
                  $t('You are logged in as {firstname}', currentUser)
                }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <nav>
        <MainMenu class="hidden-xs" />
        <hamburger-icon class="sb-mobile-menu pointer hidden-md" />
      </nav> -->
      <nav>
        <header-menu class="navigation"/>
        <hamburger-icon
          v-if="
            (!isCheckoutPage && $route.name !== 'confirmorder') ||
            isThankYouPage
          "
          class="sb-mobile-menu pointer hidden-md"
          :rightborder="rightborder"
        />
      </nav>
    </header>
    <div class="scroll">
      <span @click="animateToTop(e)" class="scrollimg"></span>
    </div>
    <!-- <div class="header-placeholder" /> -->
  </div>
  <CutSampleModelHome />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters, mapActions } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'
import AccountIcon from 'theme/components/core/blocks/Header/AccountIcon'
import CompareIcon from 'theme/components/core/blocks/Header/CompareIcon'
import HamburgerIcon from 'theme/components/core/blocks/Header/HamburgerIcon'
import Logo from 'theme/components/core/Logo'
import MicrocartIcon from 'theme/components/core/blocks/Header/MicrocartIcon'
import SearchIcon from 'theme/components/core/blocks/Header/SearchIcon'
import WishlistIcon from 'theme/components/core/blocks/Header/WishlistIcon'
import DesktopSearch from 'theme/components/core/blocks/Header/DesktopSearch'
import Telephone from 'theme/components/core/blocks/PhoneNumber/Telephone'
import MainMenu from 'theme/components/core/blocks/Header/MainMenu'
import AsyncSidebar from 'theme/components/theme/blocks/AsyncSidebar/AsyncSidebar.vue'
import Overlay from 'theme/components/core/Overlay.vue'
import HeaderMenu from 'theme/components/core/blocks/HeaderMenu/HeaderMegaMenu'
import CutSampleModelHome from 'theme/components/core/blocks/Footer/CutSampleModelHome.vue'
import config from 'config'
import { themeConfigurations } from '@vue-storefront/core/helpers';

const Microcart = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-microcart" */ 'theme/components/core/blocks/Microcart/Microcart.vue'
    )
export default {
  name: 'Header',
  components: {
    CutSampleModelHome,
    AccountIcon,
    CompareIcon,
    HamburgerIcon,
    Logo,
    MicrocartIcon,
    SearchIcon,
    DesktopSearch,
    Telephone,
    MainMenu,
    WishlistIcon,
    AsyncSidebar,
    Overlay,
    HeaderMenu
  },
  mixins: [CurrentPage],
  data () {
    return {
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54,
      Microcart,
      rightborder: false,
      scrollPosition: null
    }
  },
  computed: {
    ...mapState({
      isOpenLogin: (state) => state.ui.signUp,
      currentUser: (state) => state.user.current,
      isMicrocartOpen: (state) => state.ui.microcart
    }),
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
    isThankYouPage () {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false
    },
    checkoutLogoPath () {
      return config?.themeConfigurations?.checkoutLogo || '/assets/checkout-logo.svg';
    }
  },
  beforeMount () {
    history.scrollRestoration = 'auto'
    window.addEventListener(
      'scroll',
      () => {
        this.isScrolling = true
      },
      { passive: true }
    )
    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled()
        this.isScrolling = false
      }
    }, 250)
    this.$bus.$on('dontShowValue', () => {
      this.cutSampleshow = true
    })
  },
  mounted () {
    if (config && config.bloomreach && typeof BrTrk === 'undefined') {
      var brtrk = document.createElement('script')
      brtrk.type = 'text/javascript'
      brtrk.async = true
      brtrk.src = `//cdn.brcdn.com/v1/br-trk-${config.bloomreach.accountID}.js`
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(brtrk, s)
    }
    let iubendaInnerHtmlVar = '';
    if (config && config.themeConfigurations && config.themeConfigurations && config.themeConfigurations.iubendaParams) {
      if (config.themeConfigurations.iubendaParams.siteName === 'Flooring Mountain') {
        iubendaInnerHtmlVar = `var _iub = _iub || []; _iub.csConfiguration = {"consentOnContinuedBrowsing":false,"whitelabel":false,"lang":"en","siteId":${config.themeConfigurations.iubendaParams.siteId},"cookiePolicyId":${config.themeConfigurations.iubendaParams.cookiePolicyId}, "banner":{ "acceptButtonDisplay":true,"customizeButtonDisplay":true,"position":"float-bottom-left","acceptButtonColor":"#ffffff","acceptButtonCaptionColor":"${config.themeConfigurations.iubendaParams.acceptButtonCaptionColor}","customizeButtonColor":"${config.themeConfigurations.iubendaParams.customizeButtonColor}","customizeButtonCaptionColor":"white","rejectButtonColor":"${config.themeConfigurations.iubendaParams.rejectButtonColor}","rejectButtonCaptionColor":"${config.themeConfigurations.iubendaParams.rejectButtonCaptionColor}","textColor":"white","backgroundColor":"#29275b","content":"<div id='iubenda-cs-paragraph'>To enhance your shopping experience, we use cookies or similar technologies as specified in our <a href='privacy-policy/12918755/cookie-policy?an=no&s_ck=false&newmarkup=yes' class='iubenda-cs-cookie-policy-lnk'>cookie policy</a>.<br /></div>" }};`
      } else {
        iubendaInnerHtmlVar = `var _iub = _iub || []; _iub.csConfiguration = {"consentOnContinuedBrowsing":false,"perPurposeConsent":true,"whitelabel":false,"lang":"en","siteId":${config.themeConfigurations.iubendaParams.siteId},"cookiePolicyId":${config.themeConfigurations.iubendaParams.cookiePolicyId}, "banner":{"acceptButtonDisplay":true,"customizeButtonDisplay":true,"acceptButtonColor":"#ffffff","acceptButtonCaptionColor":"${config.themeConfigurations.iubendaParams.acceptButtonCaptionColor}","customizeButtonColor":"${config.themeConfigurations.iubendaParams.customizeButtonColor}","customizeButtonCaptionColor":"white","position":"float-bottom-left","textColor":"white","backgroundColor":"#29275b","content":"<div id='iubenda-cs-paragraph'>To enhance your shopping experience, we use cookies or similar technologies as specified in our <a href='/privacy-policy/12918755/cookie-policy?an=no&s_ck=false&newmarkup=yes' class='iubenda-cs-cookie-policy-lnk'>cookie policy</a>.<br /></div>" }}`
      }
    } else {
      iubendaInnerHtmlVar = ''
    }
    const iubPlugin = document.createElement('script');
    iubPlugin.innerHTML = iubendaInnerHtmlVar;
    document.head.appendChild(iubPlugin);
    const iubPluginScript = document.createElement('script')
    iubPluginScript.setAttribute('src', '//cdn.iubenda.com/cs/iubenda_cs.js')
    document.head.appendChild(iubPluginScript)
    window.addEventListener('scroll', this.updateScroll)
    document.addEventListener('scroll', () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > 100) {
        document.querySelector('.scroll').style.display = 'block';
      } else {
        document.querySelector('.scroll').style.display = 'none';
      }
    })
  },
  destroy () {
    window.removeEventListener('scroll', this.updateScroll)
  },
  methods: {
    animateToTop (e) {
      let scrollToTop = window.setInterval(function () {
          let pos = window.pageYOffset
          if (pos > 0 && pageYOffset >= 10) {
            window.scrollTo(0, pos - 110)
            document.querySelector('.scrollimg').style.visibility = 'visible'
          } else {
            window.clearInterval(scrollToTop)
            document.querySelector('.scrollimg').style.visibility = 'visible'
          }
        }
      )
    },
    rightborderfunction (border) {
      this.rightborder = border
    },
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    updateScroll () {
      this.scrollPosition = window.scrollY
    },
    hasScrolled () {
      this.scrollTop = window.scrollY
      this.navVisible = !(this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight)
      this.lastScrollTop = this.scrollTop
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
// $color-icon-hover: color(secondary, $colors-background);
.header {
  height: 10.4rem;
}

.relativeHeader .navigation {
  position: relative;
  top: unset;
}

.fixedHeader .navigation {
  position: fixed;
  top: -2px;
  width: 100%;
  z-index: 1;
}

.header-main {
  margin-left: 8px;
}

.inner-icons {
  padding-left: 55px;
  @media (max-width: 1200px) {
    padding-left: 92px;
  }
  @media (max-width: 1199px) and(min-width: 992px) {
    padding-left: 27px;
  }
  @media (max-width: 991px) {
    padding-left: 0px;
  }
}

header {
  z-index: 3;
  transition: top 0.2s ease-in-out;

  &.is-visible {
  }

  .wishlist {
    padding: 10px;

    .wishlist-img {
      span {
        display: block;
        text-align: center;
      }
    }

    .wishlist-text {
      span {
        font-size: 0.671875rem;
        font-family: 'Open Sans';
        color: #808898;
      }
    }
  }

  .sb-header-right {
    padding: 0;

    button {
      opacity: 1;
    }
  }

  .logo-desktop {
    @media (max-width: 767px) {
      padding-top: 6px;
      padding-left: 12.9%;
    }
    @media (min-width: 320px) and (max-width: 480px) {
      padding-top: 0;
    }
  }
}

.r-icons {
  padding: 12px 34px 12px 12px;
  // padding: 0px;
}

.r-icons1 {
  padding: 12px 36px 12px 12px;
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    padding: 12px 7px 12px 4px;
  }
  @media screen and (min-width: 1025px) and (max-width: 1269px) {
    padding: 12px 19px 12px 12px;
  }
  // padding: 0px;
}

.t-mobile {
  padding-left: 8px;
}

// .icon {
//   opacity: 0.6;
//   &:hover,
//   &:focus {
//     background-color: $color-icon-hover;
//     opacity: 1;
//   }
// }
.right-icons {
  //for edge
  float: right;
}

.header-placeholder {
  height: 54px;
}

.links {
  text-decoration: underline;
}

.basket-loc-box {
  position: relative;
}

.ischeckoutheader {
  height: auto !important;

  .bg-cl-primary {
    background: #2a275c !important;
    padding: 10px 0px 15px 0px;
    z-index: 102;
  }

  .phone-no {
    margin-right: 20px;

    img {
      position: relative;
      top: 5px;
    }

    span {
      font-family: Arial, Helvetica, sans-serif;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
    }
  }

  span {
    color: #ffffff;
  }
}

@media (max-width: 480px) {
  .ischeckoutheader .checkout-logo {
    width: 100px;
  }
  .ischeckoutheader .phone-no span {
    font-size: 3.33vw;
  }
  .ischeckoutheader .phone-no {
    margin-right: 10px;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .ischeckoutheader .phone-no {
    margin-right: 20px;
  }
  .ischeckoutheader .checkout-logo {
    width: 133px;
  }
}

@media (min-width: 600px) and (max-width: 767px) {
  .header {
    height: 133px !important;
  }
}

@media (max-width: 767px) {
  .header {
    height: 8.4rem;
    position: relative;
    z-index: 9;
  }
  .row.middle-xs {
    margin: 0 -15px;

    &.py5 {
      margin: 0;
    }
  }
  .col-xs-2:first-of-type {
    padding-left: 0;
  }
  .col-xs-2:last-of-type {
    padding-right: 0;
  }
  a,
  span {
    font-size: 12px;
    // display: block;
  }
  .r-icons,
  .r-icons1 {
    padding: 0px;
  }
  .sb-icons {
    display: flex;
    justify-content: flex-end;
    padding-right: 7.81%;
  }
  .search-bar {
    order: 2;
    padding-left: 3px;
    padding-right: 3px;
    padding-top: 3px;
  }
  .mobile-icons {
    padding-right: 20px;
  }
  .sb-mobile-menu {
    position: relative;
    z-index: 10;
  }
  header {
    height: 7.625rem;
  }
  .container {
    padding-right: 0px;
    padding-left: 0px;
  }
  .t-mobile {
    // padding: 5px;
    position: relative;
    padding: 0px;
    margin: 0px;
    width: 13.7vw;
  }
  .ischeckoutheader .bg-cl-primary {
    background: #2a275c !important;
    padding: 10px 0px 15px 0px;
    height: auto;
  }
  .ischeckoutheader .phone-no span {
  }
  .ischeckoutheader .phone-no img {
    position: relative;
    top: 4px;
  }
  .basket-loc-box {
    height: 100%;
    max-height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 6px;
  }
  .location-icon {
    width: 18.7vw;
  }
  .account-icon {
    width: 17.5vw;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .notcheckoutheader {
    height: 6.4rem;
  }
  .notcheckoutheader header {
    height: 4.625rem;
  }
  .search-bar {
    padding-top: 0;
  }
}

@media (max-width: 1199px) and (min-width: 992px) {
  .header {
    height: 10.4rem;
  }
}

//
@media (max-width: 992px) and (min-width: 768px) {
  .header {
    height: 9.1rem;
  }
  .r-icons {
    padding: 10px;
  }
}

@media (max-width: 992px) {
  .fullCloseCart {
    display: none !important;
  }
}

.scrollimg {
  font-size: 32px;
  font-weight: normal;
  color: #888888;
  margin: 9px 9px;
  outline: none;
  user-select: none;
}

.scroll {
  width: 50px;
  height: 50px;
  -webkit-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
  z-index: 2;
  position: fixed;
  bottom: 97px;
  right: 68px;
  background: #fff;
  border-radius: 25px;
  cursor: pointer;
  display: none;
}

span.scrollimg:after {
  background-image: none;
  border: solid #333;
  transform: rotate(45deg);
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  text-align: center;
  margin: 5px auto;
  border-width: 2px 0px 0px 2px;
  margin-top: -16px;
}

@media (max-width: 992px) {
  .scroll {
    display: none !important;
  }
}
</style>
<style>
.zsiq_theme1.zsiq_floatmain {
  bottom: 160px !important;
}

@media screen and (min-width: 768px) {

  .back-layout {
    position: fixed;
    z-index: 3;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #000;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0.5;
    display: none;
  }

}
</style>