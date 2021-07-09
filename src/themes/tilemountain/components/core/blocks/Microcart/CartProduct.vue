<template>
  <div class="row row-sb-left-padding">
    <div class="col-xs-3 col-md-3 col-lg-3 sb-product-img">
      <!-- product {{product}} -->
     <!-- {{ product.totals.price_incl_tax? product.totals.price_incl_tax.toFixed(2) : product.totals.price}}
     {{product.price_incl_tax? product.price_incl_tax.toFixed(2) : product.price}} -->
      <ProductImageCart :image="image" />
    </div>
    <div class="col-md-3 col-lg-3 sb-product-detail">
      <div class="product-name">
        <router-link
          class="serif h4 name"
          :to="productLink"
          data-testid="productLink"
          @click.native="$store.commit('ui/setMicrocart', false), sendProductClick($vnode.key)"
          v-if="product.name"
        >
          {{ product.name | htmlDecode }}
        </router-link>
      </div>
      <div class="actions cart-remove-button" v-if="!editMode">
        <remove-button-cart class @click="removeItem({id: product.id, totals:null})" />
      </div>
      <div class="sku" data-testid="productSku" v-if="product">
        <span class="sku-text">SKU:</span>
        <span class="sku-p-text">{{ product.sku }}</span>
      </div>
      <!-- <div class="size" v-if="fullCart && product && product.size">
        <span class="size-text">Size:</span>
        <span class="size-p-text">{{ product.size }}</span>
      </div> -->
      <!-- <div class="area" v-if="fullCart && productArea && !optionCheck">
        <template v-if="productArea !== 'Infinity'">
        <span class="area-text">Area:</span>
        <span class="area-p-text">
          {{ productArea }}sq.m
        </span>
        </template>
      </div> -->
      <div class="options" v-if="isTotalsActive && product && product.totals">
        <div v-for="opt in product.totals.options" :key="opt.label">
          <span class="opn">{{ opt.label }}:</span>
          <span class="opv" v-html="opt.value" />
        </div>
      </div>
      <div class="options" v-else-if="!editMode && product && product.options">
        <div v-for="opt in product.options" :key="opt.label">
          <span class="opn">{{ opt.label }}:</span>
          <span class="opv" v-html="opt.value" />
        </div>
      </div>
    </div>
    <div class="col-md-6 col-lg-6">
      <div class="product-quantity">
        <template v-if="isCutSampleProduct">
          <div class="product-qty-input sb-product-qty-input">
            <span>Sample</span>
          </div>
        </template>
        <template v-else>
          <div class="product-qty-input sb-product-qty-input">
            <span v-if="product.qty_per_sqm" class="TotalQP" :class="title !== 'Tile Mountain' ? 'flooring' : ''"> {{ title === 'Tile Mountain' ? 'Total Pieces:' : 'Packs'}}</span>
            <span v-else class="TotalQP">Total Qty:</span>
            <div class="sb-prodcut-qty-on-cart-">
              <product-quantity-on-cart-page
                class="qty"
                :disabled-item="checkedQuoteItem(product.sku)"
                :value="productQty"
                :max-quantity="maxQuantity"
                :loading="isStockInfoLoading"
                :is-simple-or-configurable="isSimpleOrConfigurable"
                @input="updateProductQtyInput"
                @error="handleQuantityError"
              />
              <button
                class="update-link"
                @click="updateProductQty(updatedQtyPass)"
              >
                Update
              </button>
            </div>
            <div class="firstprice">
              <span class="firstprice-cross">x</span>
              <!-- <br /> product.totals 001 {{ product.totals}} <br /> -->
              <!-- {{ product.totals.price_incl_tax.toFixed(2) | price(storeView) }} -->
              {{ product.totals?product.totals.price_incl_tax? product.totals.price_incl_tax.toFixed(2) : product.totals.price : product.price | price(storeView) }}
            </div>
          </div>
        </template>

        <div class="flex align-right start-xs between-sm prices mainprice">
          <div class="prices" v-if="!displayItemDiscounts || !isOnline">
            <span
              class="h4 serif cl-error price-special"
              v-if="product.special_price"
            > 
            <!-- <br /> product 002  {{ product}} <br /> -->
            {{
              (product.price_incl_tax? product.price_incl_tax.toFixed(2) : product.price * product.qty) | price(storeView)
            }}</span>
            <span
              class="h6 serif price-original"
              v-if="product.special_price"
            ><br />
            <!-- product 003  {{ product}}<br /> -->
            {{
              (product.original_price_incl_tax * product.qty)
                | price(storeView)
            }}</span>

            <span
              class="h4 serif price-regular"
              v-else
              data-testid="productPrice"
            >
