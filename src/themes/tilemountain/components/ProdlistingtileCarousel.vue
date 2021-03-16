<template>
  <div class="product-slide related-product-detail">
    <router-link :to="productLink" data-testid="productLink">
      <div class="product-image" ref="successProductImage">
        <div
          class="block no-underline product-link slider-custom-link product-image product-cover__thumb"
        >
          <prodlistingimage-carousel
            class="product-cover__thumb"
            :image="thumbnailObj"
            :alt="product.name | htmlDecode"
            :calc-ratio="false"
            data-testid="productImage"
          />
        </div>
      </div>
      <div class="innner-detail">
        <div class="offer btn-align">
          <p
            class="mb0 cl-accent product_name"
            v-if="!onlyImage"
            :class="
              !(product.size && product.attribute_set_id == '63')
                ? 'height'
                : ''
            "
          >
            {{ product.name | htmlDecode }}
          </p>
          <p
            v-if="product.size && product.attribute_set_id == '63'"
            class="product_name1"
          >
            Size: {{ product.size }}
          </p>
          <div class="ratingInfo">
            <p
              class="product_name2"
              :class="
                !(product.size && product.attribute_set_id == '63')
                  ? 'margin'
                  : ''
              "
            >
              <span class="Now">Now</span> £{{
                parseFloat(product.calculated_sqm_price).toFixed(2)
              }}<span v-if="productTileTypeUnitCheck(product) !== 'piece'"
                >/<span v-html="productTileTypeUnitCheck(product)"
              /></span>
            </p>
            <div class="right_align">
              <rating
                :ul-class="`slider-rating`"
                :score="
                  product.average_score ? parseFloat(product.average_score) : 0
                "
              />
              <p class="rating-no">
                ({{ product.total_reviews ? product.total_reviews : 0 }})
              </p>
            </div>
          </div>
        </div>
        <p class="mb0 cl-accent product_name" v-if="!onlyImage">
          <router-link
            class="product_btn"
            :to="productLink"
            data-testid="productLink"
          >
            <b>VIEW</b>
          </router-link>
        </p>

        <btn-carousel
          :product="product"
          :disabled="isAddToCartDisabled"
          :success-id="product.sku"
          class="addtocart-carousel-btn"
        />
      </div>
    </router-link>
    <div
      class="success-similar-addtocart hidden"
      :data-success-attribute="product.sku"
      ref="successSimilar"
    >
      <div class="success-similar-content-main">
        <div class="similar-success-tick">
          <img
            src="/assets/checkout-non-selected-tick.png"
            alt="checkout not selected tick"
          />
        </div>
        <div class="similar-success-prod-name">
          <span>{{ product.name }}</span> - is added to your cart
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts'
import config from 'config'
import ProdlistingimageCarousel from 'theme/components/ProdlistingimageCarousel'
import BtnCarousel from 'theme/components/BtnCarousel'
import rating from 'theme/components/core/blocks/Reviews/Rating'

export default {
  mixins: [ProductTile],
  components: {
    ProdlistingimageCarousel,
    BtnCarousel,
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
    },
    product: {
      type: Object,
      required: false,
      default: () => { }
    }
  },
  computed: {
    thumbnailObj() {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      }
    },
    favoriteIcon() {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    },
    isAddToCartDisabled() {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      )
    },
    changeRouterLinkAddress() {
      if (
        this.product.variant_url != '' &&
        this.product.variant_url != undefined &&
        this.product.variant_url != null
      ) {
        this.changeRouterLink = this.product.variant_url
      } else {
        this.changeRouterLink = 'abc'
      }
      return this.changeRouterLink
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
    }
  },
  watch: {
    $route(to, from) {
      this.$refs.successSimilar.classList.remove('active')
      this.$refs.successProductImage.classList.remove('hidden')
      this.show = false
    }
  },
  beforeMount() {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy() {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  }
};
</script>
<style scoped>
.ratingInfo {
    height: 100%;
    min-height: 56px;
}
.related-product-detail {
  padding: 20px 0px;
}
.related-product-detail:hover {
  background: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-color: transparent;
  transition: box-shadow 400ms ease-out;
  -moz-transition: box-shadow 400ms ease-out;
  -webkit-transition: box-shadow 400ms ease-out;
  z-index: 10;
}
.related-product-detail .slider-custom-link {
  border: none;
}
.product-image a {
  display: flex;
  flex-direction: column;
  /* height: 45vh; */
  align-items: center;
  justify-content: flex-end;
}

.product-similar-listing-carousel p {
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
  margin: 5px 5px;
  font-weight: 600;
  width: 90%;
  align-items: baseline;
  text-align: center;
}

