<template>
  <div class="product-slide">
    <div class="product-image" ref="successProductImage">
      <router-link
        class="block no-underline product-link slider-custom-link"
        v-if="changeRouterLinkAddress"
        :to="changeRouterLink == 'abc' ? productLink : productLink + changeRouterLink"
        data-testid="productLink"
      >
        <prodlistingimage-carousel
          class="product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </router-link>
      <div class="slider-inner-detail">
        <router-link
          class="block no-underline product-link slider-custom-link"
          v-if="changeRouterLinkAddress"
          :to="changeRouterLink == 'abc' ? productLink : productLink + changeRouterLink"
          data-testid="productLink"
        >
          <p v-if="!onlyImage">{{ product.name | htmlDecode }}</p>
          <span class="recently-viewed-price-container">
            <span
              class="price-original mr5 lh30 cl-secondary"
              v-if="
                product.special_price &&
                  parseFloat(product.original_price_incl_tax) > 0 &&
                  !onlyImage
              "
            >{{ product.original_price_incl_tax | price }}</span>

            <span
              class="price-special lh30 cl-accent weight-700"
              v-if="
                product.special_price &&
                  parseFloat(product.special_price) > 0 &&
                  !onlyImage
              "
            >{{ product.price_incl_tax | price }}</span>

            <span
              class="sb-category-price lh30"
              v-if="
                !product.special_price &&
                  parseFloat(product.price_incl_tax) > 0 &&
                  !onlyImage
              "
            >{{ product.price_incl_tax | price }}</span>
          </span>
        </router-link>
      </div>
      <btn-carousel
        :product="product"
        :disabled="isAddToCartDisabled"
        :success-id="product.sku"
        class="addtocart-carousel-btn"
      />
    </div>
    <div
      class="success-similar-addtocart hidden"
      :data-success-attribute="product.sku"
      ref="successSimilar"
    >
      <div class="success-similar-content-main">
        <div class="similar-success-tick">
          <img src="/assets/checkout-non-selected-tick.png" />
        </div>
        <div class="similar-success-prod-name">
          <span>{{ product.name }}</span> - is added to your cart
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store';
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts';
import config from 'config';
import ProdlistingimageCarousel from 'theme/components/ProdlistingimageCarousel';
import BtnCarousel from 'theme/components/BtnCarousel';

export default {
  mixins: [ProductTile],
  components: {
    ProdlistingimageCarousel,
    BtnCarousel
  },
  data() {
    return {
      changeRouterLink: ''
    };
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
        loading: this.thumbnail
      };
    },
    favoriteIcon() {
      return this.isOnWishlist ? 'favorite' : 'favorite_border';
    },
    isAddToCartDisabled() {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      );
    },
    changeRouterLinkAddress() {
      console.log('productArray ', this.product);
      console.log('VariantUrlCheckCarousel', this.product.variant_url);
      if (
        this.product.variant_url != '' &&
        this.product.variant_url != undefined &&
        this.product.variant_url != null
      ) {
        console.log('NotEmptyPTryingCarousel');
        this.changeRouterLink = this.product.variant_url;
      } else {
        console.log('EmptyTryingCarousel');
        this.changeRouterLink = 'abc';
      }
      return this.changeRouterLink;
    }
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
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku];
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id];
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku);
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }); // store it in the cache
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      this.$refs.successSimilar.classList.remove('active');
      this.$refs.successProductImage.classList.remove('hidden');
      this.show = false;
    }
  },
  beforeMount() {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate);
  },
  beforeDestroy() {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate);
  }
};
</script>

<style scoped>
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
.product-slide {
  text-align: center;
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
.product-recent-listing-carousel .product-slide p {
  /* background: #eceff5; */
  width: 90%;
  margin: 0 auto;
  padding: 5px 0px;
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
</style>
