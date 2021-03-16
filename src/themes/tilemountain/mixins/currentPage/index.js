import { isServer } from '@vue-storefront/core/helpers'

export default {
  data () {
    return {
      productPageRoutes: [
        'product',
        'virtual-product',
        'bundle-product',
        'simple-product',
        'downloadable-product',
        'grouped-product',
        'configurable-product'
      ],
      isProductPage: false,
      isCheckoutPage: false,
      isCart: false,
      isSuccess: false
    }
  },
  watch: {
    '$route.name': function () {
      this.setCurrentPage()
      this.isCartPage()
      this.isSuccessPage()
    }
  },
  computed: {
    canGoBack () {
      return !this.isHistoryEmpty() && this.isProductPage
    }
  },
  created () {
    this.setCurrentPage()
  },
  methods: {
    setCurrentPage () {
      this.isProductPage = !!this.$route.params.parentSku
      this.isCheckoutPage = this.$route.name === 'checkout'
    },
    // Check if history is empty
    isHistoryEmpty () {
      if (!isServer) {
        return window.history.length <= 1
      }

      return false
    },
    isCartPage () {
      if (this.$route.name === 'cart') {
        this.isCart = true;
      } else {
        this.isCart = false;
      }
    },
    isSuccessPage () {
      if (this.$route.name === 'Success') {
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
      }
    }
  }
}
