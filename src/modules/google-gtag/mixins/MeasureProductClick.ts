import { isServer } from '@vue-storefront/core/helpers'
import debounce from 'lodash-es/debounce';

export const MeasureProductClick = {
  props: {
    list: {
      type: String,
      required: false,
      default: ''
    }
  },
  created () {
    // console.log('createdTwoTimes');
    this.sendCartClick = debounce(({ productsInCart = null, grandTotal = 0 } = {}) => {
      if (!isServer) {
        this.$store.commit('google-gtag/SET_CART', { productsInCart, grandTotal })
      }
    }, 2000);

    this.sendAddCartProdClick = debounce(this.sendAddCartProdClickMethod, 2000);
    this.sendRemoveCartProdClick = debounce(this.sendRemoveCartProdClickMethod, 2000)
  },
  methods: {
    sendProductClick (position = null) {
      if (!isServer && this.product) {
        // this.$store.commit('google-gtag/SET_PRODUCT_CLICK', {
        //   product: this.product,
        //   list: this.list ? this.list : 'Category',
        //   position: position + 1
        // })
      }
    },
    // sendCartClick ({ productsInCart = null, grandTotal = 0 } = {}) {
    //
    // },
    sendHomeClick (payload) {
      if (!isServer) {
        this.$store.commit('google-gtag/SET_HOME_CLICK', payload)
      }
    },
    sendOtherClick () {
      if (!isServer) {
        this.$store.commit('google-gtag/SET_OTHER', {})
      }
    },
    sendAddCartProdClickMethod (payload) {
      if (!isServer) {
        this.$store.commit('google-gtag/SET_ADD_PRODUCT', payload)
      }
    },
    sendRemoveCartProdClickMethod ({ product, page, category = {}, item = null }, fromLoc = null) {
      if (!isServer) {
        // this.$store.commit('google-gtag/SET_REMOVE_PRODUCT', { product })
        // this.$store.commit('google-gtag/SET_REMOVE_PRODUCT', { product })
        console.log('DoWeHaveAnItem', item);
        this.$store.commit('google-gtag/SET_REMOVE_PRODUCT', { product, page, category, qty: item?.qty || product.qty })
        // this.$store.commit('google-tag-manager/SET_REMOVE_PRODUCT', { product, page })
      }
    }
  }
}
