<template>
  <div>
    <no-ssr>
      <carousel
        :autoplay="true"
        :per-page-custom="[
          [320, 1],
          [768, 1],
        ]"
      >
        <slide v-for="slide in mobileSlides" :key="slide.id">
          <div class="homepage-mobile-slider">
            <router-link
              class="shop-now"
              :to="localizedRoute(slide.buttonLinkMobile)"
            >
              <img :src="slide.image" />
            </router-link>
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
  name: "SliderMobile",
  components: {
    "no-ssr": NoSSR,
    Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
  },
  mixins: [cmsBlock],
  computed: {
    mobileSlides() {
      if (!this.data) return false;

      let { title, identifier, content, id, active } = this.data;
      let slides = [];
      let liParsedSlides = this.parsedContent.querySelectorAll("li");

      if (liParsedSlides.length === 0) return false;

      liParsedSlides.forEach(function (slide, index) {
        let id = slide.querySelector("id").innerHTML,
          img = slide.querySelector("img").attributes["src"],
          routeLink = slide.querySelector("a").innerHTML;

        let slideObj = {
          id,
          image: img,
          buttonLinkMobile: routeLink,
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
