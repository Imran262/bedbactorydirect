<template>
  <div class="media-gallery">
    <div v-if="product.product_banner_image || isOnline " class="relative w-100">
      <product-gallery-overlay
        v-if="isZoomOpen"
        :current-slide="currentSlide"
        :product-name="product.name"
        :gallery="gallery"
        :customer-gallery="customerGallery"
        :product="product"
        @close="toggleZoom"
      />
      <no-ssr>
        <product-gallery-carousel
          v-if="showProductGalleryCarousel"
          :gallery="gallery"
          ref="carousel"
          :configuration="configuration"
          :product-name="product.name"
          @toggle="openOverlay"
          @close="onEscapePress"
          @loaded="carouselLoaded = true"
          @pageChange="onPageChange"
          :product-label="product.product_banner_image"
          :imagelength="imagelength"
          :gallery-zoom="galleryZoom"
          :customer-gallery="customerGallery"
        />
      </no-ssr>
    </div>
    <product-image v-else :image="offline" :product-label="product.product_banner_image"/>
  </div>
</template>

<script>
import { ProductGallery } from '@vue-storefront/core/modules/catalog/components/ProductGallery.ts'
import ProductGalleryOverlay from './ProductGalleryOverlay'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import NoSSR from 'vue-no-ssr'
import ProductImage from './ProductImage'
import { onlineHelper } from '@vue-storefront/core/helpers'
import ProductGalleryCarousel from './ProductGalleryCarousel.vue'

export default {
  components: {
    ProductGalleryCarousel,
    'no-ssr': NoSSR,
    ProductGalleryOverlay,
    ProductImage
  },
  mixins: [
    ProductGallery,
    onEscapePress
  ],
  watch: {
    '$route': 'validateRoute'
  },
  data () {
    return {
      isZoomOpen: false,
      showProductGalleryCarousel: false,
      currentSlide: 0,
      carouselLoaded: false
    }
  },
  mounted () {
    this.showProductGalleryCarousel = true
  },
  computed: {
    productLabelImage () {
      return product.product_banner_image;
    },
    isOnline (value) {
      return onlineHelper.isOnline
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
    imagelength:{
      type: Number,
      required: false
    }
  },
  methods: {
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
      this.$emit('page-change', page);
    }
  }
}
</script>

<style lang="scss" scoped>
.media-gallery {
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  min-height: calc(90vw * 1.1);

  @media only screen and (min-width:768px) {
    min-height: inherit;
    margin-top: 3px;
  }

  &--loaded {
    background-image: none;
  }
}
</style>
