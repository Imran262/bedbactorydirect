<template>
  <div
    class="product-image"
    :class="{
      'product-image--height': basic,
      'product-image--width': !basic,
      'product-image--zoomed': zoomed,
    }"
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
    <div
      v-if="!highQualityImageError || isOnline"
      v-show="showHighQuality"
      ref="zoomElementMain"
      class="zoomElementMain"
    >
      <img
        :src="image.src"
        :alt="alt"
        @load="imageLoaded('high', true)"
        @error="imageLoaded('high', false)"
        class="product-image__thumb"
        ref="mainimage"
      />
    </div>
  </div>
</template>

<script>
import { onlineHelper } from "@vue-storefront/core/helpers";
import Panzoom from '@panzoom/panzoom'

export default {
  props: {
    calcRatio: {
      type: Boolean,
      default: true,
    },
    image: {
      type: Object,
      default: () => ({
        src: "",
        loading: "",
      }),
    },
    alt: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lowerQualityImage: false,
      lowerQualityImageError: false,
      highQualityImage: false,
      highQualityImageError: false,
      basic: true,
      zoomed: false,
      zoomFactor: 2,
    };
  },
  watch: {
    lowerQualityImage(state) {
      if (state) {
        this.basic = this.$refs.lQ.naturalWidth < this.$refs.lQ.naturalHeight;
      }
    },
    isActive() {
      this.zoomed = false;
    },
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
    },
  },
  mounted() {
    const imageZoom = this.$refs.zoomElementMain;
    const buttonPlus = document.getElementById('zoom-plus-icon')
    const buttonMinus = document.getElementById('zoom-minus-icon')
    const resetButton = document.getElementById('zoom-refresh-icon')
    const panzoom = Panzoom(imageZoom, {
      minScale: 1,
      maxScale: 3,
      transformOrigin: {x: 0.5, y: 0.5},
      panOnlyWhenZoomed: true
    })
    panzoom.reset()
    buttonPlus.addEventListener('click', panzoom.zoomIn)
    buttonMinus.addEventListener('click', panzoom.zoomOut)
    resetButton.addEventListener('click', panzoom.reset)
  },
  methods: {
    imageLoaded(type, success = true) {
      this[`${type}QualityImage`] = success;
      this[`${type}QualityImageError`] = !success;
    },
    toggleZoom(event) {
      if (!this.zoomed) {
        let normal = this.$refs.mainimage;
        normal.style.opacity = "0";
      } else {
        let normal = this.$refs.mainimage;
        normal.style.opacity = "1";
      }
      this.zoomed = !this.zoomed;
      this.calcZoomPosition(event);
    },
    calcZoomPosition(event) {
      if (this.zoomed) {
        let offset = this.pageOffset(this.$refs.mainimage);
        let zoom = this.$refs.zoomimage;
        let normal = this.$refs.mainimage;
        let relativeX = event.clientX - offset.x + window.pageXOffset;
        let relativeY = event.clientY - offset.y + window.pageYOffset;
        let normalFactorX = relativeX / normal.offsetWidth;
        let normalFactorY = relativeY / normal.offsetHeight;
        let x =
          normalFactorX *
          (zoom.offsetWidth * this.zoomFactor - normal.offsetWidth);
        let y =
          normalFactorY *
          (zoom.offsetHeight * this.zoomFactor - normal.offsetHeight);
        zoom.style.left = -x + "px";
        zoom.style.top = -y + "px";
      }
    },
    pageOffset(el) {
      let rect = el.getBoundingClientRect();
      let scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        y: rect.top + scrollTop,
        x: rect.left + scrollLeft,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.product-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: 0;
  mix-blend-mode: multiply;
  padding-bottom: 88% !important;
  &__placeholder,
  &__thumb {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // cursor: url("/assets/search-plus.png"), auto;
  }
  &__placeholder {
    max-width: 50%;
  }
  &--zoomed {
    cursor: url("/assets/search-minus.png"), auto;
  }
  &--height {
    .product-image__thumb {
      height: 100vh;
    }
  }
  &--width {
    .product-image__thumb {
      width: 100%;
    }
  }
}
.zoomed-image {
  position: absolute;
  transform-origin: top left;
  top: 0;
}
.invisible {
  visibility: hidden;
}

@media (min-width: 320px) and (max-width: 767px) {
.zoomElementMain{
position: absolute;
}
}
</style>
