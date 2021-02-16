<template>
  <div
    class="product align-center w-100 pb20 product-img-category" 
    v-observe-visibility="visibilityChanged"
  >
    <!-- {{ filters.brand }} -->
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
          class=" image-category product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </div>
      <p class="sb-prodcut-name name-size mb0 cl-accent mt10" v-if="!onlyImage">
        {{ product.name.toLowerCase() | htmlDecode }}
      </p>
      <!--  -->

      <div
        class="catstar review-size"
        v-if="reviewData && reviewData.bottomline.total_review <= 0"
      >
        <!-- {{ getReviews() }} -->
        <!-- {{reviewData.bottomline.total_review > 0}}
        {{reviewData.bottomline.total_review}} -->
      </div>
      <div class="catstar review-size" v-else>
        <!-- {{ getReviews().bottomline.average_score }}
        {{getReviews().bottomline.average_score
            ? parseFloat(getReviews().bottomline.average_score) : 0}} -->
        <!-- {{reviewData.bottomline.total_review > 0}}
        {{reviewData.bottomline.total_review}} -->

        <div
          class="rating"
          v-if="reviewData && reviewData.bottomline.total_review > 0"
        >
          <rating
            :score="
              reviewData.bottomline.average_score
                ? parseFloat(reviewData.bottomline.average_score)
                : 0
            "
          />
          <span class="TotalReviewStar"
            >({{ reviewData.bottomline.total_review }})</span
          >
        </div>
      </div>

      <div class="price-top">
        <span
          class="price-original mr5 lh30 cl-secondary old-price"
          v-if="
            product.special_price &&
            parseFloat(product.original_price_incl_tax) > 0 &&
            !onlyImage
          "
          >WAS{{ product.original_price_incl_tax | price }}<br />
        </span>
        <span
          class="price-special lh30 cl-accent weight-700"
          v-if="
            product.special_price &&
            parseFloat(product.special_price) > 0 &&
            !onlyImage
          "
          >NOW{{ product.price_incl_tax | price }}</span
        >
        <span
          class="sb-category-price original-price"
          v-if="
            !product.special_price &&
            parseFloat(product.price_incl_tax) > 0 &&
            !onlyImage
          "
          >{{ product.price_incl_tax | price }}</span
        >
      </div>
    </router-link>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store';
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts';
import config from 'config';
import ProductImage from './ProductImageCategory';
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist';
import AddToCompare from 'theme/components/core/blocks/Compare/AddToCompare';
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist';
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick';
import ReviewStars from 'src/modules/reviews-module/components/ReviewStars.vue';
import ReviewWidget from 'src/modules/reviews-module/components/ReviewWidget';
import Rating from 'theme/components/core/blocks/Reviews/Rating';
import axios from 'axios';
// import { log } from 'console';

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare, MeasureProductClick],
  components: {
    ProductImage,
    AddToWishlist,
    AddToCompare,
    ReviewStars,
    ReviewWidget,
    Rating
  },
  data() {
    return { reviewData: null, brandLogo: null };
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
    }
  },
  async serverPrefetch() {
    this.setReviews();
  },
  async mounted() {
    this.setReviews();
  },
  methods: {
    setReviews() {
      try {
        let product_Id = '';

        // if ((this.product.type_id = 'configurable')) {
        //   product_Id = this.product.parentId;
        // }
        product_Id = this.product.id;

        const URL = config.reviews.getReviews_endpoint + product_Id;
        //  console.log('URL is ', this.product);
        axios
          .get(URL)
          .then(res => {
            const response = res;
            if (response.status !== 200 && !review.data.length) {
              throw ('Error:', response.data[0].message);
            } else {
              this.reviewData = response.data[1];
            }
          })
          .catch(err => {
            throw ('Error:', err);
          });
      } catch (err) {
        console.error('error message', err);
      }
    },
    getReviews() {
      return this.reviewData;
    },
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
  beforeMount() {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate);
  },
  beforeDestroy() {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate);
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);
.image-category{
  // width: 300px;
  // height: 200px;
   top: 32% !important;
    
}
.TotalReviewStar {
  font-size: 13px;
  margin-top: 4px;
}
.rating ul {
  display: inline-flex;
  list-style: none;
  padding: 0;
}

