<template>
  <div id="home">
    <head-image />
     <UspBar :identifier="'usp-bar-TM'" />
     <FamiliarProducts />
     <Brands />
     <swatches :identifier="'swatches-TM'"/>
    <!-- <HomeBottomContent /> -->
    <!-- <homeDelivery :identifier="'home-Delivery'" />
    <FamiliarProducts />
    <homevideo />
    <div itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
      <meta
        v-for="socialLink in socialLinksSchema"
        :key="socialLink"
        itemprop="sameAs"
        :content="socialLink"
      />
    </div>
    <div itemscope itemtype="http://schema.org/WebSite">
      <meta itemprop="name" content="Tile Mountain" />
      <meta itemprop="url" content="https://www.tilemountain.co.uk/" />
    </div> -->
  </div> 
</template>

<script>
// query constructor
import { isServer, onlineHelper } from '@vue-storefront/core/helpers'
import LazyHydrate from 'vue-lazy-hydration'
// Theme core components
import HeadImage from 'src/themes/bedfactory/components/core/blocks/MainSlider/HeadImage'
import homeDelivery from 'theme/components/core/blocks/homeDelivery/homeDelivery'
import UspBar from "src/themes/bedfactory/components/theme/blocks/UspBar/UspBar"; // BFD Component
import FamiliarProductsORiginal from 'theme/components/core/blocks/FamiliarProducts/FamiliarProducts'
import FamiliarProducts from "src/themes/bedfactory/components/theme/blocks/FamiliarProducts/FamiliarProducts"; // BFD Component
import Swatches from '/home/ejaz/vsf/BEDFACTORY/newBFD/bfdvuestore/src/themes/bedfactory/components/core/blocks/Swatches/Swatches';
// Theme local components
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers'
import slider from 'theme/components/core/blocks/slider/slider'
// Theme local components
import mainProduct from 'theme/components/theme/blocks/mainProduct/mainProduct'
import homevideo from 'theme/components/core/blocks/homevideo/homevideo'
// Theme local components
import TileLinks from 'theme/components/theme/blocks/TileLinks/TileLinks'
import { Logger } from '@vue-storefront/core/lib/logger'
import { mapGetters } from 'vuex'
import config from 'config'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
// import trustPoilet from "theme/components/core/blocks/trustPoilet/trustPoilet";
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'




import Brands from "src/themes/bedfactory/components/theme/blocks/Brands/Brands";// BFD Component
import HomeBottomContent from "src/themes/bedfactory/components/theme/blocks/HomeBottomContent/HomeBottomContent";

export default {
  name: 'HomePage',
  data () {
    return {
      loading: true,
      pageTitle: {
        title: '',
        titleTemplate:  this.$route.meta.title || this.$i18n.t("Cheap Beds For Sale | Up To 60% Off | Choose Delivery Day"),
      }
    }
  },
  components: {
    HeadImage,
    PromotedOffers,
    TileLinks,
    LazyHydrate,
    slider,
    homeDelivery,
    mainProduct,
    homevideo,
    FamiliarProducts,
    UspBar, // BFD
    Brands, //BFD
    HomeBottomContent, //BFD
    Swatches
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('homepage', ['getEverythingNewCollection']),
    categories () {
      return this.getCategories
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.some((field) =>
        ['homepage', 'homepage.new_collection'].includes(field)
      )
    },
    socialLinksSchema () {
      return config.socialUrlsForSchema ? config.socialUrlsForSchema : ''
    }
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule)
  },
  async beforeMount () {
    if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch('claims/check', {
        claimCode: 'onboardingAccepted',
      })
      if (!onboardingClaim) {
        // show onboarding info
        this.$store.dispatch('claims/set', {
          claimCode: 'onboardingAccepted',
          value: true,
        })
      }
    }
    window.addEventListener('scroll',(event) => {
    history.scrollRestoration = 'auto'
    let scroll = window.scrollY;
    localStorage.setItem("Homescrollloc", scroll);
  });
    window.addEventListener('load',(event) => {
    let loca = localStorage.getItem('Homescrollloc')
    window.scrollTo(0, loca)
  });
  },
  mixins: [MeasureProductClick],
  mounted () {
    this.sendHomeClick({ metaInfo: { ...this.pageTitle }, path: this.$route.path, fullPath: this.$route.fullPath });
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup')
    }
    if (typeof BrTrk === 'undefined') {
      document.getElementsByTagName('script')[0].addEventListener('load', () => {
        this.addBloom()
      })
    } else {
      this.addBloom()
    }
  },
  methods: {
    metatitle () {
      if(config?.themeConfigurations?.title){
      return config?.themeConfigurations?.title;
      }
    },
    addBloom () {
      if (config && config.bloomreach) {
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'homepage'
        br_data.domain_key = config.bloomreach.domainKey
        br_data.view_id = config.bloomreach.viewId
        br_data.test_data = config.bloomreach.testData
        BrTrk.getTracker().updateBrData(br_data)
        BrTrk.getTracker().logPageView()
      }
    }
  },

  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect')
      if (redirectObj) this.$router.push(redirectObj)
      localStorage.removeItem('redirect')
    }
  },
  async asyncData ({ store, route, context }) {
    // this is for SSR purposes to prefetch data
    if (context) context.output.cacheTags.add(`home`)
    Logger.info('Calling asyncData in Home Page (core)')()

    await Promise.all([
      store.dispatch('homepage/fetchNewCollection'),
      store.dispatch('promoted/updateHeadImage'),
      store.dispatch('promoted/updatePromotedOffers'),
    ])
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      // Loading products to cache on SSR render
      next((vm) =>
        vm.$store.dispatch('homepage/fetchNewCollection').then((res) => {
          vm.loading = false
        })
      )
    } else {
      next()
    }
  },
  metaInfo () {
    let canonicalUrl = (config && config.canonicalBaseUrl) ? config.canonicalBaseUrl : '/'
    let metaData = [
      {
        property: 'og:url',
        content: (config.ogtagsBaseUrl ? config.ogtagsBaseUrl : '') + canonicalUrl
      },
      {
        property: 'og:title',
        content: ''
      },
      {
        property: 'og:type',
        content: 'website'
      }
    ]
    return {
      ...this.pageTitle,
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl
        }
      ],
      meta: metaData
    }
  }
};
</script>

<style lang="scss" scoped>
.new-collection {
  @media (max-width: 767px) {
    padding-top: 0;
  }
}
</style>
