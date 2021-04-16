<template>
  <div class="product-listing row m0 center-xs start-md">
    <!-- In product Listing
  Products are <br /> -->
  <template v-if="isCategory">
    <div
      v-for="(product, key) in products"
      :key="key"
      class="col-sm-12 col-md-4 flex col-xs-12 pading"
    >
      <product-tile-custom-cat :product="product" :filters="filters"/>
    </div>
  </template>
  <template v-else>
    <div
      v-for="(product, key) in products"
      :key="key"
      class="col-sm-12 col-md-3 flex col-xs-12 pading"
    >
   <!-- Current Product {{product.name}} -->
      <product-tile-custom :product="product" :filters="filters"/>
    </div>
  </template>
  </div>
</template>

<script>
import ProductTileCustomCat from './ProductTileBFD.vue'
import ProductTileCustom from './ProductTileSearch.vue'

export default {
  name: 'ProductListing',
  components: {
    ProductTileCustom
  },
  data () {
    return {
      lastHero: 0
    }
  },
  props: {
    products: {
      type: null,
      required: true
    },
    columns: {
      type: [Number, String],
      required: true
    },
     filters: {
      type: Object,
      required:true
    },
     isCategory: {
      type: Boolean,
      required:true
    }
  },
  methods: {
    wide (isOnSale, isNew, index) {
      let deltaCondition = index > 0 && ((index - 1) - this.lastHero) % 2 === 0
      // last image always shouldn't be big, we also need to count from last promoted to check if it will look ok
      let isHero = ((isOnSale === '1' || isNew === '1') && deltaCondition) || (index === this.products.length - 1 && (index - this.lastHero) % 2 !== 0)
      if (isHero) {
        this.lastHero = index
      }
      return isHero ? 'col-xs-12' : 'col-xs-6'
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 767px) {
.pading{
    /* padding-bottom: 9px !important; */
    padding: 0px;
    border-bottom: 1px solid #ccc;
    /* padding-top: 8px !important; */
}
}
</style>
