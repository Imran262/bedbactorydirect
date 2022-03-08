<template>
  <div class="minimal-layout">
    <div id="viewport" class="w-100 relative">
      <!-- <minimal-header /> -->
      <async-sidebarMobile
        :async-component="SidebarMenu"
        :is-open="isSidebarOpen"
        @close="$store.commit('ui/setSidebar')"
        direction="left"
      />
      <slot />
      <Overlay />
      <!-- <minimal-footer /> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MinimalHeader from 'theme/components/core/blocks/Header/MinimalHeader.vue'
import MinimalFooter from 'theme/components/core/blocks/Footer/MinimalFooter.vue'
import AsyncSidebarMobile from 'theme/components/theme/blocks/AsyncSidebar/AsyncSidebarMobile.vue'
import Overlay from 'theme/components/core/Overlay.vue'

import Head from 'theme/head'
const SidebarMenu = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-menu" */ 'theme/components/core/blocks/SidebarMenu/SidebarMenu.vue')
export default {
  data () {
    return {
      ordersData: [],
      SidebarMenu
    }
  },
  computed: {
    ...mapState({
      overlayActive: state => state.ui.overlay,
      isSidebarOpen: (state) => state.ui.sidebar
    })
  },
  methods: {
  },
  beforeMount () {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start()
      this.$Progress.increase(40)
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation)

    // add script to page.
    let gTagScript = document.createElement('script')
    gTagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-Q5973J67QM')
    gTagScript.async = true
    document.head.appendChild(gTagScript)

    const gtagScriptData = document.createElement('script')
    gtagScriptData.setAttribute('data-uniq', 'gTagScriptData')
    gtagScriptData.innerHTML = 'window.dataLayer = window.dataLayer || [];\n' +
      '  function gtag(){dataLayer.push(arguments);}\n' +
      '  gtag(\'js\', new Date());\n' +
      '\n' +
      '  gtag(\'config\', \'G-Q5973J67QM\');'
    document.head.appendChild(gtagScriptData)
    let fontawsmLib = document.createElement('link')
    fontawsmLib.type = 'text/css'
    fontawsmLib.rel = 'stylesheet'
    fontawsmLib.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css')
    document.body.appendChild(fontawsmLib)
    let googleFont = document.createElement('link')
    googleFont.type = 'text/css'
    googleFont.rel = 'stylesheet'
    googleFont.setAttribute('href', 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700|Roboto:400,700|Material+Icons&display=swap')
    document.body.appendChild(googleFont)
  },
  beforeDestroy () {
  },
  metaInfo: Head,
  components: {
    MinimalHeader,
    AsyncSidebarMobile,
    MinimalFooter,
    SidebarMenu,
    Overlay
  }
}
</script>

<style lang="scss" src="theme/css/main.scss">
</style>