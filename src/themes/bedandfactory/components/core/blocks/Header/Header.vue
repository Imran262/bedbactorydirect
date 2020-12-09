<template>
  <div class="header">
    <header class="fixed w-100" :class="{ 'is-visible': navVisible }">
      <!-- Google Tag Manager -->
      <script>
        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != "dataLayer" ? "&l=" + l : "";
          j.async = true;
          j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", "GTM-TCDSZMQ");
      </script>
      <!-- End Google Tag Manager -->
      <div class="col-md-12 top-bar-main">
        <Topbar class="pointer" />
      </div>
      <div class="container px15">
        <div
          class="row between-xs middle-xs"
          v-if="!isCheckoutPage || isThankYouPage"
        >
          <div class="col-md-2 col-xs-4 pt5">
            <div>
              <logo width="120px" height="76px" />
            </div>
          </div>
          <div class="search-bar col-md-6 col-xs-12 middle-xs">
            <div>
              <SearchPanelDesktop />
            </div>
          </div>
          <!-- <div class="col-xs-2 visible-xs">
            <search-icon class="p15 icon pointer" />
          </div>-->

          <div class="col-xs-2 visible-xs">
            <!-- <wishlist-icon class="pointer" /> -->
          </div>
          <div class="col-xs-2 visible-xs">
            <Phonenumber class="pointer" />
          </div>
          <!-- <div class="col-xs-2 visible-xs">
            <Telephone class="pointer" />
          </div>-->

          <div class="col-md-4 col-xs-2 pr-8">
            <div class="inline-flex sb-header-right">
              <!-- <search-icon class="p15 icon hidden-xs pointer" /> -->
              <!-- <wishlist-icon class="p15 icon hidden-xs pointer" /> -->
              <Phonenumber class="p10 icon hidden-xs pointer" />
              <!-- <Telephone class="p10 icon hidden-xs pointer" /> -->
              <!-- <compare-icon class="p15 hidden-xs pointer" /> -->
              <account-icon class="p10 icon hidden-xs pointer" />
              <microcart-icon class="pointer" />
            </div>
          </div>
        </div>
        <div
          class="row between-xs middle-xs px15 py5"
          v-if="isCheckoutPage && !isThankYouPage"
        >
          <!-- <div class="col-xs-5 col-md-3 middle-xs">
            <div>
              <router-link
                :to="localizedRoute('/')"
                class="cl-tertiary links"
              >
                {{ $t('Return to shopping') }}
              </router-link>
            </div>
          </div>-->
          <div class="col-xs-2 col-md-12 center-xs">
            <logo width="auto" height="75px" />
          </div>
          <!-- <div class="col-xs-5 col-md-3 end-xs">
            <div>
              <a
                v-if="!currentUser"
                href="#"
                @click.prevent="gotoAccount"
                class="cl-tertiary links"
              >{{ $t('Login to your account') }}</a>
              <span v-else>
                {{
                  $t('You are logged in as {firstname}', currentUser)
                }}
              </span>
            </div>
          </div>-->
        </div>
      </div>
      <nav>
        <header-menu />
        <hamburger-icon
          v-if="!isCheckoutPage || isThankYouPage"
          class="sb-mobile-menu pointer hidden-md"
        />
      </nav>
    </header>

    <div class="header-placeholder" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CurrentPage from 'theme/mixins/currentPage';
import AccountIcon from 'theme/components/core/blocks/Header/AccountIcon';
import CompareIcon from 'theme/components/core/blocks/Header/CompareIcon';
import HamburgerIcon from 'theme/components/core/blocks/Header/HamburgerIcon';
import Logo from 'theme/components/core/Logo';
import MicrocartIcon from 'theme/components/core/blocks/Header/MicrocartIcon';
import SearchIcon from 'theme/components/core/blocks/Header/SearchIcon';
import WishlistIcon from 'theme/components/core/blocks/Header/WishlistIcon';
import SearchPanelDesktop from 'theme/components/core/blocks/Header/SearchPanelDesktop';
import Phonenumber from 'theme/components/core/blocks/Header/Phonenumber';
import HeaderMenu from 'theme/components/core/blocks/HeaderMenu/HeaderMegaMenu';
import Topbar from 'theme/components/core/blocks/Header/Topbar';
export default {
  name: 'Header',
  components: {
    AccountIcon,
    CompareIcon,
    HamburgerIcon,
    Logo,
    MicrocartIcon,
    SearchIcon,
    SearchPanelDesktop,
    WishlistIcon,
    Phonenumber,
    HeaderMenu,
    Topbar
  },
  mixins: [CurrentPage],
  data() {
    return {
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54
    };
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
    window.addEventListener(
      'scroll',
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
  },
  methods: {
    gotoAccount() {
      this.$bus.$emit('modal-toggle', 'modal-signup');
    },
    hasScrolled() {
      this.scrollTop = window.scrollY;
      if (
        this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight
      ) {
        this.navVisible = false;
      } else {
        this.navVisible = true;
      }
      this.lastScrollTop = this.scrollTop;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$color-icon-hover: color(secondary, $colors-background);
.header {
  height: 8.5rem;
}
@media (max-width: 767px) {
  .header {
    height: 8.2rem;
  }
}
header {
  // height: 95px;
  // top: -55px;
  z-index: 3;
  transition: top 0.2s ease-in-out;
  background-color: #fff;

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
        font-family: "Poppins", sans-serif;
        color: #54575b;
      }
    }
  }
  .sb-header-right {
    padding: 0;
    button {
      opacity: 1;
    }
    .compare-icon {
      margin-top: 20px;
    }
  }
}
.icon {
  &:hover,
  &:focus {
    background-color: $color-icon-hover;
    opacity: 1;
  }
}
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
.top-bar-main {
  padding: 0;
}
@media (max-width: 767px) {
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
  }
  .search-bar {
    order: 2;
    padding-left: 3px;
    padding-right: 3px;
  }
  .sb-mobile-menu {
    position: absolute !important;
    bottom: 0;
    background-color: #e5e7ea;
    padding: 10px 15px 10px 15px;
  }
  header {
    height: auto;
  }
  .container {
    width: 100% !important;
    max-width: 100%;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .header {
    height: 11.9rem;
  }
}
@media (min-width: 991px) and (max-width: 1023px) {
  .sb-header-right {
    button {
      padding: 15px 5px;
    }
    div {
      padding: 15px 2px;
    }
  }
}
@media (min-width: 1024px) and (max-width: 1202px) {
  .sb-header-right {
    button {
      padding: 15px 0px;
    }
    div {
      padding: 15px 2px;
    }
  }
}
</style>
