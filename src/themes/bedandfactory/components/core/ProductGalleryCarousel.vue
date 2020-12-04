<template>
  <div class="media-gallery-carousel">
    <carousel
      :per-page="1"
      :mouse-drag="false"
      :navigation-enabled="true"
      pagination-active-color="#828282"
      pagination-color="transparent"
      navigation-next-label="<i class='material-icons p15 cl-bg-tertiary pointer'>keyboard_arrow_right</i>"
      navigation-prev-label="<i class='material-icons p15 cl-bg-tertiary pointer'>keyboard_arrow_left</i>"
      ref="carousel"
      :speed="carouselTransitionSpeed"
      @pageChange="pageChange"
    >
      <slide v-for="(images, index) in gallery" :key="images.src">
        <div
          class="product-image-container"
          :class="{ 'video-container w-100 h-100 flex relative': images.video }"
        >
          <product-image
            v-show="hideImageAtIndex !== index"
            @dblclick="openOverlay"
            class="pointer image"
            @click="openOverlay"
            :image="images"
            :alt="productName | htmlDecode"
          />
          <product-video
            v-if="images.video && index === currentPage"
            v-bind="images.video"
            :index="index"
            @video-started="onVideoStarted"
          />
        </div>
      </slide>
    </carousel>
    <i
      class="zoom-in material-icons p15 cl-bgs-tertiary pointer"
      @click="openOverlay"
      >zoom_in</i
    >
  </div>
</template>

<script>
import config from "config"
import { Carousel, Slide } from "vue-carousel"
import ProductImage from "./ProductImage"
import ProductVideo from "./ProductVideo"
import reduce from "lodash-es/reduce"
import map from "lodash-es/map"

export default {
  name: "ProductGalleryCarousel",
  components: {
    Carousel,
    Slide,
    ProductImage,
    ProductVideo
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    productName: {
      type: String,
      default: ""
    },
    configuration: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      carouselTransition: true,
      carouselTransitionSpeed: 0,
      currentColor: 0,
      currentPage: 0,
      hideImageAtIndex: null
    }
  },
  computed: {},
  beforeMount() {
    this.$bus.$on("filter-changed-product", this.selectVariant)
    this.$bus.$on("product-after-load", this.selectVariant)
  },
  mounted() {
    this.selectVariant()

    if (this.configuration.color) {
      const { color } = this.configuration
      this.currentColor = color.id
    }

    this.$emit("loaded")
  },
  beforeDestroy() {
    this.$bus.$off("filter-changed-product", this.selectVariant)
    this.$bus.$off("product-after-load", this.selectVariant)
  },
  methods: {
    navigate(index) {
      if (this.$refs.carousel) {
        this.$refs.carousel.goToPage(index)
      }
    },
    selectVariant() {
      if (config.products.gallery.mergeConfigurableChildren) {
        const option = reduce(
          map(this.configuration, "attribute_code"),
          (result, attribute) => {
            result[attribute] = this.configuration[attribute].id
            return result
          },
          {}
        )
        if (option) {
          let index = this.gallery.findIndex(
            obj =>
              obj.id &&
              Object.entries(obj.id).toString() ===
              Object.entries(option).toString(),
            option
          )
          if (index < 0)
            index = this.gallery.findIndex(
              obj => obj.id && obj.id.color === option.color
            )
          this.navigate(index)
        }
      }

      this.$emit("close")
    },
    openOverlay() {
      const currentSlide = this.$refs.carousel.currentPage
      this.$emit("toggle", currentSlide)
    },
    switchCarouselSpeed() {
      const { color } = this.configuration
      if (color && this.currentColor !== color.id) {
        this.currentColor = color.id
        this.carouselTransitionSpeed = 0
      } else {
        this.carouselTransitionSpeed = 500
      }
    },
    pageChange(index) {
      this.switchCarouselSpeed()

      this.currentPage = index
      this.hideImageAtIndex = null
    },
    onVideoStarted(index) {
      this.hideImageAtIndex = index
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
.media-gallery-carousel {
  position: relative;
  text-align: center;
  height: 100%;
}
.media-gallery-carousel .zoom-in {
  position: absolute;
  right: 0px;
  background: #eaeaea;
  bottom: 100px;
}
.media-gallery-carousel .bg-cl-secondary {
  background: #ffffff;
}
.zoom-in {
  position: absolute;
  bottom: 0;
  right: 0;
}
.image {
  opacity: 1;
  will-change: opacity;
  transition: 0.3s opacity $motion-main;
  &:hover {
    opacity: 0.9;
  }
}
.video-container {
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
.media-gallery-carousel,
.media-zoom-carousel {
  .VueCarousel-pagination {
    position: absolute;
    bottom: 0px;
    @media (max-width: 767px) {
      display: none;
    }
  }
  .VueCarousel-navigation-button {
    margin: 0;
    transform: translateY(-50%) !important;
  }
  .VueCarousel-slide {
    backface-visibility: unset;
  }
  .VueCarousel-navigation {
    opacity: 0;
    &--disabled {
      display: none;
    }
  }
  .VueCarousel-dot {
    padding: 8px !important;
    button {
      border: 2px solid #828282;
    }
  }
  &:hover {
    .VueCarousel-navigation {
      opacity: 0.9;
    }
    .VueCarousel-navigation-button {
      transition: opacity 3s;
      &:after {
        background-color: transparent;
      }
    }
  }
}
/*Custom Css */
.bt-product-gallery .media-gallery {
  margin-bottom: -60px;
}
.media-gallery-carousel .product-image__thumb {
  top: 43%;
}
.product-detail-inner .prod-gallery-thumbnails-carousel {
  padding-top: 0px;
  padding-bottom: 0px;
}
.prod-gallery-thumbnails-carousel img.block {
  height: 100px;
}
.product-thumbnails ul li img {
  width: 100px;
}

.border-green {
  border: 2px solid #00998c;
}

.border-grey-light {
  border: 2px solid #2e525a6e;
}

.product-thumbnails ul {
  list-style: none;
  display: block;
  padding: 0px;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: nowrap;
  width: 85%;
  margin: auto;
}
.media-gallery {
  height: auto !important;
  min-height: inherit !important;
}

.product-thumbnails ul li {
  display: inline-block;
  padding: 0 10px;
}
button#slideLeft {
  background: none;
  border: 0;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  left: -30px;
}

button#slideLeft .pointer {
  color: #8678a9;
  font-size: 60px;
  padding: 0;
}

button#slideRight {
  background: none;
  border: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -30px;
}

