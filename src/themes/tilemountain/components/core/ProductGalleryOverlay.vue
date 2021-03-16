<template>
  <div>
    <div class="overlay"></div>
    <div class="media-zoom">
      <i
        class="media-zoom__close material-icons p15 cl-bg-tertiary pointer"
        @click="$emit('close')"
        >close</i
      >
      <no-ssr>
        <product-gallery-zoom-carousel
          v-if="showProductGalleryZoomCarousel"
          :current-slide="currentSlide"
          :gallery="fullsizezoomCarousel"
          :customer-gallery="customerGallery"
          :product-name="productName"
        />
      </no-ssr>
    </div>
  </div>
</template>
<script>
import NoSSR from "vue-no-ssr";
import ProductGalleryZoomCarousel from "./ProductGalleryZoomCarousel.vue";
import config from "config";
// import "viewerjs/dist/viewer.css";
// import Viewer from "v-viewer";
// import Vue from "vue";
import { type } from "os";
// Vue.use(Viewer);
export default {
  name: "ProductGalleryOverlay",
  props: {
    currentSlide: {
      type: Number,
      required: false,
      default: 0,
    },
    gallery: {
      type: Array,
      required: true,
    },
    productName: {
      type: String,
      required: false,
      default: "",
    },
    product: {
      type: Object,
      required: true,
    },
    customerGallery: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showProductGalleryZoomCarousel: false,
    };
  },
  components: {
    "no-ssr": NoSSR,
    ProductGalleryZoomCarousel,
  },
  mounted() {
    this.$store.commit("ui/setOverlay", true);
    this.showProductGalleryZoomCarousel = true;
  },
  destroyed() {
    this.$store.commit("ui/setOverlay", false);
  },
  computed: {
    fullsizezoomCarousel() {
      return this.product.media_gallery.map((imgGallery) => {
        return {
          src: this.getThumbnail(
            imgGallery.image,
            config.galleryZoomImageSize.width,
            config.galleryZoomImageSize.height
          ),
          error: this.getThumbnail(
            imgGallery.image,
            config.galleryZoomImageSize.width,
            config.galleryZoomImageSize.height
          ),
          loading: this.getThumbnail(
            imgGallery.image,
            config.galleryZoomImageSize.width,
            config.galleryZoomImageSize.height
          ),
        };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~theme/css/base/global_vars";

$z-index-gallery: map-get($z-index, overlay) + 1;
.media-zoom {
  position: fixed;
  /* top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-index-gallery;
  background: #fff; */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -49%);
  bottom: 20%;
  z-index: 10;
  background: #ffffff;
  border: 1px solid #ffffff;
  width: 100%;
  min-height: 920px;
  -webkit-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 1px 9px -5px rgba(0, 0, 0, 0.75);
  border-radius: 10px;

  &__close {
    position: absolute;
    right: 15px;
        top: -25px;
    z-index: 1;
    background: #eb008b;
    border-radius: 28px;
    height: 25px;
    width: 25px;
    color: #fff;
    -webkit-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 5px -1px rgba(0, 0, 0, 0.75);
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
  }
  @media (min-width: 1025px) and (max-width: 1200px) {
  min-height: 755px;
  transform: translate(-50%, -54%);
  }
  @media (min-width: 1201px) and (max-width: 1900px) {
  min-height: 835px;
  }
}

.overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3); /* Black background with opacity */
  z-index: 3; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>
<style>
.btn-sidebar-mobile {
  display: none;
}

@media (min-width: 320px) and (max-width: 767px) {
  .media-zoom-carousel__thumbs-main {
    border: none;
    max-width: 100% !important;
    order: 2;
  }

  .media-zoom-carousel__gallery {
    max-width: 100% !important;
    padding: 0 !important;
    margin-bottom: 10px !important;
  }

  .media-zoom-carousel__thumb {
    margin-bottom: 0 !important;
    margin-right: 5px;
    min-width: 25%;
  }

  .media-zoom-carousel__thumbs {
    display: flex !important;
    overflow: hidden !important;
    height: 100% !important;
    flex-direction: row !important;
    padding: 0 !important;
    direction: inherit !important;
  }

  .product-slider-sidebar {
    padding: 0;
    border: none;
  }

  .media-zoom-carousel__thumbs-main .btn-sidebar {
    display: none;
  }

  .btn-sidebar-mobile {
    display: block;
  }

  .btn-sidebar-mobile {
    margin-bottom: 0 !important;
    max-width: 80% !important;
  }

  .btn-sidebar-mobile .prod-btn {
    height: 35px;
    max-width: 155px;
  }

  .VueCarousel-navigation {
    opacity: 0 !important;
  }
  .media-zoom-carousel__carousel .VueCarousel-pagination {
    bottom: 37px !important;
  }

  .media-zoom {
    width: 99% !important;
    min-height: 400px !important;
    border-radius: 5px !important;
  }

  .media-zoom__close {
    right: 5px !important;
    top: 5px !important;
    height: 10px !important;
    width: 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px !important;
  }

  .media-zoom-carousel__slide img {
    max-width: 715px;
  }
  .bottom-carousel .VueCarousel-navigation button {
    background-color: #696868;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    opacity: 0.8;
  }
  .bottom-carousel .VueCarousel-navigation .VueCarousel-navigation-prev i {
    color: #ffffff;
    left: 5px;
    position: absolute;
    top: 5px;
  }
  .bottom-carousel .VueCarousel-navigation .VueCarousel-navigation-next i {
    color: #ffffff;
    right: 25px;
    position: absolute;
    top: 5px;
  }
}

@media (min-width: 414px) and (max-width: 414px) {
  .media-zoom {
    min-height: 490px !important;
  }
}

@media (min-width: 375px) and (max-width: 375px) {
  .media-zoom {
    min-height: 450px !important;
  }
}

@media (min-width: 360px) and (max-width: 360px) {
  .media-zoom {
    min-height: 435px !important;
  }
}

@media (min-width: 411px) and (max-width: 411px) {
  .media-zoom {
    min-height: 490px !important;
  }
}

@media only screen and (min-device-width: 568px) and (max-device-width: 568px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -35%) !important;
    min-height: 255px !important;
  }

  .VueCarousel-pagination {
    bottom: 50px !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}
@media only screen and (min-device-width: 823px) and (max-device-width: 823px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -35%) !important;
    min-height: 255px !important;
  }

  .VueCarousel-pagination {
    bottom: 50px !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}