.rating ul li .fa {
  color: #fdd055;
  font-size: 17px;
}

.rating {
  /* width: 100%; */
  display: inline-flex;
  /* text-align: right; */
  // margin-top: 14px;
  ul {
    margin-top: 15px !important;
    @media (min-width: 768px) and (max-width: 1199px) {
      margin-top: 0px !important;
    }
    @media screen and (max-width: 460px) {
      margin-top: 7px !important;
    }
  }

  @media screen and (max-width: 1199px) {
    text-align: left;
    /* width: 100%; */
  }
}
.price-top {
  border-top: 1px solid #dfe1e5;
  padding-top: 17px;
}
.original-price {
  margin: 16px;
}
.old-price {
  font-size: 12px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}
.brand-size {
  height: 30px;
}
.name-size {
  height: 55px;
}
.comfort-size {
  height: 30px;
}
.review-size {
 padding-top: 10px;
 height: 40px;
}
.price-size {
  height: 40px;
}
.color-soft {
  background-color: #f6a076 !important;
}
.color-medium-soft {
  background-color: #fa8a63 !important;
}
.color-medium {
  background-color: #cb6885 !important;
}
.color-medium-firm {
  background-color: #965177 !important;
}
.color-orthopaedic {
  background-color: #5b364c !important;
}
/* .rounded-button {
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0px 0px;
  cursor: pointer;
  border-radius: 25px;
  padding: 6px 31px 6px 30px;
} */
.rounded-button {
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0px 0px;
  cursor: pointer;
  border-radius: 25px;
  padding: 6px 23px 6px 23px;
  font-weight: bold;
  width: 169px;
}
@media (max-width: 1000px) and (min-width:768px ){
  .rounded-button{
    padding: 6px 6px 6px 6px;
    width: 150px;
  }
}
@media only screen and (max-device-width: 345px) and (min-device-width: 320px){
.rounded-button[data-v-10bab35f] {
    width: 121px !important;
    font-size: 10px !important;
}
}
.product {
  position: relative;
  margin-bottom: 10px;
  /* border-style: groove; */
  border: 1px solid #dfe1e5;
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
    /* font-size: 0.875rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: capitalize; */
    /* font-size: 1rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: capitalize; */
    font-size: 1.2rem;
    color: #54575b;
    font-family: "Poppins", sans-serif;
    /* font-weight: bold; */
    /* margin-bottom: 20px; */
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* autoprefixer: ignore next  */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
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
  margin: 3px 5px 0px 3px;

  &__thumb {
    padding-bottom: calc(165.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      padding-bottom: calc(198% / (276.5 / 100));
      margin-bottom: 0px;
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
  /* height: auto; */
  line-height: 1.4em;
  display: -ms-flexbox;
  display: flex;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  overflow: hidden;
  /* margin-bottom: 0px; */
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
    font-size: 1rem;
  }
  .rounded-button {
    width: 133px;
    font-size: 11px;
  }
  .name-size{
    height: 64px;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  /* .product .sb-prodcut-name {
    height: auto; 
  } */
}
</style>
<style>
.catstar .vue-star-rating-star {
  width: 22px;
  height: 22px;
  /* display:inline-flex !important; */
}

.catstar .vue-star-rating {
  display: inline-flex !important;
  float: inline !important;
}
</style>
<style lang="scss">
.product-img-category{
  .product-image{
     &__placeholder,
    &__thumb {
      top: 50%;
      
    }
  }
  @media screen and (max-width: 425px)
  {
    top:0%;
  
  }
  }
</style>