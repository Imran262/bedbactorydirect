import { isServer } from '@vue-storefront/core/helpers'

export const MeasureProductClick = {
  props: {
    list: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    sendProductClick(position = null) {
      if (!isServer && this.product) {
        this.$store.commit('google-gtag/SET_PRODUCT_CLICK', {
          product: this.product,
          list: this.list ? this.list : 'Category',
          position: position + 1
        })
      }
    }
  }
}
