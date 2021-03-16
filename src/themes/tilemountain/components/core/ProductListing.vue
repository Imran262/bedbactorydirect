<template>
  <div class="product-listing row m0 center-xs start-md">
    <div
      v-for="(product, key) in products"
      :key="key"
      class="col-sm-12 col-md-4 flex col-xs-12 pading"
    >
      <product-tile :product="product" />
    </div>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'

export default {
  name: 'ProductListing',
  components: {
    ProductTile
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
    }
  },
  mounted() {
    setTimeout(this.emitingfunc, 2000)
  },
  methods: {
    emitingfunc(){
    this.$emit('showPagination' , true)
    },
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
