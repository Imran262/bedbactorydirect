<template>
  <div
    class="product align-center w-100 pb20"
    v-observe-visibility="visibilityChanged"
  >
    <!-- <div class="product__icons">
      <AddToWishlist :product="product">
        <div
          class="product__icon"
          :class="{'product__icon--active': isOnWishlist }"
          :title="isOnWishlist ? $t('Remove') : $t('Add to favorite') "
        >
          <i class="material-icons">{{ favoriteIcon }}</i>
        </div>
      </AddToWishlist>
      <AddToCompare :product="product">
        <div
          class="product__icon"
          :class="{'product__icon--active':isOnCompare } "
          :title="isOnCompare ? $t('Remove from compare') : $t('Add to compare')"
        >
          <i class="material-icons">compare</i>
        </div>
      </AddToCompare>
    </div> -->
    <router-link
      class="block no-underline product-link"
      :to="productLink"
      data-testid="productLink"
    >
      <div
        class="product-cover bg-cl-secondary"
        :class="[
          { sale: labelsActive && isOnSale },
          { new: labelsActive && isNew },
        ]"
      >
        <product-image
          class="product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </div>

      <p class="sb-prodcut-name mb0 cl-accent mt10" v-if="!onlyImage">
        {{ product.name | htmlDecode }}
      </p>

      <span
        class="price-original mr5 lh30 cl-secondary"
        v-if="
          product.special_price &&
            parseFloat(product.original_price_incl_tax) > 0 &&
            !onlyImage
        "
        >{{ product.original_price_incl_tax | price }}</span
      >

      <span
        class="price-special lh30 cl-accent weight-700"
        v-if="
          product.special_price &&
            parseFloat(product.special_price) > 0 &&
            !onlyImage
        "
        >{{ product.price_incl_tax | price }}</span
      >

      <span
        class="sb-category-price"
        v-if="
          !product.special_price &&
            parseFloat(product.price_incl_tax) > 0 &&
            !onlyImage
        "
        >{{ product.price_incl_tax | price }}</span
      >
    </router-link>
  </div>
</template>

<script>
import rootStore from "@vue-storefront/core/store";
import { ProductTile } from "@vue-storefront/core/modules/catalog/components/ProductTile.ts";
import config from "config";
import ProductImage from "./ProductImage";
import AddToWishlist from "theme/components/core/blocks/Wishlist/AddToWishlist";
import AddToCompare from "theme/components/core/blocks/Compare/AddToCompare";
import { IsOnWishlist } from "@vue-storefront/core/modules/wishlist/components/IsOnWishlist";
import { IsOnCompare } from "@vue-storefront/core/modules/compare/components/IsOnCompare";

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare],
  components: {
    ProductImage,
    AddToWishlist,
    AddToCompare,
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true,
    },
    onlyImage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    thumbnailObj() {
      return {
        src: this.thumbnail,
        loading: this.thumbnail,
      };
    },
    favoriteIcon() {
      return this.isOnWishlist ? "favorite" : "favorite_border";
    },
  },
  methods: {
    onProductPriceUpdate(product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product);
      }
    },
    visibilityChanged(isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === "configurable" &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku];
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id];
          if (typeof cachedItem === "undefined" || cachedItem === null) {
            skus.push(confChild.sku);
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch("stock/list", { skus: skus }); // store it in the cache
        }
      }
    },
  },
  beforeMount() {
    this.$bus.$on("product-after-priceupdate", this.onProductPriceUpdate);
  },
  beforeDestroy() {
    this.$bus.$off("product-after-priceupdate", this.onProductPriceUpdate);
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);

.product {
  position: relative;
  margin-bottom: 10px;
  @media (max-width: 767px) {
    padding-bottom: 10px;
  }
  &__icons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-top: 10px;
  }
  &__icon {
    padding-top: 10px;
    opacity: 0;
    z-index: 2;
    transition: 0.3s opacity $motion-main;
    @media (max-width: 767px) {
      opacity: 1;
    }
    &--active {
      opacity: 1;
    }
  }
  &:hover {
    .product__icon {
      opacity: 1;
    }
  }
  .sb-prodcut-name {
    font-size: 0.875rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    margin-bottom: 20px;
  }
  span.sb-category-price {
    font-size: 1.131875rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
  }
}

.price-original {
  text-decoration: line-through;
}

%label {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: $border-secondary;
  text-transform: uppercase;
  color: $color-white;
  font-size: 12px;
}

.product-cover {
  overflow: hidden;

  &__thumb {
    padding-bottom: calc(165.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      padding-bottom: calc(300% / (276.5 / 100));
    }
    opacity: 1;
    will-change: opacity, transform;
    transition: 0.3s opacity $motion-main, 0.3s transform $motion-main;
  }

  @media screen and (min-width: 768px) {
    &:hover {
      .product-cover__thumb {
        opacity: 1;
        transform: scale(1.1);
      }
      &.sale::after,
      &.new::after {
        opacity: 1;
      }
    }
  }

  &.sale {
    &::after {
      @extend %label;
      content: "Sale";
    }
  }
  &.new {
    &::after {
      @extend %label;
      content: "New";
    }
  }
}
/*FLOR-21 */
.product__icons {
  bottom: 0 !important;
  top: unset !important;
  border: 1px solid #ddd;
  padding: 4px 3px 2px 3px !important;
  border-radius: 5px;
}

.product__icon {
  padding: 0 !important;
}

i.material-icons {
  vertical-align: bottom;
}
.product__icon {
  opacity: 1 !important;
}
/*FLOR-21 */
img.product-cover-thumb {
  width: 120%;
}
/* FLOR-108  */
.product__icon--active img {
  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg)
    brightness(104%) contrast(97%);
}
.searchpanel .product a {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  /* height: 241px; */
  -ms-flex-align: center;
  /* align-items: flex-end; */
  -ms-flex-pack: end;
  justify-content: flex-end;
}
.searchpanel .product {
  padding-bottom: 0;
  margin-bottom: 0;
}
.product .sb-prodcut-name {
  height: auto;
  line-height: 1.4em;
  display: -ms-flexbox;
  display: flex;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 0px;
  display: block;
  text-align: center;
}

.searchpanel .product__icons {
  display: none;
}
.sb-prodcut-sku {
  display: none !important;
}
#search-mainmain .sb-prodcut-sku {
  display: block !important;
}
.price-special {
  color: #d90046;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 767px) {
  .product .sb-prodcut-name {
    height: auto;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  .product .sb-prodcut-name {
    height: auto;
  }
}
</style>
