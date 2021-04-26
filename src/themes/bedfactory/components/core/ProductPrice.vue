<template>
  <div class="price serif">
    <!-- <br />Custom Options<br />{{customOptions}} -->
    <div class="h3 cl-secondary">
      <span class="h2 cl-mine-shaft weight-700">{{
        price.special | price(storeView)
      }}</span
      >&nbsp;
      <span class="h3 saving-price-detail-div">
        <span
          class="price-original was-price"
          v-if="price.special !== price.original"
          >was {{ price.original | price(storeView) }}</span
        >
        <span class="save-amount" v-if="discoutedPrice !== 0"
          >Save:{{ discoutedPrice.toFixed(2) | price(storeView) }}</span
        >
      </span>
    </div>
    <!-- {{price.special}}
    {{price.original}}
    {{discoutedPrice.toFixed(2)}}-->
    <!-- <div
      class="h2 cl-mine-shaft weight-700"
      v-if="!initialPrice.special && price.default"
    >
      {{ price.default | price(storeView) }}
    </div>-->
  </div>
</template>
<script>
import {
  getCustomOptionValues,
  getCustomOptionPriceDelta,
} from "@vue-storefront/core/modules/catalog/helpers/customOption";
import {
  getBundleOptionsValues,
  getBundleOptionPrice,
} from "@vue-storefront/core/modules/catalog/helpers/bundleOptions";
import get from "lodash-es/get";
import { currentStoreView } from "@vue-storefront/core/lib/multistore";

export default {
  name: "ProductPrice",
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
    customOptions: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    bundleOptionsPrice() {
      const allBundeOptions = this.product.bundle_options || [];
      const selectedBundleOptions = Object.values(
        get(
          this.product,
          "product_option.extension_attributes.bundle_options",
          {}
        )
      );
      const price = getBundleOptionPrice(
        getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
      );
      return price;
    },
    customOptionsPriceDelta() {
      console.log("1122== Price Value are",this.customOptions,Object.values(this.customOptions),
          this.product.custom_options);
      const priceDelta = getCustomOptionPriceDelta(
        getCustomOptionValues(
          Object.values(this.customOptions),
          this.product.custom_options
        ),
        this.product
      );

      return priceDelta;
    },
    price() {
      const customOptionPrice = this.customOptionsPriceDelta.priceInclTax;
      const special =
        (this.initialPrice.default + customOptionPrice) * this.product.qty;
      const original =
        (this.initialPrice.original + customOptionPrice) * this.product.qty;
      const defaultPrice =
        this.product.qty > 0
          ? (this.initialPrice.default + customOptionPrice) * this.product.qty
          : this.initialPrice.default;
      // console.log("1122 About to emit ");
      let obj = {};
      // this.$emit("calculatedPrice", obj);
      // console.log("1122 emitted is ",obj);
      if (this.bundleOptionsPrice.priceInclTax > 0) {
        obj = {
          special,
          original,
          default: this.bundleOptionsPrice.priceInclTax,
        };
        this.$emit("calculatedPrice", obj);
        return {
          special,
          original,
          default: this.bundleOptionsPrice.priceInclTax,
        };
      }
      // console.log("This is price =========>", special, original, defaultPrice);
      obj = {
        special,
        original,
        default: defaultPrice,
      };
      this.$emit("calculatedPrice", obj);
      return {
        special,
        original,
        default: defaultPrice,
      };
    },
    initialPrice() {
      return {
        default: this.product.price_incl_tax || this.product.priceInclTax || 0,
        original:
          this.product.original_price_incl_tax ||
          this.product.originalPriceInclTax ||
          0,
        special: this.product.special_price || this.product.specialPrice || 0,
      };
    },
    discoutedPrice() {
      return parseFloat(this.price.original) - parseFloat(this.price.special);
    },
    storeView() {
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
 font-family: Arial, Helvetica, sans-serif !important;
}

.price {
  @media (max-width: 767px) {
    color: $color-primary;
  }
}
.bt-price-main .h2.cl-mine-shaft.weight-700 {
  color: #d10000b8;
  display: inline-block;
  margin-top: 15px;
  font-family: Arial, Helvetica, sans-serif !important;
  font-size: 2rem !important;
   @media (max-width: 1200px) {
      font-size: 1.5rem !important;
   }
      @media (max-width: 767px) {
      font-size: 1.55rem !important;
   }

}

.bt-product-gallery {
  padding-right: 30px;
}

.bt-product-details {
  padding-left: 30px;
}
.saving-price-detail-div {
  display: inline-block;
  padding-left: 15px;
  font-size: 17px;
  color: #54575b;
}
.product-detail-inner {
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f1f2;
}
span.save-amount {
  padding-left: 15px;
  color: #d10000b8;
  font-family: Arial, Helvetica, sans-serif !important;
}
.h3.cl-secondary {
    padding: 0px 40px 0px 40px;
}
.price.serif {
    margin-top: -20px;
}
@media (max-width: 767px) {
  .h3.cl-secondary {
    padding: 0px 40px 0px 25px;
}
}
@media (max-width: 392px) {
.saving-price-detail-div{
  padding-left: 0px !important;
}
}
</style>
