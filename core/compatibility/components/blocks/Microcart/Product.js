import { MicrocartProduct } from '@vue-storefront/core/modules/cart/components/Product.ts';
import i18n from '@vue-storefront/i18n';
import debounce from 'lodash-es/debounce';
import config from 'config';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick';
import { getProductPrimaryCategory } from '@vue-storefront/core/helpers';

export default {
  beforeMount () {
    // deprecated, will be moved to theme or removed in the near future #1742
    this.$bus.$on('cart-after-itemchanged', this.onProductChanged)
    this.$bus.$on('notification-after-itemremoved', this.onProductRemoved)
    this.updateQuantity = debounce(this.updateQuantity, 1000)
  },
  beforeDestroy () {
    // deprecated, will be moved to theme or removed in the near future #1742
    this.$bus.$off('cart-after-itemchanged', this.onProductChanged);
    this.$bus.$off('notification-after-itemremoved', this.onProductRemoved);
    this.updateQuantity.cancel();
  },
  mixins: [MeasureProductClick],
  methods: {
    removeItem ({ id = null, totals = null } = null) {
      let productCat = getProductPrimaryCategory(this.product);
      this.removeFromCart({ id: id || this.product.id, totals: totals || this.product.totals });
      this.sendRemoveCartProdClick({ product: this.product, page: this.$route.name, category: productCat, item: this.agItem || null }, 'product.js removeItem');
    },
    updateQuantity (newQuantity) {
      let quantity = parseInt(newQuantity);
      if (quantity < 1) quantity = 1;
      MicrocartProduct.methods.updateQuantity.call(this, quantity);
    },
    onProductChanged (event) {
      // deprecated, will be moved to theme or removed in the near future #1742
      if (event && event.item && this.product && event.item.sku === this.product.sku) {
        this.$forceUpdate();
      }
    },
    onProductRemoved (event) {
      if (event.item.sku === this.product.sku) {
        this.removeFromCart(event.item);
      }
    }
  }
}
