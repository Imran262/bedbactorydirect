<template>
<div class="main_pro">
  <div class="mb35">
    <div class="row mb15 main_pro1">
      <div class="col-xs-12 col-sm-6">
        <h3 class="m0 mb5">
          {{ $t('My recently viewed products') }}
        </h3>
      </div>
    </div>
    <div class="row p20">
      <div class="col-xs-12" v-if="items && items.length > 0">
        <product-listing columns="3" :products="items" />
      </div>
      <div class="col-xs-12 h4" v-else>
        <p>{{ $t('No products yet') }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import RecentlyViewed from '@vue-storefront/core/modules/recently-viewed/components/RecentlyViewed'
import ProductListing from 'src/themes/bedfactory/components/core/ProductListingCustom'

export default {
  mixins: [RecentlyViewed],
  components: {
    ProductListing
  }
}
</script>
<style scoped>
.main_pro {
     border: 1px solid #b7b4b4;
    border-radius: 10px;
    padding: 7px;
  background: #fff;
}
.main_pro1{
     border: 1px solid #b7b4b4;
    background-color: #071a44;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    margin-top: -9px;
      padding: 8px;
}
h3{
    color: #fff;

}

.bg-cl-mine-shaft {
    background-color: #29275b!important;
}
h1, h2, h3, h4, h5 {
   font-family: oblik !important;
}
.cl-tertiary {
    color: #fff!important;
}
</style>
