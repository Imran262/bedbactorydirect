<template>
  <div class="media-gallery">
    <div v-if="product.product_banner_image || isOnline " class="relative w-100">
      <!-- <product-gallery-overlay
        v-if="isZoomOpen"
        :current-slide="currentSlide"
        :product-name="product.name"
        :gallery="gallery"
        :customer-gallery="customerGallery"
        :product="product"
        @close="toggleZoom"
      /> -->
        <product-gallery-carousel
          v-if="showProductGalleryCarousel && rendered"
          :gallery="gallery"
          ref="carousel"
          :configuration="configuration"
          :product-name="product.name"
          @toggle="openOverlay"
          @close="onEscapePress"
          @loaded="carouselLoaded = true"
          @pageChange="onPageChange"
          :product-label="product.product_banner_image"
          :is-bundle-item="isBundleP"
          :imagelength="imagelength"
          :gallery-zoom="galleryZoom"
          :customer-gallery="customerGallery"
        />
  
      <div v-for="(image, index) in selectedBundleOptionImages" :key="index" class="bundle-products-thumbs">
        <img v-if="image" :src="image" :alt="index">
      </div>
    </div>
    <product-image v-else :image="offline" :product-label="product.product_banner_image"/>
    <!-- <div class="number-on-mobile">
      <div class="number-text">
        <p>
          <span>{{ parseInt(page) + 1 }} / {{ gallery.length }}</span>
        </p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ProductGallery } from '@vue-storefront/core/modules/catalog/components/ProductGallery.ts'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import NoSSR from 'vue-no-ssr'
import ProductImage from './ProductImage'
import { getThumbnailPath, onlineHelper } from '@vue-storefront/core/helpers'
import ProductGalleryCarousel from './ProductGalleryCarousel.vue'

export default {
  components: {
    ProductGalleryCarousel,
    'no-ssr': NoSSR,
    ProductImage
  },
  mixins: [
    ProductGallery,
    onEscapePress
  ],
  watch: {
    '$route': 'validateRoute',
    prodId (newId, prevId) {
      if (newId !== prevId) {
        this.selectedBundleOptionImages = null
      }
    },
    currentRoute (old,newroute) {
        this.rendered = false;
        this.page = 0
        this.$nextTick(() => {
          this.rendered = true;
        });
    }
  },
  data () {
    return {
      isZoomOpen: false,
      rendered : true,
      showProductGalleryCarousel: true,
      currentSlide: 0,
      carouselLoaded: false,
      selectedBundleOptionImages: null,
      page: 0
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-bundleoptions', this.bundleOptionUpdated)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-bundleoptions', this.bundleOptionUpdated)
  },

  computed: {
    prodId () {
      return this.product.id
    },
    productLabelImage () {
      return this.product.product_banner_image;
    },
    currentRoute () {
        return this.$route.path
    },

    isOnline (value) {
      return onlineHelper.isOnline
    },
    isBundleP () {
      return this.product.bundle_options && this.product.bundle_options.length > 0
    }
  },
  props: {
    customerGallery: {
      type: Array,
      required: true
    },
    galleryZoom: {
      type: Array,
      required: true
    },
    imagelength: {
      type: Number,
      required: false
    },
    currentGalleryPage: {
      type: [Number, String],
      required: false
    }
  },
  methods: {
    bundleOptionUpdated (updatedValue) {
      if (this.isBundleP && !updatedValue.option.title.includes('Underfloor')) {
        let bundleOption = updatedValue.option;
        let selectedOption = updatedValue.optionValues?.['bundleOption_' + bundleOption.option_id];
        let selectedProduct = selectedOption ? selectedOption.value?.product : '';
        if (selectedProduct && selectedProduct.thumbnail) {
          if (selectedProduct.thumbnail !== 'no_selection') {
            this.selectedBundleOptionImages = { [updatedValue.option.title]: getThumbnailPath(selectedProduct.thumbnail, 80, 80) }
          } else {
            this.selectedBundleOptionImages = { [updatedValue.option.title]: '' }
          }
        }
      }
      return null;
    },
    openOverlay (currentSlide) {
      this.currentSlide = currentSlide
      this.toggleZoom()
    },
    validateRoute () {
      this.$forceUpdate()
    },
    toggleZoom () {
      this.isZoomOpen = !this.isZoomOpen
    },
    onEscapePress () {
      if (this.isZoomOpen) {
        this.toggleZoom()
      }
    },
    onPageChange (page) {
      this.page = page
      this.$emit('page-change', page);
    }
  }
}
</script>

<style lang="scss" scoped>
.bundle-products-thumbs{
  display: inline-block;
  position: absolute;
  bottom: 9rem;
  right: 0;
}

@media only screen and (max-width: 450px) {
  .bundle-products-thumbs {
    bottom: 4rem;
  }
}
.media-gallery {
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  min-height: calc(90vw * 1.1);
  position: relative;
  @media (max-width: 480px){
    min-height: calc(80vw * 1.1);
  }

  @media only screen and (min-width:768px) {
    min-height: inherit;
    margin-top: 3px;
  }

  &--loaded {
    background-image: none;
  }
}
// div.number-on-mobile {
//   display: block;
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   background: rgba(255, 255, 255, 0.5);
//   @media only screen and (min-width:768px) {
//     display: none;
//   }
// }
// .number-on-mobile p {
//   margin: 0;
// }
// div.number-on-mobile span {
//   width: 100%;
//   padding: 8px 0px;
//   background: rgba(255, 255, 255, 0.5);
//   font-size: 12px;
//   color: #29275b;
//   font-weight: bold;
//   display: block;
// }
</style>
