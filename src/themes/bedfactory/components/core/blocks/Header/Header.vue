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
                <logo width="150px" height="68px" />
              </div>
            </div>
            <div class="search-bar col-md-5 col-xs-12 middle-xs">
              <div class="back-layout"></div>
              <div>
                <DesktopSearch @rightborder="rightborderfunction($event)" />
              </div>
            </div>
            <div class="col-md-5 col-xs-8 pr-8 basket-loc-box">
              <div class="inline-flex sb-icons">
                <Telephone
                  class="icon pointer t-mobile"
                  :callText="phone"
                  :callNumber="call"
                />
                <div class="flex inner-icons">
                  <wishlist-icon class="icon pointer r-icons location-icon" />
                  <account-icon class="icon pointer r-icons1 account-icon" />

                  <microcart-icon class="icon pointer r-icons3" />
                </div>
              </div>
              <async-sidebar
                ref="asyncSideBar"
                :async-component="Microcart"
                :is-open="isMicrocartOpen"
                class="microcart-sidebar fullCloseCart"
                style="display: none"
                :class="
                  productsInCart.length > 0
                    ? 'productsPresent'
                    : 'productsAbsent'
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
                <Telephone
                  :from-checkout-page="true"
                  :callText="phone"
                  :callNumber="call"
                />
                <a
                  v-if="!currentUser"
                  href="#"
                  @click.prevent="gotoAccount"
                  class="cl-tertiary links"
                  ><img
                    src="/assets/icons/user.svg"
                    alt="checkout user"
                    class="checkout-user"
                /></a>
                <span v-else class="log-in-detail">
                  You are logged in as {{ currentUser.firstname }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- <nav>
        <MainMenu class="hidden-xs" />
        <hamburger-icon class="sb-mobile-menu pointer hidden-md" />
      </nav> -->
        <nav>
          <header-menu class="navigation" />
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
      <div class="scroll" @click="animateToTop()">
        <span class="scrollimage"
          ><img src="/assets/icons/arrowupicon.png"
        /></span>
      </div>
      <!-- <div class="header-placeholder" /> -->
    </div>
    <!-- <CutSampleModelHome /> -->
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapGetters, mapActions } from "vuex";
import CurrentPage from "theme/mixins/currentPage";
import AccountIcon from "src/themes/bedfactory/components/core/blocks/Header/AccountIcon";
import CompareIcon from "theme/components/core/blocks/Header/CompareIcon";
import HamburgerIcon from "theme/components/core/blocks/Header/HamburgerIcon";
import Logo from "theme/components/core/Logo";
import MicrocartIcon from "src/themes/bedfactory/components/core/blocks/Header/MicrocartIcon";
import SearchIcon from "theme/components/core/blocks/Header/SearchIcon";
import WishlistIcon from "theme/components/core/blocks/Header/WishlistIcon";
import DesktopSearch from "theme/components/core/blocks/Header/DesktopSearch";
import Telephone from "theme/components/core/blocks/PhoneNumber/Telephone";
import Phonenumber from "src/themes/bedfactory/components/core/blocks/PhoneNumber/Phonenumber";
import MainMenu from "theme/components/core/blocks/Header/MainMenu";
import AsyncSidebar from "theme/components/theme/blocks/AsyncSidebar/AsyncSidebar.vue";
import Overlay from "theme/components/core/Overlay.vue";
import HeaderMenu from "src/themes/bedfactory/components/core/blocks/HeaderMenu/HeaderMegaMenu";
import CutSampleModelHome from "theme/components/core/blocks/Footer/CutSampleModelHome.vue";
import config from "config";
import { themeConfigurations } from "@vue-storefront/core/helpers";
const Microcart = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-microcart" */ "theme/components/core/blocks/Microcart/Microcart.vue"
  );