button#slideRight .pointer {
  color: #8678a9;
  font-size: 60px;
  padding: 0;
}

.product-thumbnails {
  position: relative;
  padding: 10px 0;
}
@media (min-width: 767px) {
  .bt-product-gallery .VueCarousel-pagination {
    display: none;
  }

  .bt-product-gallery .VueCarousel-navigation {
    display: none;
  }
  .media-gallery-carousel .product-image__thumb {
    top: 50%;
  }
}
/*Product Page pro carousel */
.product-similar-listing-carousel .VueCarousel-navigation {
  display: block;
  position: relative;
}

.product-similar-listing-carousel .VueCarousel-navigation button {
  top: -100px;
  width: 0;
  padding: 0;
}

.cart-popup .VueCarousel-navigation button {
  top: -78px !important;
  width: 0;
  padding: 0;
}

.product-similar-listing-carousel .VueCarousel-navigation button i {
  color: #54575b;
  font-size: 40px;
}

.product-similar-listing-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-prev {
  left: -35px;
}

.product-similar-listing-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-next {
  right: 35px;
}
.product-similar-listing-carousel .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}
/*Product Page pro carousel */
.prod-gallery-thumbnails-carousel img.block {
  width: 100px;
  display: inline-block;
  padding: 1px;
}

.prod-gallery-thumbnails-carousel .VueCarousel-navigation {
  display: block;
}
.prod-gallery-thumbnails-carousel .VueCarousel-navigation button i {
  color: #8678a9;
  font-size: 40px;
  padding: 0;
  width: 0;
}

.prod-gallery-thumbnails-carousel .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}

.prod-gallery-thumbnails-carousel .VueCarousel-navigation button {
  width: 0px;
  padding: 0px !important;
  margin: 0 0 0 0 !important;
}

.prod-gallery-thumbnails-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-prev {
  left: -30px;
}
.prod-gallery-thumbnails-carousel
  .VueCarousel-navigation
  button.VueCarousel-navigation-next {
  right: 10px;
}
.product-similar-listing-carousel .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}

/* Product Page Recently carousel */
.recently-viewed-items-container .VueCarousel-navigation {
  display: block;
}
.recently-viewed-items-container .VueCarousel-navigation button i {
  color: #8678a9;
  font-size: 60px;
  padding: 0;
  width: 0;
}

.recently-viewed-items-container .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}
.recently-viewed-items-container {
  padding-top: 25px;
  padding-bottom: 25px;
}

.recently-viewed-items-container .VueCarousel-navigation button {
  width: 0px;
  padding: 0px !important;
  margin: 0 0 0 0 !important;
}

.recently-viewed-items-container
  .VueCarousel-navigation
  button.VueCarousel-navigation-prev {
  left: -70px;
}
.recently-viewed-items-container
  .VueCarousel-navigation
  button.VueCarousel-navigation-next {
  right: -10px;
}
.recently-viewed-items-container .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}
/* Product Page Recently carousel */
/*Custom Css */

