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
          <div class="row">
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
                <router-link
                  class="shop-now"
                  :to="localizedRoute(slide.buttonLink)"
                >
                  <img :src="slide.image" />
                </router-link>
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
  computed: {
    desktopSlides() {
      if (!this.data) return false;

      let slides = [];
      let liParsedSlides = this.parsedContent.querySelectorAll("li");

      if (liParsedSlides.length === 0) return false;

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
          image: img,
          button,
          buttonLink: routeLink,
        };
        slides.push(slideObj);
      });

      return slides;
    },
  },
  methods: {},
};
</script>
<style>
.hidden {
  display: none !important;
}
</style>