.product-similar-listing-carousel .product-image .product-cover__thumb {
  padding: 0 0px 0px 0px;
  margin: 0px auto;
  height: 215px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-sliders .product-similar-listing-carousel p {
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
  margin: 5px 5px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  height: 50px;
}

.product-similar-listing-carousel .VueCarousel {
  background: #fff;
  text-align: center;
  padding: 0px 30px 10px 30px;
}

.product-similar-listing-carousel .VueCarousel-navigation {
  display: block;
  position: relative;
}

.product-similar-listing-carousel .VueCarousel-navigation button {
  top: -100px;
  width: 0;
  padding: 0;
}

.product-recent-listing-carousel .product-image a {
  /* height: 0px; */
  /* background: #f2f2f2; */
}

.product-similar-listing-carousel .VueCarousel-navigation button i {
  color: #00998c;
  font-size: 40px;
}

.product-similar-listing-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-prev {
  left: -35px;
}

.product-similar-listing-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-next {
  right: 35px;
}

.addtocart-carousel-btn {
  display: inline-block;
  padding: 0;
  min-width: auto;
}

.popup-sliders .VueCarousel .product-slide {
  border-right: 2px solid #eaebec;
  display: block;
  height: 100%;
}

.product-recent-listing-carousel button.addtocart-carousel-btn {
  display: none !important;
}

.product-similar-listing-carousel .recently-viewed-price-container {
  font-family: 'Poppins', sans-serif;
  color: #d10000b8;
  display: block;
  font-weight: 700;
}

.product-recent-listing-carousel .innner-detail {
  width: 90%;
  margin: auto;
}

.product-recent-listing-carousel span.recently-viewed-price-container {
  display: block;
  /* background: #eceff5; */
  width: 90%;
  margin: 0 auto;
  color: #54575b;
  font-size: 18px;
  font-weight: 700;
}

.popup-sliders .VueCarousel .slider-custom-link {
  display: block !important;
  height: auto !important;
}

.cart-popup .popup-sliders .VueCarousel .slider-inner-detail {
  width: 50%;
  margin-left: 20px;
}

.popup-sliders .VueCarousel .slider-inner-detail,
.popup-sliders .VueCarousel .product-cover__thumb {
  float: left;
}

.product-recent-listing-carousel .slider-inner-detail {
  margin: 0 auto;
}

.product-description-main .product-similar-listing-carousel .product-image a {
  /* height: 130px; */
}

.product-description-main .slider-inner-detail p {
  height: 4em;
  line-height: 1.4em;
  display: flex;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slider-rating li {
  display: inline-block;
}

.slider-rating li .fa {
  color: #fcde02;
  font-size: 20px;
}

.product_name2,
.slider-rating,
.rating-no {
  display: inline-block;
  width: auto !important;
}

.rating-no {
  color: #7e7979;
  font-size: 12px;
}

@media (max-width: 360px) {
  .right_align {
    /* text-align: left !important;
    margin-top: 0px !important; */
    margin-left: -40px;
  }
}

@media (max-width: 767px) {
  .popup-sliders .product-similar-listing-carousel p {
    text-align: center;
    height: 30px;
  }

  .popup-sliders button.carousel-addtocart-btn {
    float: none;
    margin-bottom: 10px;
  }

  .popup-sliders .VueCarousel .slider-custom-link {
    display: block !important;
    margin-top: 10px;
  }

  .popup-sliders .VueCarousel .slider-inner-detail {
    width: 100%;
  }

  .popup-sliders .VueCarousel .product-slide {
    border-right: 2px solid transparent;
  }

  .product-recent-listing-carousel .slider-inner-detail {
    margin: 0 auto;
    margin-bottom: 50px;
  }

  .product-image a {
    height: auto;
  }

  .product-description-main .slider-inner-detail p {
    min-height: auto;
  }

  .product-description-main .product-similar-listing-carousel .product-image a {
    height: auto;
  }

  .cart-popup .popup-sliders .VueCarousel .slider-inner-detail {
    width: 100%;
    margin-left: 0px;
  }
  .offer {
    min-height: 98px;
  }
  .product_name {
    line-height: 1.6 !important;
    margin-top: 0;
  }
  .rating-no {
    font-size: 10px;
  }
  .Now {
    display: none;
  }
  .product_btn {
    padding: 13px 0px 14px 0px;
    height: 0;
    line-height: 0.3;
    border-radius: 0 !important;
  }
}

@media (min-width: 767px) and (max-width: 1900px) {
  .product-recent-listing-carousel span.recently-viewed-price-container {
    padding: 0px 0px 35px 0px;
  }
}

.success-similar-addtocart {
  display: none;
}

.success-similar-addtocart.active {
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  display: flex;
  height: 226px;
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
}

.success-similar-content-main .similar-success-tick img {
  display: inline-block;
  background: #00998c;
  border-radius: 50%;
  padding: 12px 7px;
}

.similar-success-prod-name span {
  text-transform: capitalize;
  font-weight: 600;
  font-size: 14px;
}

.VueCarousel-navigation-button {
  color: #eee;
}

.product_name {
  color: #29275b;
  text-align: left;
  line-height: 1.7;
  font-size: 15px;
  font-weight: 500;
  min-height: 54px;
  font-family: Arial;
}
@media screen and (max-width: 374px) and (min-width: 320px) {
  .offer .product_name {
    height: 37px !important;
    overflow: hidden !important;
    min-height: 23px !important;
    line-height: 1.4 !important;
    padding-top: 11px;
  }
  .offer .product_name1 {
    margin: 7px 0 0 0 !important;
  }
}
@media screen and (max-width: 767px) and (min-width: 375px) {
  .offer .product_name {
    height: 45px !important;
    overflow: hidden !important;
    min-height: 23px !important;
    line-height: 1.4 !important;
    padding-top: 11px;
  }
  .offer .product_name1 {
    margin: 3px 0 0 0 !important;
  }
}

.product_name1 {
  margin: 0px 0px -9px 0px;
  color: #29275b;
  text-align: left;
  line-height: 1;
  font-size: 13px;
  font-family: Arial;
}

.product_name2 {
  color: #29275b;
  font-family: Arial;
  text-align: left;
  line-height: 0;
  font-weight: bold;
  font-size: 15px;
  margin-right: -26px;
  margin-top: 21px;
}

.image_size {
  display: block;
  margin-left: auto;
  /* margin-right: auto; */
  width: 40%;
  margin-top: -19px;
}

.product_btn {
  width: 100%;
  /* height: 44px; */
  background-color: #29275b;
  border: none;
  color: white;
  border-radius: 4px;
  display: block;
  text-align: center;
  padding: 13px 0px 14px 0px;
  margin-top: -5px;
}
a:not(.no-underline):hover:after {
  background-color: transparent;
}
.pd {
  padding: 7px;
}

.right_align {
  text-align: right;
  margin-top: -39px;
}

@media (max-width: 991px) {
  .product_name2 {
    color: #29275b;
    text-align: left;
    line-height: 0;
    font-weight: bold;
    font-size: 11px !important;
    margin-right: -17px;
    font-family: Arial;
    margin-top: 7px;
  }
  .product_name2 span {
    margin-top: 19px;
  }
  .fa-star:before {
    content: '\f005';
    font-size: 12px;
  }

  .fa-star-half-o:before {
    content: '\f123';
    font-size: 12px;
  }

  .fa-star-o:before {
    content: '\f006';
    font-size: 12px;
  }
}

@media (max-width: 1200px) and (min-width: 767px) {
  .product_name1 {
    font-size: 10px;
  }
  .product_name2 {
    color: #29275b;
    text-align: left;
    line-height: 2;
    font-weight: bold;
    font-size: 11px !important;
    margin-right: -34px;
  }
  .product_name2,
  .slider-rating,
  .rating-no {
    margin-top:  6px;
  }
  .fa-star:before {
    content: '\f005';
    font-size: 15px;
  }

  .fa-star-half-o:before {
    content: '\f123';
    font-size: 15px;
  }

  .fa-star-o:before {
    content: '\f006';
    font-size: 15px;
  }
}
@media (max-width: 767px) {
  .innner-detail {
    padding: 0;
  }
}
@media (max-width: 400px) {
  .product_name {
    min-height: 48px !important;
    font-size: 3.327vw;
    line-height: 2 !important;
  }
  .product_name a {
    font-size: 3.759vw;
    font-family: Arial;
  }
  /* .product-slide  .ratingInfo{
      margin-top: -19px;
  } */
}
.product-image {
  position: relative;
  /* width: 100%; */
  /* max-width: 100%; */
  /* height: 0; */
  mix-blend-mode: multiply;
  padding-right: 17px !important;
  padding-left: 17px !important;
}

.product-cover__thumb {
  padding-bottom: calc(240.44% / (276.5 / 115));
}
/* .margin{
  margin-top: 0px !important;
} */
.height {
  max-height: 48px !important;
  overflow: hidden;
}
@media (max-width: 767px) {
  .product-image {
    padding-right: 9px !important;
    padding-left: 9px !important;
  }
}
</style>
<style>
@media (max-width: 767px) {
  .recently-viewed-items-contain
    .product-recent-listing-carousel
    .VueCarousel
    .VueCarousel-navigation {
    opacity: 1 !important;
  }
  .recently-viewed-items-contain .VueCarousel-navigation-prev {
    width: 38px;
    height: 38px;
    left: 30px !important;
    right: auto;
  }
  .recently-viewed-items-contain .VueCarousel-navigation-next {
    width: 38px;
    height: 38px;
    right: 30px !important;
    left: auto;
  }
  .recently-viewed-items-contain .VueCarousel-navigation--disabled {
    opacity: 0 !important;
  }
}
</style>
<style>
 .btn-align {
    height: 100%;
    min-height: 115px;
}
@media (max-width: 767px){
   .btn-align {
      height: 100%;
    min-height: 116px !important;
}
}
</style>
