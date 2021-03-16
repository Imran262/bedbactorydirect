<template>
  <div class="cutsample-box">
    <router-link
      :to="productLink"
      data-testid="productLink"
    >
    <product-image
      class="product-cover__thumb"
      :image="thumbnailObj"
      :alt="product.name | htmlDecode"
      :calc-ratio="false"
      data-testid="productImage"
      :product-label="product.product_banner_image"
    />
    </router-link>
    <div class="infoproduct">
    <h3>{{ product.name }}</h3>
    <p v-if="product.size">
      Size: {{ product.size }}
    </p>
    <div class="rating">
      <h4 v-if="product.qty_per_sqm">
        Now £ {{ getPerSqmPrice }} /sqm
      </h4>
      <div class="stars">
        <rating
          :ul-class="`cursor-pointer`"
          :score="product.average_score? parseFloat(product.average_score): 0"
        />
        <span>({{ product.total_reviews }})</span>
      </div>
    </div>
    </div>
    <router-link
      class="product_btn"
      :to="productLink"
      data-testid="productLink"
    >
      <b>VIEW</b>
    </router-link>
  </div>
</template>
<script>
import rootStore from '@vue-storefront/core/store';
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts';
import config from 'config';
import rating from 'theme/components/core/blocks/Reviews/Rating';
import ProductImage from 'theme/components/core/ProductImage';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'Product',
  components: {
    rating,
    ProductImage
  },
  data () {
    return {
      changeRouterLink: ''
    };
  },
  props: {
    product: {
      type: Object,
      required: false,
      default: null
    }
  },
  mixins: [ProductTile],
  computed: {
    getPerSqmPrice () {
      return this.product.calculated_sqm_price
    },
    thumbnail () {
      let thumbnail = productThumbnailPath(this.product)
      return this.getThumbnail(thumbnail, config.products.thumbnails.width, config.products.thumbnails.height)
    },
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      };
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    }
  }
}
</script>
<style lang="scss" scoped>
.infoproduct{
  height: 100%;
  min-height: 140px;
  @media(max-width: 767px){
    min-height: 160px;
  }
}
.cutsample-box {
  padding: 0px 10px;
  .image_label_two {
    position: relative;
    padding-bottom: calc(240.44% / (276.5 / 115));
    background: #f2f2f2;
    overflow: hidden;
  }
  img {
    width: 100%;
  }

  h3 {
    color: #29275b;
    text-align: left;
    line-height: 2;
    font-size: 13px;
    font-weight: 500;
    margin: 10px 0 0 0;
    font-family: Arial, Helvetica, sans-serif;
    min-height: 51px;
  }

  p {
    color: #29275b;
    text-align: left;
    line-height: 2;
    font-size: 12px;
    margin: 0px;
    font-weight: 500;
    font-family: Arial, Helvetica, sans-serif;
  }

  .rating {
    margin-bottom: 40px;
    h4 {
      color: #29275b;
      text-align: left;
      line-height: 0;
      font-weight: bold;
      font-size: 11px;
      font-family: Arial, Helvetica, sans-serif;
      float: left;
    }

    .stars {
      float: right;
      margin-top: 4px;
      ul{
        margin: 2px 2px 0 0px;
      }
      ul, span{
        float: left;
      }

      span {
        color: #7e7979;
        font-size: 10px;
        position: relative;
        top: 5px;
      }
    }
  }

  .product_btn {
    width: 100%;
    background-color: #29275b;
    border: none;
    color: white;
    border-radius: 3px;
    display: block;
    text-align: center;
    padding: 10px 0px;
    font-size: 14px;

    &:hover {
      border: none;
    }
  }
  a.underline:after, a:not(.no-underline):hover:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: transparent;
  }
}

@media(max-width: 370px) {
  .cutsample-box .rating h4 {
    font-size: 12px;
  }
  .cutsample-box .rating .stars span {
    color: #7e7979;
    font-size: 12px;
    top: 7px;
  }
  .cutsample-box .rating .stars {
    margin-top: 0px;
    float: left;
  }
  .rating {
    margin-bottom: 60px !important;
  }
}
@media(min-width: 370px) and (max-width: 423px) {
  .cutsample-box .rating h4 {
    font-size: 9px;
  }
  .cutsample-box .rating .stars span {
    color: #7e7979;
    font-size: 8px;
    top: 7px;
  }
  .cutsample-box .rating .stars {
    margin-top: 0px;
  }
  .rating {
    margin-bottom: 30px !important;
  }
  .cutsample .rating h4{
    font-size: 8px;
  }
 .cutsample .rating .stars ul{
    margin: 0px 2px 0 0px;
  }
}
</style>
