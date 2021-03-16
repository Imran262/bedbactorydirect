<template>
  <div class="category-image product-cover__thumb product-image" v-on="$listeners">
    <img
      v-show="showPlaceholder"
      v-if="categoryIndex < 4"
      :alt="alt"
      :data-src="getCategoryLink.src"
      :src="getCategoryLink.src"
      class="category-image_thumb"
    >
    <img
      v-show="showPlaceholder"
      v-else
      :alt="alt"
      v-lazy="getCategoryLink.src"
      :src="getCategoryLink.src"
      loading="lazy"
      class="category-image_thumb"
    >
    <div class="category-label-image" v-if="label">
      <img v-if="categoryIndex < 4" class="image_label" :src="getCategoryLabel" alt="category label" />
      <img v-else class="image_label" v-lazy="getCategoryLabel" alt="category label" />
    </div>
  </div>
</template>

<script>
import { onlineHelper, getThumbnailPath } from '@vue-storefront/core/helpers';
export default {
  props: {
    image: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    label: {
      type: [String, Array],
      default: ''
    },
    categoryIndex: {
      type: [String, Number],
      default: 0,
      required: false
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
    getCategoryLink () {
      if (this.image === '' || this.image === 'null' || this.image === null) {
        return '/assets/placeholder.svg';
      }
      const getCategoryLinkObjMain = getThumbnailPath(`/${this.image}`, 235, 235, 'category');
      let getCategoryLinkObj = { src: getCategoryLinkObjMain, error: '/assets/placeholder.svg', loading: '/assets/loading.gif' }
      return getCategoryLinkObj;
    },
    getCategoryLabel () {
      let catLabelStr = ''
      if (this.label.length > 0 && Array.isArray(this.label)) {
        catLabelStr = this.label[0]
      } else {
        catLabelStr = this.label
      }
      return getThumbnailPath(`/${catLabelStr}`, 120, 120, 'stockicon');
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
    }
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
.product-cover {
  overflow: hidden;

  &__thumb {
    padding-bottom: calc(143.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      padding-bottom: calc(240.44% / (276.5 / 115));
    }
  }
}
.category-label-image{
  img{
    position: absolute;
    top: 0;
    right: 0;
    width: 50% !important;
  }
}
</style>
