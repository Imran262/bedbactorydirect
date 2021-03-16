<template>
  <div id="page_not_found">
    <section class="pt20 px20 ">
      <div class="container ">
        <h2 class="notfound_main_text">
          {{ $t("Sorry, we can't find that page.") }}
        </h2>
      </div>
    </section>
    <section class="bg-cl-primary  px20">
      <div class="container">
        <div class="lh16 h5 weight-400">
          <p class="text-colour">
              {{ $t("Unfortunately the page you are looking for seems to be missing.") }}
          </p>
          
          <p class="text-colour">
            {{ $t('If you need furture assistance please') }}
           
            <Telephone404 :call-text="` call us,`" class="p15 icon pointer t-mobile" :identifier="'phone-number'" />
            {{ $t('drop us a line on live chat') }}
            {{ $t('or write to us via our') }}
              <router-link :to="localizedRoute('/i/contacts')" class=" notfound_text">
               {{ $t('contact us page.') }}
             </router-link>
          </p>
          
          <p class="pt15 text-colour">
            {{ $t('Please try our search to help find a particular product or select a category below.') }}
            
           
          </p>
        </div>
      
        <!-- <section class="container" v-if="ourBestsellersCollection.length">
          <header class="col-md-12 pt40">
            <h3 class="align-center">
              {{ $t('See our bestsellers') }}
            </h3>
          </header>
          <lazy-hydrate when-idle>
            <div class="row center-xs">
              <div v-for="product in ourBestsellersCollection" :key="product.id" class="col-md-3">
                <product-tile :product="product" />
              </div>
            </div>
          </lazy-hydrate>
        </section> -->
      </div>
    </section>
    <PageNotFoundBlock :identifier="'Not_found'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Logger } from '@vue-storefront/core/lib/logger'
import i18n from '@vue-storefront/i18n'
import LazyHydrate from 'vue-lazy-hydration'
import ProductTile from '../components/core/ProductTile.vue'
import PageNotFoundBlock from 'theme/components/core/blocks/PageNotFoundBlock/PageNotFoundBlock'
import Telephone404 from 'theme/components/core/blocks/PhoneNumber/Telephone404';

export default {
  name: 'PageNotFound',
  computed: {
    ...mapGetters({
      ourBestsellersCollection: 'homepage/getBestsellers'
    })
  },
  async asyncData ({ store, route, context }) {
    Logger.log('Entering asyncData for PageNotFound ' + new Date())()
    if (context) {
      context.output.cacheTags.add(`page-not-found`)
      context.server.response.statusCode = 404
    }

    await store.dispatch('homepage/loadBestsellers')
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('404 Page Not Found'),
      meta: [{ vmid: 'description', name: 'description', content: '' }]
    }
  },
  components: {
    ProductTile,
    LazyHydrate,
    PageNotFoundBlock,
    Telephone404
  },
  methods: {
    toggleSearchpanel () {
      this.$store.commit('ui/setSearchpanel', true)
    }
  }
}
</script>

<style scoped>
  
  .notfound_main_text{
    font-family: oblik;
    color: #29275b;
  }
.notfound_text{
      color: #29275b;
    font-weight: bold;
}
.text-colour{
      color: #828282;
}
   a.underline:after,
    a:not(.no-underline):hover:after {
      background-color: transparent !important;
    }

#page_not_found .text-colour .phone {
    padding: 0;
    display: inline-block;
}
#page_not_found .text-colour .phone .contact {
    background: none;
    padding: 0;
    display: inline-block;
}
#page_not_found .text-colour .phone .contact p {
    padding: 0;
    margin: 0;
}

</style>
<style>
@media (max-width: 767px) {
  #page_not_found section .text-colour .t-mobile.phone a {
    background: none;
        width: 100%;
    max-width: 100%;
        height: 100%;
}
#page_not_found section .text-colour .t-mobile.phone a p {
    display: block;
}
}
</style>