export default {
  name: "Header",
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
    Phonenumber,
    MainMenu,
    WishlistIcon,
    AsyncSidebar,
    Overlay,
    HeaderMenu,
  },
  mixins: [CurrentPage],
  data() {
    return {
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54,
      Microcart,
      rightborder: false,
      scrollPosition: null,
      phone: config.phoneNumber.toShow,
      call: config.phoneNumber.toCall,
    };
  },
  async beforeRouteEnter(to, from, next) {
    // console.log("789456  header", this.productsInCart.length);
  },
  watch: {
    "$route.name": function (to, from) {
      if (from === "checkout" && to !== "cart") {
        document.getElementById("app").style.overflowX = "hidden";
        document.getElementById("viewport").style.overflow = "hidden";
      }
      if (from === "cart" && to !== "checkout") {
        document.getElementById("app").style.overflowX = "hidden";
        document.getElementById("viewport").style.overflow = "hidden";
      }
    },
    $route(to, from) {
      console.log("789456 In Header in cart", this.$route, to, from);
      if (to.name === "cart") {
        this.$store.dispatch("cart/sync", {
          forceClientState: false,
          forceSync: true,
        });
        this.$store.dispatch("cart/syncTotals", { forceServerSync: true });
        // console.log("789456 Header ", this.productsInCart.length);
        if (this.productsInCart.length === 0) {
          // console.log("789456 Cart is Empty ");
          this.$router.push(this.localizedRoute("/"));
        }
      }
    },
  },
  computed: {
    ...mapState({
      isOpenLogin: (state) => state.ui.signUp,
      currentUser: (state) => state.user.current,
      isMicrocartOpen: (state) => state.ui.microcart,
    }),
    ...mapGetters({
      productsInCart: "cart/getCartItems",
      totals: "cart/getTotals",
    }),
    isThankYouPage() {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false;
    },
    checkoutLogoPath() {
      return "/assets/logo.svg";
    },
  },
  beforeMount() {
    history.scrollRestoration = "auto";
    // console.log("789456 In Header ", this.$route);
    if (this.$route.name === "cart") {
      // console.log("789456 Header ", this.productsInCart.length);
      if (this.productsInCart.length === 0) {
        // console.log("789456 Cart is Empty ");
        this.$router.push(this.localizedRoute("/"));
      }
    }
    window.addEventListener(
      "scroll",
      () => {
        this.isScrolling = true;
      },
      { passive: true }
    );
    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled();
        this.isScrolling = false;
      }
    }, 250);
    this.$bus.$on("dontShowValue", () => {
      this.cutSampleshow = true;
    });
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
    document.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        document.querySelector(".scroll").style.display = "block";
      } else {
        document.querySelector(".scroll").style.display = "none";
      }
    });
  },
  destroy() {
    window.removeEventListener("scroll", this.updateScroll);
  },
  methods: {
    animateToTop(e) {
      let scrollToTop = window.setInterval(function () {
        let pos = window.pageYOffset;
        if (pos > 0 && pageYOffset >= 10) {
          window.scrollTo(0, pos - 110);
          document.querySelector(".scrollimage").style.visibility = "visible";
        } else {
          window.clearInterval(scrollToTop);
          document.querySelector(".scrollimage").style.visibility = "visible";
        }
      });
    },
    rightborderfunction(border) {
      this.rightborder = border;
    },
    gotoAccount() {
      // document.body.style.overflow = "hidden";
      console.log("In Go to Account Function");
      this.$bus.$emit("modal-toggle", "modal-signup");
    },
    updateScroll() {
      this.scrollPosition = window.scrollY;
    },
    hasScrolled() {
      this.scrollTop = window.scrollY;
      this.navVisible = !(
        this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight
      );
      this.lastScrollTop = this.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
// $color-icon-hover: color(secondary, $colors-background);
span.log-in-detail {
  color: #071a44 !important;
  font-weight: bold;
}
.inline-flex {
  align-items: center;
  align-items: center;
  justify-content: space-between;
  display: flex;
}
.r-icons3 {
  display: flex;
  flex-direction: column;
  margin-top: 0.6rem;
      margin-left: 0.8rem;
  // margin-left: 0.7rem;
  // padding: 12px 0px 12px 12px;
}
.header-icon {
  margin-left: 50px;
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
  //  align-items: baseline !important;
}
@media (max-width: 1199px) and(min-width: 992px) {
  .inline-flex {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .r-icons3{
          margin-top: 0;
          margin-left: 0;
    }
}
//  for tablets
@media (max-width: 991px) and(min-width: 768px) {
  .inline-flex {
    justify-content: flex-end;
    align-items: center;
    display: flex;
  }
  .r-icons3 {
    margin-top: 0.4rem;
    margin-right: 0;
    margin-left: 0;
  }
}
.inner-icons {
  // padding-left: 60px;
  align-items: center;
  @media (max-width: 1199px) and(min-width: 992px) {
    // padding-left: 8px;
  }
  @media (max-width: 767px) {
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
        font-family: "Open Sans";
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
@media (min-width: 1200px) {
  .r-icons {
    padding: 0px 0px 12px 12px;
    // padding: 0px;
    // width: 4.7vw !important;
        margin: 0 0.8rem;
  }
  .account-icon {
  padding: 0px 0px 12px 0px;
  // width: 4vw;
      margin: 0 0.8rem;
}
}
@media (min-width: 992px) and (max-width: 1199px) {
  .r-icons {
    padding: 0px 0px 12px 12px;
    // padding: 0px;
  }
  .r-icons1 {
    padding: 0px 0px 6px 15px !important;
  }
  .account-icon{
    margin: 0;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .r-icons {
    padding: 0px 7px 12px 4px;
    // padding: 0px;
  }
}
// .account-icon {
//   padding: 0px 0px 12px 12px;
//   // width: 4vw;
//       margin: 0 0.8rem;
// }
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
    /*background: #2a275c !important;*/
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
// @media (min-width: 600px) and (max-width: 767px) {
//   .header {
//     height: 129px !important;
//   }
// }
@media  (max-width: 767px) {
  .header {
    // height: 8rem;
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
  // header {
  //   height: 7.625rem;
  // }
  .container {
    padding-right: 0px;
    padding-left: 0px;
  }
  .t-mobile {
    // padding: 5px;
    // position: relative;
    // padding: 0px;
    // margin: 0px;
    // width: 12.7vw;
  }
  .ischeckoutheader .bg-cl-primary {
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
    justify-content: center;
    align-items: center;
    padding-top: 6px;
  }
  .r-icons {
    width: 16.7vw;
  }
  .account-icon {
    width: 13.5vw;
  }
}
@media  (max-width: 319px) {
.header{
      // height: 6.3rem;
}
header{
     height: 6.4rem;
}

}
@media (min-width: 320px) and (max-width: 480px) {
  .notcheckoutheader {
    // height: 6.4rem;
  }
  // .notcheckoutheader header {
  //   height: 4.625rem;
  // }
  .search-bar {
    padding-top: 0;
  }
  .account-icon{
    margin-right: 6px;
        margin-left: 12px;
  }
  .basket-loc-box{
    justify-content: flex-end;
  }
}
// for movile view less than 767px
@media (max-width: 767px) {
  .r-icons3 {
    margin-top: 19px;
    margin-left: 0;
  }
}
@media (max-width: 480px){
    .r-icons3 {
    margin-top: -4px;
    margin-left: 0;
  }

}

@media (max-width: 992px) and (min-width: 768px) {
  .inner-icons {
    padding-left: 2px;
  }
  .r-icons1 {
    padding: 10px;
  }
  .account-icon {
    width: 5vw;
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
  content: "";
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
@media (max-width: 1199px) and (min-width: 993px) {
  .header-icon {
    margin-left: 30px;
  }
}
.scrollimage {
  padding-left: 13px;
  img {
    color: black;
    width: 23px;
    height: 23px;
    transform: rotate(268deg);
    margin-top: 12px;
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
a.cl-tertiary.links img {
  position: relative;
  /* top: 5px; */
}
@media (max-width: 336px) {
  .phone-no {
    margin-right: 0px !important;
  }
}
img.checkout-user {
  width: 22px;
}
@media (min-width: 481px) and (max-width: 767px) {
 .t-mobile{
   position: relative;
    padding: 0px;
    margin: 0px;
    width: 12.7vw;
  }
}
@media (min-width: 280px) and (max-width: 480px) {
   .t-mobile{
   position: relative;
    padding: 0px !important;
    margin: 0px;
    top: -5px;
    width: 11.7vw;
    height: 90px;
  }
  .sb-icons {
    display: flex;
    justify-content:flex-start;
    padding-right: 7.81%;
  }
   /* @media (min-width: 992px) and (max-width: 1199px){
    
  } */
  
}


</style>