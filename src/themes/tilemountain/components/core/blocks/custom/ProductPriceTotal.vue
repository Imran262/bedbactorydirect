<template>
  <div class="price serif">
    <div class="h3 cl-secondary" v-if="initialPrice.special && price.default && price.original">
      <span class="h2 cl-mine-shaft weight-700" v-if="calCheck==true">{{ price.special | price(storeView) }}</span>&nbsp;
      <span class="price-original h3" v-if="calCheck==true">{{ price.original | price(storeView) }}</span>
    </div>

    <div class="h2 cl-mine-shaft price" v-if="!initialPrice.special && price.default">

      <template v-if="option" class="price-div">
        <template v-if="calCheck==true">

          {{ price.default | price(storeView) }}
        </template>
        <!-- <small class="perTile">Total Inc VAT</small> -->

        <!-- <span>Total Inc VAT1</span> -->
      </template>
      <template v-else>
        <template v-if="calCheck==true">
          {{ price.default | price(storeView) }}
          <small class="perTile">Total</small>
        </template>
      </template>
      <span class="vat" v-if="calCheck==true">inc VAT</span>
    </div>
  </div>
</template>
<script>
import {
  getCustomOptionPriceDelta,
  getCustomOptionValues,
} from '@vue-storefront/core/modules/catalog/helpers/customOption';
import {
  getBundleOptionPrice,
  getBundleOptionsValues,
} from '@vue-storefront/core/modules/catalog/helpers/bundleOptions';
import get from 'lodash-es/get';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'ProductPrice',
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    },
    option: {
      type: Boolean,
      default: false
    },
    calCheck: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    bundleOptionsPrice () {
      const allBundeOptions = this.product.bundle_options || [];
      const selectedBundleOptions = Object.values(
        get(
          this.product,
          'product_option.extension_attributes.bundle_options',
          {}
        )
      );
      return getBundleOptionPrice(
        getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
      );
    },
    customOptionsPriceDelta () {
      return getCustomOptionPriceDelta(
        getCustomOptionValues(
          Object.values(this.customOptions),
          this.product.custom_options
        ),
        this.product
      );
    },
    price () {
      const customOptionPrice = this.customOptionsPriceDelta.priceInclTax;
      const special =
        (this.initialPrice.default + customOptionPrice) * this.product.qty;
      const original =
        (this.initialPrice.original + customOptionPrice) * this.product.qty;
      const defaultPrice =
        this.product.qty > 0
          ? (this.initialPrice.default + customOptionPrice) * this.product.qty
          : this.initialPrice.default;
      if (this.bundleOptionsPrice.priceInclTax > 0) {
        return {
          special,
          original,
          default: this.bundleOptionsPrice.priceInclTax
        };
      }
      let data = {
        special,
        original,
        default: defaultPrice
      }
      this.$bus.$emit('calculatedFinalPrice', data)
      return data;
    },
    initialPrice () {
      return {
        default: this.product.price_incl_tax || this.product.priceInclTax || 0,
        original:
          this.product.original_price_incl_tax ||
          this.product.originalPriceInclTax ||
          0,
        special: this.product.special_price || this.product.specialPrice || 0,
      };
    },
    storeView () {
      return currentStoreView();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

$color-primary: color(primary);
.price-original {
  text-decoration: line-through;
}

.price {
  @media (max-width: 767px) {
    color: $color-primary;
  }

  .vat {
    font-size: 12px;
    font-weight: bold;
    color: #48403B;
  }

  /*Custom*/
  font-weight: normal;
  text-align: left;

  small.perTile {
    /* font-size: 16px;
    padding-left: 10px; */
    margin-left: 13px;
    font-size: 13px;
  }
}

.price-div {
  color: #484340;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  font-weight: 700;
  justify-content: center;
  display: flex;
  margin-bottom: 29px;
}

.main-Calculator {
  .price {
    font-size: 24px;
    color: #29275B;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 400;
  }
}
</style>
