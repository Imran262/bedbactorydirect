<template>
  <div class="product-recent-listing-carousel">
    <template v-if="items && items.length">
      <prodrecentlisting-carousel v-if="items.length > 0" columns="4" :products="items" :prod="product" />
    </template>
  </div>
</template>
<script>
import RecentlyViewed from '@vue-storefront/core/modules/recently-viewed/components/RecentlyViewed';
import ProdrecentlistingCarousel from 'theme/components/ProdrecentlistingCarousel';
import NoSSR from 'vue-no-ssr';

export default {
  mixins: [RecentlyViewed],
  name: 'RecentlyViewedItems',
  components: {
    Carousel: () => import('vue-carousel').then(Slider => Slider.Carousel),
    Slide: () => import('vue-carousel').then(Slider => Slider.Slide),
    'no-ssr': NoSSR,
    ProdrecentlistingCarousel
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    columns () {
      if (this.items.length <= 4) {
        return this.items.length;
      } else {
        return 4;
      }
    }
  }
};
</script>
<style scoped>
.product-recent-listing-carousel .VueCarousel img {
  max-width: 256px;
  vertical-align: bottom;
}

.product-recent-listing-carousel p {
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
  margin: 5px 0px;
  font-weight: 600;
  background: #f2f2f2;
  width: 90%;
  margin: 0 auto;
  padding: 10px 0 10px 0;
}

.product-recent-listing-carousel button {
  background: #8678a9;
  border: 2px solid #8678a9;
  border-radius: 5px;
  padding: 5px 25px;
  color: #fff;
  font-weight: 600;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 38;
}

.product-image {
  position: relative;
  z-index: 10;
  padding-bottom: 35px;
}
</style>
<style>
.product-recent-listing-carousel .VueCarousel-wrapper {
  padding: 20px 0px 20px 15px;
}
@media(max-width: 767px){
  .product-recent-listing-carousel .VueCarousel-wrapper {
    padding: 0px;
  }
}
</style>
