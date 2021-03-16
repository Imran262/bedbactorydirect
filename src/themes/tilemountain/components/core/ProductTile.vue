<template>
  <div
    class="product align-center w-100 pb20"
    v-observe-visibility="visibilityChanged"
  >
    <router-link
      class="block no-underline product-link"
      :to="productLink"
      data-testid="productLink"
      @click.native="sendProductClick($vnode.key)"
    >
      <div
        class="product-cover product-listing-box"
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
          :product-label="product.product_banner_image"
        />
      </div>

      <span
        class="price-special cl-accent"
        v-if="
          product.special_price &&
          parseFloat(product.special_price) > 0 &&
          !onlyImage
        "
      >
        <p class="mb0 cl-accent mt10 sub-cat-title" v-if="!onlyImage">
          {{ product.name | htmlDecode }}
        </p>
        <span>
          <p
            class="only11"
            v-if="
              product.size !== 'PALLET' &&
              product.size !== 'pallet' &&
              product.size !== 'Pallet'
            "
          >
            <span v-if="product.size !== '-' && product.size">Size:{{ product.size }}</span>
          </p>
        </span>
        <span class="p-from">
          <p class="only">
            <span class="priceprod">
              {{ product.calculated_sqm_price | price(storeView) }}/<span
                v-if="productTileTypeUnitCheck(product) !== 'piece'"
                v-html="productTileTypeUnitCheck(product)"
                >/</span
              >
            </span>
          </p>
          <div class="rating1">
            <rating
              :score="
                product.average_score ? parseFloat(product.average_score) : 0
              "
            />
            <span data-v-e79937e8 class="reviews"
              >({{ product.total_reviews ? product.total_reviews : 0 }})</span
            >
          </div>
        </span>
      </span>
      <div class="detailsprod bundle-products">
        <span
          class="sign"
          v-if="
            !product.special_price &&
              parseFloat(product.price_incl_tax) > 0 &&
              !onlyImage
          "
        >
          <p class="mb0 cl-accent mt10 sub-cat-title">
            {{ product.name | htmlDecode }}
          </p>
          <span>
            <p
              class="only1"
              v-if="
                product.size !== 'PALLET' &&
                product.size !== 'pallet' &&
                product.size !== 'Pallet'
              "
            >
              <span v-if="product.size !== '-' && product.size">Size: {{ product.size }}</span>
            </p>
          </span>
          <span class="p-from">
            <p class="only">
              <span class="priceprod">
                {{ product.calculated_sqm_price | price(storeView) }}<span v-if="productTileTypeUnitCheck(product) !== 'piece'">/</span><span
                  v-if="productTileTypeUnitCheck(product) !== 'piece'"
                  v-html="productTileTypeUnitCheck(product)"
                  ></span
                >
              </span>
            </p>
            <div class="rating">
              <rating
                :score="
                  product.average_score ? parseFloat(product.average_score) : 0
                "
              />
              <span data-v-e79937e8 class="reviews">
                ({{ product.total_reviews ? product.total_reviews : 0 }})
              </span>
            </div>
          </span>
        </span>
        <div class="sign" v-else-if="!onlyImage && product.price_incl_tax === 0">
          <p class="mb0 cl-accent mt10 sub-cat-title">
            {{ product.name | htmlDecode }}
          </p>
          <p class="low-price">
            As Low As {{ product.calculated_sqm_price | price(storeView) }}
          </p>
          <div class="rating1">
            <rating
              :score="
                product.average_score ? parseFloat(product.average_score) : 0
              "
            />
            <span data-v-e79937e8 class="reviews">({{ product.total_reviews ? product.total_reviews : 0 }})</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts'