<!-- <br />            product 004  {{ product}} <br /> -->
            {{
              ((product.original_price_incl_tax
                ? product.original_price_incl_tax
                : product.price_incl_tax? product.price_incl_tax.toFixed(2) : product.price) *
                product.qty)
                | price(storeView)
            }}</span>
          </div>
          <div class="prices" v-else-if="isOnline && product.totals">
            <span
              class="h4 serif cl-error price-special"
              v-if="product.totals.discount_amount"
            >{{
              (product.totals.row_total_incl_tax)
                | price(storeView)
            }}</span>
            <!-- <span
              class="h6 serif price-original"
              v-if="product.totals.discount_amount"
            >{{ product.totals.row_total_incl_tax | price(storeView) }}</span> -->
            <span
              class="h4 serif price-regular"
              v-if="!product.totals.discount_amount"
            >{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
          </div>
          <div class="prices" v-else>
            <span class="h4 serif price-regular"> 
              <!-- product 000 {{ product}}  -->
              {{
              ((product.regular_price || product.price_incl_tax? product.price_incl_tax.toFixed(2) : product.price) * product.qty)
                | price(storeView)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductImageCart from 'theme/components/core/ProductImageCart'
import RemoveButtonCart from './RemoveButtonCart'
import ProductQuantityOnCartPage from 'theme/components/core/ProductQuantityOnCartPage.vue'
import {
  getThumbnailForProduct
} from '@vue-storefront/core/modules/cart/helpers'
import { onlineHelper } from '@vue-storefront/core/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import EditMode from './EditMode'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { mapGetters, mapState } from 'vuex'
import config from 'config'
import { CartService } from '@vue-storefront/core/data-resolver'
import AddedAdhesiveGroutItem from './Cart/AddedAdhesiveGroutItem'
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'
export default {
  name: 'CartProduct',
  components: {
    ProductImageCart,
    ProductQuantityOnCartPage,
    RemoveButtonCart,
    AddedAdhesiveGroutItem
  },
  mixins: [Product, ProductOption, EditMode, MeasureProductClick],
  props: {
    product: {
      required: true,
      type: [Object, Array]
    },
    fullCart: {
      type: Boolean,
      default: false
    },
    orignalprice: {
      type: Boolean,
      default: false
    },
    adhesiveGroutItems: {
      type: Array,
      required: false,
      default: () => []
    },
    minSqmValue: {
      required: true,
      type: [Number, String]
    }
  },
  data () {
    return {
      updatedQtyPass: this.editMode ? this.getEditingQty : this.product.qty,
      maxQuantity: 0,
      optionCheck: false,
      isStockInfoLoading: false,
      quantityError: false,
      quoteVueItemOriginal: [],
      fixing: '',
      madeOf: '',
      grout: '',
      title: config?.themeConfigurations?.title,
      payload: {
        'data': {
          product_id: '',
          item_id: '',
          fixing_type: '',
          applied_material: '',
          grout_width: '',
          total_qty: '',
          sqm: ''
        }
      },
      productArea: 0,
      payloadChildProducts: {
        'data': {
          product_id: '',
          item_id: '',
          fixing_type: '',
          applied_material: '',
          grout_width: '',
          total_qty: '',
          sqm: ''
        }
      },
      childProducts: {},
      childProductSkus: [],
      childProductItems: []
    }
  },
  async mounted () {
    if (this.product) {
      this.productArea = (this.updatedQtyPass / this.product.qty_per_sqm).toFixed(2)
    }
    this.checkIt()
    await this.getChildProductSkus()
    await this.itemExtensionAttributes()
  },
  beforeMount () {
    this.$bus.$on('fixing-madeOf-grout', (properties) => {
      this.fixing = properties.selectedFixing;
      this.madeOf = properties.selectedMadeOf;
      this.grout = properties.selectedGroutJoint;
    })
  },
  methods: {
    async itemExtensionAttributes () {
      const quoteItemData = await CartService.getItems()
      var quoteItem = []
      var quoteVueItem = []
      if (quoteItemData && quoteItemData.result && quoteItemData.result.length > 0 && Array.isArray(quoteItemData.result)) {
        quoteItem = quoteItemData.result.filter((quoteItemInside) => {
          if (quoteItemInside && quoteItemInside.extension_attributes && quoteItemInside.extension_attributes.is_vue_quote) {
            quoteVueItem.push(quoteItemInside.sku)
          }
        })
      }
      this.quoteVueItemOriginal = quoteVueItem
    },
    async onProductQuantityUpdate () {
      let tileSqm = (this.updatedQtyPass / this.product.qty_per_sqm).toFixed(2)
      this.payload.data.product_id = this.product.id;
      this.payload.data.fixing_type = this.fixing;
      this.payload.data.applied_material = this.madeOf;
      this.payload.data.grout_width = this.grout;
      this.payload.data.total_qty = this.updatedQtyPass;
      this.payload.data.sqm = tileSqm;
      await this.$store.dispatch(
        'groutadhesive/groutAdhesiveFunction', this.payload).then((res) => {
        let response = JSON.parse(res);
        if (response.success) {
          this.$bus.$emit('additional-products', {
            groutAdhesiveArray: response.data,
            groutAdhesiveTotalPrice: response.total_price
          });
        } else {
          this.$bus.$emit('additional-products', {
            groutAdhesiveArray: [],
            groutAdhesiveTotalPrice: 0
          });
        }
      });
    },
    updateProductQty (qty) {
      this.$bus.$emit('notification-progress-start', 'Updating qty... ')
      if (this.editMode) {
        this.editModeSetQty(qty)
        return
      }
      this.updateQuantity(qty)
      if (this.minSqmValue < this.productArea) {
        this.$bus.$emit('remove-grout-adhesive-section', {
          doesNotHasGroutAdhesiveSection: false,
          productId: this.product.id
        })
      } else if (this.minSqmValue > this.productArea) {
        this.$bus.$emit('remove-grout-adhesive-section', {
          doesNotHasGroutAdhesiveSection: true,
          productId: this.product.id
        })
      }
      this.$bus.$emit('quantity-updated', { minSqmValue: this.minSqmValue, sqm: this.productArea, productId: this.product.id })
    },
    updateQuantity (quantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: this.product,
        qty: quantity
      }).then(r => {
        if (r) {
          this.$bus.$emit('notification-progress-stop', 'Updating qty... ')
          this.pullCartSync()
          this.updatedQtyPass = quantity
          this.onProductQuantityUpdate()
          this.$emit('tile-quantity-updated', this.updatedQtyPass)
        }
      })
    },
    async pullCartSync () {
      await this.$store.dispatch('cart/sync', {
        forceClientState: false,
        forceSync: true
      });
      await this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
      this.$forceUpdate();
    },
    updateProductQtyInput (qty) {
      this.updatedQtyPass = qty
      // this.$emit('tile-quantity-updated', this.updatedQtyPass)
    },
    handleQuantityError (error) {
      this.quantityError = error
    },
    checkedQuoteItem (sku) {
      var isVueQuote = false
      this.quoteVueItemOriginal.filter((skuInside) => {
        if (sku === skuInside) {
          isVueQuote = true
        }
      })
      return isVueQuote
    },
    checkIt () {
      if (this.product && this.product.totals) {
        if (this.product.totals.options) {
          for (var i = 0; i <= this.product.totals.options.length; i++) {
            if (this.product.totals.options[i]) {
              this.optionCheck = true
            }
          }
        }
      }
    },
    async removeFromCart () {
      this.$store.commit('ui/setOverlay', false)
      this.$bus.$emit('notification-progress-start', 'Processing... ')
      let lastItem
      if (this.childProductItems[0]) {
        // lastItem = this.objectSize(this.childProductItems)
        for (let productKey in this.childProductItems) {
          if (this.childProductItems.hasOwnProperty(productKey)) {
            let productItem = this.getProductItemId(this.childProductItems[productKey])
            if (this.productsInCart && this.productsInCart.length && this.productsInCart.length > 0) {
              const currentProductInCart = this.productsInCart.find(item => item.server_item_id === parseInt(productItem.item_id))
              // if (parseInt(productKey) === lastItem - 1) {
              //   console.log('if Arsl')
              //    this.$store.dispatch('cart/removeItem', {
              //     product: currentProductInCart,
              //     itemId: productItem.item_id
              //   })
              // } else {
              //   console.log('else Arsl')
              this.$store.dispatch('cart/removeItem', { product: currentProductInCart, itemId: productItem.item_id })
              // }
            }
          }
        }
      }
      this.$bus.$emit('notification-progress-stop')
      this.$bus.$emit('has-grout-adhesive', {
        recommendation: false,
        productId: this.product.id
      })
      await this.$store.dispatch('cart/removeItem', { product: this.product })
      this.$bus.$emit('carPageUpdate', {
        productId: this.product.id
      })
    },
    // objectSize (obj) {
    //   let size = 0
    //   let key
    //   for (key in obj) {
    //     if (obj.hasOwnProperty(key)) size++;
    //   }
    //   return size;
    // },
    getProductItemId (product) {
      if (this.adhesiveGroutItems && this.adhesiveGroutItems.length && this.adhesiveGroutItems.length > 0) {
        return this.adhesiveGroutItems.find(item => item.recommended_sku === product.sku)
      }
    },
    getChildProductSkus () {
      if (this.adhesiveGroutItems && this.adhesiveGroutItems.length && this.adhesiveGroutItems.length > 0) {
        this.adhesiveGroutItems.forEach((item) => {
          if (!this.childProductSkus.includes(item.recommended_sku)) {
            this.childProductSkus.push(item.recommended_sku)
          }
        })
        this.getChildProducts()
      }
    },
    async getChildProducts () {
      if (this.childProductSkus && this.childProductSkus.length > 0) {
        let childProductQuery = prepareRelatedQuery(
          'sku',
          this.childProductSkus
        );
        await this.$store
          .dispatch('product/list', {
            query: childProductQuery,
            size: 10,
            prefetchGroupProducts: false,
            updateState: false
          })
          .then(({ items }) => {
            this.childProductItems = items;
          })
          .catch((err) => {
            console.log('Product Child Products Failed', err);
          });
      }
    },
    async getQuantity (product) {
      if (this.isStockInfoLoading) return // stock info is already loading
      this.isStockInfoLoading = true
      try {
        const validProduct = product || this.product
        const res = await this.$store.dispatch('stock/check', {
          product: validProduct,
          qty: this.productQty
        })
        return res.qty
      } finally {
        this.isStockInfoLoading = false
      }
    },
    async changeEditModeFilter (filter) {
      const editedProduct = this.getEditedProductgetEditedProduct(filter)
      const maxQuantity = await this.getQuantity(editedProduct)
      if (!maxQuantity) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'The product is out of stock and cannot be added to the cart!'
          ),
          action1: { label: this.$t('OK') }
        })
      } else if (maxQuantity < this.productQty) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'Only {maxQuantity} products of this type are available!',
            { maxQuantity }
          ),
          action1: { label: this.$t('OK') }
        })
      } else {
        this.maxQuantity = maxQuantity
        this.editModeSetFilters(filter)
      }
    }
  },
  computed: {
    ...mapState({
      isMicrocartOpen: (state) => state.ui.microcart
    }),
    ...mapGetters({
      productsInCart: 'cart/getCartItems'
    }),
    displayItemDiscounts () {
      return config.cart.displayItemDiscounts
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(this.product.type_id)
    },
    isUpdateCartDisabled () {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      )
    },
    isCutSampleProduct () {
      if (this.product && this.product.totals && this.product.totals.options && this.product.totals.options.length > 0) {
        return this.product.totals.options.filter((option, key) => {
          return option.label === 'Sample' && option.value === 'Cut Size'
        }).length > 0
      }
      return false
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
    isTotalsActive () {
      return (
        this.isOnline &&
        !this.editMode &&
        this.product.totals &&
        this.product.totals.options
      )
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    editMode () {
      return this.getEditingProductId === this.product.id
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    productQty () {
      return this.editMode ? this.getEditingQty : this.product.qty
    },
    storeView () {
      return currentStoreView()
    }
  },
  watch: {
    isOnline: {
      async handler (isOnline) {
        if (isOnline) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      }
    },
    isMicrocartOpen: {
      async handler (isOpen) {
        if (isOpen) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      },
      immediate: true
    },
    adhesiveGroutItems (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getChildProductSkus()
      }
    },
    updatedQtyPass (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.productArea = (this.updatedQtyPass / this.product.qty_per_sqm).toFixed(2);
        // this.$emit('tile-quantity-updated', this.productArea)
      }
    },
    productArea (newVal, oldVal) {
      if (newVal !== oldVal) {
        // this.$emit('tile-quantity-updated', this.productArea)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

.blend {
  flex: 0 0 150px;
}

.image {
  mix-blend-mode: multiply;
  vertical-align: top;
  width: 150px;
  @media (max-width: 767px) {
    width: 100px;
  }
}

.details {
  flex: 1 1 auto;
  display: flex;
  flex-flow: row wrap;
}

.mobilerow {
  display: none;
}

.name {
  @media (max-width: 767px) {
    // font-size: 14px;
    font-size: 2.597vw !important;
    display: block;
    margin-bottom: 0 !important;
  }
}

.options {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 12px;
  font-weight: normal;
  padding-right: 15px;
  margin-top: 10px;

  .opn {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 12px;
    font-weight: bold;
    padding-right: 0px;
    display: block;
    margin-bottom: 5px;
    width: 175px;
  }

  .opv {
    color: #aaa;
    font-family: Arial;
    font-size: 12px;
    font-weight: normal;
    padding-right: 15px;
    display: block;
    margin-left: 15px;
    margin-bottom: 10px;
  }
}

.options,
.sku {
  @media (max-width: 767px) {
    font-size: 10px;
  }
}

.qty {
  padding-right: 30px;

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

.actions {
  margin: 0 -5px;
}

.prices {
  flex-direction: column;
  @media (max-width: 767px) {
    padding: 0;
    font-size: 12px;
  }
}

.price-special {
  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.price-original {
  text-decoration: line-through;
}

input {
  width: 30px;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

.flex-wrap {
  flex-wrap: wrap;
}

.edit-mode {
  border-bottom: 1px solid color(white-smoke);
}

.filters {
  flex: 1 1 200px;
}

.update-button {
  font-size: 14px;
  min-width: 150px;
  width: 150px;
  padding: 10px;
}
.sb-prodcut-qty-on-cart- {
  margin-top: 52px;
}
.maincart {
  .mobilerow {
    display: none;
  }

  li {
    border-bottom: 1px solid #e6ebee;
    width: 100%;
    margin: 0px;
  }

  .qty {
    // padding-right: 0px;
    // padding-top: 54px;
    // width: 17%;
    padding: 0;
  }

  .mainprice {
    // padding-top: 68px;
    // padding-right: 0px;
    // flex-direction: column;
    // margin: 0px;
    // width: 20%;
    // margin: 0px;
    // span {
    //   color: #29275b;
    //   font-size: 20px;
    //   font-family: Arial, Helvetica, sans-serif;
    //   font-weight: bold;
    // }
  }

  .firstprice {
    // padding-top: 70px;
    // padding-right: 0px;
    // width: 10%;
    // text-align: center;
    padding-left: 20px;
    color: #878382;
    font-size: 16px;
    font-weight: bold;
    margin-top: 33px;

    .firstprice-cross {
      padding-right: 3px;
      color: #878382;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .name {
    font-family: Arial, Helvetica, sans-serif;
  }

  .details-inner {
    .Q-inner {
      width: 80%;
    }
  }

  @media (max-width: 1200px) and (min-width: 992px) {
    .product-qty-input {
      span {
        font-size: 13px;
        padding-right: 12px;
      }
    }
    .firstprice {
      padding-left: 10px;

      .firstprice-cross {
        padding-right: 4px;
      }
    }
    .details-inner {
      .Q-inner {
        width: 70%;
      }
    }
    .qty {
      width: 23%;
    }
    .mainprice {
      width: 22%;
      padding-right: 16px;
    }
    .mainprice .prices span {
      font-size: 17px;
    }
    .maincart .firstprice{
      padding-left: 5px;
    }
  }
  @media (max-width: 991px) and (min-width: 767px) {
    .details {
      position: relative;

      .Q-inner {
        width: 100%;
      }

      .qty {
        padding-top: 10px;
      }

      .firstprice {
        position: absolute;
        bottom: 15px;
        right: 140px;
      }

      .mainprice {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
  }
  @media (max-width: 767px) {
    .mobilerow {
      display: flex;
    }
    h2 {
      text-align: center;
    }
    .mobprice {
      padding-top: 12px;
    }
    .qty-mobile {
      padding-left: 0px;
    }
    .details {
      position: relative;

      .Q-inner {
        width: 93%;
      }

      .mainprice {
        display: none;
      }

      .firstprice {
        display: none;
      }

      .qty {
        display: none;
      }
    }
    .update-link {
      // display: none;
    }
    .sb-prodcut-qty-on-cart- {
      padding-left: 17px;
      margin-top: 0;
    }
    .sb-product-img {
      display: flex;
      justify-content: center;
    }
    .sku {
      margin-top: 0;
    }
    .sku-text {
      font-size: 2.319vw;
    }
    .sku-p-text {
      font-size: 2.319vw;
    }
    .size {
      margin-top: 0;
    }
    .size-text {
      font-size: 2.319vw;
    }
    .size-p-text {
      font-size: 2.319vw;
    }
    .area {
      margin-top: 0;
    }
    .area-text {
      font-size: 2.319vw;
    }
    .area-p-text {
      font-size: 2.319vw;
    }
    .cart-remove-button {
      position: absolute;
      top: 2px;
      right: 6px;
    }
    .TotalQP {
      font-size: 2.853vw;
      margin-top: 0;
    }
    .firstprice {
      font-size: 2.853vw;
      margin-top: 0;
      .firstprice-cross {
        font-size: 2.853vw;
      }
    }
    .mainprice .prices span {
      font-size: 2.853vw;
      margin-top: 0;
    }
  }
}

.row-sb-left-padding {
  margin: 0;
}

.product-name a {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 16px;
  margin: 6px 0;
  height: auto !important;
  margin-bottom: 12px;
  font-weight: bold;
  width: 390px;
  display: block;
  white-space: normal;
}

.sku {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 15px;
}

.sku-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  // font-weight: bold;
  padding-right: 15px;
}
.sku-p-text {
  font-weight: bold;
}
.size {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 10px;
}

.size-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;

  padding-right: 15px;
}
.size-p-text {
  font-weight: bold;
}
.area {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 10px;
}

.area-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  padding-right: 15px;
}
.area-p-text {
  font-weight: bold;
}
.product-qty-input span {
  color: #9b9b9b;
  font-family: Arial;
  font-size: 16px;
  font-weight: normal;
  padding-right: 20px;
  margin-top: 35px;
  min-width: 92px;
  @media screen and (max-width: 576px) {
    margin-top: 0px !important;
}
}
.product-qty-input .flooring{
  min-width: 44px;
}


.product-quantity.qty .base-input-numberz input {
  height: 45px;
  width: 45px;
  border: 2px solid #f2f2f2;
  text-align: center;
  border-radius: 5px;
}

.sb-product-qty-input {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.product-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.mainprice .prices span {
  color: #29275b;
  font-family: Arial;
  font-weight: bold;
  font-size: 20px;
  margin-top: 32px;
  display: block;
}

.headingtop h2 {
  padding-top: 10px;
  color: #4a4a4a;
  font-family: 'Oblik';
  font-size: 30px;
}

.update-link {
  color: #ea429d;
  text-decoration: underline;
  font-size: 11px;
  text-align: center;
  display: block;
  font-family: Arial;
  padding-top: 5px;
  border: 0;
  background: none;
  margin: 0 0 0 -2px;
}

.sb-product-img {
  flex-basis: 21.9%;
}

.sb-product-detail {
  // flex-basis: 28.1%;
  // max-width: 28.1%;
  @media (max-width: 767px) {
    flex-basis: 65%;
    max-width: 65%;
  }
}

.update-link:after {
  background-color: transparent !important;
}

.cart-remove-button {
  display: flex;
  justify-content: flex-end;
  width: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.sb-md-dropdown {
  margin: 35px 0;
  width: 100%;
  padding: 0;
}
@media(max-width:360px){
  .product-name a {
    width: 190px !important;
    display: block;
    white-space: normal !important;
  }
}
@media(max-width:767px){
  .product-qty-input span {
    min-width: 76px;
    font-size: 2.853vw;
    margin-top: 0;
  }
  .maincart .sb-prodcut-qty-on-cart-{
    padding-left: 0px !important;
    margin-top: 12px;
  }
  .options .opn{
    font-size: 2.397vw !important;
    width: 100%;
  }
  .options .opv {
    font-size: 2.1vw;
  }
  .product-name a {
    width: 100%;
    display: block;
    white-space: normal;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .mainprice .prices span {
    margin-top: 45px;
  }
  .product-qty-input span {
    margin-top: 45px;
  }
  .update-link {
    margin: 0 0 0 -5px;
  }
}
@media (min-width: 991px) and (max-width: 1200px) {
  .mainprice .prices span {
    margin-top: 33px;
    font-size: 14px !important;
  }
  .product-qty-input span {
    margin-top: 60px;
    min-width: 74px;
    padding-left: 0px !important;
    font-size: 12px !important;
  }
  .maincart .firstprice{
    font-size: 12px !important;
  }
  .update-link {
    margin: 0 0 0 -5px;
  }
}
@media (max-width: 455px) {
  // .sb-product-img {
  //   flex-basis: 40%;
  // }
  .sb-product-detail {
    flex-basis: 65%;
    max-width: 65%;
  }
  .product-qty-input span {
    padding-right: 10px;
  }

  .maincart {
    .firstprice {
      padding-left: 10px;
    }
  }
  .mainprice .prices span {
    font-size: 16px;
  }
  .cart-remove-button {
    // margin-top: 12px;
  }
  .sb-product-img {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 350px) {
  .product-qty-input span {
    font-size: 11px;
    font-weight: bold;
  }
}
</style>
