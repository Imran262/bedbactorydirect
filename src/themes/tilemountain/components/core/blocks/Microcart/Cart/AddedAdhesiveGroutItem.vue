<template>
  <div class="col-md-12">
    <template v-if="product">
      <agProduct :product="product" :ag-item="item" :orignalprice="true"/>
    </template>
  </div>
</template>
<script>
import agProduct from './agProductItem'

export default {
  name: 'AddedAdhesiveGroundItem',
  data () {
    return {
      product: null
    }
  },
  components: {
    agProduct
  },
  computed: {
    itemMatchesProduct () {
      return !(this.product && this.product.sku !== this.item.recommended_sku);
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    productsInCart: {
      type: [Object, Array],
      required: true
    }
  },
  watch: {
    async itemMatchesProduct (newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.getProduct()
      }
    }
  },
  methods: {
    async getProduct () {
      this.$store.dispatch('product/single', {
        options: { sku: this.item.recommended_sku },
        setCurrentProduct: false,
        setCurrentCategoryPath: false,
        selectDefaultVariant: false
      }).then(data => this.updateProductData(data))
        .catch(err => console.log('fetchingProductHasSomeErr', err))
    },
    updateProductData (product) {
      if (this.productsInCart && this.productsInCart.length && this.productsInCart.length > 0) {
        product.server_item_id = this.item.item_id;
        this.product = product
      }
    }
  },
  async mounted () {
    await this.getProduct()
  }
}
</script>
