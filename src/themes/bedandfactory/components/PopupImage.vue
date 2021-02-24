<template>
  <div
    class="product-image popupproduct-image-component"
    :class="{ 'product-image--height': basic, 'product-image--width': !basic }"
    :style="style"
    v-on="$listeners"
  >
    <img
      v-show="showPlaceholder"
      src="/assets/placeholder.svg"
      :alt="alt"
      :comeid="comeid"
      class="product-image__placeholder"
    />
    <img
      v-if="!lowerQualityImageError || isOnline"
      v-show="showLowerQuality"
      :src="image.loading"
      :alt="alt"
      :comeid="comeid"
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
      :comeid="comeid"
      @load="imageLoaded('high', true)"
      @error="imageLoaded('high', false)"
      class="product-image__thumb"
    />
  </div>
</template>

<script>
import { onlineHelper } from "@vue-storefront/core/helpers";

export default {
  props: {
    calcRatio: {
      type: Boolean,
      default: true
    },
    image: {
      type: Object,
      default: () => ({
        src: "",
        loading: ""
      })
    },
    alt: {
      type: String,
      default: ""
    },
    comeid: {
      type: String,
      default: ""
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
      width: 50%;
    }
  }
}
.popupproduct-image-component {
  padding: 0 !important;
  height: auto;
}
.left-side.popup_item-image .popupproduct-image-component img {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
}
@media (max-width: 767px) {
  .product-image__placeholder {
    max-width: 100%;
    position: relative;
    top: 0;
    left: 0;
  }
}
</style>
