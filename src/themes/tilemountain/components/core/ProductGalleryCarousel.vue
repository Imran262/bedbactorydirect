<template>
  <div>
    <div class="media-gallery-carousel" id="media-gallery-carousel">
      <VueSlickCarousel v-bind="mainCarousel"
        :infinite=false
        ref="carousel"
        :draggable = false
        :per-page="1"
        :touch-drag="true"
        class="main-gallery-thumbnail"
        :speed=500
        @beforeChange="beforeChange"
        @afterChange="pageChange">
        <div v-for="(images, index) in gallery" :key="images.src">
          <figure
            v-show="index === 0 || !singleThumbnail"
            itemscope
            @click="initPopUp('called')"
            ref="figure"
            :src="
              galleryZoom[index]
                ? getImageFullSize(galleryZoom[index].image)
                : images.src
            "
          >
            <a
              v-if="
                getImageTypeName(galleryZoom[index].image) === 'Customer Photos'
              "
              :href="
                galleryZoom[index]
                  ? getImageFullSize(galleryZoom[index].image)
                  : images.src
              "
              :data-size="'' + 900 + 'x' + 900"
            >
              <img v-lazy="images.src" :alt="productName" />
            </a>
            <a
              v-else
                :href="
                galleryZoom[index]
                  ? getImageFullSize(galleryZoom[index].image)
                  : images.src
                "
              :data-size="'' + 2300 + 'x' + 2300"
            >
              <iframe
                ref="iframe"
                data-type="video"
                class="videoDiv"
                :data-video="
                  `<div class=&quot;wrapper&quot;><div class=&quot;video-wrapper&quot;><iframe ref=&quot;iframes&quot; id=&quot;iframe_container&quot; class=&quot;pswp__video&quot; style=&quot;width:70%; height:70%&quot;  src=&quot;` +
                  getEmbedUrl(images) +
                  `&quot; frameborder=&quot;0&quot; allowfullscreen></iframe></div></div>`
                "
                v-if="images.video"
                width="560"
                height="315"
                loading="lazy"
                :src="getEmbedUrlNoJsApi(images)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
              <img v-else-if="index <= 1" :src="images.src" :alt="productName" />
              <img v-else v-lazy="images.src" :alt="productName" />
            </a>

            <figcaption v-if="galleryZoom[index]">
              {{ getImageTypeName(galleryZoom[index].image) }}
            </figcaption>
            <div class="image_label_one" v-if="productLabel">
              <img
                class="image_label"
                :src="getProductLabel"
                alt="product label"
              />
            </div>
          </figure>
        </div>
      </VueSlickCarousel>
      </div>
      <div class="Galleries" v-if="!$device.isMobile && gallery.length > 1">
        <div class="main-gallery">
        <VueSlickCarousel
          v-bind="settingABCD"
          :infinite=false
          ref="c2"
          :draggable = false
          :slidesToShow='4'
          :slidesToScroll='4'
          :rows='1'
          :initialSlide='0'
          class="thumbnail-arrows"
           :speed=300
          @afterChange="pageChange">
          >
        <div v-for="(images, index) in gallery" :key="images.src">

          <div v-if="images.video" class="youtubeIcon"></div>
          <img :src="images.src" :alt="productName" id="thumnail" :class="{'active-img-slide': selected ? images.src == selected : (!firstslideIndex ? index == 0 : index === 'noone'), 'drag-active' : index === firstslideIndex }"   @click="onSelect(index,images.src)" />

        </div>
      </VueSlickCarousel>
      </div>
        <div class="Viewgallery" >
          <a @click="openFigureGallery()"> View Gallery +</a>
        </div>
      </div>

      <img
        class="zoom-in material-icons p15 cl-bgs-tertiary pointer for-desktop"
        ref="play"
        v-show="isVideo.length > 0"
        v-lazy="''"
        alt="play"
      />
      <img
        class="zoom-in material-icons p15 cl-bgs-tertiary pointer for-mobile"
        ref="playMobile"
        v-show="isVideo.length > 0"
        v-lazy="''"
        alt="play mobile"
      />

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

            <button
              class="pswp__button pswp__button--close"
              title="Close (Esc)"
            />

            <button class="pswp__button pswp__button--share" title="Share"> </button>

            <button
              class="pswp__button pswp__button--fs"
              title="Toggle fullscreen"
            />

            <button
              class="pswp__button pswp__button--zoom"
              title="Zoom in/out"
            />

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

          <div
            class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"
          >
            <div class="pswp__share-tooltip" />
          </div>

          <button class="pswp__button pswp__button--arrow--left" title="" />

          <button class="pswp__button pswp__button--arrow--right" title="" />

          <div class="pswp__caption">
            <div class="pswp__caption__center" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
 import VueSlickCarousel from 'vue-slick-carousel'
 import 'vue-slick-carousel/dist/vue-slick-carousel.css'
 import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import config from 'config'
