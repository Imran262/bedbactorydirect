<template>
  <no-ssr>
    <carousel
      :per-page-custom="[
        [320, 2],
        [375, 2],
        [768, 3],
        [1000, columns],
        [1200, columns]
      ]"
      :center-mode="false"
      :navigation-enabled="true"
      :pagination-enabled="false"
      navigation-next-label="<i class='recent-right-arrow cl-bg-tertiary-new arrow-mobile  material-icons p15  pointer'>keyboard_arrow_right</i>"
      navigation-prev-label="<i class='recent-left-arrow cl-bg-tertiary-new arrow-mobile material-icons p15  pointer'>keyboard_arrow_left</i>"
    >
      <slide v-for="(product, index) in linkedProducts" :key="index" class="slider-new-main">
        <prodlistingtile-carousel :product="product"/>
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
  data () {
    return {
      linkedProducts: []
    };
  },
  props: {
    products: {
      type: null,
      required: true
    },
    columns: {
      type: [Number, String],
      required: true
    },
    prod: {
      type: Object,
      required: true
    }
  },
  methods: {
    wide (isOnSale, isNew, index) {
      let deltaCondition = index > 0 && (index - 1 - lastHero) % 2 === 0;
      // last image always shouldn't be big, we also need to count from last promoted to check if it will look ok
      let isHero =
        ((isOnSale === '1' || isNew === '1') && deltaCondition) ||
        (index === this.products.length - 1 && (index - lastHero) % 2 !== 0);
      if (isHero) {
        lastHero = index;
      }
      return isHero ? 'col-xs-12' : 'col-xs-6';
    },
    async createlist () {
      if (this.prod.rt0_sku) {
        let upsell = await this.getProduct(this.prod.rt0_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt1_sku) {
        let upsell = await this.getProduct(this.prod.rt1_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt2_sku) {
        let upsell = await this.getProduct(this.prod.rt2_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt3_sku) {
        let upsell = await this.getProduct(this.prod.rt3_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt4_sku) {
        let upsell = await this.getProduct(this.prod.rt4_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt5_sku) {
        let upsell = await this.getProduct(this.prod.rt5_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt6_sku) {
        let upsell = await this.getProduct(this.prod.rt6_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt7_sku) {
        let upsell = await this.getProduct(this.prod.rt7_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt8_sku) {
        let upsell = await this.getProduct(this.prod.rt8_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
      if (this.prod.rt9_sku) {
        let upsell = await this.getProduct(this.prod.rt9_sku);
        if (upsell) {
          this.linkedProducts.push(upsell);
        }
      }
    },
    async getProduct (psku) {
      return this.$store.dispatch('product/single', {
        options: { sku: psku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false,
      });
    }
  },
  async mounted () {
    this.createlist();
  },
  // beforeMount() {
  //   console.log("hamza khan")
  //       this.linkedProducts= []
  // },
  watch: {
    prod: {
      handler () {
        this.linkedProducts = []
        this.createlist();
      }
    }
  }
};
</script>
<style scoped lang="scss">
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
  .product-recent-listing-carousel .VueCarousel-navigation-prev {
    left: 12% !important;
    transform: translateY(-50%) translateX(-100%) !important;
    font-family: "system" !important;
    background-color: #29275b !important;
  }
  .cart-popup .popup-sliders .VueCarousel-slide {
    margin-left: 0px;
  }
}
</style>
