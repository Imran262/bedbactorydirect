<template>
  <button type="button" class="new_button order-sample-half" @click="requestCutSizeSample" :disabled="disabled">
    <span>
      <span class="cut-sample-free" v-if="price !== 0">HALF SIZE SAMPLE {{ ((price) ? (' - £' + price) : '') }}</span>
      <span class="cut-sample-free" v-else>HALF SIZE SAMPLE</span>
    </span>
  </button>
</template>

<script>
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapGetters } from 'vuex';

export default {
  name: 'HalfSizeSample',
  data: function () {
    return {
      payload: {
        sample: 'half_size',
        id: '', // Product ID
        product: '', // Product ID
        item: '', // Product ID
        qty: 1,
        cartId: ''
      }
    };
  },
  props: {
    price: {
      type: [Number, String],
      required: false,
      default: null
    },
    disabled: {
      type: Boolean,
      required: true
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
      getCartToken: 'cart/getCartToken'
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
    async requestCutSizeSample () {
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
                message: 'Failed to Add Half Size Sample'
              })
            );
            return false;
          }

          await this.pullCartSync();
          this.sendGTAGEvent();
          this.notifyUser(
            notifications.createNotification({
              type: 'success',
              message: 'Half Size Sample updated to cart'
            })
          );
        })
        .catch((err) => {
          console.log('we got an error', err);
        });
      // this.pullCartSync();
    },
    sendGTAGEvent () {
      let addedProduct = this.cartItems.find((i) => {
        return i.sku === this.product.sku
      });

      let type = this.product.type_id;
      let sampleType = null;

      if (addedProduct.totals && addedProduct.totals.options && addedProduct.totals.options.length > 0 && addedProduct.totals.options[0]) {
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
.disableClick {
  opacity: 0.6;
}

.order-sample-half {
  background-color: #00a897;
  display: block;
  font-size: 14px;
  padding: 9px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
  width: 95%;
  font-family: Arial, serif;
  height: 100%;
  min-height: 48px;
  border: 2px solid #00a897;
  font-weight: 700;
  float: left;

  span {
    background: none !important;
    color: #fff;
  }
}
@media(max-width: 991px){
  .order-sample-half {
    width: 100%;
  }
}
</style>
