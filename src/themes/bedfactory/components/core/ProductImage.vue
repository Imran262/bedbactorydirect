<template>
  <div
    class="product-image image_label_two"
    :class=" [{'product-image--height': basic, 'product-image--width': !basic } , [customClass === true ? 'CustomProduct' : '']]"
    :style="style"
    v-on="$listeners"
  >
    <img
      v-show="showPlaceholder"
      :src="placeholderSvg"
      :alt="alt"
      class="product-image__placeholder"
    />
    <img
      v-if="!lowerQualityImageError || isOnline"
      v-show="showLowerQuality"
      v-lazy="image.loading"
      :alt="alt"
      @load="imageLoaded('lower', true)"
      @error="imageLoaded('lower', false)"
      ref="lQ"
      class="product-image__thumb"
      :src="image.src"
    />
    <img
      v-if="!highQualityImageError || isOnline"
      v-show="showHighQuality"
      v-lazy="image.src"
      :alt="alt"
      @load="imageLoaded('high', true)"
      @error="imageLoaded('high', false)"
      class="product-image__thumb"
      :src="image.src"
    />
    <div class="image_label_one" v-if="productImageLabel && productImageLabel !== '0' && productImageLabel.length>1">
      <img alt="Product Label" class="image_label" :src="backEnd+'/pub/media/'+productImageLabel" @error="imgPlaceholder"/>
    </div>
  </div>
</template>

<script>
import { onlineHelper, getThumbnailPath } from '@vue-storefront/core/helpers'
import config from 'config'
export default {
  data () {
    return {
      backEnd: config.backEnd,
      lowerQualityImage: false,
      lowerQualityImageError: false,
      highQualityImage: false,
      highQualityImageError: false,
      basic: true
    }
  },
  props: {
    calcRatio: {
      type: Boolean,
      default: true
    },
    image: {
      type: Object,
      default: () => ({
        src: '',
        loading: ''
      })
    },
    alt: {
      type: String,
      default: ''
    },
    productLabel: {
      type: [String, Array],
      default: ''
    },
    customClass: {
      type: Boolean,
      default: false

    },
    productImageLabel:{
      type:String,
      default:''
    }
  },
  watch: {
    lowerQualityImage (state) {
      if (state) {
        this.basic = this.$refs.lQ.naturalWidth < this.$refs.lQ.naturalHeight
      }
    }
  },
  computed: {
    getProductLabel () {
      return 'https://www.tilemountain.co.uk/img/120/120/resize/stockicon/stylish_savings.png'
      let productLabelStr = ''
      if (this.productLabel.length > 0 && Array.isArray(this.productLabel)) {
        productLabelStr = this.productLabel[0]
      } else {
        productLabelStr = this.productLabel
      }
      return getThumbnailPath(`/${productLabelStr}`, 120, 120, 'stockicon')
    },
    showPlaceholder () {
      return !this.showLowerQuality && !this.showHighQuality
    },
    showLowerQuality () {
      return this.lowerQualityImage && !this.showHighQuality
    },
    showHighQuality () {
      return this.highQualityImage
    },
    imageRatio () {
      const { width, height } = this.$store.state.config.products.gallery
      return `${height / (width / 100)}%`
    },
    style () {
      return this.calcRatio ? { paddingBottom: this.imageRatio } : {}
    },
    isOnline (value) {
      return onlineHelper.isOnline
    },
     placeholderSvg () {
      return config.images.productPlaceholder ? config.images.productPlaceholder : '/assets/placeholder.svg'
    }
  },
  mounted () {
    // console.log('alt', this.alt)
  },

  methods: {
    imgPlaceholder (e) {
      e.target.src = '/assets/placeholderLabel.png'
    },
    imageLoaded (type, success = true) {
      this[`${type}QualityImage`] = success
      this[`${type}QualityImageError`] = !success
    }
  }
};
</script>

<style lang="scss" scoped>
.product-lisitng-inner .image_label_one img{
  @media (min-width: 768px) and (max-width: 992px){
    width: 80%;
  }
}
.product-image {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 0;
  mix-blend-mode: multiply;
  &__placeholder,
  &__thumb {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__placeholder {
    max-width: 50%;
  }
  &--height {
    .product-image__thumb {
      height: 100%;
    }
  }
  &--width {
    .product-image__thumb {
      width: 100%;
    }
  }
}
.product-image__thumb {
  display: block !important;
}
.product-image--width .product-image__thumb {
  max-width: 100%;
}
.cutsample-box .product-image--width .product-image__thumb {
  width: auto;
  max-height: 200px;
  max-width: 100%;
}
.product-slider-sidebar .product-image__thumb {
  height: auto;
  width: auto;
  transform: none;
  position: relative;
  left: auto;
  top: auto;
}
.media-zoom-carousel__thumb .product-image .product-image__thumb {
  top: 50%;
  max-height: 250px;
}
.microcart {
  .products {
    padding: 0px;
    li {
      padding: 10px;
      .blend {
        flex: 0 0 110px;
      }
      img {
        max-height: 80px;
      }
    }
  }
}

li.media-zoom-carousel__thumb .image_label_two {
  padding-bottom: 0 !important;
}
.order-details img {
  max-height: 110px !important;
}
@media (max-width: 767px) {
  .product-image--width .product-image__thumb {
    transform: translate(-50%, -50%) !important;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
  }
  .product-image {
    mix-blend-mode: unset;
    padding-bottom: 88% !important;
  }
  .CustomProduct{
    padding-bottom: 100% !important;
  }
  .cutsample-box .product-image--width .product-image__thumb {
    width: auto;
    max-width: 100%;
  }
  li.media-zoom-carousel__thumb .image_label_two {
    padding-bottom: 88% !important;
  }
  .order-details img {
    max-height: 100% !important;
  }
}
.image_label {
  width : 120px;
  display: block;
  margin-left: auto;
  @media screen and (max-width: 767px) {
    width: 70%;
  }
}
.image_label_one {
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: none;
}
.cart-summary-product-table .image_label_two {
  position: relative;
  width: 15%;
  padding-bottom: 15% !important;
}

.cart-summary-product-table img {
  max-height: 60px !important;
}

.image_label_two {
  position: relative;
  opacity: 1 !important;
}

li.media-zoom-carousel__thumb .product-image {
  height: auto;
}
@media (min-width: 767px) and (max-width: 1200px) {
  .cart-summary-product-table img {
    max-height: 80px !important;
  }
}
@media (min-width: 767px) and (max-width: 1000px) {
  .cutsample-box .product-image--width .product-image__thumb {
    width: auto;
    max-height: 100%;
    max-width: 100%;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .product-slider .image_label_two {
    padding-bottom: 90% !important;
  }
}
@media (min-width: 991px) and (max-width: 1330px) {
  .product-image--width .product-image__thumb {
    max-height: 475px;
  }
}
</style>