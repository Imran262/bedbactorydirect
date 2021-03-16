<template>
  <button-full
    @click.native="
      addToCart(product);
      cartQuantityExceeded();
      outOfStock(true);
      closeModal();
    "
    :disabled="isProductDisabled"
    data-testid="addToCart"
  >
    {{ $t('Add to basket') }}
  </button-full>
</template>

<script>
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages'
import { notifications } from '@vue-storefront/core/modules/cart/helpers'
import focusClean from 'theme/components/theme/directives/focusClean'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import config from 'config'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'
import { getProductPrimaryCategory, isServer } from '@vue-storefront/core/helpers'

export default {
  directives: { focusClean },
  mixins: [MeasureProductClick],
  components: { ButtonFull },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sqmValUpdated: {
      type: [String, Number],
      required: false,
      default: null
    }
  },
  data () {
    return {
      cartItems: 0
    }
  },
  methods: {
    closeModal () {
      this.$bus.$emit('modal-hide', 'modal-calculator')
    },
    async pullCartSync () {
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      this.$forceUpdate();
    },
    notifyUser (notificationData) {
      // this.$store.dispatch('notification/spawnNotification', notificationData, {
      //   root: true
      // });
    },
    onAfterRemovedVariant () {
      this.$forceUpdate()
    },
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
    cartQuantityExceeded () {
      if ((this.cartItems > this.product.stock.qty) || (this.sqmValUpdated > (this.product.stock.qty / this.product.qty_per_sqm))) {
        if (this.product.clearance === 1) {
          this.$bus.$emit('modal-show', 'modal-clearancemodal')
          this.$bus.$emit('sendvalueToModal', this.cartItems)
          return true
        }
      }
      return false
    },
    outOfStock (fromTemp) {
      let getAllStockStatus = config.customStockStatus
      if (getAllStockStatus) {
        let convertStockCodeToArray = Object.keys(getAllStockStatus).map((key) => getAllStockStatus[key])
        const comapreCustomStockCode = this.product.custom_stock_status
        if (convertStockCodeToArray.includes(String(comapreCustomStockCode))) {
          if (
            ((this.cartItems > this.product.stock.qty) ||
            (this.sqmValUpdated > (this.product.stock.qty / this.product.qty_per_sqm))) && !this.cartQuantityExceeded()
          ) {
            let data = {
              sku: this.product.sku,
              name: this.product.name,
              stock: this.product.stock.qty,
              order: this.product.qty
            }
            let url = config?.sendoutstockEmail?.sendEmail || config?.api?.url + '/api/ext/outofstockEmail/sendEmail'
            if (fromTemp) {
              axios.post(url, data).then(({ data }) => {
              })
            }
            this.$bus.$emit('modal-show', 'outofstock-modal')
            return true
          }
        }
        return false
      }
    },
    async addToCart (product) {
      this.$emit('atcPixel')
      if (!this.cartQuantityExceeded() && !this.outOfStock(false)) {
        this.$emit('Modal')
        if (this.sqmValUpdated === '') {
          let tileQty = 0
          let sqmQty = 1
          tileQty = Math.ceil(product.qty_per_sqm + sqmQty)
          product.qty = tileQty
          this.$emit('update-sqm-qty', {
            sqm: 1,
            tileQty: tileQty
          })
        }
        try {
          const diffLog = await this.$store.dispatch('cart/addItem', {
            productToAdd: product
          })

          this.$bus.$emit('cartUpdated', 'Product')
          diffLog.clientNotifications.forEach((notificationData) => {
            this.notifyUser(notificationData)
          })

          await this.pullCartSync();
          let cartProduct = null
          if (product.type_id === 'simple') {
            cartProduct = this.currentCartItems?.find(c => c.sku === product.sku)
          }


          let page = this.getProductOrCategoryPageMetaInfo();
          let productCat = getProductPrimaryCategory(product);

          await this.sendAddCartProdClick({
            product: cartProduct || product,
            page,
            priceFromTotals: false,
            category: productCat
          })

          // this.$bus.$emit('new-item-added-to-cart', { diffLog, product });
          this.$bus.$emit('product-added-to-cart')
        } catch (message) {
          console.log('Try Method Was failed', message);
          // this.notifyUser(notifications.createNotification({ type: 'error', message }))
        }
      } else {
        let page = this.getProductOrCategoryPageMetaInfo();
        let productCat = getProductPrimaryCategory(product)
        await this.sendAddCartProdClick({
          product: product,
          page,
          priceFromTotals: false,
          category: productCat
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding',
      currentCartItems: 'cart/getCartItems'
    }),
    isProductDisabled () {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== '' ||
        this.isAddingToCart
      )
    }
  },
  mounted () {
    this.$bus.$on('sendvalueToCart', (value) => {
      this.cartItems = value
    })
  },
  beforeMount () {
    this.$bus.$on('product-after-removevariant', this.onAfterRemovedVariant)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-removevariant')
  }
};
</script>
