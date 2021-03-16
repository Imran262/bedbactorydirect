<template>
  <div class="media-zoom-carousel">
    <div class="media-zoom-carousel__container row flex">
      <div class="col-lg-3 media-zoom-carousel__thumbs-main">
        <div class="media-zoom-carousel__thumb sidebar btn-main btn-sidebar">
          <button
            class="prod-btn active"
            id="prodBtn"
            @click="showProductImages()"
          >
            Product Photos
          </button>
          <button
            class="prod-btn unactive"
            id="custBtn"
            @click="showCustomerImages()"
            v-if="customerGallery.length > 0"
          >
            Customer Photos
          </button>
        </div>
        <div class="product-slider-sidebar">
          <carousel
            v-if="showCarousel && showProduct"
            class="prod-gallery-thumbnails-carousel bottom-carousel showProductcarousel"
            :per-page="4"
            :mouse-drag="false"
            @page-change="pageChange"
            :min-swipe-distance="20"
            :navigation-enabled="true"
            :pagination-enabled="false"
            navigation-next-label="<i class='material-icons p15  pointer'>keyboard_arrow_right</i>"
            navigation-prev-label="<i class='material-icons p15  pointer'>keyboard_arrow_left</i>"
          >
            <slide
              class="mb-1 bg-grey-lighter mob-flex media-zoom-carousel__thumbs m0 p0 scroll"
              ref="thumbs"
              v-for="(images, index) in gallery"
              :key="images.src"
            >
              <product-image
                class="media-zoom-carousel__thumb sidebar"
                @click="navigate(index)"
                :image="images"
                :alt="productName | htmlDecode"
              />
            </slide>
          </carousel>
          <carousel
            v-if="showCarousel && showCustomer"
            class="prod-gallery-thumbnails-carousel bottom-carousel showCustomercarousel"
            :per-page="4"
            :mouse-drag="false"
            @page-change="pageChange"
            :min-swipe-distance="20"
            :navigation-enabled="true"
            :pagination-enabled="false"
            navigation-next-label="<i class='material-icons p15  pointer'>keyboard_arrow_right</i>"
            navigation-prev-label="<i class='material-icons p15  pointer'>keyboard_arrow_left</i>"
          >
            <slide
              class="mb-1 bg-grey-lighter mob-flex media-zoom-carousel__thumbs m0 p0 scroll"
              ref="thumbs"
              v-for="(images, index) in customerGallery"
              :key="images.src"
            >
              <product-image
                class="media-zoom-carousel__thumb sidebar"
                @click="navigate(index)"
                :image="images"
                :alt="productName | htmlDecode"
              />
            </slide>
          </carousel>
          <ul
            v-if="showDesktop && showProduct"
            class="media-zoom-carousel__thumbs m0 p0 scroll showProductUl"
            ref="thumbs"
          >
            <li
              class="media-zoom-carousel__thumb sidebar imageItemLi"
              v-for="(images, index) in gallery"
              :class="index == 0 ? 'activenew' : ''"
              :key="images.src"
            >
              <product-image
                @click="navigate(index)"
                :image="images"
                :alt="productName | htmlDecode"
              />
            </li>
          </ul>
          <ul
            v-if="showDesktop && showCustomer"
            class="media-zoom-carousel__thumbs m0 p0 scroll showCustomerUl"
            ref="thumbs"
          >
            <li
              class="media-zoom-carousel__thumb sidebar"
              v-for="(images, index) in customerGallery"
              :key="images.src"
            >
              <product-image
                @click="navigate(index)"
                :image="images"
                :alt="productName | htmlDecode"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="col-lg-9 media-zoom-carousel__gallery">
        <div
          class="media-zoom-carousel__thumb sidebar btn-main btn-sidebar btn-sidebar-mobile"
        >
          <button
            class="prod-btn active"
            id="prodBtnMob"
            @click="showProductImages(true)"
          >
            Product Photos
          </button>
          <button
            class="prod-btn unactive"
            id="custBtnMob"
            @click="showCustomerImages(true)"
          >
            Customer Photos
          </button>
        </div>
        <carousel
          v-if="showProduct"
          :per-page="1"
          :mouse-drag="false"
          :navigation-enabled="true"
          :pagination-enabled="false"
          navigation-next-label="<i class='material-icons p15 cl-bg-tertiary pointer'></i>"
          navigation-prev-label="<i class='material-icons p15 cl-bg-tertiary pointer'></i>"
          ref="zoomCarousel"
          class="media-zoom-carousel__carousel showProductBiggerCarousel"
          :speed="carouselTransitionSpeed"
          @pageChange="pageChange"
          :navigate-to="currentPage"
        >
          <slide v-for="(images, index) in gallery" :key="images.src">
            <div
              class="media-zoom-carousel__slide"
              :class="{ 'video-container h-100 flex relative': images.video }"
            >
              <div class="pageNumber-total">
                {{ index + 1 }} / {{ gallery.length }}
              </div>
              <product-gallery-image
                v-show="hideImageAtIndex !== index"
                :image="images"
                :alt="productName | htmlDecode"
                :is-active="index === currentPage"
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
        <carousel
          v-if="showCustomer"
          :per-page="1"
          :mouse-drag="false"
          :navigation-enabled="true"
          pagination-active-color="#828282"
          pagination-color="transparent"
          navigation-next-label="<i class='material-icons p15 cl-bg-tertiary pointer'></i>"
          navigation-prev-label="<i class='material-icons p15 cl-bg-tertiary pointer'></i>"
          ref="zoomCarousel"
          class="media-zoom-carousel__carousel showCustomerBiggerCarousel"
          :speed="carouselTransitionSpeed"
          @pageChange="pageChange"
          :navigate-to="currentPage"
        >
          <slide v-for="(images, index) in customerGallery" :key="images.src">
            <div
              class="media-zoom-carousel__slide"
              :class="{ 'video-container h-100 flex relative': images.video }"
            >
              <product-gallery-image
                v-show="hideImageAtIndex !== index"
                :image="images"
                :alt="productName | htmlDecode"
                :is-active="index === currentPage"
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
        <div class="zoom-plus-minus-icons">
          <span class="zoom-plus-icon" id="zoom-plus-icon">
            <img src="/assets/zoom-plus-img.png" alt="zoom plus" />
          </span>
          <span class="zoom-minus-icon" id="zoom-minus-icon">
            <img src="/assets/zoom-minus.png" alt="zoom minus" />
          </span>
          <span class="zoom-refresh-icon" id="zoom-refresh-icon">
            <img src="/assets/zoom-refresh.png" alt="zoom refresh" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import ProductImage from "./ProductImage";
