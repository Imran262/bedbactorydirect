<template>
  <div class="sb-slider-wrapper">
    <div class="container">
      <no-ssr>
        <carousel :per-page="1" :loop="true" :autoplay="true">
          <slide>
            <router-link to="/about">
              <img
                src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg"
                alt="tiles slider"
              />
            </router-link>
          </slide>
          <slide>
            <router-link to="/about">
              <img src="/assets/the_first.1585732759.jpg" alt="tiles slider" />
            </router-link>
          </slide>
          <slide>
            <router-link to="/about">
              <img
                src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg" alt="tiles slider"
              />
            </router-link>
          </slide>
          <slide>
            <router-link to="/about">
              <img
                src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg" alt="tiles slider"
              />
            </router-link>
          </slide>
          <slide>
            <router-link to="/about">
              <img
                src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg" alt="tiles slider"
              />
            </router-link>
          </slide>
          <slide>
            <router-link to="/about">
              <img
                src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg" alt="tiles slider"
              />
            </router-link>
          </slide>
        </carousel>
      </no-ssr>
    </div>
    <div>
      <img src="/assets/Tiles_to_iles_slider_2020-08-10.1597111369.jpg" alt="tiles" />
    </div>
  </div>
</template>



<script>
import NoSSR from "vue-no-ssr";
export default {
  name: "desktopSlider",
  components: {
    Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
    "no-ssr": NoSSR,
  },
};
</script>
<style >
.sb-slider-wrapper {
  background-color: #4f98d0;
  margin: 0;
  width: 100%;
}
.VueCarousel-pagination {
  width: 100%;
  position: absolute;
  bottom: 20px;
  height: 0;
  margin-bottom: 65px;

  left: 20px;
}

.sb-slider-wrapper img {
  border: 0;
  vertical-align: top;
  max-width: 100%;
}
.VueCarousel-dot {
  display: block;
  width: 10px !important;
  height: 10px !important;
  border-radius: 20px !important;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  opacity: 1;
}
.VueCarousel-dot.VueCarousel-dot--active {
  margin-top: 20px;
  padding: 10px;
  width: 10px;
  height: 10px;
  background-color: #e10081 !important;
}
.VueCarousel-dot.VueCarousel-dot--active:after {
  margin-top: 20px;
  padding: 10px;
  width: 10px;
  height: 10px;
  background-color: #e10081 !important;
}
a img::after {
  text-decoration: none;
}
a.underline:after,
a:not(.no-underline):hover:after {
  display: none;
}
</style>