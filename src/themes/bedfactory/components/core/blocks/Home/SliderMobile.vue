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
              <img :src="slide.mobile" class="mobile"/>
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
                  <img :src="slide.mobile" class="mobile"/>
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
import cmsBlock from 'vsf-cms-block-mixin/components/cmsBlock';
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'SliderMobile',
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
  mounted () {
    console.log('Mounted called')
  },
  computed: {
    desktopSlides () {
      // console.log('desktopSlides mobile', this.data)
      if (!this.data) { return false }
      let slides = []
      let liParsedSlides = this.parsedContent.querySelectorAll('li')
      // console.log("7896541 ",liParsedSlides);
      if (liParsedSlides && liParsedSlides.length === 0) return false
      liParsedSlides.forEach((slide, index) => {
        let mobileImage = ''
        let desktopImage = ''
        let imagesBoth = slide.querySelectorAll('img')
        // console.log("7896541 images",imagesBoth);
        mobileImage = imagesBoth[0].attributes['src']
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

<style scoped >
.mobile {
  width: 100%;
}
*{
	outline: none;
}
</style>

<style lang=scss>
.homepage-slider-detail-img-only{
  padding-bottom: 90%;
  position: relative;
  a{
    position: unset !important;
  }
  img.mobile{
    width: 100%;
    height: auto;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 51%;
    left: 50%;
    object-fit: contain;
  }
}
</style>
