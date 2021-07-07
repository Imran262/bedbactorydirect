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
      // console.log('789456 About to check current page', this.$route);
      if (this.$route.name === 'cart') {
        // console.log('789456 This is cart page');
      } else {
        // console.log('789456 This is not cart page');
      }
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
        // console.log('789456 This is cart pAge');
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
