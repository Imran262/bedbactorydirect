<template>
  <div>
    <div class="media-gallery-carousel" id="media-gallery-carousel">
      <carousel
        :per-page="1"
        :mouse-drag="false"
        :navigation-enabled="false"
        pagination-active-color="#828282"
        pagination-color="transparent"
        :pagination-enabled="true"
        navigation-next-label="<i class='material-icons p15 cl-bg-tertiary pointer'>keyboard_arrow_right</i>"
        navigation-prev-label="<i class='material-icons p15 cl-bg-tertiary pointer'>keyboard_arrow_left</i>"
        ref="carousel"
        :speed="carouselTransitionSpeed"
        @pageChange="pageChange"
      >
        <slide v-for="(images, index) in gallery" :key="images.src">
          <!-- <div>
            <img :src="images.src" alt="AltTitle" itemprop="thumbnail">
          </div> -->
          <!-- <img :src="images.src" alt="AltTitle" itemprop="thumbnail"> -->
          <figure
            v-show="index === 0 || !singleThumbnail"
            itemprop="associatedMedia"
            itemscope
            itemtype="http://schema.org/ImageObject"
            :src="images.src"
          >
            <a :href="images.src" itemprop="contentUrl" :data-size="'' + 2300 + 'x' + 2300" title="title">
              <img :src="images.src" alt="AltTitle" itemprop="thumbnail">
            </a>
          </figure>
          <!-- <product-image
            v-show="hideImageAtIndex !== index"
            @click="openOverlay"
            class="pointer image"
            :image="images"
            :alt="productName | htmlDecode"
            :product-label="productLabel"
            :class="imagelength ==1 ? 'margan' : ''"
          /> -->
        </slide>
      </carousel>
    </div>
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg" />
      <div class="pswp__scroll-wrap">
        <!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
        <!-- don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
          <div class="pswp__item" />
          <div class="pswp__item" />
          <div class="pswp__item" />
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <!--  Controls are self-explanatory. Order can be changed. -->

            <div class="pswp__counter" />

            <button class="pswp__button pswp__button--close" title="Close (Esc)" />

            <button class="pswp__button pswp__button--share" title="Share" />

            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen" />

            <button class="pswp__button pswp__button--zoom" title="Zoom in/out" />

            <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut" />
                </div>
              </div>
            </div>
          </div>

          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip" />
          </div>

          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />

          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />

          <div class="pswp__caption">
            <div class="pswp__caption__center" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'config';