import ProductGalleryImage from "./ProductGalleryImage";
import ProductVideo from "./ProductVideo";
import NoSSR from "vue-no-ssr";
import Panzoom from "@panzoom/panzoom";
export default {
  name: "ProductGalleryZoomCarousel",
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
    customerGallery: {
      type: Array,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      carouselTransitionSpeed: 300,
      currentPage: 0,
      hideImageAtIndex: null,
      showProduct: true,
      showCustomer: false,
      screenSize: screen.width,
      showCarousel: false,
      showDesktop: true,
      indexNew: 1
    };
  },
  watch: {},
  computed: {
    // checkScreenSize() {
    //   console.log("1122 Checking Screen",screen.width);
    //   if (screen.width <= 768) {
    //     this.showCarousel = true;
    //     return true;
    //   } else {
    //     this.showCarousel = false;
    //     return false;
    //   }
    // },
  },
  components: {
    Carousel: () =>
      import(/* webpackChunkName: "vue-carousel" */ "vue-carousel").then(
        (Slider) => Slider.Carousel
      ),
    Slide: () =>
      import(/* webpackChunkName: "vue-carousel" */ "vue-carousel").then(
        (Slider) => Slider.Slide
      ),
    ProductImage,
    ProductGalleryImage,
    ProductVideo,
    "no-ssr": NoSSR,
  },
  mounted() {
    this.checkScreenSize();
    this.$nextTick(() => {
      disableBodyScroll(this.$refs.thumbs);
    });
    this.navigate(this.currentSlide);
    if (this.$refs.zoomCarousel) {
      let navigation = this.$refs.zoomCarousel.$children.find(
        (c) => c.$el.className === "VueCarousel-navigation"
      );
      let pagination = this.$refs.zoomCarousel.$children.find(
        (c) => c.$el.className === "VueCarousel-pagination"
      );
      if (navigation !== undefined) {
        navigation.$on("navigationclick", this.increaseCarouselTransitionSpeed);
      }
      if (pagination !== undefined) {
        pagination.$on("paginationclick", this.increaseCarouselTransitionSpeed);
      }
    }
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    checkScreenSize(e) {
      // console.log("1122 Checking Screen", screen.width);
      if (screen.width < 769) {
        this.showCarousel = true;
        this.showDesktop = false;
        return true;
      } else {
        this.showCarousel = false;
        this.showDesktop = true;
        return false;
      }
    },
    showProductImages(value) {
      this.currentPage = 0;
      if (value) {
        this.showProduct = true;
        this.showCustomer = false;
        document.getElementById("prodBtnMob").classList.add("active");
        document.getElementById("custBtnMob").classList.remove("unactive");
        document.getElementById("custBtnMob").classList.remove("active");
        document.getElementById("custBtnMob").classList.add("unactive");
      } else {
        this.showProduct = true;
        this.showCustomer = false;
        document.getElementById("prodBtn").classList.add("active");
        document.getElementById("custBtn").classList.remove("unactive");
        document.getElementById("custBtn").classList.remove("active");
        document.getElementById("custBtn").classList.add("unactive");
      }
    },
    showCustomerImages(value) {
      this.currentPage = 0;
      if (value) {
        this.showProduct = false;
        this.showCustomer = true;
        document.getElementById("prodBtnMob").classList.remove("active");
        document.getElementById("custBtnMob").classList.add("unactive");
        document.getElementById("custBtnMob").classList.add("active");
        document.getElementById("custBtnMob").classList.remove("unactive");
      } else {
        this.showProduct = false;
        this.showCustomer = true;
        document.getElementById("prodBtn").classList.remove("active");
        document.getElementById("custBtn").classList.add("unactive");
        document.getElementById("custBtn").classList.add("active");
        document.getElementById("custBtn").classList.remove("unactive");
      }
    },
    navigate (index) {
      var imageElems = document.querySelectorAll('.product-slider-sidebar .sidebar');
      [].forEach.call(imageElems, (el) => {
        el.classList.remove("activenew");
      });
      if (index === 1) {
        document
          .getElementsByClassName('sidebar')[0]
          .classList.add('activenew');
      }
      event.target.parentElement.parentElement.classList.add("activenew");
      this.currentPage = index;
    },
    increaseCarouselTransitionSpeed() {
      this.carouselTransitionSpeed = 500;
    },
    pageChange(index) {
      var imageElems = document.querySelectorAll('.product-slider-sidebar .sidebar');
      [].forEach.call(imageElems, (el) => {
        el.classList.remove("activenew");
      });
      document.getElementsByClassName('sidebar')[index + 1].classList.add('activenew');
      document.getElementsByClassName('sidebar')[index + 1].scrollIntoView();
      this.indexNew = index
      document.getElementById("zoom-refresh-icon").click();
      this.hideImageAtIndex = null;

    },
    onVideoStarted(index) {
      this.hideImageAtIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~theme/css/base/global_vars";
@import "~theme/css/animations/transitions";

.media-zoom-carousel {
  * {
    box-sizing: border-box;
  }

  &__container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    overflow: hidden;
    padding: 10px;
    // height: 750px;
    max-height: 100%;
    /* justify-content: space-evenly; */

    @media (max-width: 767px) {
      top: 50%;
      bottom: auto;
      height: auto;
      transform: translate3d(0, -50%, 0);
      padding: 5px;
    }
  }

  &__thumbs {
    list-style: none;
    //padding-right: 20px;
    width: 100%;
    /* max-width: 140px; */
    /* height: 100%; */
    height: 820px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    direction: rtl;
    /* &::-webkit-scrollbar {
      display: none;
    } */
    padding: 0px 20px 0px 20px;
    @media (max-width: 767px) {
      display: none;
    }
    @media (min-width: 1201px) and (max-width: 1900px) {
      height: 735px;
    }
  }

  &__thumb {
    margin-bottom: 10px;
    max-width: 100%;
    //cursor: pointer;

    &:last-of-type {
      margin-bottom: 0;
    }

    & > * {
      opacity: 0.9;
      will-change: opacity;
      transition: 0.3s opacity $motion-main;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__gallery {
    // max-width: 843px;
    height: 100%;
    flex: 1;
    margin: 0 auto;
    max-width: 1150px;
    position: relative;
    .zoom-plus-minus-icons {
      position: absolute;
      left: -110px;
      bottom: 0;
      display: flex;
      flex-direction: column;
      span {
        margin-bottom: 14px;
      }
    }

    @media (max-width: 767px) {
      height: auto;
      .zoom-plus-minus-icons {
        left: 0;
        bottom: 0;
        span img {
          width: 50%;
        }
      }
    }
    @media (min-width: 768px) and (max-width: 1200px) {
      .zoom-plus-minus-icons {
        left: 0;
        bottom: 0;
        span img {
          width: 50%;
        }
      }
    }
    @media (min-width: 1201px) and (max-width: 1800px) {
      .zoom-plus-minus-icons {
        left: 0;
        bottom: 75px;
        span img {
          width: 50%;
        }
      }
    }
    @media (min-width: 993px) and (max-width: 1900px) {
      max-width: 75%;
    }
  }

  &__carousel {
    height: 100%;
  }

  &__slide {
    height: 100%;
    max-height: 100%;
    position: relative;
  }
}

.sidebar {
  width: 100%;
  text-align: center;
  justify-content: center;
}
.product-slider-sidebar ul li {
  max-width: 250px;
  // height: 250px;
}
.thumb-video {
  padding-bottom: calc(319% / (568 / 100));
}

.video-container {
  align-items: center;
  justify-content: center;
}

.prod-btn {
  width: 50%;
  float: left;
  height: 44px;
  font-family: Arial;
  border: none;
  border-radius: 5px 5px 0px 0px;
  background-color: #dcdcdc;
}

.active {
  background-color: #29275b;
  color: #fcfcfc;
  border: none;
  font-family: Arial;
  border-radius: 5px 5px 0 0;
}

.unactive {
  background-color: #dcdcdc;
  color: black;
  border: none;
  font-family: Arial;
}

.btn-main {
  width: 100%;
  margin-bottom: 0;
}
</style>

<style lang="scss">
.media-zoom-carousel {
  .VueCarousel-wrapper,
  .VueCarousel-inner,
  .VueCarousel-slide {
    height: 100%;
  }

  .VueCarousel-pagination {
    .VueCarousel-dot {
      background-color: #dcdcdc !important;
      width: 12px !important;
      height: 12px !important;
    }

    .VueCarousel-dot.VueCarousel-dot--active {
      background-color: #2a275c !important;
      height: 12px !important;
      width: 12px !important;
    }
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 25px;
    background-color: #dcdcdc;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #cdcdcd;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
}

.media-zoom-carousel__thumbs-main {
  padding: 0 !important;
  border-radius: 5px 5px 0px 0px;
  max-width: 415px !important;
}
.product-slider-sidebar {
  padding: 18px 26px 18px 26px;
  border: 2px solid #29275b;
}
.btn-sidebar {
  overflow: auto;
  border-radius: 5px 0 0 0;
}
//.media-zoom-carousel__slide img {
//  top: 43.5% !important;
//}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-prev {
  left: -14%;
  border-radius: 5px 0px 0px 5px;
  width: 112px;
  height: 112px;
}

.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-prev
  i {
  background: url("/assets/zoom-slider-arrow-left.png");
  width: 44px;
  height: 80px;
  vertical-align: middle;
}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-prev:focus {
  outline: none;
}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-button {
  background-color: #ededed;
}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-next {
  right: -14%;
  border-radius: 0px 5px 5px 0px;
  width: 112px;
  height: 112px;
}

.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-next
  i {
  background: url("/assets/slider-zoom-arrow-right.png");
  width: 44px;
  height: 80px;
  vertical-align: middle;
}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-next:focus {
  outline: none;
}
.VueCarousel.media-zoom-carousel__carousel
  .VueCarousel-navigation
  .VueCarousel-navigation-button
  i {
  font-size: 100px;
  padding: 0;
}
.bottom-carousel {
  .VueCarousel-navigation {
    opacity: 10 !important;
  }
}
.pageNumber-total {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translate(-50%, 0);
}
.media-zoom-carousel__thumbs .activenew {
  border: 3px solid #00a897;
}
@media (min-width: 320px) and (max-width: 767px) {
  .pageNumber-total {
    bottom: 0;
  }
  .product-slider-sidebar ul li {
    max-width: 100% !important;
    height: 100% !important;
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    background-color: #dcdcdc;
    border-radius: 5px;
  }
}
@media only screen and (min-device-width: 823px) and (max-device-width: 823px) and (orientation: landscape) {
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    background-color: #dcdcdc;
    border-radius: 5px;
  }
}
@media only screen and (min-device-width: 812px) and (max-device-width: 812px) and (orientation: landscape) {
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    background-color: #dcdcdc;
    border-radius: 5px;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
  .product-slider-sidebar ul li {
    max-width: 100% !important;
    height: 100% !important;
  }
  .pageNumber-total {
    bottom: 1%;
  }
}
@media (min-width: 1025px) and (max-width: 1200px) {
  .media-zoom-carousel__thumbs {
    height: 645px !important;
  }
}
</style>
