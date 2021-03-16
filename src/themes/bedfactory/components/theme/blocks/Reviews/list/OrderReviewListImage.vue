<template>
  <div
    v-if="getProductImage.src !== ''"
    v-lazy-container="{ selector: 'img'}"
  >
    <img
      :data-src="getProductImage.src"
      class="card-img"
      data-error="/assets/placeholder.svg"
      data-loading="/assets/loading.gif"
    >
  </div>
</template>
<script>
import {
  getThumbnailPath
} from '@vue-storefront/core/helpers';

export default {
  data() {
    return {
      img: null,
      product: null
    }
  },
  props: ['sku'],
  computed: {
    getProductImage() {
      if (this.img) {
        const thumbnail = getThumbnailPath(this.img, 300, 300, 'product');
        return {
          src: thumbnail,
          loading: ''
        }
      } else {
        return {
          src: '',
          loading: ''
        }
      }
    }
  },
  async mounted() {
    const product = await this.$store.dispatch('product/single', {
      options: { sku: this.sku },
      setCurrentProduct: false,
      setCurrentCategoryPath: false,
      selectDefaultVariant: false
    })
    this.img = product.image
  }
}
</script>
<style scoped>
  .card-img {
    height: 7rem;
    width: 110px;
  }
</style>
