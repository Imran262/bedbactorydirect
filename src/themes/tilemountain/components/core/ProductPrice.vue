<template>
  <div class="price serif hide" id="hidePriceOnLoadPage" ref="priceDiv">
    <div
      class="h3 cl-secondary"
      v-if="initialPrice.special && price.default && price.original"
    >
      <span
        class="h2 cl-mine-shaft weight-700"
      >{{ price.special | price(storeView) }}</span>&nbsp;
      special
      <!--      <span-->
      <!--        class="price-original h3"-->
      <!--      >{{ price.original | price(storeView) }}</span>-->
    </div>
    <span
      class="h2 cl-mine-shaft weight-700"
      v-else-if="hidePriceOnLoad &&
        parseFloat(hidePriceOnLoad) === 1 &&
        vinylProductPrice === 0 &&
        productTileTypeUnitCheck(product) === 'm<sup>2</sup>' &&
        product.filter_type !== 'Pack'"
    >
      {{ product.calculated_sqm_price | price(storeView) }}
    </span>
    <span
      class="h2 cl-mine-shaft weight-700"
      v-else-if="!initialPrice.special && price.default && vinylProductPrice === 0"
    >
      {{ price.default | price(storeView) }}
    </span>
    <span
      class="h2 cl-mine-shaft weight-700"
      v-else-if="!initialPrice.special && price.default && vinylProductPrice > 0 && product.filter_type === 'Pack'"
    >
      {{ vinylPriceStore }}
    </span>
    <span class="sqm-title">
      inc VAT
    </span>
  </div>
</template>
<script>
import {
  getCustomOptionPriceDelta,
  getCustomOptionValues
} from '@vue-storefront/core/modules/catalog/helpers/customOption'
import {
  getBundleOptionPrice,
  getBundleOptionsValues
} from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import get from 'lodash-es/get'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import config from 'config';

export default {
  name: 'ProductPrice',
  data () {
    return {
      vinylTotalPrice: 0,
      vinylPriceStore: 0
    }
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    },
    hidePriceOnLoad: {
      type: [String, Number],
      default: ''
    },
    vinylProductPrice: {
      type: Number,
      required: true
    }
  },
  methods: {
    vinylTotalPriceAddition () {
      this.vinylTotalPrice += this.vinylProductPrice;
      this.price.default += this.vinylTotalPrice;
      this.vinylTotalPrice = 0;
      this.vinylPriceStore = this.price.default.toFixed(2)
      this.$emit('finalPrice', this.vinylPriceStore)
      return this.vinylPriceStore;
    },
    productTileTypeUnitCheck (product) {
      console.log('productTileTypeUnitCheck', product)
      let productUnit = '';
      if (product.product_price_type) {
        if (this.productTileType[product.product_price_type] === 'sqm') {
          productUnit = 'm<sup>2</sup>';
        } else if (this.productTileType[product.product_price_type]) {
          productUnit = this.productTileType[product.product_price_type];
        } else {
          productUnit = 'm<sup>2</sup>';
        }
      } else {
        productUnit = 'm<sup>2</sup>';
      }
      return productUnit;
    }
  },
  computed: {
    productTileType () {
      return config.tileTypes;
    },
    bundleOptionsPrice () {
      const allBundeOptions = this.product.bundle_options || []
      const selectedBundleOptions = Object.values(get(this.product, 'product_option.extension_attributes.bundle_options', {}))
      return getBundleOptionPrice(
        getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
      )
    },
    customOptionsPriceDelta () {
      return getCustomOptionPriceDelta(
        getCustomOptionValues(Object.values(this.customOptions), this.product.custom_options || []),
        this.product
      )
    },
    price () {
      const customOptionPrice = this.customOptionsPriceDelta.priceInclTax
      const special = (this.initialPrice.default + customOptionPrice) * this.product.qty
      const original = (this.initialPrice.original + customOptionPrice) * this.product.qty
      const defaultPrice = this.product.qty > 0
        ? (this.initialPrice.default + customOptionPrice) * this.product.qty
        : this.initialPrice.default

      if (this.bundleOptionsPrice.priceInclTax > 0) {
        return {
          special,
          original,
          default: this.bundleOptionsPrice.priceInclTax
        }
      }

      return {
        special,
        original,
        default: defaultPrice
      }
    },
    initialPrice () {
      return {
        default: this.product.price_incl_tax || this.product.priceInclTax || 0,
        original: this.product.original_price_incl_tax || this.product.originalPriceInclTax || 0,
        special: this.product.special_price || this.product.specialPrice || 0
      }
    },
    storeView () {
      return currentStoreView()
    }
  },
  watch: {
    $route: function (to, from) {
      if (to.name !== from.name) {
        if (document.getElementById('hidePriceOnLoadPage')) {
          document.getElementById('hidePriceOnLoadPage').classList.add('hide');
        }
      }
    },
    vinylProductPrice: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.vinylTotalPriceAddition()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-primary: color(primary);
.price-original {
  text-decoration: line-through;
}

.price {
  @media (max-width: 767px) {
    color: $color-primary;
    display: flex;
    justify-content: center;
  }
}
.add-to-cart span{
  color: #2a275c;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2.5rem;
  line-height: 1.5;
}
.add-to-cart .sqm-title{
  margin-left: 0px;
  font-family: oblik;
  color: #4a4a4a;
  font-size: 18px;
  font-weight: bold;
}
@media(max-width: 767px){
  .add-to-cart {
    .h3.cl-secondary{
      display: block;
      margin: auto;
      text-align: center;
    }
    span{
      text-align: center;
      display: block;
      font-size: 28px;
    }
    .sqm-title{
      text-align: center;
      display: block;
      font-size: 12px;
      margin-top: 15px;
      padding-left: 6px;
    }
  }
}
@media(min-width: 991px) and (max-width: 1200px){
   .add-to-cart span {
    font-size: 1.5rem;
  }
}
.price.serif.hide {
  display: none;
}
</style>
