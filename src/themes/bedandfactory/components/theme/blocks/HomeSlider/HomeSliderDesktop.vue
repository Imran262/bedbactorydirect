<template>
  <div class="homeslider hidden-xs hidden-sm">
    <SliderDesktop :identifier="'home_slider_desktop'" />
  </div>
</template>

<script>
import SliderDesktop from "../../../core/blocks/Home/SliderDesktop";

export default {
  components: {
    SliderDesktop
  },
  mixins: [SliderDesktop],
  data() {
    return {
      slides: [
        {
          id: 3,
          // title: 'All year round low pricing',
          // description: 'Changing the dynamic of bathroom pricing',
          image: "assets/images/homepage/delivery-banner.png"
          // button: 'Shop Now',
          // buttonlink: '/baths'
        }
      ]
    };
  },
  mounted() {
    console.log("myDatas", this.data);
  }
};
</script>

<style lang="scss">
@media (min-width: 767px) {
  .homeslider {
    .homepage-slider {
      padding-right: 0px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .homepage-slider-detail {
      padding: 30px 30px 10px 10px;
      position: absolute;
      top: 0;
      right: 0;
      width: 25%;

      h1 {
        font-family: "Poppins", sans-serif;
        color: #54575b;
        text-transform: uppercase;
        margin: 0px;
        font-size: 32px;
        letter-spacing: 1px;
        font-weight: 700;
      }

      p {
        color: #54575b;
        font-size: 20px;
        margin-top: 10px;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        font-style: italic;
      }

      .shop-now {
        background: #00bfb3;
        padding: 10px 15px 10px 15px;
        float: right;
        color: #fff;
        font-style: italic;
        -webkit-box-shadow: 1px 5px 13px -4px rgba(0, 0, 0, 0.51);
        -moz-box-shadow: 1px 5px 13px -4px rgba(0, 0, 0, 0.51);
        box-shadow: 1px 5px 13px -4px rgba(0, 0, 0, 0.51);
      }
    }

    .homepage-slider-detail-img-only {
      width: 100%;
      height: 100%;
      h1 {
        font-family: "Poppins", sans-serif;
        color: #54575b;
        text-transform: uppercase;
        margin: 0px;
        font-size: 32px;
        letter-spacing: 1px;
        font-weight: 700;
      }

      p {
        color: #54575b;
        font-size: 20px;
        margin-top: 10px;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        font-style: italic;
      }
    }
  }
  // .VueCarousel-slide:nth-child(2n) .homepage-slider .homepage-slider-detail {
  //   left: 0;
  //   padding: 70px 10px 70px 30px;
  // }
  .VueCarousel-pagination {
    width: auto !important;
    text-align: left !important;
    position: absolute;
    left: 25px;
    bottom: 0;

    .VueCarousel-dot {
      width: 12px !important;
      height: 14px !important;
      margin: 5px 2px;
      background: #ffffff !important;
      border-radius: 5px !important;
      border: 2px solid #e7e7e7 !important;
      padding: 0px !important;
    }

    .VueCarousel-dot--active {
      background: #00998c !important;
      border: 2px solid #ffffff !important;
    }

    .VueCarousel-dot-button {
      background: transparent !important;
      outline: none !important;
    }
  }
}

@media (min-width: 1200px) and (max-width: 1500px) {
  .homeslider {
    .homepage-slider-detail {
      padding: 50px 40px;

      h1 {
        font-size: 25px;
      }

      p {
        font-size: 16px;
      }
    }
  }
}

@media (min-width: 767px) and (max-width: 1200px) {
  .homeslider {
    .homepage-slider-detail {
      // padding: 30px 40px;
      h1 {
        font-size: 16px;
      }

      p {
        font-size: 14px;
      }
    }
  }
}

@media (min-width: 768px) and (max-width: 992px) {
  .homeslider {
    .homepage-slider {
      margin-top: 24px;

      .homepage-slider-detail {
        width: 25%;

        p {
          margin-top: 5px;
          margin-bottom: 5px;
        }

        .shop-now {
          padding: 5px 10px 5px 10px;
        }
      }
    }
  }
  .VueCarousel-slide:nth-child(2n) .homepage-slider .homepage-slider-detail {
    width: 25%;
  }
}
</style>
