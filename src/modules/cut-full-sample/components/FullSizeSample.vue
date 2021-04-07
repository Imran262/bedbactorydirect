<template>
  <button @click="requestFullSizeSample" type="button" class="new_button order-sample-full" :disabled="disabled">
    <span>
      <span>FULL SIZE SAMPLE {{ ((price) ? (' - £' + price) : '') }}</span>
    </span>
  </button>
</template>

<script>
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapGetters } from 'vuex';

export default {
  name: 'FullSizeSample',
  data: function () {
    return {
      payload: {
        sample: 'full_size',
        id: '', // Product ID
        product: '', // Product ID
        item: '', // Product ID
        qty: 1,
        cartId: '',
        param: 'xyz'
      }
    };
  },
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    price: {
      type: [Number, String],
      required: false,
      default: null
    },
    product: {
      type: Object,
      default: () => ({})
    },
    cartId: {
      type: [Number, String],
      required: false,
      default: ''
    }
  },
  computed: {
    ...mapGetters({
      getCartToken: 'cart/getCartToken',
      cartItems: 'cart/getCartItems'
    })
  },
  methods: {
    getProductOrCategoryPageMetaInfo (obj = this) {
      // console.log('selectedObj', obj?.$options?.name);
      if (obj && (!obj.$options || !obj.$options.name || obj.$options.name !== 'DefaultLayout') && obj.$parent) {
        return this.getProductOrCategoryPageMetaInfo(obj.$parent);
      }
      if (obj?.$options?.name === 'DefaultLayout') {
        let component = obj.$children.find(c => ['ProductPage', 'CategoryPage', 'HomePage'].includes(c?.$options?.name))
        return { name: component?.$options?.name, meta: { ...component.$metaInfo } }
      }
    },
    async requestFullSizeSample () {
      // Assigning Product Values
      this.payload.id = this.payload.product = this.payload.item = this.product.id;

      this.payload.cartId = this.cartId;

      if (!this.cartId) {
        await this.$store.dispatch('cart/createCartId', {
          productToAdd: this.product
        });
        this.payload.cartId = this.getCartToken;
      }
      await this.$store
        .dispatch('sample-quote/sampleQuoteFunction', this.payload)
        .then(async (res) => {
          if (res && res.code && res.code !== 200) {
            this.notifyUser(
              notifications.createNotification({
                type: 'error',
                message: 'Failed to Add Full Size Sample'
              })
            );
            return false;
          }

          await this.pullCartSync();
          // this.pullCartSync();
          this.sendGTAGEvent();
          this.$bus.$emit('cartUpdated', 'Full')
          // this.notifyUser(
          //   notifications.createNotification({
          //     type: 'success',
          //     message: 'Full Size Sample updated to cart'
          //   })
          // );
          this.$emit('FullSampleAdded', res)
        });
      // this.pullCartSync();
    },
    sendGTAGEvent () {
      let addedProduct = this.cartItems.find((i) => {
        return i.sku === this.product.sku
      });

      let type = this.product.type_id;
      let sampleType = null;

      if (addedProduct && addedProduct.totals && addedProduct.totals.options && addedProduct.totals.options.length > 0 && addedProduct.totals.options[0]) {
        type = addedProduct.totals.options[0].label
        sampleType = addedProduct.totals.options[0].value
      }
      // this.$bus.$emit('new-item-added-to-cart', { product: addedProduct });
      this.$store.commit('google-gtag/SET_ADD_PRODUCT', {
        product: addedProduct,
        page: this.getProductOrCategoryPageMetaInfo(),
        priceFromTotals: true,
        type,
        sampleType
      });
    },
    async pullCartSync () {
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      await this.$store.dispatch('cart-after-itemchanged', {
        forceClientState: false
      });

      this.$bus.$emit('cart-after-itemchanged', { item: this.product })
      this.$forceUpdate();
    },
    notifyUser (notificationData) {
      this.$emit('sampleRes', notificationData);
      this.$store.dispatch('notification/spawnNotification', notificationData, {
        root: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-sample-full {
  display: block;
  border-radius: 3px;
  cursor: pointer;
  width: 95%;
  padding: 9px;
  height: 100%;
  min-height: 48px;
  border: 2px solid #2a275c;
  float: left;
  background-color: #ffffff;
  font-weight: 700;

  span {
    background: none !important;
    color: #2a275c;
  }
}
@media(max-width: 767px){
  .order-sample-full {
    span{
      font-size: 15px;
    }
  }
}
</style>
