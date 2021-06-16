<template>
  <swatch-image :image="image" />
</template>
<script>
import SwatchImage from "./SwatchImage";
import {
  getThumbnailPath,
  productThumbnailPath,
} from "@vue-storefront/core/helpers";
import {
  getThumbnailForProduct,
  getProductConfiguration,
} from "@vue-storefront/core/modules/cart/helpers";
export default {
  name: "SwatchProduct",
  components: { SwatchImage },
  computed: {
    image() {
      return {
        loading: this.thumbnail,
        src: this.thumbnail,
      };
    },
    thumbnail() {
      return getThumbnailForProduct(this.product);
    },
  },
  props: {
    product: {
      required: true,
      type: Object,
    },
  },
};
</script>
<style lang="css" scoped>
</style>