<template>
  <div class="default-layout">
    <overlay v-if="overlayActive"/>
    <loader/>
    <div id="viewport" class="w-100 relative">
      <main-header/>
      <!-- <async-sidebar
        :async-component="SearchPanel"
        :is-open="isSearchPanelOpen"
        @close="$store.commit('ui/setSearchpanel')"
      /> -->
      <async-sidebarMobile
        :async-component="SidebarMenu"
        :is-open="isSidebarOpen"
        @close="$store.commit('ui/setSidebar')"
        direction="left"
      />
      <slot/>
        <main-footer/>
      <lazy-hydrate when-visible>
        <notification />
      </lazy-hydrate>
      <lazy-hydrate when-idle>
        <sign-up />
      </lazy-hydrate>
      <cookie-notification v-if="showCookieNotification"/>
      <lazy-hydrate when-idle>
        <offline-badge />
      </lazy-hydrate>
      <order-confirmation
        :orders-data="ordersData"
        v-if="loadOrderConfirmation"
      />
    </div>
    <vue-progress-bar/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AsyncSidebar from 'theme/components/theme/blocks/AsyncSidebar/AsyncSidebar.vue';
import AsyncSidebarMobile from 'theme/components/theme/blocks/AsyncSidebar/AsyncSidebarMobile.vue';
import MainHeader from 'theme/components/core/blocks/Header/Header.vue';
import MainFooter from 'theme/components/core/blocks/Footer/FooterTM.vue';
import Overlay from 'theme/components/core/Overlay.vue';
import Loader from 'theme/components/core/Loader.vue';
import Notification from 'theme/components/core/Notification.vue';
import SignUp from 'theme/components/core/blocks/Auth/SignUp.vue';
import CookieNotification from 'theme/components/core/CookieNotification.vue';
import OfflineBadge from 'theme/components/core/OfflineBadge.vue';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import LazyHydrate from 'vue-lazy-hydration'

const SidebarMenu = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-menu" */ 'theme/components/core/blocks/SidebarMenu/SidebarMenu.vue');
const SearchPanel = () =>
  import(
    /* webpackChunkName: "vsf-search-panel" */ 'theme/components/core/blocks/SearchPanel/SearchPanel.vue');
const OrderConfirmation = () =>
  import(
    /* webpackChunkName: "vsf-order-confirmation" */ 'theme/components/core/blocks/Checkout/OrderConfirmation.vue');

export default {
  name: 'Default',
  data () {
    return {
      loadOrderConfirmation: false,
      ordersData: [],
      SearchPanel,
      SidebarMenu,
      showCookieNotification: !!config.cookieNotification
    };
  },
  computed: {
    ...mapState({
      overlayActive: (state) => state.ui.overlay,
      isSearchPanelOpen: (state) => state.ui.searchpanel,
      isSidebarOpen: (state) => state.ui.sidebar
    })
  },
  methods: {
    onOrderConfirmation (payload) {
      this.loadOrderConfirmation = true;
      this.ordersData = payload;
      this.$bus.$emit('modal-show', 'modal-order-confirmation');
    },
    fetchMenuData () {
      return this.$store.dispatch('category-next/fetchMenuCategories', {
        level:
          config.entities.category.categoriesDynamicPrefetch &&
          config.entities.category.categoriesDynamicPrefetchLevel >= 0
            ? config.entities.category.categoriesDynamicPrefetchLevel
            : null,
        skipCache: isServer
      });
    }
  },
  serverPrefetch () {
    return this.fetchMenuData();
  },
  beforeMount () {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      this.$Progress.increase(40);
      next();
    });
    this.$router.afterEach((to, from) => {
      this.$Progress.finish();
    });
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation);

    // add script to page.
    // let gTagScript = document.createElement('script')
    // gTagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-MQ0RMQSH9J')
    // gTagScript.async = true;
    // document.head.appendChild(gTagScript)

    // const gtagScriptData = document.createElement('script');
    // gtagScriptData.setAttribute('data-uniq', 'gTagScriptData');
    // gtagScriptData.innerHTML = 'window.dataLayer = window.dataLayer || [];\n' +
    //   '  function gtag(){dataLayer.push(arguments);}\n' +
    //   '  gtag(\'js\', new Date());\n' +
    //   '\n' +
    //   '  gtag(\'config\', \'G-MQ0RMQSH9J\');';
    // document.head.appendChild(gtagScriptData);
    let fontawsmLib = document.createElement('link')
    fontawsmLib.type = 'text/css';
    fontawsmLib.rel = 'stylesheet';
    fontawsmLib.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')
    document.body.appendChild(fontawsmLib)
    let googleFont = document.createElement('link')
    googleFont.type = 'text/css';
    googleFont.rel = 'stylesheet';
    googleFont.setAttribute('href', 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700|Roboto:400,700|Material+Icons&display=swap')
    document.body.appendChild(googleFont)
  },
  beforeDestroy () {
    this.$bus.$off('offline-order-confirmation', this.onOrderConfirmation);
  },
  metaInfo: Head,
  components: {
    MainHeader,
    MainFooter,
    SidebarMenu, // eslint-disable-line vue/no-unused-components
    Overlay,
    Loader,
    Notification,
    SignUp,
    CookieNotification,
    OfflineBadge,
    OrderConfirmation,
    AsyncSidebar,
    LazyHydrate,
    AsyncSidebarMobile
  }
};
</script>

<style lang="scss" src="theme/css/main.scss"></style>