@media only screen and (min-device-width: 640px) and (max-device-width: 640px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -35%) !important;
    min-height: 255px !important;
  }

  .VueCarousel-pagination {
    bottom: 50px !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}
@media only screen and (min-device-width: 736px) and (max-device-width: 736px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -46%) !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}

@media only screen and (min-device-width: 667px) and (max-device-width: 667px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -42%) !important;
    min-height: 335px !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .media-zoom-carousel__thumbs-main {
    border: none;
    max-width: 100% !important;
    order: 2;
  }

  .media-zoom-carousel__gallery {
    max-width: 100% !important;
    padding: 0 !important;
    margin-bottom: 10px !important;
  }

  .media-zoom-carousel__thumb {
    margin-bottom: 0 !important;
    margin-right: 5px;
    min-width: 25.3%;
  }

  .media-zoom-carousel__thumbs {
    display: flex !important;
    overflow: hidden !important;
    height: 100% !important;
    flex-direction: row !important;
    padding: 0 !important;
    direction: inherit !important;
  }

  .product-slider-sidebar {
    padding: 0;
    border: none;
  }

  .media-zoom-carousel__thumbs-main .btn-sidebar {
    display: none;
  }

  .btn-sidebar-mobile {
    display: block;
  }

  .btn-sidebar-mobile {
    margin-bottom: 0 !important;
    max-width: 80% !important;
  }

  .btn-sidebar-mobile .prod-btn {
    height: 35px;
    max-width: 155px;
  }

  .VueCarousel-navigation {
    opacity: 0 !important;
  }

  .media-zoom {
    width: 99% !important;
    min-height: 885px !important;
    border-radius: 5px !important;
    transform: translate(-50%, -51%) !important;
  }

  .media-zoom__close {
    right: 5px !important;
    top: 5px !important;
    height: 10px !important;
    width: 10px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px !important;
  }

  .media-zoom-carousel__slide img {
    max-width: 760px;
    height: 100%;
  }

  .media-zoom-carousel__container {
    top: 50% !important;
    bottom: auto !important;
    height: auto !important;
    -webkit-transform: translate3d(0, -50%, 0) !important;
    transform: translate3d(0, -50%, 0) !important;
    padding: 5px !important;
  }

  .product-slider-sidebar .product-image--width .product-image__thumb {
    max-height: 167px !important;
    max-width: 167px;
  }
}
@media only screen and (min-device-width: 823px) and (max-device-width: 823px) and (orientation: landscape) {
  .media-zoom {
    transform: translate(-50%, -35%) !important;
    min-height: 390px !important;
  }

  .VueCarousel-pagination {
    bottom: 50px !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}
@media only screen and (min-device-width: 812px) and (max-device-width: 812px) and (orientation: landscape) {
  .media-zoom {
    min-height: 390px !important;
    transform: translate(-50%, -47%) !important;
  }
  .media-zoom-carousel__container {
    overflow-y: scroll !important;
    -webkit-overflow-y: scroll !important;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .product-slider-sidebar .product-image--width .product-image__thumb {
    max-height: 100%;
  }
  .media-zoom__close {
    top: -10px;
    height: 20px;
    width: 20px;
    padding: 10px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
  }
  .VueCarousel.media-zoom-carousel__carousel
    .VueCarousel-navigation
    .VueCarousel-navigation-next {
    right: 0;
    display: none;
  }
  .VueCarousel.media-zoom-carousel__carousel
    .VueCarousel-navigation
    .VueCarousel-navigation-prev {
    left: 0;
    display: none;
  }
  .bottom-carousel .VueCarousel-navigation button {
    background-color: #696868;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    opacity: 0.8;
  }
  .bottom-carousel .VueCarousel-navigation .VueCarousel-navigation-prev i {
    color: #ffffff;
    left: 5px;
    position: absolute;
    top: 5px;
  }
  .bottom-carousel .VueCarousel-navigation .VueCarousel-navigation-next i {
    color: #ffffff;
    right: 25px;
    position: absolute;
    top: 5px;
  }
  /* .media-zoom-carousel__thumbs {
    height: 645px !important;
  } */
}
@media (min-width: 992px) and (max-width: 1024px) {
  .media-zoom {
    transform: translate(-50%, -50%) !important;
    min-height: 745px !important;
  }
  .media-zoom-carousel__thumbs {
    height: 645px !important;
  }
}
@media (min-width: 1025px) and (max-width: 1900px) {
  .VueCarousel.media-zoom-carousel__carousel
    .VueCarousel-navigation
    .VueCarousel-navigation-next {
    right: 0;
  }
  .VueCarousel.media-zoom-carousel__carousel
    .VueCarousel-navigation
    .VueCarousel-navigation-prev {
    left: 0;
  }
}
</style>