import ProductImage from './ProductImage';
import ProductVideo from './ProductVideo';
import reduce from 'lodash-es/reduce';
import map from 'lodash-es/map';
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
export default {
  name: 'ProductGalleryCarousel',
  components: {
    Carousel: () =>
      import(/* webpackChunkName: "vue-carousel" */ 'vue-carousel').then(
        (Slider) => Slider.Carousel
      ),
    Slide: () =>
      import(/* webpackChunkName: "vue-carousel" */ 'vue-carousel').then(
        (Slider) => Slider.Slide
      ),
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
      default: ''
    },
    configuration: {
      type: Object,
      required: true
    },
    productLabel: {
      type: String,
      default: ''
    },
    imagelength: {
      type: Number,
      required: false
    },
    options: {
      default: () => ({}),
      type: Object
    },
    singleThumbnail: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      carouselTransition: true,
      carouselTransitionSpeed: 0,
      currentColor: 0,
      currentPage: 0,
      hideImageAtIndex: null,
      pswp: null,
      angle: 0,
      classDynamicP2: '',
      items: [
        {
          src: 'https://www.klebefieber.de/img/2300/2300/resize-convert-jpg/g/a/garderobe-shabby-chic-no-rs182-sunshine-vintage-75683_3_254.webp',
          thumbnail: 'http://via.placeholder.com/64x64',
          w: 2300,
          h: 2300,
          alt: 'some numbers on a grey background'
        },
        {
          src: 'http://via.placeholder.com/1200x900',
          thumbnail: 'http://via.placeholder.com/64x64',
          w: 1200,
          h: 900
        }
      ]
    };
  },
  computed: {},
  beforeMount () {
    this.$bus.$on('product-after-configure', this.selectVariant);
    this.$bus.$on('product-after-load', this.selectVariant);
  },
  mounted () {
    setTimeout(() => {
      this.swipeInitFunction();
    }, 2000);
    this.selectVariant();
    if (this.configuration.color) {
      const { color } = this.configuration;
      this.currentColor = color.id;
    }
    this.$emit('loaded');
  },
  beforeDestroy () {
    this.$bus.$off('product-after-configure', this.selectVariant);
    this.$bus.$off('product-after-load', this.selectVariant);
  },
  methods: {
    swipeInitFunction () {
      var initPhotoSwipeFromDOM = function (gallerySelector) {
        var parseThumbnailElements = function (el) {
          var thumbElements = el.childNodes;
          var newThumbElements = el.parentNode;
          var numNodes = thumbElements.length;
          var newNumNodes = el.parentNode.childNodes.length;
          var items = [];
          var figureEl;
          var linkEl;
          var size;
          var item;
          for (var newI = 0; newI < newNumNodes; newI++) {
            figureEl = newThumbElements.childNodes[newI].childNodes[0] // <figure> element
            // include only element nodes
            if (figureEl.nodeType !== 1) {
              continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            // create slide object
            item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
              // <figcaption> content
              item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
          }
          return items;
        };
        // find nearest parent element
        var closest = function closest (el, fn) {
          return el && (fn(el) ? el : closest(el.parentNode, fn));
        };
        // triggers when user clicks on thumbnail
        var onThumbnailsClick = function (e) {
          e = e || window.event;
          e.preventDefault ? e.preventDefault() : e.returnValue = false;
          var eTarget = e.target || e.srcElement;
          // find root element of slide
          var clickedListItem = closest(eTarget, (el) => {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
          });
          if (!clickedListItem) {
            return;
          }
          // find index of clicked item by looping through all child nodes
          // alternatively, you may define index via data- attribute
          var clickedGallery = clickedListItem.parentNode.parentNode;
          var childNodes = clickedListItem.parentNode.parentNode.childNodes;
          var numChildNodes = childNodes.length;
          var nodeIndex = 0;
          var index;
          for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
              continue;
            }
            if (childNodes[i].childNodes[0] === clickedListItem) {
              index = nodeIndex;
              break;
            }
            nodeIndex++;
          }
          if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedListItem.parentNode);
          }
          return false;
        };
        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
          var hash = window.location.hash.substring(1);
          var params = {};
          if (hash.length < 5) {
            return params;
          }
          var vars = hash.split('&');
          for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
              continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
              continue;
            }
            params[pair[0]] = pair[1];
          }
          if (params.gid) {
            params.gid = parseInt(params.gid, 10);
          }
          return params;
        };
        var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
          var pswpElement = document.querySelectorAll('.pswp')[0];
          var gallery;
          var options;
          var items;
          items = parseThumbnailElements(galleryElement);
          // define options (if needed)
          options = {
            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
              var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
              var rect = thumbnail.getBoundingClientRect();
              return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            }
          };
          // PhotoSwipe opened from URL
          if (fromURL) {
            if (options.galleryPIDs) {
              // parse real index when custom PIDs are used
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for (var j = 0; j < items.length; j++) {
                if (items[j].pid == index) {
                  options.index = j;
                  break;
                }
              }
            } else {
              // in URL indexes start from 1
              options.index = parseInt(index, 10) - 1;
            }
          } else {
            options.index = parseInt(index, 10);
          }
          // exit if index not found
          if (isNaN(options.index)) {
            return;
          }
          if (disableAnimation) {
            options.showAnimationDuration = 0;
          }
          // Pass data to PhotoSwipe and initialize it
          gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
          gallery.init();
        };
        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector);
        for (var i = 0, l = galleryElements.length; i < l; i++) {
          galleryElements[i].setAttribute('data-pswp-uid', i + 1);
          galleryElements[i].onclick = onThumbnailsClick;
        }
        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
          openPhotoSwipe(hashData.pid, galleryElements[ hashData.gid - 1 ], true, true);
        }
      };
      let classDynamicP1 = document.getElementById('media-gallery-carousel');
      this.classDynamicP2 = classDynamicP1.childNodes[0].childNodes[0].childNodes[0].classList[0]
      initPhotoSwipeFromDOM('.' + this.classDynamicP2);
    },
    navigate (index) {
      if (this.$refs.carousel) {
        this.$refs.carousel.goToPage(index);
      }
    },
    selectVariant () {
      if (config.products.gallery.mergeConfigurableChildren) {
        const option = reduce(
          map(this.configuration, 'attribute_code'),
          (result, attribute) => {
            result[attribute] = this.configuration[attribute].id;
            return result;
          },
          {}
        );
        if (option) {
          let index = this.gallery.findIndex(
            (obj) =>
              obj.id &&
              Object.entries(obj.id).toString() ===
                Object.entries(option).toString(),
            option
          );
          if (index < 0) {
            index = this.gallery.findIndex(
              (obj) => obj.id && obj.id.color === option.color
            );
          }
          this.navigate(index);
        }
      }
      this.$emit('close');
    },
    openOverlay () {
      const currentSlide = this.$refs.carousel.currentPage;
      this.$emit('toggle', currentSlide);
    },
    switchCarouselSpeed () {
      const { color } = this.configuration;
      if (color && this.currentColor !== color.id) {
        this.currentColor = color.id;
        this.carouselTransitionSpeed = 0;
      } else {
        this.carouselTransitionSpeed = 500;
      }
    },
    pageChange (index) {
      this.switchCarouselSpeed();
      this.currentPage = index;
      this.hideImageAtIndex = null;
      this.$emit('pageChange', index);
    },
    onVideoStarted (index) {
      this.hideImageAtIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";
@media screen and (min-width: 768px){
  .margan{
    padding-bottom: 94% !important;
  }
}
.media-gallery-carousel {
  position: relative;
  text-align: center;
  height: 100%;
}
.zoom-in {
  position: absolute;
  top: 10px;
  left: 0;
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
.for-mobile {
  display: none;
}
</style>

<style lang="scss">
.media-gallery-carousel,
.media-zoom-carousel {
  .VueCarousel-pagination {
    position: absolute;
    bottom: 15px;
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
.product-image-container {
  background-color: #fff !important;
}
.prod-gallery-thumbnails-carousel .VueCarousel-slide {
  position: relative;
}
.prod-gallery-thumbnails-carousel img.block {
  max-width: 100px;
  display: inline-block;
  padding: 1px;
  max-height: 100px;
  position: inherit;
  top: 50%;
  left: auto;
  -webkit-transform: translate(0%, -50%);
  -ms-transform: translate(0%, -50%);
  transform: translate(0%, -50%);
  height: auto;
  width: auto;
  z-index: 999;
}
.prod-gallery-thumbnails-carousel .VueCarousel-navigation button i {
  color: #29275b;
  padding: 0;
  width: 0;
}
.prod-gallery-thumbnails-carousel .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}
.media-gallery-carousel .VueCarousel-pagination {
  display: none;
}
.media-gallery-carousel {
  .sale {
    position: absolute;
    right: 0;
    top: 27px;
    background-color: #ed108c;
    color: #fff;
    font-family: Oblik;
    font-weight: bold;
    padding: 15px 20px;
  }
  .VueCarousel-dot:focus {
    outline: 1px solid transparent !important;
  }
}
.media-zoom-carousel__slide .product-image.product-image--width {
  padding-bottom: 85% !important;
}
@media (max-width: 500px) {
  .product-recent-listing-carousel .VueCarousel-navigation-prev {
    left: 13% !important;
    transform: translateY(-50%) translateX(-100%) !important;
    font-family: "system" !important;
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
  .product-recent-listing-carousel .VueCarousel-navigation-next {
    right: 13% !important;
    transform: translateY(-50%) translateX(100%);
    font-family: "system";
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
}
@media (min-width: 500px) and (max-width: 767px) {
  .product-recent-listing-carousel .VueCarousel-navigation-prev {
    left: 8% !important;
    transform: translateY(-50%) translateX(-100%) !important;
    font-family: "system" !important;
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
  .product-recent-listing-carousel .VueCarousel-navigation-next {
    right: 8% !important;
    transform: translateY(-50%) translateX(100%);
    font-family: "system";
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
}
@media (max-width: 767px) {
  .product-recent-listing-carousel .arrow-mobile {
    font-size: 70px;
    padding: 0px;
  }
  .media-gallery {
    min-height: auto !important;
  }
  .media-zoom-carousel__slide .product-image.product-image--width {
    padding-bottom: 85% !important;
  }
  .for-desktop {
    display: none;
  }
  .for-mobile {
    display: block !important;
  }
  .zoom-in {
    position: absolute !important;
    top: 5px !important;
    left: -35px !important;
    height: 60px;
    width: auto;
  }
  .media-gallery-carousel {
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
    .sale {
      top: 0px;
    }
  }
}
figure {
  display: block;
  margin: 0px;
}
figure img {
    width: 100%;
    object-fit: cover;
}
</style>