/*Mobile Custom Css */
@media (max-width: 1100px) and (min-width: 768px) {
  .recently-viewed-items-container
    .VueCarousel-navigation
    button.VueCarousel-navigation-next {
    right: 55px;
  }
  .recently-viewed-items-container
    .VueCarousel-navigation
    button.VueCarousel-navigation-prev {
    left: 0;
  }
}
@media (max-width: 767px) {
  .bt-product-gallery .VueCarousel-pagination {
    display: block;
  }
  .bt-product-gallery .VueCarousel-navigation {
    display: none;
  }

  .bt-product-gallery .media-gallery {
    min-height: auto;
    // padding-bottom: 55px;
  }

  .bt-product-gallery .VueCarousel-pagination button {
    background-color: #a8a8a8 !important;
    height: 15px !important;
    width: 15px !important;
    margin-top: 0px !important;
  }
  .bt-product-gallery .VueCarousel-pagination button:focus {
    outline: none;
  }
  .bt-product-gallery .VueCarousel-pagination button.VueCarousel-dot--active {
    background-color: #8678a9 !important;
    height: 15px !important;
    width: 15px !important;
  }

  .bt-product-gallery .media-gallery-carousel .VueCarousel-pagination {
    display: inline-block;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: -65px;
    transform: translateY(-50%);
  }
  .bt-product-gallery
    .media-gallery-carousel
    .VueCarousel-pagination
    .VueCarousel-dot-container {
    margin-top: 0px !important;
  }
  .bt-product-gallery {
    padding-right: 8px !important;
  }
  // .product-similar-listing-carousel .VueCarousel {
  //   border: 1px solid #606060;
  // }
  .recently-viewed-items-container.container {
    width: 100%;
  }
  .saving-price-detail-div {
    display: block !important;
    padding-left: 0px !important;
  }

  // .product-similar-listing-carousel .VueCarousel {
  //   border: 1px solid #606060;
  // }

  .recently-viewed-items-container.container {
    width: 100%;
  }

  .recently-inner-container {
    padding: 0 0 0 0 !important;
  }

  .product-recent-listing-carousel button {
    display: none;
  }

  .recently-viewed-items-container.container {
    padding-bottom: 0;
    border-bottom: 10px solid #626161;
  }
  .product-recent-listing-carousel .VueCarousel img {
    max-width: 90% !important;
  }
  .bt-product-gallery .media-gallery {
    margin-bottom: 0px;
  }
  .media-gallery-carousel {
    // margin-top: 20px;
  }
  .product-similar-listing-carousel .VueCarousel-navigation button {
    top: -130px;
  }
  .media-gallery-carousel .VueCarousel-slide {
    // height: 350px;
  }
  .cart-popup .VueCarousel-navigation button {
    top: -225px !important;
  }
}
/*Mobile Custom Css */
/* Comes WIth */
.comes-with-main .product-image {
  width: auto !important;
}
.comes-with-main
  .VueCarousel-slide.mb-1.bg-grey-lighter.VueCarousel-slide-active {
  margin-right: 15px;
}
.comes-with-main .product-image:hover {
  // border-bottom: 5px solid #dddd;
}
.comes-with-main .comeproimage:hover {
  border-bottom: 5px solid #dddd;
}

.comes-with-main .border_green .product-image {
  // border-bottom: 5px solid #0f988b;
}
.comes-with-main .border_green {
  border-bottom: 5px solid #0f988b;
}
.comes-with-main .border_green .product-image:hover {
  // border-bottom: 5px solid #0f988b;
}
.comes-with-main .border_green:hover {
  border-bottom: 5px solid #0f988b;
}
.comes-with-main .prod-gallery-thumbnails-carousel {
  padding-top: 15px;
  padding-bottom: 15px;
}
.comes-with-main .prod-gallery-thumbnails-carousel .VueCarousel-slide {
  margin: 0px 15px 0px 15px;
}
// .comes-with-main .prod-gallery-thumbnails-carousel .VueCarousel-inner {
//   transform: translate3d(0px, 0px, 0px) !important;
// }
.comes-with-main span {
  font-weight: 600;
  font-size: 16px;
  color: #54575b;
}
/* Comes WIth */
@media (max-width: 767px) {
  .bt-product-gallery .media-gallery-carousel .zoom-in {
    display: none;
  }
  .comes-with-main .prod-gallery-thumbnails-carousel .VueCarousel-slide {
    margin: 0px;
  }
}
@media (min-width: 767px) and (max-width: 1023px) {
  .product-detail-inner .prod-gallery-thumbnails-carousel {
    padding-top: 30px;
    padding-bottom: 0px;
  }
}
</style>