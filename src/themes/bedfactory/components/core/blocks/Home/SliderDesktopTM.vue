<template>
  <div>
    <template v-if="objectLength(desktopSlides) === 1">
      <div v-for="slide in desktopSlides" :key="slide.id" class="slides">
        <div class="row">
          <div
            v-if="slide.title && slide.button"
            @click="navigate(slide.buttonLink)"
            class="homepage-slider col-lg-12 col-md-12 col-sm-12 col-xs-12 draggable"
          >
            <!--          <router-link :to="localizedRoute(slide.buttonLink)" target="_self">-->
            <img :src="slide.image" class="desktop" alt="homeslider image"/>
            <img :src="slide.mobile" class="mobile" alt="homeslider image"/>
            <!--          </router-link>-->
          </div>
          <div
            v-else
            class="homepage-slider col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <div class="homepage-slider-detail-img-only">
              <router-link
                class="shop-now"
                v-if="slide.buttonLink"
                :to="localizedRoute(slide.buttonLink)"
              >
                <img :src="slide.image" class="desktop" alt="homeslider image"/>
                <img :src="slide.mobile" class="mobile" alt="homeslider image"/>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <VueSlickCarousel :dots="true" class="home-page-slider" v-if="desktopSlides">
        <div v-for="slide in desktopSlides" :key="slide.id" class="slides">
          <div class="row">
            <div
              v-if="slide.title && slide.button"
              class="homepage-slider col-lg-12 col-md-12 col-sm-12 col-xs-12 draggable"
              id="button"
              ref="draggableRoot"
              @click="navigate(slide.buttonLink)"
              @pointerdown="handleDown"
              @pointerup="handleUp"
              @pointercancel="handleUp"
            >
              <!--          <router-link :to="localizedRoute(slide.buttonLink)" target="_self">-->
              <img :src="slide.image" class="desktop" alt="homeslider image"/>
              <!--          </router-link>-->
            </div>
            <div
              v-else
              class="homepage-slider col-lg-12 col-md-12 col-sm-12 col-xs-12"
            >
              <div class="homepage-slider-detail-img-only">
                <router-link
                  class="shop-now"
                  v-if="slide.buttonLink"
                  :to="localizedRoute(slide.buttonLink)"
                >
                  <img :src="slide.image" class="desktop" alt="homeslider image"/>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </VueSlickCarousel>
    </template>
  </div>
</template>

<script>
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'SliderDesktop',
  components: {
    VueSlickCarousel
  },
  data () {
    return {
      drag: false,
      click: false
    }
  },
  mixins: [cmsBlock],
  computed: {
    desktopSlides () {
      // console.log('desktopSlides Desktop', this.data)
      if (!this.data) { return false }
      let slides = []
      let liParsedSlides = this.parsedContent.querySelectorAll('li')
    //  console.log(" parsed slides" , liParsedSlides);
      if (liParsedSlides && liParsedSlides.length === 0) return false
      liParsedSlides.forEach((slide, index) => {
        let mobileImage = ''
        let desktopImage = ''
        let imagesBoth = slide.querySelectorAll('img')
        imagesBoth.forEach((img, index) => {
          if (img.classNames[0] === 'desktop') {
            desktopImage = img.attributes['src']
          }
          if (img.classNames[0] === 'mobile') {
            mobileImage = img.attributes['src']
          }
        })
        let id = slide.querySelector('label').innerHTML
        let title = slide.querySelector('h2')
          ? slide.querySelector('h2').innerHTML
          : null
        let img = slide.querySelector('img').attributes['src']
        let button = slide.querySelector('button')
          ? slide.querySelector('button').innerHTML
          : null
        let routeLink = slide.querySelector('a')
          ? slide.querySelector('a').innerHTML
          : null
        let slideObj = {
          id,
          title,
          mobile: mobileImage,
          image: desktopImage,
          button,
          buttonLink: routeLink
        }
      //  console.log('slideObj',slideObj);
        slides.push(slideObj)
      })
      return slides
    }
  },
  methods: {
    objectLength (obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },
    navigate (buttonLink) {
      if (!this.drag) {
        this.click = !this.click
        this.$router.push(this.localizedRoute(buttonLink))
      }
    },
    handleMove () {
      this.drag = true
    },
    handleDown () {
      document.addEventListener('pointermove', this.handleMove)
    },
    handleUp () {
      document.removeEventListener('pointermove', this.handleMove)
      setTimeout(() => {
        this.drag = false
      }, 50)
    }
  }
};
</script>
<style>
.VueCarousel-pagination {
  position: absolute;
  bottom: 0;
}
</style>
<style lang="scss" scoped>
.homepage-slider {
  cursor: pointer;
  padding-bottom: 23%;
  position: relative;
  img {
    width: 100%;
    height: auto;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    object-fit: contain;
  }

  .homepage-slider-detail {
    position: absolute;
    width: 35%;
    bottom: 30%;
    margin-left: 10%;

    .shop-now {
      pointer-events: none;
      background: #d6de28;
      border-radius: 30px;
      padding: 12px 20px;
      box-shadow: none;
      color: #424242;
      width: 220px;
      font-size: 17px;
      margin-top: 10px;
    }

    h2 {
      color: #fff;
      font-size: 26px;
    }
  }

  .homepage-slider-detail-img-only {
    width: 100%;
    height: 100%;
  }
}