import config from 'config'
import ProductImage from './ProductImage'
import rating from 'theme/components/core/blocks/Reviews/Rating'
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare, MeasureProductClick],
  components: {
    ProductImage,
    rating
  },
  data() {
    return {
      changeRouterLink: ''
    }
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    thumbnailObj() {
      return {
        src: this.thumbnail,
        loading: this.thumbnail,
      }
    },
    favoriteIcon() {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    },
    storeView() {
      return currentStoreView()
    },
    productTileType() {
      return config.tileTypes
    }
  },
  methods: {
    productTileTypeUnitCheck(product) {
      let productUnit = ''
      if (product.product_price_type) {
        if (this.productTileType[product.product_price_type] === 'sqm') {
          productUnit = 'm<sup>2</sup>'
        } else if (this.productTileType[product.product_price_type]) {
          productUnit = this.productTileType[product.product_price_type]
        } else {
          productUnit = 'm<sup>2</sup>'
        }
      } else {
        productUnit = 'm<sup>2</sup>'
      }
      return productUnit
    },
    onProductPriceUpdate(product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product)
      }
    },
    visibilityChanged(isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku]
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku)
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }) // store it in the cache
        }
      }
    },
  },
  beforeMount() {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy() {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  },
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);
@media (max-width: 767px) {.detailsprod {width: 46%;float: right;margin: 0 10px !important;}.product-cover {width: 45%;float: left;}.detailsprod .p-from {display: block;text-align: right;}.rating {width: 100% !important;}.only {float: none;}.price-special {width: 48%;float: right;margin: 0 10px !important;.p-from {display: block;}}.reviews {float: none !important;}.rating1 {display: inline-flex !important;}.rating {display: inline-flex !important;}.only11 {margin: 2px 0px 12px 0px !important;}}@media (min-width: 540px) and (max-width: 767px) {.sub-cat-title {margin-top: 23px !important;}.only1 {margin: 2px 0px 12px 0px !important;}}@media screen and (max-width: 460px) and (min-width: 320px) {.sub-cat-title {font-size: 12px !important;margin: 6px 0px 0px 0px !important;padding: 0px;}.only11 {font-size: 12px !important;margin: 0px 0px 0px 0px !important;}.only1 {font-size: 12px !important;margin: 0px 0px 6px 0px !important;}.priceprod {font-size: 14px !important;}.rating1 ul {margin: 6px 0px 0px 0px !important;}.rating ul {margin: 6px 0px 0px 0px !important;}.rating1 ul li .fa {font-size: 16px !important;}.rating ul li .fa {font-size: 16px !important;}.reviews {margin: 6px 0px 0px 4px !important;}}.bundle-products .sub-cat-title {font-size: 16px;font-family: "Arial";}.bundle-products .low-price{color: #29275b !important;font-family: Arial;font-weight: bold;font-size: 16px;margin: 15px 0 0 0;padding: 0 !important;font-weight: normal;border: none !important;}.bundle-products .rating1{width: 100%;text-align: left;}.sub-cat-title {width: 100%;text-align: left;padding-bottom: 10px;margin-bottom: 7px;margin-top: 20px;color: #434343;font-family: 'Arial';font-size: 19px;@media screen and (min-width: 375px) and (max-width: 440px) {line-height: 18px;padding-bottom: 15px;}}.sign {text-align: left;width: 100%;display: block;}.only1 {margin: 0;font-size: 14px;}.p-from {color: #828282;font-weight: bold;font-size: 12px;text-align: left;display: -ms-inline-flexbox;display: inline-flex;padding-left: 0px;width: 100%;@media screen and (max-width: 1199px) {display: block;}}.only {font-weight: bold;font-size: 12px;text-align: left;float: left;width: 60%;font-family: 'Arial';@media screen and (max-width: 1199px) {width: 100%;}}.priceprod {color: #2a285a;font-weight: bold;font-size: 16px;text-align: left;width: 100%;font-family: 'Arial';}.rating ul {display: inline-flex;list-style: none;padding: 0;}.rating ul li .fa {color: #fcde02;font-size: 17px;}.rating {width: 100%;text-align: right;ul {margin-top: 15px !important;@media (min-width: 768px) and (max-width: 1199px) {margin-top: 0px !important;}@media screen and (max-width: 460px) {margin-top: 7px !important;}}@media screen and (max-width: 1199px) {text-align: left;width: 100%;}}.rating1 ul {display: -ms-inline-flexbox;display: inline-flex;list-style: none;padding: 0;}.rating1 {width: 50%;text-align: right;ul {margin-top: 15px;@media (min-width: 768px) and (max-width: 1199px) {margin-top: 0px;}}@media screen and (max-width: 1199px) {text-align: left;width: 100%;}}.reviews {margin: 0px 10px 0px 5px;font-family: Arial;font-size: 14px;color: #828282;margin-top: 14px;@media screen and (min-width: 768px) {position: relative;top: -2px;}@media screen and (min-width: 375px) and (max-width: 767px) {font-size: 12px;}@media screen and (min-width: 320px) and (max-width: 374px) {font-size: 12px;}}.product-listing-box{background-color: #fff;}.product {position: relative;@media (max-width: 767px) {padding-bottom: 10px;padding: 17px;}&__icons {position: absolute;top: 0;right: 0;display: flex;flex-direction: column;padding-right: 20px;padding-top: 10px;}&__icon {padding-top: 10px;opacity: 0;z-index: 2;transition: 0.3s opacity $motion-main;@media (max-width: 767px) {opacity: 1;}&--active {opacity: 1;}}&:hover {.product__icon {opacity: 1;}}}.price-original {text-decoration: line-through;}%label {position: absolute;top: 0;left: 0;display: flex;justify-content: center;align-items: center;width: 40px;height: 40px;background-color: $border-secondary;text-transform: uppercase;color: $color-white;font-size: 12px;}.product-cover {overflow: hidden;&__thumb {padding-bottom: calc(143.88% / (164.5 / 100));@media screen and (min-width: 768px) {padding-bottom: calc(240.44% / (276.5 / 115));}@media screen and (max-width: 767px) {padding-bottom: calc(240.44% / (276.5 / 115));}opacity: 0.8;will-change: opacity, transform;transition: 0.3s opacity $motion-main, 0.3s transform $motion-main;}@media screen and (min-width: 768px) {&:hover {.product-cover__thumb {opacity: 1;}&.sale::after, &.new::after {opacity: 0.8;}}}&.sale {&::after {@extend %label;content: 'Sale';}}&.new {&::after {@extend %label;content: 'New';}}}.price-original {float: left;}.only11 {float: left;margin: 0;font-family: 'Arial';}@media screen and (min-width: 375px) and (max-width: 767px) {.only {margin-bottom: 4px;}}@media screen and (min-width: 320px) and (max-width: 374px) {.only {margin-bottom: 0px !important;}}.only .price-original {margin-top: 6px;@media screen and (max-width: 460px) and (min-width: 320px) {margin-top: 3px !important;}display: flex;}@media screen and (min-width: 461px) and (max-width: 767px) {.sub-cat-title {font-size: 16px !important;}.only1 {font-size: 16px !important;}.priceprod {font-size: 16px !important;}.price-original {font-size: 16px !important;}}@media(min-width:767px) and (max-width:1200px){.bundle-products .sub-cat-title {font-size: 12px;}.bundle-products .low-price{font-size: 12px;margin-bottom: 10px;}}.only1 {font-family: Arial;}
</style>
