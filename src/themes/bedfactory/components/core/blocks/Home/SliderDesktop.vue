<template>
  <div class="container">
    <no-ssr>
      <carousel
        :autoplay="true"
        :per-page-custom="[
          [480, 1],
          [768, 1],
        ]"
      >
        <slide v-for="slide in desktopSlides" :key="slide.id">
          <div class="row hover">
            <div
              v-if="slide.title && slide.button"
              class="homepage-slider col-lg-12 col-md-12"
            >
              <img :src="slide.image" />
              <div class="homepage-slider-detail">
                <h1>{{ slide.title }}</h1>
                <p>{{ slide.description }}</p>
                <router-link
                  class="shop-now"
                  :to="localizedRoute(slide.buttonLink)"
                  >{{ slide.button }}</router-link
                >
              </div>
            </div>
            <div v-else class="homepage-slider col-lg-12 col-md-12">
              <div class="homepage-slider-detail-img-only">
                <!-- <router-link
                  class="shop-now"
                  :to="localizedRoute(slide.buttonLink)"
                > -->
                <img
                  @click="navigate(slide.buttonLink)"
                  @pointerdown="handleDown"
                  @pointerup="handleUp"
                  @pointercancel="handleUp"
                  :src="slide.image"
                />
                <!-- </router-link> -->
              </div>
            </div>
          </div>
        </slide>
      </carousel>
    </no-ssr>
  </div>
</template>

<script>
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
import NoSSR from "vue-no-ssr";
export default {
  name: "SliderDesktop",
  components: {
    "no-ssr": NoSSR,
    Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
  },
  mixins: [cmsBlock],
  data(){
    return{
      drag : false
    }
  },
  computed: {
    desktopSlides() {
      //  console.log('desktopSlides Desktop', this.data,this.parsedContent)
      if (!this.data) return false;

      let slides = [];
      let liParsedSlides = this.parsedContent.querySelectorAll("li");

      if (liParsedSlides.length === 0) return false;
      // console.log(" parsed slides" , liParsedSlides);
      liParsedSlides.forEach(function (slide, index) {
        let id = slide.querySelector("id").innerHTML,
          title = slide.querySelector("title")
            ? slide.querySelector("title").innerHTML
            : null,
          description = slide.querySelector("description")
            ? slide.querySelector("description").innerHTML
            : null,
          img = slide.querySelector("img").attributes["src"],
          button = slide.querySelector("button")
            ? slide.querySelector("button").innerHTML
            : null,
          routeLink = slide.querySelector("a")
            ? slide.querySelector("a").innerHTML
            : null;

        let slideObj = {
          id,
          title,
          description,
          mobile: ' ',
          image: img,
          button,
          buttonLink: routeLink,
        };
        // console.log('slideObj',slideObj);
        slides.push(slideObj);
      });

      return slides;
    },
  },
  methods: {
    navigate (buttonLink) {
console.log('clickWasTriggered');
if (!this.drag) {
console.log('justATest for Click')
this.click = !this.click
this.$router.push(this.localizedRoute(buttonLink))
}
},
handleMove () {
this.drag = true
},
handleDown () {
document.addEventListener('pointermove', this.handleMove);
console.log('justfetchingDrag', this.drag);
},
handleUp () {
document.removeEventListener('pointermove', this.handleMove)
setTimeout(() => {
this.drag = false;
console.log('draggingIsFalseNow');
}, 50)
}
  },
};
</script>
<style>
.hidden {
  display: none !important;
}
.hover {
  cursor:pointer
    }
</style>
