<template>
  <div id="app">
    <!-- Google Tag Manager (noscript) -->
    <noscript
      ><iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-TCDSZMQ"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe
    ></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const DefaultLayout = () =>
  import(/* webpackChunkName: "vsf-layout-default" */ './layouts/Default');
const EmptyLayout = () =>
  import(/* webpackChunkName: "vsf-layout-empty" */ './layouts/Empty');
const MinimalLayout = () =>
  import(/* webpackChunkName: "vsf-layout-minimal" */ './layouts/Minimal');

export default {
  data() {
    return {
      ordersData: []
    };
  },
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay
    }),
    layout() {
      return `${this.$route.meta.layout || 'default'}-layout`;
    }
  },
  components: {
    DefaultLayout,
    EmptyLayout,
    MinimalLayout
  }
};
</script>
