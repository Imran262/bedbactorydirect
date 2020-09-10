<template>
  <div class="homeslider hidden-md hidden-lg hidden-xl">
    <SliderMobile :identifier="'home_slider_mobile'" />
  </div>
</template>

<script>
  import SliderMobile from "../../../core/blocks/Home/SliderMobile";
  export default {
    components: {
      SliderMobile
    }
  };
</script>

<style lang="scss">
  @media (max-width: 767px) {
    .homepage-mobile-slider{
      img{
        width:100%;
      }
    }
    .VueCarousel-pagination {
      width: auto !important;
      text-align: left !important;
      position: absolute;
      left: 5px;
      bottom: 7px;
      .VueCarousel-dot {
        width: 10px !important;
        height: 10px !important;
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
</style>
