import { mapGetters } from 'vuex';
import { hasOnlySampleTypeInCart, hasOnlySelectedSampleTypesInCart } from './index';

export default {
  props: {
    cartItems: {
      type: [Object, Array],
      required: true
    }
  },
  data () {
    return {
      cartId: null
    };
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      getCartToken: 'cart/getCartToken',
      totals: 'cart/getTotals',
      shippingDetails: 'checkout/getShippingDetails'
    }),
    hasOnlyFullSampleInCart () {
      return hasOnlySampleTypeInCart({ cartItems: this.cartItems, sampleType: 'Full Size' });
    },
    showFullToCutConverter () {
      return hasOnlySelectedSampleTypesInCart({
        cartItems: this.cartItems,
        sampleTypes: ['Full Size', 'Cut Size'],
        compulsorySamples: ['Full Size']
      }) && this.productsInCart.length > 0 && this.productsInCart.length < 4
    }
  },
  methods: {
    async getCartId () {
      if (this.getCartToken) {
        this.cartId = this.getCartToken;
        return this.getCartToken;
      }

      await this.$store.dispatch('cart/createCartId');
      this.cartId = this.getCartToken;
      return this.getCartToken;
    },
    async removeFromCart (product) {
      if (!product) {
        return false;
      }
      await this.$store.dispatch('cart/removeItem', { product });

      return true;
    }
  }
};
