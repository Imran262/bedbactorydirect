<template>
  <div class="row row-sb-left-padding left-padding-adhesive-img">
    <div class="col-md-3 col-xs-3 sb-product-img">
      <ProductImageCart :image="image"/>
    </div>
    <div class="col-md-3 col-xs-6 sb-product-detail">
      <div class="product-name">
        <router-link
          class="serif h4 name"
          :to="productLink"
          data-testid="productLink"
          @click.native="$store.commit('ui/setMicrocart', false)"
          v-if="product.name"
        >{{ product.name | htmlDecode }}
        </router-link>
      </div>
      <div class="sku" data-testid="productSku">
        <span class="sku-text">SKU:</span>
        {{ product.sku }}
      </div>
      <div class="size" v-if="fullCart">
        <span class="size-text">Size:</span>
        {{ product.size }}
      </div>
      <div class="area" v-if="fullCart && product.qty_per_sqm && !optionCheck">
        <span class="area-text">Area:</span>
        {{ (agItemQuantity / product.qty_per_sqm).toFixed(2) }}sq. m
      </div>

      <!--  <div class="options" v-if="isTotalsActive">
          <div v-for="opt in product.totals.options" :key="opt.label">
            <span class="opn">{{ opt.label }}:</span>
            <span class="opv" v-html="opt.value"/>
          </div>
        </div>
        <div class="options" v-else-if="!editMode && product.options">
          <div v-for="opt in product.options" :key="opt.label">
            <span class="opn">{{ opt.label }}:</span>
            <span class="opv" v-html="opt.value" />
          </div>
        </div>-->
    </div>
    <div class="actions cart-remove-button" v-if="!editMode">
      <remove-button-cart class @click="removeItem({id: product.id, totals:null})"/>
    </div>
    <div class="col-md-6 col-xs-12">
      <div class="product-quantity">
        <template>
          <div class="product-qty-input sb-product-qty-input">
            <span>Total Pieces:</span>
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
                @click="updateProductQty(agItemQuantity)"
              >
                Update
              </button>
            </div>
            <div class="firstprice" v-if="orignalprice && !optionCheck">
              <span class="firstprice-cross">x</span>
              {{ product.price_incl_tax.toFixed(2) | price(storeView) }}
            </div>
          </div>
        </template>
        <div class="flex align-right start-xs between-sm prices mainprice">
          <div class="prices" v-if="!displayItemDiscounts || !isOnline">
            <span
              class="h4 serif cl-error price-special"
              v-if="product.special_price"
            >{{
                (product.price_incl_tax * product.qty) | price(storeView)
              }}</span
            >
            <span
              class="h6 serif price-original"
              v-if="product.special_price"
            >{{
                (product.original_price_incl_tax * product.qty)
                  | price(storeView)
              }}</span
            >
            <span
              class="h4 serif price-regular"
              v-else
              data-testid="productPrice"
              >
              {{
                ((product.original_price_incl_tax
                  ? product.original_price_incl_tax
                  : product.price_incl_tax) *
                  agItemQuantity)
                  | price(storeView)
              }}</span
            >
          </div>
          <div class="prices" v-else-if="isOnline && product && product.totals">
            <span
              class="h4 serif cl-error price-special"
              v-if="product.totals.discount_amount"
            >
              {{ (product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount) | price(storeView) }}
            </span>
            <span
              class="h6 serif price-original"
              v-if="product && product.totals && product.totals.row_total_incl_tax "
            >{{ product.totals.row_total_incl_tax | price(storeView) }}</span
            >
            <span
              class="h4 serif price-regular"
              v-if="!product.totals.discount_amount"
            >{{ product.totals.row_total_incl_tax | price(storeView) }}</span
            >
          </div>
          <div class="prices" v-else>
            <span class="h4 serif price-regular">
              {{
                ((product.regular_price || product.price_incl_tax) * agItemQuantity)
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
import RemoveButtonCart from '../RemoveButtonCart'
import ProductQuantityOnCartPage from 'theme/components/core/ProductQuantityOnCartPage.vue'
import {
  getThumbnailForProduct
} from '@vue-storefront/core/modules/cart/helpers'
import { getProductPrimaryCategory, onlineHelper } from '@vue-storefront/core/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import EditMode from '../EditMode'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { mapState } from 'vuex'
import config from 'config'
import { CartService } from '@vue-storefront/core/data-resolver'

export default {
  name: 'AGProduct',
  components: {
    ProductImageCart,
    ProductQuantityOnCartPage,
    RemoveButtonCart
  },
  mixins: [Product, ProductOption, EditMode],
  props: {
    product: {
      required: true,
      type: [Object, Array]
    },
    agItem: {
      required: true,
      type: Object
    },
    fullCart: {
      type: Boolean,
      default: false
    },
    orignalprice: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      maxQuantity: 0,
      optionCheck: false,
      isStockInfoLoading: false,
      quantityError: false,
      quoteVueItemOriginal: [],
      agItemQuantity: 0
    }
  },
  async mounted () {
    // this.checkIt();
    if (this.agItem) {
      this.agItemQuantity = this.agItem.qty;
    }
    await this.itemExtensionAttributes()
  },
  methods: {
    async itemExtensionAttributes () {
      const quoteItemData = await CartService.getItems()
      var quoteItem = []
      var quoteVueItem = []
      if (quoteItemData && quoteItemData.result && quoteItemData.result.length > 0) {
        quoteItem = quoteItemData.result.filter(function (quoteItemInside) {
          if (quoteItemInside && quoteItemInside.extension_attributes && quoteItemInside.extension_attributes.is_vue_quote) {
            quoteVueItem.push(quoteItemInside.sku)
          }
        })
      }
      this.quoteVueItemOriginal = quoteVueItem
    },
    updateProductQty (qty) {
      this.$bus.$emit('notification-progress-start', 'Updating qty... ')
      if (this.editMode) {
        this.editModeSetQty(qty)
        return
      }
      this.updateQuantity(qty)
    },
    updateQuantity (quantity) {
      let payloadData = {
        product: this.product,
        qty: quantity,
        itemId: parseInt(this.cartItemId)
      };
      this.$store.dispatch('cart/updateQuantity', payloadData).then(r => {
        if (r) {
          this.$bus.$emit('notification-progress-stop', 'Updating qty... ')
          this.$bus.$emit('cartItemQuantityUpdated', payloadData);
        }
      })
    },
    updateProductQtyInput (qty) {
      this.agItemQuantity = qty
    },
    handleQuantityError (error) {
      this.quantityError = error
    },
    checkedQuoteItem (sku) {
      var isVueQuote = false
      this.quoteVueItemOriginal.filter(function (skuInside) {
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
      console.log('RemoveTheItemFromCart');
      this.$bus.$emit('notification-progress-start', 'Processing... ')
      await this.$store.dispatch('cart/removeItem', { product: this.product, itemId: this.cartItemId })
      await this.$store.dispatch('cart/sync', { forceClientState: true })
      this.$bus.$emit('carPageUpdate', {
        productId: 0
      })
      this.$bus.$emit('notification-progress-stop')
      let productCat = getProductPrimaryCategory(this.product);
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
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      if (this.product) {
        return getThumbnailForProduct(this.product)
      }
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
      if (this.product) {
        return formatProductLink(this.product, currentStoreView().storeCode)
      }
    },
    productQty () {
      return this.editMode ? this.getEditingQty : this.agItemQuantity
    },
    storeView () {
      return currentStoreView()
    },
    cartItemId () {
      return this.agItem.item_id
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
    font-size: 14px;
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
    font-size: 14px;
    font-weight: bold;
    padding-right: 0px;
    margin-top: -5px;
    display: block;
    margin-bottom: 5px;
  }

  .opv {
    color: #4a4a4a;
    font-family: Arial;
    font-size: 14px;
    font-weight: normal;
    padding-right: 15px;
    display: block;
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
    padding-top: 20px;

    .firstprice-cross {
      padding-right: 11px;
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
  }
}

.row-sb-left-padding {
  margin-top: 20px;
  position: relative;
}

.product-name a {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 16px;
  margin: 6px 0;
  height: auto !important;
  margin-bottom: 12px;
  font-weight: bold;
  white-space: nowrap;
  @media (max-width: 767px) {
    white-space: unset;
    font-size: 2.597vw;
    display: block;
  }
}

.sku {
  color: #4a4a4a;
  font-family: Arial;
  font-weight: normal;
  font-size: 14px;
  margin-top: 1px;
  height: 100%;
  display: flex;
  align-items: center;
  @media (max-width: 767px) {
    font-size: 2.319vw;
    height: auto;
  }
}

.sku-text {
  color: #4a4a4a;
  font-family: Arial;
  font-size: 14px;
  font-weight: bold;
  padding-right: 15px;
  @media (max-width: 767px) {
    font-size: 2.319vw;
  }
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
  font-weight: bold;
  padding-right: 15px;
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
  font-weight: bold;
  padding-right: 15px;
}

.product-qty-input span {
  color: #9b9b9b;
  font-family: Arial;
  font-size: 16px;
  font-weight: normal;
  padding-right: 20px;
  margin-top: 25px;
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
  // height: 100%;
}

.mainprice .prices span {
  color: #29275b;
  font-family: Arial;
  font-weight: bold;
  font-size: 20px;
  margin-top: 22px;
  display: block;
}

.sb-prodcut-qty-on-cart- {
  margin-top: 43px;
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
}

.sb-product-img {
  // flex-basis: 21.9%;
}

.sb-product-detail {
  // flex-basis: 28.1%;
  // max-width: 28.1%;
  @media (max-width: 767px) {
    // flex-basis: 65%;
    // max-width: 65%;
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

@media (min-width: 767px) and (max-width: 991px) {
  .mainprice .prices span {
    margin-top: 45px;
  }
  .product-qty-input span {
    margin-top: 45px;
  }
}

@media (min-width: 991px) and (max-width: 1200px) {
  .mainprice .prices span {
    margin-top: 60px;
  }
  .product-qty-input span {
    margin-top: 60px;
  }
}

@media (max-width: 455px) {
  // .sb-product-img {
  //   flex-basis: 40%;
  // }
  // .sb-product-detail {
  //   flex-basis: 50%;
  //   max-width: 50%;
  // }
  .product-qty-input span {
    padding-right: 10px;
    margin-top: 0;
  }

  .maincart {
    .firstprice {
      padding-left: 10px;
    }
  }
  .mainprice .prices span {
    font-size: 16px;
    margin-top: 0;
  }
  .sb-prodcut-qty-on-cart- {
    margin-top: 15px;
  }
  .row-sb-left-padding {
    padding-left: 15px;
  }
}

@media (max-width: 767px) {
  .row-sb-left-padding {
    padding-left: 15px;
  }
}
</style>
<style>
.left-padding-adhesive-img .sb-product-img .product-image img {
  width: 75px;
}
</style>
