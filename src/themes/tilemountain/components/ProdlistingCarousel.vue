<template>
  <no-ssr>
    <carousel
      :per-page-custom="[
        [320, 1],
        [480, 2],
        [768, 1],
        [1000, 2],
        [1200, columns]
      ]"
      :navigation-enabled="true"
      :pagination-enabled="false"
      navigation-next-label="<i class='material-icons p15  pointer'>keyboard_arrow_right</i>"
      navigation-prev-label="<i class='material-icons p15  pointer'>keyboard_arrow_left</i>"
    >
      <slide v-for="(product) in products" :key="product.id" class="slider-new-main">
        <prodlistingtile-carousel :product="product" />
      </slide>
    </carousel>
  </no-ssr>
</template>

<script>
import ProdlistingtileCarousel from 'theme/components/ProdlistingtileCarousel';
import NoSSR from 'vue-no-ssr';
let lastHero = 0;
export default {
  name: 'ProdlistingCarousel',
  components: {
    ProdlistingtileCarousel,
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR
  },
  props: {
    products: {
      type: null,
      required: true
    },
    columns: {
      type: [Number, String],
      required: true
    }
  },
  methods: {
    wide(isOnSale, isNew, index) {
      let deltaCondition = index > 0 && (index - 1 - lastHero) % 2 === 0;
      // last image always shouldn't be big, we also need to count from last promoted to check if it will look ok
      let isHero =
        ((isOnSale === '1' || isNew === '1') && deltaCondition) ||
        (index === this.products.length - 1 && (index - lastHero) % 2 !== 0);
      if (isHero) {
        lastHero = index;
      }
      return isHero ? 'col-xs-12' : 'col-xs-6';
    }
  }
};
</script>
<style scoped>
.product-similar-listing-carousel .VueCarousel {
  background: #fff;
  text-align: center;
  padding: 0px 30px 16px 30px;
}
.cart-popup .product-similar-listing-carousel .VueCarousel {
  background: #fff;
  text-align: center;
  padding: 0px 30px;
}
.cart-popup .popup-sliders .VueCarousel-slide {
  margin-left: 10px;
}
@media (max-width: 767px) {
  .cart-popup .popup-sliders .VueCarousel-slide {
    margin-left: 0px;
  }
}
</style>