.hidden {
  display: none !important;
}

@media (max-width: 767px) {
  .homepage-slider .homepage-slider-detail h2 {
    font-size: 24px;
  }
  .homepage-slider .homepage-slider-detail {
    position: absolute;
    width: 56%;
    bottom: 30%;
    margin-left: 10%;
  }
  .homepage-slider .desktop {
    display: none;
  }
  .homepage-slider {
    position: relative;
    top: 4px;
  }
  .homepage-slider img {
    width: 100%;
    height: 299px;
  }
}

@media (min-width: 768px) {
  .homepage-slider .mobile {
    display: none;
  }
  .homepage-slider {
    img {
      width: 100%;
      height: 100%;
    }

    .homepage-slider-detail {
      position: absolute;
      width: 30%;
      bottom: 30%;
      margin-left: 10%;

      h2 {
        color: #fff;
        font-size: 60px;
      }
    }

    .homepage-slider-detail-img-only {
      width: 100%;
      height: 100%;
    }
  }
  .hidden {
    display: none !important;
  }
}

@media only screen and (max-width: 1024px) and (min-width: 768px) {
  .homepage-slider .homepage-slider-detail h2 {
    font-size: 28px;
  }
}

@media only screen and (max-width: 1514px) and (min-width: 1025px) {
  .homepage-slider .homepage-slider-detail h2 {
    font-size: 39px;
  }
}

@media only screen and (max-width: 1514px) {
  .homepage-slider .homepage-slider-detail h2 sub {
    vertical-align: text-top;
    font-size: 21px;
    margin: 0;
    bottom: 11px;
    left: -4px;
    position: relative;
  }
}

h2 sub {
  vertical-align: text-top;
  font-size: 35px;
  margin: 0;
  bottom: 4px;
  left: -10px;
  position: relative;
}

ul.slick-dots {
  position: absolute;
  bottom: 20px;
  height: 0;
  margin-bottom: 20px;
  left: 20px;
}

.homepage-slider a {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
<style>
.home-page-slider ul.slick-dots {
  position: absolute;
  bottom: 20px;
  height: 0;
  margin-bottom: 20px;
  left: 20px;
}

.home-page-slider .slick-dots li button:before {
  font-size: 12px;
  opacity: 1;
  color: #fff;
}

.home-page-slider .slick-dots li.slick-active button:before {
  opacity: 1;
  color: #EE4C56 !important;
}
</style>
<style scoped>
img {
  pointer-events: none;
}

/* a {
  pointer-events: none;
} */
</style>