import ProductImage from './ProductImage'
import ProductVideo from './ProductVideo'
import reduce from 'lodash-es/reduce'
import map from 'lodash-es/map'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { getThumbnailPath } from '@vue-storefront/core/helpers'

export default {
  name: 'ProductGalleryCarousel',
  components: {
    VueSlickCarousel,
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
    isBundleItem: {
      type: Boolean,
      required: false,
      default: false
    },
    gallery: {
      type: Array,
      required: true
    },
    galleryZoom: {
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
    },
    customerGallery: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selected: '',
      firstslideIndex : null ,
      mainCarousel:{
          "responsive":[
           {
              "breakpoint": 767,
              "settings": {
              "dots": true
                }
           }
         ],

      },
      
      settingABCD:{
        "lazyLoad" : 'onDemand',
        "responsive": [
          {
            "breakpoint": 1320,
            "settings": {
              "slidesToShow": 3,
            }
          },
          {
            "breakpoint": 992,
            "settings": {
              "slidesToShow": 4,
            }
          }
           
        ]
      },
      newGallery: '',
      slideToChange :null ,
      currentGalleryPage: 0,
      startSlide: 1 ,
      isVideo: [],
      carouselTransition: true,
      carouselTransitionSpeed: 0,
      currentColor: 0,
      currentPage: 0,
      afterchangeCalled: null ,
      hideImageAtIndex: null,
      pswp: null,
      angle: 0,
      onetimeCall:'',
      classDynamicP2: '',
      // zoomDataYes: '',
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
    }
  },
  computed: {

    getProductLabel () {
      return getThumbnailPath(`/${this.productLabel}`, 120, 120, 'stockicon')
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-configure', this.selectVariant)
    this.$bus.$on('product-after-load', this.selectVariant)

  },
  mounted () {
    console.log('gallery', this.gallery)
    var self = this
    this.isVideo = this.gallery.filter((item) => {
      return item.video
    })
    setTimeout(() => {
      this.swipeInitFunction()
      
    }, 200)
      // this.swipeInitFunction()

    this.selectVariant()
    this.initPopUp()

    if (this.configuration.color) {
      const { color } = this.configuration
      this.currentColor = color.id
    }
    this.$emit('loaded')
  },
  beforeDestroy () {
    this.$bus.$off('product-after-configure', this.selectVariant)
    this.$bus.$off('product-after-load', this.selectVariant)
  },
  methods: {
    onErrorIMg (el) {
      el.parentNode.style.display = 'none'

    },

     openFigureGallery () {
      // this.$refs.getProductGallery.$refs.carousel.stopVideo()

      document.getElementsByTagName('figure')[0].click()
      

    },
    initPopUp(val) {
      if(!this.onetimeCall) {
        console.log('calld first time')
        this.onetimeCall = val
        this.swipeInitFunction()
      
      }
    },
    stopVideo () {
      let stopFunc = this.$refs.iframe
      if (this.$refs.iframe && this.$refs.iframe[0] && this.$refs.iframe[0].contentWindow) {
        stopFunc[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
      }
    },
    getEmbedUrl (images) {
      let linkId = images.video.url
      if (linkId.includes('youtu.be')) {
          linkId = linkId.split('/')
          linkId = linkId[linkId.length -1]
      } else {
          linkId = linkId.split('=')
          linkId = linkId[1]
        }
      return `https://www.youtube.com/embed/${linkId}?enablejsapi=1`
    },
    getEmbedUrlNoJsApi (images) {
      let linkId = images.video.url
        if (linkId.includes('youtu.be')) {
          linkId = linkId.split('/')
          linkId = linkId[linkId.length -1]
        } else {
          linkId = linkId.split('=')
          linkId = linkId[1]
        }
        return `https://www.youtube.com/embed/${linkId}`
    },

    getImageFullSize (imageSrc) {
      return this.getThumbnail(imageSrc, config.galleryZoomImageSize.width, config.galleryZoomImageSize.height)
    },
    getImageTypeName (url) {
      const productImageLabel = this.customerGallery.filter((customer) => {
        return customer.src === url
      })
      if (productImageLabel.length > 0) {
        return 'Customer Photos'
      } else {
        return null
      }
    },
    swipeInitFunction () {
      var self = this
      var initPhotoSwipeFromDOM = function (gallerySelector) {
        var parseThumbnailElements = function (el) {
          var thumbElements = el.childNodes
          var newThumbElements = el.parentNode
          var numNodes = thumbElements.length
          var newNumNodes = el.parentNode.parentNode.parentNode.childNodes.length
          var items = []
          var figureEl
          var linkEl
          var size
          var item
          for (var newI = 0; newI < newNumNodes; newI++) {
            figureEl = newThumbElements.parentNode.parentNode.childNodes[newI].childNodes[0].childNodes[0].childNodes[0] // <figure> element
            // include only element nodes
            if (figureEl.nodeType !== 1) {
              continue
            }
            linkEl = figureEl.children[0] // <a> element
            size = linkEl.getAttribute('data-size').split('x')
            // create slide object
            if (linkEl.childNodes[0].getAttribute('data-type') === 'video') {
              item = {
                html: linkEl.childNodes[0].getAttribute('data-video')
              }
            } else {
              item = {
                // src: linkEl.getAttribute('href'),
                src: linkEl.children[0].getAttribute("src"),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
              }
            }
            if (figureEl.children.length > 1) {
              // <figcaption> content
              item.title = figureEl.children[1].innerHTML
            }

            if (linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src')
               // item.mrc = linkEl.getAttribute("href");
            }

            item.el = figureEl // save link to element for getThumbBoundsFn
            items.push(item)
          }

          return items
        }

        // find nearest parent element
        var closest = function closest (el, fn) {
          return el && (fn(el) ? el : closest(el.parentNode, fn))
        }

        // triggers when user clicks on thumbnail
        var videoSlide = (e) => {
          var nodes = document.querySelector('.slick-track')
          var node = document.querySelector('.slick-slide')
          var index
          for (var i = 0; i < nodes.childNodes.length; i++) {
            let currentNode = nodes.childNodes[i]
            if (currentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].tagName.toUpperCase() === 'IFRAME') {
              index = i
            }
          }
          openPhotoSwipe(index, node.childNodes[0].childNodes[0])
        }
        var onThumbnailsClick = function (e) {
          if (e.target.classList.length > 0) {
            return
          }
          e = e || window.event
          e.preventDefault ? e.preventDefault() : e.returnValue = false

          var eTarget = e.target || e.srcElement
          // find root element of slide
          var clickedListItem = closest(eTarget, (el) => {
            // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE')
             document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          })

          if (!clickedListItem) {
            return
          }
          // find index of clicked item by looping through all child nodes
          // alternatively, you may define index via data- attribute
          var clickedGallery = clickedListItem.parentNode.parentNode
          var childNodes = clickedListItem.parentNode.parentNode.parentNode.parentNode.childNodes
          var numChildNodes = childNodes.length
          var nodeIndex = 0
          var index
          var zoomYes

          for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
              continue
            }
            if (childNodes[i].childNodes[0].childNodes[0].childNodes[0] === clickedListItem) {
              index = nodeIndex
              // if (clickedListItem.childNodes[2].innerText.includes('Customer')) {
              //   // this.zoomDataYes = 1
              // } else {
              //   // this.zoomDataYes = 0
              // }
              //break
            }
            nodeIndex++
          }

          if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedListItem.parentNode)
          }
          return false
        }

        // parse picture index and gallery index from URL (#&pid=1&gid=2)
        var photoswipeParseHash = function () {
          var hash = window.location.hash.substring(1)
          var params = {}

          if (hash.length < 5) {
            return params
          }

          var vars = hash.split('&')
          for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
              continue
            }
            var pair = vars[i].split('=')
            if (pair.length < 2) {
              continue
            }
            params[pair[0]] = pair[1]
          }

          if (params.gid) {
            params.gid = parseInt(params.gid, 10)
          }

          return params
        }

        var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
          document.getElementById('minicarticon').disabled = true;
          var pswpElement = document.querySelectorAll('.pswp')[0]
          var gallery
          var options
          var items

          items = parseThumbnailElements(galleryElement)
          // define options (if needed)

          options = {
            history: false,
            shareEl: true,
            closeOnScroll: true,
            closeOnVerticalDrag : false,
            closeElClasses: [],
            hideAnimationDuration: 500,
            // define gallery index (for URL) testing
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            // maxSpreadZoom: zoomYes === 1 ? 2 : 2,
            // getDoubleTapZoom: function (isMouseClick, item) {
            //   return zoomYes === 1 ? 1 : 1;
            // },
            // zoomEl: true,
            clickToCloseNonZoomable: false,

            getThumbBoundsFn: function (index) {
              let videoContainer = document.getElementById('iframe_container')
              if (videoContainer) {
                videoContainer.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
              }
              if (!document.getElementsByClassName('pswp__ui--hidden')[ 0 ]) {
                document.getElementsByTagName('body')[0].style.overflow = 'scroll';
                document.getElementsByTagName('body')[0].style.overflowX = 'auto';
              }
              // See Options -> getThumbBoundsFn section of documentation for more info
              var thumbnail = items[index].el.getElementsByTagName('img')[0]
               ? items[index].el.getElementsByTagName('img')[0]
                : items[index].el.getElementsByTagName('iframe')[0] // find thumbnail
              var pageYScroll =
               window.pageYOffset || document.documentElement.scrollTop
              var rect = thumbnail.getBoundingClientRect()

              return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
            }

          }

          // PhotoSwipe opened from URL
          if (fromURL) {
            if (options.galleryPIDs) {
              // parse real index when custom PIDs are used
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for (var j = 0; j < items.length; j++) {
                if (items[j].pid == index) {
                  options.index = j
                  break
                }
              }
            } else {
              // in URL indexes start from 1
              options.index = parseInt(index, 10) - 1
            }
          } else {
            options.index = parseInt(index, 10)
          }

          // exit if index not found
          if (isNaN(options.index)) {
            return
          }

          if (disableAnimation) {
            options.showAnimationDuration = 0
          }

          // Pass data to PhotoSwipe and initialize it
          gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
          gallery.listen('resize', () => {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          });
          gallery.listen('close', () => {
            document.getElementsByTagName('body')[0].style.overflow = 'scroll';
            document.getElementsByTagName('body')[0].style.overflowX = 'auto';
            setTimeout(() => {
              document.getElementById('minicarticon').disabled = false;
            }, 100);
          });
          gallery.init()
        }

        // loop through all gallery elements and bind events
        var galleryElements = document.querySelectorAll(gallerySelector)
        for (var i = 0, l = galleryElements.length; i < l; i++) {
          galleryElements[i].setAttribute('data-pswp-uid', i + 1)
          self.$refs.play.onclick = videoSlide
          self.$refs.playMobile.onclick = videoSlide
          galleryElements[i].onclick = onThumbnailsClick
        }

        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = photoswipeParseHash()
        if (hashData.pid && hashData.gid) {
          openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)
        }
      }
      let classDynamicP1 = document.getElementById('media-gallery-carousel')
      if (classDynamicP1) {
        this.classDynamicP2 = classDynamicP1.childNodes[0]?.childNodes[1]?.childNodes[0]?.classList[0]
        if(!this.classDynamicP2){
          this.classDynamicP2 = classDynamicP1.childNodes[0]?.childNodes[0]?.childNodes[0]?.classList[0]
        }
        initPhotoSwipeFromDOM('.' + this.classDynamicP2)
      }
    },
    navigate (index) {
      if (this.$refs.carousel) {
        // this.$refs.carousel.goToPage(index)
      }
    },
    selectVariant () {
      if (config.products.gallery.mergeConfigurableChildren) {
        const option = reduce(
          map(this.configuration, 'attribute_code'),
          (result, attribute) => {
            result[attribute] = this.configuration[attribute].id
            return result
          },
          {}
        )
        if (option) {
          let index = this.gallery.findIndex(
            (obj) =>
              obj.id &&
              Object.entries(obj.id).toString() ===
              Object.entries(option).toString(),
            option
          )
          if (index < 0) {
            index = this.gallery.findIndex(
              (obj) => obj.id && obj.id.color === option.color
            )
          }
          this.navigate(index)
        }
      }

      this.$emit('close')
    },
    openOverlay () {
      const currentSlide = this.$refs.carousel.currentPage
      this.$emit('toggle', currentSlide)
    },
    switchCarouselSpeed () {
      const { color } = this.configuration
      if (color && this.currentColor !== color.id) {
        this.currentColor = color.id
        this.carouselTransitionSpeed = 0
      } else {
        this.carouselTransitionSpeed = 500
      }
    },

    pageChange (index) {
      this.stopVideo()
      this.currentPage = index
      this.hideImageAtIndex = null
      this.afterchangeCalled = 'called'
    },
    beforeChange (oldSlide,newSlide) {
       this.$emit('pageChange', newSlide)
      this.selected = ""
      this.firstslideIndex = newSlide

    },

    onSelect(slide,imgSrc)  {
      this.selected = imgSrc
      this.firstslideIndex = null

      if(!this.afterchangeCalled && !this.startSlide) {
        setTimeout(() => {
        this.$refs.carousel.goTo(slide)
        this.startSlide = 0
      }, 500);
      } else {
        this.$refs.carousel.goTo(slide)
        this.startSlide = 0
      }
      this.slideToChange = slide
      this.afterchangeCalled = null
    },

    onVideoStarted (index) {
      this.hideImageAtIndex = index
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';

.Galleries{
  display:flex;
  margin-top: 12px;
}

.youtubeIcon {
  background: url(/assets/images/youtube.png) center center no-repeat;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  z-index: 2000;
  cursor: pointer;
  pointer-events: none;
}

.main-gallery{
  width:79%;
  @media (max-width: 1199px) {
    width:76%;
  }
  @media (max-width: 991px) {
    width:84%;
  }
}

.Viewgallery {
  @media (max-width: 1199px) {
    width: 24%;
  }
  @media (max-width: 991px) {
    width: 16%;
  }
}


@media screen and (min-width: 768px) {
  .margan {
    padding-bottom: 94% !important;
  }
}

.border-grey-light {
  border: 2px solid #2e525a6e;
}

.border-blue {
  border: 2px solid #29275b;
}

.pswp,
.pswp--open {
  z-index: 9999 !important;
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
@media (max-width: 480px){
.cls-Class{
  position: relative;
  padding-bottom: 100%;
}
}
</style>






<style lang="scss">
.main-gallery-thumbnail {
  .slick-track {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
@media screen and (min-width: 992px) and (max-width: 1199px) {
    .thumbnail-arrows {
      .slick-slide{
        padding:0px !important;
        padding-top: 5px !important;
      }
    }
}
@media screen and (min-width: 1200px) and (max-width: 1300px) {
    .thumbnail-arrows {
      .slick-slide{
        padding:2px !important;
        padding-top: 5px !important;
      }
    }
}

.videoDiv {
  position: relative;
  z-index: -1;
  cursor: pointer;
}
.media-gallery-carousel {
  position: relative;
  text-align: center;
  height: 100%;
  .main-gallery-thumbnail{
    img{
      cursor: pointer;
    }
  }
  .slick-slide {
    img {
      @media (max-width: 991px) {
        // max-height: 572px;
        object-fit: cover;
      }
    }
  }
}
.Viewgallery{
    width:21%;
    padding-top: 40px;

 a{
    padding-left: 14px;
    font-weight: bold;
    color: #29275b;
    font-family: Arial;
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
  }
}
  .thumbnail-arrows .slick-prev {
    left: -14px;
    @media (max-width: 991px) {
      left: -4px;
    }
     &:before{
      content: '\2192';
      background: transparent;
      color: transparent;
      background: url(/assets/back.svg) no-repeat;
    }
  }
  .thumbnail-arrows .slick-next {
    right: -20px;
    @media (max-width: 991px) {
      right: -4px;
    }
    &:before{
      content: '\2192';
      background: transparent;
      color: transparent;
      background: url(/assets/next.svg) no-repeat;
    }

  }
  .thumbnail-arrows {
    padding-left: 7px;
    .slick-track {
      min-width: 100%;
    }
    .slick-slide {
      padding: 4px;
      cursor: pointer;
      position: relative;
      max-width: 110px;
      outline: 0 !important;
      & *,
      &:focus{
        outline: 0 !important;
      }
      @media (max-width: 1320px) {
        max-width: initial;
      }
      @media (max-width: 991px) {
        max-width: 144px;
        display: flex !important;
        justify-content: center;
      }
      @media (max-width: 790px) {
        max-width: 141px;
      }
      @media (max-width: 768px) {
        max-width: 139px;
      }

      // &.slick-current.slick-active {
      //   img {
      //     border-color: #29275b;
      //   }
      // }
      .active-img-slide, .drag-active {
        border-color: #29275b;
      }
    }
     img{
      border: 2px solid #2e525a6e;
      max-height: 100px;
      max-width: 100px;
      cursor: pointer;
      width: 100%;
    }
    .videoDiv{
      width: 100px;
      max-height:100px ;
    }
  }
#iframe_container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
}

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
  margin-right: 14px
}

.rightArrow {
    position: relative;
    left: -13px;
}

.prod-gallery-thumbnails-carousel .VueCarousel-navigation button:focus {
  border: 0;
  outline: 0;
}

// .media-gallery-carousel .VueCarousel-pagination {
//   display: block;
// }

.media-gallery-carousel {
  .sale {
    position: absolute;
    right: 0;
    top: 27px;
    background-color: #ed108c;
    color: #fff;
    font-family: Arial;
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
  .videoDiv {
    width: 100% !important;
  }
  .product-recent-listing-carousel .VueCarousel-navigation-prev {
    left: 13% !important;
    transform: translateY(-50%) translateX(-100%) !important;
    font-family: 'system' !important;
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
  .product-recent-listing-carousel .VueCarousel-navigation-next {
    right: 13% !important;
    transform: translateY(-50%) translateX(100%);
    font-family: 'system';
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
    font-family: 'system' !important;
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
  .product-recent-listing-carousel .VueCarousel-navigation-next {
    right: 8% !important;
    transform: translateY(-50%) translateX(100%);
    font-family: 'system';
    background-color: #29275b !important;
    opacity: 0.7;
    color: white !important;
    padding: 0px !important;
    top: 33% !important;
  }
}

@media (max-width: 767px) {
.Galleries{
  display:none !important;
  }

  .video-wrapper #iframe_container {
    width: 100% !important;
    height: 36% !important;
  }
  .product-recent-listing-carousel {
    margin-top: 10px;
  }
  .product-recent-listing-carousel .arrow-mobile {
    font-size: 36px;
    padding: 0px;
  }
  @media (min-width: 480px){
  .media-gallery {
    min-height: auto !important;
    }
  }
  .media-zoom-carousel__slide .product-image.product-image--width {
    padding-bottom: 85% !important;
  }
  .for-desktop {
    display: none;
  }
  // .for-mobile {
  //   display: block !important;
  // }
  .zoom-in {
    position: absolute !important;
    top: 5px !important;
    left: -35px !important;
    height: 60px;
    width: auto;
  }
  // .media-gallery-carousel {
  //   .VueCarousel-pagination {
  //     .VueCarousel-dot {
  //       background-color: #f50808 !important;
  //       width: 12px !important;
  //       height: 12px !important;
  //     }

  //     .VueCarousel-dot.VueCarousel-dot--active {
  //       background-color: #f509d5 !important;
  //       height: 12px !important;
  //       width: 12px !important;
  //     }
  //   }

  //   .sale {
  //     top: 0px;
  //   }
  // }
  
  .slick-dots {
}
.slick-dots li button {
    cursor: pointer;
    border: 0;
    outline: none;
    background: #f9f9f900 !important;
}
.slick-dots li button:before {
    // font-family: 'slick';
    font-size: 16px;
    opacity: 1;
    color: #dcdcdc !important;
}
.slick-dots li.slick-active button:before {
    color: #EE4C56 !important;
        opacity: 1;
}

}

@media (max-width: 1320px) {
  #iframe_container {
    width: 76% !important;
    height: 50% !important;
  }
}

figure {
  display: block;
  margin: 0px;
  // width: 100%;
  position: relative;
}

figure img {
  width: 100%;
}
@media (max-width: 767px) {
 figure img {
  width: auto !important;
}
}


 .pswp__img{
  height: auto !important;
}

.pswp__bg {
  background: rgb(0, 0, 0) !important;
}
@media (min-width: 480px) {
img.pswp__img {
    transform: translateY(80px);
    height: auto !important;
}
}
// .pswp__button--share {
//     background-position: -45px -44px;
// }

.pswp__caption {
  top: 44px;
  width: auto;
  bottom: unset;
  background-color: #ff0000 !important;
  font-weight: 900 !important;
  right: 0;
  left: unset;
  min-height: auto !important;
}
.image_label_one {
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: none;
}
.image_label {
  display: block;
  margin-left: auto;
  cursor: default;
}
.pswp__caption__center {
  color: #fff;
  padding: 0;
}

// div#media-gallery-carousel figcaption {
//   display: none;
// }
div.bt-product-gallery .leftArrow{
  visibility: hidden;
}
div.bt-product-gallery .rightArrow{
  visibility: hidden;
}
</style>
