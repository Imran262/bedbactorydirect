<template>
  <div class="similar-cut-sample">
    <no-ssr>
      <carousel
        :per-page-custom="[
          [320, 2],
          [375, 2],
          [768, 3],
          [1000, 4],
          [1200, 4]
        ]"
        :center-mode="false"
        :navigation-enabled="true"
        :pagination-enabled="false"
        navigation-next-label="<i class='recent-right-arrow cl-bg-tertiary-new arrow-mobile  material-icons p15  pointer'>keyboard_arrow_right</i>"
        navigation-prev-label="<i class='recent-left-arrow cl-bg-tertiary-new arrow-mobile material-icons p15  pointer'>keyboard_arrow_left</i>"
      >
        <slide v-for="(product, index) in similarProducts.items" :key="index">
          <product
            :product="product"
          />
        </slide>
      </carousel>
    </no-ssr>
  </div>
</template>
<script>
import NoSSR from 'vue-no-ssr';
import product from 'theme/components/custom/similar/Product'
export default {
  name: 'SimilarCutSample',
  components: {
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    product,
    'no-ssr': NoSSR
  },
  props: {
    similarProducts: {
      type: Object,
      required: false,
      default: null
    }
  }
};
</script>

<style scoped>
.similar-cut-sample {
  margin-top: 40px;
}
</style>

<style lang="scss">
  .similar-cut-sample {
    .VueCarousel-navigation-button:focus {
     outline: 1px solid transparent !important;
    }
    .p15{
      padding: 0px;
    }
  }
  @media(max-width: 767px){
      .similar-cut-sample{
        .VueCarousel-navigation-button {
          top: 30% !important;
        }
        .VueCarousel-navigation {
          opacity: 1 !important;
        }
        .VueCarousel-navigation-next{
            right: 39px !important;
            background: url(/assets/next.png) no-repeat !important;
            content: none !important;
            height: 80px !important;
            width: 65px !important;
            display: block !important;
            i{
              display: none !important;
            }
        }
        .VueCarousel-navigation-prev{
            left: 55px !important;
            background: url(/assets/back.png) no-repeat !important;
            content: none !important;
            height: 80px !important;
            width: 65px !important;
            display: block !important;
            i{
              display: none !important;
            }
        }
      }
    }
    @media(min-width: 767px) and (max-width: 991px){
      .VueCarousel-navigation {
          opacity: 1 !important;
        }
    }
</style>
