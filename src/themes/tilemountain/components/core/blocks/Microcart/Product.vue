<template>
  <li class="row py10 bg-cl-white" :class="{ 'relative': editMode }">
    <div class="mx10 w-100 py10 mb15 edit-mode flex between-xs middle-xs" v-if="editMode">
      Edit mode
      <button class="brdr-none bg-cl-transparent" @click="closeEditMode">
        <span class="cl-accent">
          <i class="material-icons cl-accent mr5">close</i>
        </span>
      </button>
    </div>
    <div class="blend">
      <div class="ml10 bg-cl-secondary">
        <product-image :image="image"/>
      </div>
    </div>
    <div class="col-xs-7 col-lg-8 flex pl20 flex-wrap item-detail-full">
      <div class="flex flex-nowrap details">
        <div class="w-100 between-xs details-inner">
          <div class="Q-inner">
            <div class="remove-icon middle-xs actions" v-if="!editMode">
              <edit-button
                class="mx5"
                @click="openEditMode"
                v-if="productsAreReconfigurable && !editMode"
              />
              <remove-button class="mx5" @click="removeItem({id: product.id, totals: product.totals}); overlayClose()"/>
            </div>
            <router-link
              class="serif h4 name product-name"
              :to="productLink"
              data-testid="productLink"
              @click.native="$store.commit('ui/setMicrocart', false), sendProductClick($vnode.key)"
            >
              {{ product.name | htmlDecode }}
            </router-link>
            <div class="h6 cl-bg-tertiary pt5 size" v-if="product.size">
              <p><span>Size:</span>{{ product.size }}</p>
            </div>

            <div class="row qty-price-box" v-if="!isBundleProduct">
              <div class="h6 cl-bg-tertiary pt5 qty col-xs-9 col-sm-6 col-md-8 col-lg-7"
                   v-if="!notShowTilesInputIfSample">
                <span class="Qtytext">Qty:</span>
                <div v-if="product.qty_per_sqm" class="set">
                  <span v-if="productTileTypeUnitCheck(product) === 'm<sup>2</sup>'">
                    <span class="quantity">{{ calculateSqmQuantity(product.qty) }}</span>
                    <span
                      v-if="productTileTypeUnitCheck(product) !== 'piece'"
                      v-html="productTileTypeUnitCheck(product)"
                      class="sqm"></span>
                  </span>
                  <span v-else>
                    <span class="quantity">{{ Math.abs(product.qty) }}</span>
                    <span
                      v-if="productTileTypeUnitCheck(product) !== 'piece'"
                      v-html="productTileTypeUnitCheck(product)"
                      class="sqm"></span>
                  </span>
                </div>
                <div v-else>
                  <span v-if="productTileTypeUnitCheck(product) === 'm<sup>2</sup>'">
                    <span class="quantity">{{ calculateSqmQuantity(product.qty) }}</span>
                    <span
                      v-if="productTileTypeUnitCheck(product) !== 'piece'"
                      v-html="productTileTypeUnitCheck(product)"
                      class="sqm"></span>
                  </span>
                  <span v-else>
                    <span class="quantity">{{ Math.abs(product.qty) }}</span>
                    <span
                      v-if="productTileTypeUnitCheck(product) !== 'piece'"
                      v-html="productTileTypeUnitCheck(product)"
                    class="sqm"></span>
                  </span>
                </div>
              </div>
              <div class="h6 cl-bg-tertiary pt5 qty col-xs-9 col-sm-6 col-md-8 col-lg-7"
                   v-if="notShowTilesInputIfSample">
                <div class="h6 cl-bg-tertiary pt5 options" v-if="product.totals && isTotalsActive">
                  <div v-for="opt in product.totals.options" :key="opt.label">
                    <span class="opn">{{ opt.label }}:</span>
                    <span class="opv" v-html="opt.value"/>
                  </div>
                </div>
                <div class="h6 cl-bg-tertiary pt5 options" v-else-if="!editMode && product.options">
                  <div v-for="opt in product.options" :key="opt.label">
                    <span class="opn">{{ opt.label }}:</span>
                    <span class="opv" v-html="opt.value"/>
                  </div>
                </div>
              </div>
              <div class="col-xs-3 col-sm-6 col-md-4 col-lg-5 p0">
                <div class="prices" v-if="!displayItemDiscounts || !isOnline">
                  <span
                    class="h4 serif cl-error price-special"
                    v-if="product.special_price"
                  >{{ product.price_incl_tax * product.qty | price(storeView) }}</span>
                  <span
                    class="h6 serif price-original"
                    v-if="product.special_price"
                  >{{ product.original_price_incl_tax * product.qty | price(storeView) }}</span>

                  <span
                    class="h4 serif price-regular"
                    v-else
                    data-testid="productPrice"
                  >
                    {{
                      (product.original_price_incl_tax ? product.original_price_incl_tax : product.price_incl_tax) * product.qty | price(storeView)
                    }}
                  </span>
                </div>
                <div class="prices" v-else-if="isOnline && product.totals">
                  <span
                    class="h4 serif cl-error price-special"
                    v-if="product.totals.discount_amount"
                  >{{
                      product.totals.row_total_incl_tax | price(storeView)
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
                  <span
                    class="h4 serif price-regular"
                  >{{ (product.regular_price || product.price_incl_tax) * Math.abs(product.qty) | price(storeView) }}</span>
                </div>
              </div>
            </div>
            <div class="row qty-price-box" v-else>
              <div class="options bundleOption" v-if="bundleOptions">
                <dl>
                  <template v-for="(opt, index) in bundleOptions">
                    <dl class="opn" :key="`dl` + index" style="font-weight: bold">
                      {{ opt.label }}:
                    </dl>
                    <dt class="opv" :key="`dt` + index" v-html="opt.value"/>
                  </template>
                </dl>
              </div>
              <div class="col-xs-3 col-sm-6 col-md-4 col-lg-5 p0">
                <div class="prices" v-if="!displayItemDiscounts || !isOnline">
                  <span
                    class="h4 serif cl-error price-special"
                    v-if="product.special_price"
                  >{{ product.price_incl_tax * Math.abs(product.qty) | price(storeView) }}</span>
                  <span
                    class="h6 serif price-original"
                    v-if="product.special_price"
                  >{{ product.original_price_incl_tax * Math.abs(product.qty) | price(storeView) }}</span>

                  <span
                    class="h4 serif price-regular"
                    v-else
                    data-testid="productPrice"
                  >
                    {{
                      (product.original_price_incl_tax ? product.original_price_incl_tax : product.price_incl_tax) * Math.abs(product.qty) | price(storeView)
                    }}
                  </span>
                </div>
                <div class="prices" v-else-if="isOnline && product.totals">
                  <span
                    class="h4 serif cl-error price-special"
                    v-if="product.totals.discount_amount"
                  >{{
                      product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount | price(storeView)
                    }}</span>
                  <span
                    class="h6 serif price-original"
                    v-if="product.totals.discount_amount"
                  >{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
                  <span
                    class="h4 serif price-regular"
                    v-if="!product.totals.discount_amount"
                  >{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
                </div>
                <div class="prices" v-else>
                  <span
                    class="h4 serif price-regular"
                  >{{ (product.regular_price || product.price_incl_tax) * Math.abs(product.qty) | price(storeView) }}</span>
                </div>
              </div>
            </div>

            <!-- <div class="h6 cl-bg-tertiary pt5 sku" data-testid="productSku">{{ product.sku }}</div> -->
            <!-- <div
              class="h6 pt5 cl-error"
              v-if="hasProductErrors"
            >{{ product.errors | formatProductMessages }}</div> -->
            <!-- <div
              class="h6 pt5 cl-success"
              v-if="hasProductInfo && !hasProductErrors"
            >{{ product.info | formatProductMessages }}</div> -->
            <!-- <div class="mobilerow flex">
              <product-quantity-on-cart
                class="h5 cl-accent lh25 qty-mobile col-xs-4"
                :value="productQty"
                :max-quantity="maxQuantity"
                :loading="isStockInfoLoading"
                :is-simple-or-configurable="isSimpleOrConfigurable"
                @input="updateProductQty"
                @error="handleQuantityError"
              />
              <div
                class="mobprice col-xs-4"
                v-if="orignalprice"
              >{{ product.price_incl_tax.toFixed(2) | price(storeView) }}</div>
              <div class="flex col-xs-4">
                <div class="prices" v-if="!displayItemDiscounts || !isOnline">
                  <span
                    class="h4 serif cl-error"
                    v-if="product.special_price"
                  >{{ product.price_incl_tax * product.qty | price(storeView) }}</span>
                  bhai maan
                  <span
                    class="h6 serif"
                    v-if="product.special_price"
                  >{{ product.original_price_incl_tax * product.qty | price(storeView) }}</span>

                  <span
                    class="h4 serif"
                    v-else
                    data-testid
                  >{{ (product.original_price_incl_tax ? product.original_price_incl_tax : product.price_incl_tax) * product.qty | price(storeView) }}</span>
                </div>
                <div class="prices" v-else-if="isOnline && product.totals">
                  <span
                    class="h4 serif cl-error"
                    v-if="product.totals.discount_amount"
                  >{{ product.totals.row_total - product.totals.discount_amount + product.totals.tax_amount | price(storeView) }}</span>
                  <span
                    class="h6 serif"
                    v-if="product.totals.discount_amount"
                  >{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
                  <span
                    class="h4 serif price-regular"
                    v-if="!product.totals.discount_amount"
                  >{{ product.totals.row_total_incl_tax | price(storeView) }}</span>
                </div>
                <div class="prices" v-else>
                  <span
                    class="h4 serif price-regular"
                  >{{ (product.regular_price || product.price_incl_tax) * product.qty | price(storeView) }}</span>
                </div>
              </div>
            </div> -->
          </div>
          <!-- <product-quantity-on-cart
            class="h5 cl-accent lh25 qty"
            :value="productQty"
            :max-quantity="maxQuantity"
            :loading="isStockInfoLoading"
            :is-simple-or-configurable="isSimpleOrConfigurable"
            @input="updateProductQty"
            @error="handleQuantityError"
          /> -->
        </div>
        <!-- <div
          class="firstprice"
          v-if="orignalprice"
        >
          {{ product.price_incl_tax.toFixed(2) | price(storeView) }}
        </div> -->
      </div>
      <!-- <div class="w-100 pb15 flex flex-wrap bottom-xs" v-if="editMode">
        <div class="ml0 flex flex-wrap filters" v-if="productsAreReconfigurable">
          <div
            class="h5 pt5 w-100"
            v-for="(option, index) in product.configurable_options"
            :key="index"
          >
            <div class="h6 cl-bg-tertiary mr10">
              {{ option.label }}:
            </div>
            <div class="flex flex-wrap pt5" v-if="option.label == 'Color' && editMode">
              <color-selector
                v-for="filter in getAvailableFilters[option.attribute_code]"
                v-if="isOptionAvailable(filter)"
                :key="filter.id"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
            <div class="flex flex-wrap pt5" v-else-if="option.label == 'Size' && editMode">
              <size-selector
                class="mr10 mb10"
                v-for="filter in getAvailableFilters[option.attribute_code]"
                v-if="isOptionAvailable(filter)"
                :key="filter.id"
                :variant="filter"
                :selected-filters="getSelectedOptions"
                @change="changeEditModeFilter"
              />
            </div>
          </div>
        </div>
        <button-full
          class="update-button mb10 mr10"
          @click.native="updateProductVariant"
          :disabled="isUpdateCartDisabled"
        >
          {{ $t('Update item') }}
        </button-full>
      </div> -->
    </div>
  </li>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product';

import ProductQuantityOnCart from 'theme/components/core/ProductQuantityOnCart.vue';
import ProductImage from 'theme/components/core/ProductImageMicroCart';
import ColorSelector from 'theme/components/core/ColorSelector.vue';
import SizeSelector from 'theme/components/core/SizeSelector.vue';
import RemoveButton from './RemoveButton';
import EditButton from './EditButton';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption';
import {
  getThumbnailForProduct,
  getProductConfiguration
} from '@vue-storefront/core/modules/cart/helpers';
import ButtonFull from 'theme/components/theme/ButtonFull';
import EditMode from './EditMode';
import { MeasureProductClick } from 'src/modules/google-gtag/mixins/MeasureProductClick'

export default {
  data () {
    return {
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false
    };
  },
  props: {
    product: {
      type: Object,
      required: true
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
  components: {
    RemoveButton,
    ProductImage,
    ColorSelector,
    SizeSelector,
    EditButton,
    ButtonFull,
    ProductQuantityOnCart
  },

  mixins: [Product, ProductOption, EditMode, MeasureProductClick],
  computed: {
    ...mapState({
      isMicrocartOpen: (state) => state.ui.microcart
    }),
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0;
    },
    hasProductErrors () {
      const errors = this.product.errors || {};
      const errorsValuesExists =
        Object.keys(errors).filter((errorKey) => errors[errorKey]).length > 0;
      return errorsValuesExists;
    },
    isTotalsActive () {
      return (
        this.isOnline &&
        !this.editMode &&
        this.product.totals &&
        this.product.totals.options
      );
    },
    isOnline () {
      return onlineHelper.isOnline;
    },
    productsAreReconfigurable () {
      return (
        config.cart.productsAreReconfigurable &&
        this.product.type_id === 'configurable' &&
        this.isOnline
      );
    },
    productTileType () {
      return config.tileTypes;
    },
    displayItemDiscounts () {
      return config.cart.displayItemDiscounts;
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      };
    },
    thumbnail () {
      return getThumbnailForProduct(this.product);
    },
    configuration () {
      return getProductConfiguration(this.product);
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode);
    },
    editMode () {
      return this.getEditingProductId === this.product.id;
    },
    productQty () {
      return this.editMode ? this.getEditingQty : Math.abs(this.product.qty);
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(this.product.type_id);
    },
    isBundleProduct () {
      return this.product.type_id === 'bundle'
    },
    isUpdateCartDisabled () {
      return (
        this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
      );
    },
    storeView () {
      return currentStoreView();
    },
    notShowTilesInputIfSample () {
      let labelCheck = false;
      if (this.product.totals && this.product.totals.options) {
        let productOptionArray = this.product.totals.options;
        // console.log("total options", this.product.totals.options);
        productOptionArray.forEach((option) => {
          if (option.label === 'Sample') {
            labelCheck = true;
          }
        });
        return labelCheck;
      }
      return false;
    },
    bundleOptions () {
      return (this.product && this.product.totals && this.product.totals.options) ? this.product.totals.options : null
    }
  },
  methods: {
    updateProductVariant () {
      this.updateVariant();
      this.closeEditMode();
    },
    productTileTypeUnitCheck (product) {
      let productUnit = '';
      if (product.product_price_type) {
        if (this.productTileType[product.product_price_type] === 'sqm') {
          productUnit = 'm<sup>2</sup>';
        } else if (this.productTileType[product.product_price_type]) {
          productUnit = this.productTileType[product.product_price_type];
        } else {
          productUnit = 'm<sup>2</sup>';
        }
      } else {
        productUnit = 'm<sup>2</sup>';
      }
      return productUnit;
    },
    updateProductQty (qty) {
      if (this.editMode) {
        this.editModeSetQty(qty);
        return;
      }
      this.updateQuantity(qty);
    },
    async removeFromCart ({ id, totals } = null) {
      if (totals && totals.options && totals.options.length > 0 && totals.options[0].label && totals.options[0].label === 'recommendations') {
        await this.$store.dispatch('cart/removeItem', { product: this.product, itemId: totals.item_id });
      } else {
        await this.$store.dispatch('cart/removeItem', { product: this.product });
      }
      await this.sendRemoveCartProdClick({ product: this.product, page: this.$route.name });
      this.$store.commit('ui/setOverlay', false)
      this.$bus.$emit('cartUpdated', true)
      this.$bus.$emit('carPageUpdate', {
        productId: this.product.id
      })
    },
    async overlayClose () {
      let pickOverlay = await document.getElementsByClassName('overlay fixed w-100');
      let changeDataType = Array.from(pickOverlay);
      if (changeDataType && changeDataType[0]) {
        changeDataType[0].classList.add('notificationOverlay');
      }
    },
    updateQuantity (quantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: this.product,
        qty: quantity
      });
    },
    async getQuantity (product) {
      if (this.isStockInfoLoading) return; // stock info is already loading
      this.isStockInfoLoading = true;
      try {
        const validProduct = product || this.product;
        const res = await this.$store.dispatch('stock/check', {
          product: validProduct,
          qty: this.productQty
        });
        return res.qty;
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    handleQuantityError (error) {
      this.quantityError = error;
    },
    async changeEditModeFilter (filter) {
      const editedProduct = this.getEditedProduct(filter);
      const maxQuantity = await this.getQuantity(editedProduct);
      if (!maxQuantity) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'The product is out of stock and cannot be added to the cart!'
          ),
          action1: { label: this.$t('OK') }
        });
      } else if (maxQuantity < this.productQty) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'Only {maxQuantity} products of this type are available!',
            { maxQuantity }
          ),
          action1: { label: this.$t('OK') }
        });
      } else {
        this.maxQuantity = maxQuantity;
        this.editModeSetFilters(filter);
      }
    },
    calculateSqmQuantity (productQuantity) {
      let Sqm = Math.abs(productQuantity) / this.product.qty_per_sqm;
      return Sqm.toFixed(2)
      // return this.roundTo(this.product.qty / this.product.qty_per_sqm, 1)
    }
  },
  watch: {
    isOnline: {
      async handler (isOnline) {
        if (isOnline) {
          const maxQuantity = await this.getQuantity();
          this.maxQuantity = maxQuantity;
        }
      }
    },
    isMicrocartOpen: {
      async handler (isOpen) {
        if (isOpen) {
          const maxQuantity = await this.getQuantity();
          this.maxQuantity = maxQuantity;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";

.blend {
  flex: 0 0 150px;
}

div.bundleOption span.price {
  font-weight: bold;
}

.microcart {
  .products {
    li {
      .blend {
        flex: 0 0 100px !important;

        .bg-cl-secondary {
          background: #fff;
          border: 1px solid #f2f2f2;
        }
      }

      .details-inner {
        .h4 {
          color: #4a4a4a;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
          display: block;

          &:hover {
            text-decoration: none;
          }
        }

        a.underline:after, a:not(.no-underline):hover:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: transparent;
        }

        .size {
          p {
            color: #4a4a4a;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            margin-top: 5px;
            margin-bottom: 0px;

            span {
              margin-right: 10px;
              text-align: left;
            }
          }
        }

        .options {
          color: #4a4a4a;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 14px;
          margin-top: 5px;
          margin-bottom: 0px;
        }

        .qty {
          padding-right: 0px;
          display: flex;

          span.Qtytext {
            margin-top: 3px;
            padding-left: 4px;
            font-size: 12px;
            color: #4a4a4a;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
          }
          .set {
            line-height: 1;
          }

          p {
            color: #4a4a4a;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            margin-top: 3px;
            margin-bottom: 0px;
            margin-left: 23px;

            span {
              margin-right: 10px;
              text-align: left;
              color: #4a4a4a;
            }
          }
          span.quantity {
            padding-left: 15px;
            color: #4a4a4a;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.87;
          }
          span.sqm {
            margin-top: 3px;
            padding-left: 0;
            font-size: 14px;
            color: #4a4a4a;
            @media screen and (max-width: 767px){
              margin-top: -1px;
            }
          }
        }

        .price-regular {
          color: #4a4a4a;
          font-family: Arial, Helvetica, sans-serif;
          margin-top: 8px;
          text-align: right;
          display: block;
          @media(max-width: 991px) and (min-width: 768px){
            margin-top: 13px
          }
          @media(max-width: 768px) {
            margin-top: 13px;
            margin-left: 20px;
          }
        }
      }
    }
  }

  .remove-icon {
    position: relative;
    top: -30px;
    right: -8px;
    margin-bottom: 10px;
  }
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

.options,
.sku {
  @media (max-width: 767px) {
    font-size: 10px !important;
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
    padding-right: 0px;
    padding-top: 54px;
    width: 17%;
  }

  .mainprice {
    padding-top: 68px;
    padding-right: 0px;
    flex-direction: column;
    margin: 0px;
    width: 20%;
    margin: 0px;

    span {
      color: #29275b;
      font-size: 20px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
    }
  }

  .firstprice {
    padding-top: 70px;
    padding-right: 0px;
    width: 10%;
    text-align: center;
  }

  .name {
    font-family: Arial, Helvetica, sans-serif;
  }

  .details-inner {
    .Q-inner {
      width: 80%;
    }
  }
}

@media (max-width: 1200px) and (min-width: 992px) {
  .details-inner {
    .Q-inner {
      width: 100%;
    }
  }
  .firstprice {
    width: 28%;
  }
  .qty {
    width: 23%;
  }
  .mainprice {
    width: 22%;
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
  .prices {
    padding-top: 8px;
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
  }
  .microcart .products li .details-inner .price-regular {
    margin-top: 4px;
  }
  .microcart {
    .products {
      li {
        .details-inner {
          .name {
            margin-top: 6px;
          }

          .h4 {
            font-size: 11px;
          }
          .product-name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            max-width: 110px;
      }
      .price-regular {
        margin-left: 0;
        color: #48403d;
        margin-top: 1.44px !important;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
      }
          .size {
            p {
              span {
                margin-right: 9px;
              }
            }
          }
      .size {
        span {
          font-size: 11px;
        }

        p {
          font-size: 11px;
        }
      }

      .qty {
        // padding-left: 0;
        span.Qtytext {
          font-size: 11px;
        }

        span.sqm {
          font-size: 11px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .quantity {
          line-height: 1.68 !important;
          padding-left: 12px !important;
        }
        p {
          font-size: 9px;
          margin-left: 13px;
        }
      }
    }
  }
}

.remove-icon {
  top: -5px;
  right: -14px;
  position: absolute;
}
    .item-detail-full {
      padding-left: 10px;
    }
}
.microcart .products li .details-inner .options{
font-size: 10px;
margin-top: 0px;
}
}
</style>
