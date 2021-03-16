<template>
  <form class="custom-options" data-testid="bundle-options">
    <div v-for="option in product.bundle_options" :key="('bundleOption_' + option.option_id)">
      <template v-if="option.type && ['select','drop_down'].includes(option.type)">
        <product-bundle-option :product="product" :option="option" @option-changed="optionChanged" :error-messages="errorMessages"/>
      </template>
      <template v-else>
        <product-bundle-option :option="option" @option-changed="optionChanged" :error-messages="errorMessages"/>
      </template>
    </div>
  </form>
</template>

<script>
import { ProductBundleOptions } from '@vue-storefront/core/modules/catalog/components/ProductBundleOptions.ts'
import ProductBundleOption from './ProductBundleOption'

export default {
  mixins: [ProductBundleOptions],
  components: {
    ProductBundleOption
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
</style>
