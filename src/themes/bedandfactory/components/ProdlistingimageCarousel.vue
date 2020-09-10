<template>
  <div :style="style" v-on="$listeners">
    <img v-show="showPlaceholder" src="/assets/placeholder.svg" :alt="alt">
    <img
      v-if="!lowerQualityImageError || isOnline"
      v-show="showLowerQuality"
      :src="image.loading"
      :alt="alt"
      @load="imageLoaded('lower', true)"
      @error="imageLoaded('lower', false)"
      ref="lQ"
    >
    <img
      v-if="!highQualityImageError || isOnline"
      v-show="showHighQuality"
      :src="image.src"
      :alt="alt"
      @load="imageLoaded('high', true)"
      @error="imageLoaded('high', false)"
    >
  </div>
</template>

<script>
import { onlineHelper } from '@vue-storefront/core/helpers';

export default {
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
    }
  },
  data() {
    return {
      lowerQualityImage: false,
      lowerQualityImageError: false,
      highQualityImage: false,
      highQualityImageError: false,
      basic: true
    };
  },
  watch: {
    lowerQualityImage(state) {
      if (state) {
        this.basic = this.$refs.lQ.naturalWidth < this.$refs.lQ.naturalHeight;
      }
    }
  },
  computed: {
    showPlaceholder() {
      return !this.showLowerQuality && !this.showHighQuality;
    },
    showLowerQuality() {
      return this.lowerQualityImage && !this.showHighQuality;
    },
    showHighQuality() {
      return this.highQualityImage;
    },
    imageRatio() {
      const { width, height } = this.$store.state.config.products.gallery;
      return `${height / (width / 100)}%`;
    },
    style() {
      return this.calcRatio ? { paddingBottom: this.imageRatio } : {};
    },
    isOnline(value) {
      return onlineHelper.isOnline;
    }
  },
  methods: {
    imageLoaded(type, success = true) {
      this[`${type}QualityImage`] = success;
      this[`${type}QualityImageError`] = !success;
    }
  }
};
</script>

<style scoped>
.product-similar-listing-carousel img {
  width: 125px;
  padding: 0;
  position: relative !important;
  max-width: 100% !important;
}
.product-image .product-cover__thumb {
  padding: 0;
}
.popup-sliders .VueCarousel .product-cover__thumb{
  width: 140px;
  margin-left: 15px;
  margin-right: 15px;
}
.popup-sliders .VueCarousel .product-cover__thumb img{
  width: 100%;
}

.product-recent-listing-carousel .product-image .product-cover__thumb {
  margin: 0 auto;
  padding: 0 15px;
}
.product-recent-listing-carousel img {
  padding: 0;
  position: relative !important;
  width: 100%;;
  max-height: 205px;
}
@media(max-width: 767px){
  .popup-sliders .VueCarousel .product-cover__thumb{
    width: 100%;
  }
  .product-similar-listing-carousel img {
    width: 50%;
  }
}
</style>
