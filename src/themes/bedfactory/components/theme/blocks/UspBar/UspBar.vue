<template>
  <div class="main-usp-bar">
    <div class="usp-bar container focusUnsetChild">
      <VueSlickCarousel v-bind="settings">
        <div class="focusUnset" v-for="slide in uspData" :key="slide.id">
          <div class="bus-img-main">
            <router-link :to="localizedRoute(slide.actuallink)" class="usp-a">
              <div class="bus-img">
                <img
                  :src="slide.icon"
                  style="height: 24px"
                  class="icons_home"
                />
              </div>
              <div class="home_delivery_text">{{ slide.linktext }}</div>
              <!-- <span>{{ slide.linktext }}</span> -->
            </router-link>
            <!-- <router-link :to="localizedRoute(slide.actuallink)" class="usp-a">
                  <div class="bus-img">
                  </div>
                  <div class="home_delivery_text">{{ singleblock.linktext }}</div>
                  </router-link> -->
          </div>
        </div>
      </VueSlickCarousel>

      <!-- <div class="container">
         <div class="usp-bar-inner">
         <CmsBlock identifier="usp-bar-TM" />
         </div>
         </div> -->
      <!-- <div :class="['bedfactorydirect', 'row']" v-if="data"> -->
      <!-- <div
         class="bus-img-main col-sm-3"
         v-for="(singleblock, index) in uspData"
         :key="index"
          >
           <router-link :to="localizedRoute(singleblock.actuallink)" class="usp-a">
            <div class="bus-img">
            <img
              :src="singleblock.icon"
              alt="icons"
              style="height: 24px"
              class="icons_home"
            />
               </div>
            <div class="home_delivery_text">{{ singleblock.linktext }}</div>
            </router-link>
           </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

import CmsBlock from "theme/components/core/blocks/Cms/Block";
import cmsBlock from "vsf-cms-block-mixin/components/cmsBlock";
// import NoSSR from "vue-no-ssr";
export default {
  components: {
    CmsBlock,
    VueSlickCarousel,
    // "no-ssr": NoSSR,
    // Carousel: () => import("vue-carousel").then((Slider) => Slider.Carousel),
    // Slide: () => import("vue-carousel").then((Slider) => Slider.Slide),
  },
  data() {
    return {
      settings: {
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnFocus: true,
        pauseOnHover: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              infinite: true,
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 2000,
              pauseOnHover: true,
            },
          },
          {
            breakpoint: 767,
            settings: {
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              focusOnSelect: false,
              autoplaySpeed: 5000,
            },
          },
        ],
      },
    };
  },
  name: "homeDelivery",
  mixins: [cmsBlock],
  computed: {
    uspData() {
      let storeAllData = [];
      if (this.data) {
        let saveAllData = this.parsedContent.querySelectorAll(".item");
        saveAllData.forEach((data, index) => {
          let anchortext = data.querySelector("a")
            ? data.querySelector("a").innerHTML
            : "";
          let anchorlink = data.querySelector("a")
            ? data.querySelector("a").getAttribute("href")
            : "";
          let imgicon = data.querySelector("img")
            ? data.querySelector("img").getAttribute("src")
            : " ";
          // console.log('this is img' , imgicon)
          let dataObject = {
            linktext: anchortext.toString(),
            actuallink: anchorlink.toString(),
            icon: imgicon.toString(),
          };
          storeAllData.push(dataObject);
        });
        return storeAllData;
      }
    },
    title() {
      return config?.themeConfigurations?.title;
    },
  },
  methods: {},
};
</script>
<style lang='scss'>
.focusUnset:focus {
  outline: unset !important;
}
.focusUnsetChild > div:focus {
  outline: unset !important;
}
.usp-bar {
  text-align: center !important;
}
.main-usp-bar {
  background-color: #F1F8FF;
}
.usp-bar-box {
  img {
    width: 18px;
    height: 15px;
    padding-right: 5px;
  }
  p {
    display: inline;
  }
}
.mobile-view {
  text-align: center;
}
@media screen and (max-width: 1200px) {
  .usp-bar {
    // display: none;
  }
}

a.usp-a {
  display: inline-flex;
  padding: 12px 0 12px 0;
}
.home_delivery_text {
  margin-left: 10px;
  margin-top: 4px;
  color: #071a44;
}
/* Landscape tablets and medium desktops */
@media (min-width: 768px) and (max-width: 991px) {
  .home_delivery_text {
    margin-left: 10px;
    margin-top: 4px;
    font-size: 12px;
    color: #071a44;
  }
}
.bedfactorydirect {
  text-align: center;
}
@media only screen and (max-width: 1200px) {
  .bus-img-main {
    width: 100%;
    display: flex;
    justify-content: center;
    max-width: 100%;
  }
}

@media (min-width: 320px) and (max-width: 480px) {
  .main-usp-bar {
    // margin-top: 28px;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .main-usp-bar {
    // margin-top: 10px;
  }
}

// Small devices (landscape phones, 576px and up)
// @media (min-width: 576px) and (max-width: 767.98px) {

//  }

/// mobile view
// @media only screen and (max-width: 576px)
// {
// .main-usp-bar .usp-bar{
//     max-width:60% !important;
//     margin: 0 auto;
// }
// }
</style>