<template>
  <div
    class="product-image image_label_two"
    :class="{ 'product-image--height': basic, 'product-image--width': !basic }"
    :style="style"
    v-on="$listeners"
  >
    <img
      v-show="showPlaceholder"
      src="/assets/placeholder.svg"
      :alt="alt"
      class="product-image__placeholder"
    />
    <img
      v-if="!lowerQualityImageError || isOnline"
      v-show="showLowerQuality"
      :src="image.loading"
      :alt="alt"
      @load="imageLoaded('lower', true)"
      @error="imageLoaded('lower', false)"
      ref="lQ"
      class="product-image__thumb"
    />
    <img
      v-if="!highQualityImageError || isOnline"
      v-show="showHighQuality"
      :src="image.src"
      :alt="alt"
      @load="imageLoaded('high', true)"
      @error="imageLoaded('high', false)"
      class="product-image__thumb"
    />
    <div class="image_label_one" v-if="productLabel">
      <img class="image_label" :src="getProductLabel" alt="product label"/>
    </div>
  </div>
</template>

<script>
import { onlineHelper, getThumbnailPath } from '@vue-storefront/core/helpers';

export default {
  name: 'ProductImageMicroCart',
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
      type: String,
      default: ''
    }
  },
  data () {
    return {
      lowerQualityImage: false,
      lowerQualityImageError: false,
      highQualityImage: false,
      highQualityImageError: false,
      basic: true
    };
  },
  watch: {
    lowerQualityImage (state) {
      if (state) {
        this.basic = this.$refs.lQ.naturalWidth < this.$refs.lQ.naturalHeight;
      }
    }
  },
  computed: {
    getProductLabel () {
      return getThumbnailPath(`/${this.productLabel}`, 350, 350, 'stockicon');
    },
    showPlaceholder () {
      return !this.showLowerQuality && !this.showHighQuality;
    },
    showLowerQuality () {
      return this.lowerQualityImage && !this.showHighQuality;
    },
    showHighQuality () {
      return this.highQualityImage;
    },
    imageRatio () {
      const { width, height } = this.$store.state.config.products.gallery;
      return `${height / (width / 100)}%`;
    },
    style () {
      return this.calcRatio ? { paddingBottom: this.imageRatio } : {};
    },
    isOnline (value) {
      return onlineHelper.isOnline;
    },
  },
  methods: {
    imageLoaded (type, success = true) {
      this[`${type}QualityImage`] = success;
      this[`${type}QualityImageError`] = !success;
    }
  }
};
</script>

<style lang="scss" scoped>
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

.product-image--width .product-image__thumb {
  width: auto;
  max-height: 100%;
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
    max-height: 100%;
    transform: translate(-50%, -50%) !important;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
  }
  .product-image {
    mix-blend-mode: unset;
    padding-bottom: 88% !important;
  }
  .cutsample-box .product-image--width .product-image__thumb {
    width: auto;
    max-height: 100%;
    max-width: 100%;
  }
  li.media-zoom-carousel__thumb .image_label_two {
    padding-bottom: 88% !important;
  }
  .order-details img {
    max-height: 100% !important;
  }
}

//@media(min-width: 767px) and (max-width: 991px){
//  .product-slider .product-image--width .product-image__thumb {
//    max-height: 308px;
//  }
//}
//@media(min-width: 991px) and (max-width: 1200px){
//  .product-slider .product-image--width .product-image__thumb {
//    max-height: 450px;
//  }
//}
//@media(min-width: 1200px) and (max-width: 1320px){
//  .product-slider .product-image--width .product-image__thumb {
//    max-height: 577px;
//  }
//}
.image_label {
  display: block;
  margin-left: auto;
  width: 35%;
}

.image_label_one {
  position: absolute;
  right: 0;
  top: 0;
}

.cart-summary-product-table .image_label_two {
  position: relative;
  width: 25%;
  padding-bottom: 25% !important;
}

.cart-summary-product-table img {
  max-height: 120px !important;
}

.image_label_two {
  position: relative;
}

li.media-zoom-carousel__thumb .product-image {
  height: auto;
}

@media(min-width: 767px) and (max-width: 1200px) {
  .cart-summary-product-table img {
    max-height: 80px !important;
  }
}

@media(min-width: 767px) and (max-width: 1000px) {
  .cutsample-box .product-image--width .product-image__thumb {
    width: auto;
    max-height: 100%;
    max-width: 100%;
  }
}

@media(min-width: 767px) and (max-width: 991px) {
  .product-slider .image_label_two {
    padding-bottom: 90% !important;
  }
}

@media(min-width: 991px) and (max-width: 1330px) {
  .product-image--width .product-image__thumb {
    max-height: 475px;
  }
}
</style>
