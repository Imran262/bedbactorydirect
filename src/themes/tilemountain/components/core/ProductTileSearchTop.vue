<template>
  <div
    class="product align-center w-100 pb20 col-md-12 col-xs-12 maxwith"
    v-observe-visibility="visibilityChanged"
    @click="removeborders()"
  >
    <router-link
      class="block no-underline product-link"
      :to="productLinkNew"
      data-testid="productLink"
      @click.native="sendProductClick($vnode.key)"
    >
      <div class="detailsprod">
          <p class="mb0 cl-accent mt10 sub-cat-title" v-if="!onlyImage" :id="'id'+uniqueid">
            {{ product.title | htmlDecode }}
          </p>
      </div>
    </router-link>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store';
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts';
import config from 'config';
import ProductImage from './ProductImageSearchTop';
import rating from 'theme/components/core/blocks/Reviews/Rating';
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist';
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick';

export default {
  name: 'ProductTileSearchTop',
  mixins: [ProductTile, IsOnWishlist, IsOnCompare, MeasureProductClick],
  components: {
    ProductImage,
    rating
  },
  data () {
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
    },
    index: {
      type: Number,
      default: 0
    },
    product: {
      type: Object,
      required: false,
      default: () => { }
    },
    word: {
      type: String,
      required: true
    },
    serresult: {
      type: Array,
      required: true
    },
    uniqueid: {
      type: Number,
      required: true
    }
  },
  computed: {
    thumbnail () {
      let thumbnail = this.product.thumb_image ? this.product.thumb_image : null;
      return thumbnail ? this.getThumbnail(thumbnail, config.products.thumbnails.width, config.products.thumbnails.height) : '/assets/placeholder.jpg'
    },
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      };
    },
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border';
    },
    storeView () {
      return currentStoreView();
    },
    productTileType () {
      return config.tileTypes;
    },
    productLinkNew () {
      if (this.product && this.product.url) {
        let urlMaking = this.product.url;
        if (urlMaking) {
          return '/' + urlMaking;
        }
      }
      return '#';
    }
  },
  methods: {
    productTileTypeUnitCheck (product) {
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
    },
      highlightText () {
        
        // this.product.title.includes(this.word)
        // this.word.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        // // let searchitem = this.word.charAt(0).toUpperCase() + this.word.slice(1);
        // console.log("this is hamza" ,this.product.title , 'word' , this.product.title.includes(this.word.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')) , this.word)
        // console.log("this is ali" , this.word.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '))
        const text = this.product.title; //The actual text to compair the value against

    var value = this.word.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '); //The input value
    var startingIndex = text.indexOf(value); //The string index where the value begins in the paragraph
    // console.log("its bahadur" , this.word , startingIndex!=-1 , startingIndex , value , text)
  if (startingIndex != -1) { //If the value is within the text
    var endingIndex = startingIndex+value.length; //The string index where the value ends is just the length of the value added to the starting index
  
    var highlightedText = text.slice(0,startingIndex); //The text from the beginning to the start of the highlight
    highlightedText += "<span style=\"color:green; font-weight: Bold; color: #2d2b5e;\">"; //Add the HTML which will cause the highlight
    highlightedText += text.slice(startingIndex,endingIndex); //Add the text to highlight
    highlightedText += "</span>"; //Add the HTML which will cause the end of the highlight
    highlightedText += text.slice(endingIndex); //Add the remaining text
    // document.getElementById("prodname").innerHTML =''
    let getelement = 'id'+this.uniqueid;
    document.getElementById(getelement).innerHTML = highlightedText; ; //Set the HTML of the paragraph to be the new, highlighted string that we made.
    
  }
  
},
    onProductPriceUpdate (product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product);
      }
    },
    removeborders () {
      this.$emit('removeborders');
    },
    visibilityChanged (isVisible, entry) {
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
    },
  },
  beforeMount () {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate);
  },
  beforeDestroy () {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate);
  },
    watch: {
    serresult: {
      handler () {
          this.highlightText();
        }
      },
        word: {
      handler () {
        this.highlightText();
         }
      }
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
.product-cover {
  width: 30%;
  float: left;
}
.detailsprod {
  margin: 0 2px !important;
}

@media (max-width: 767px) {
  .detailsprod {
    margin: 0 60px !important;
  }
}
@media screen and (max-width: 767px) and (min-width: 375px) {
  .sub-cat-title {
    font-size: 16px !important;
  }
}

.sub-cat-title {
  width: 100%;
  text-align: left;
  padding-bottom: 6px;
  margin-bottom: 0px;
  margin-top: 7px;
  color: #8f8d8d;
  font-family: "Arial";
  font-size: 16px;
  font-weight: normal;

}
.product {
  position: relative;
  @media (max-width: 767px) {
    padding-bottom: 10px;
  }
}
@media screen and (min-width: 768px) and (max-width: 991px){
  .sub-cat-title {
    font-size: 15px !important;
  }
}
</style>
<style lang="scss">
.maxwith .product-image__thumb {
  max-height: 100% !important;
}

</style>
