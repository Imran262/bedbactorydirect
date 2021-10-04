<template>
  <div class="row p25 between-xs">
    <table class="cart-summary-product-table" :class="outOfStockCode() && product.stock && product.qty > product.stock.qty ? 'product_out_of_stock' : ''">
       <tr class="outofstock-row" v-if="outOfStockCode() && product.stock && product.qty > product.stock.qty">
        <th class="stockOut" colspan="3">
          <span class="stockEmpty">{{$t('Out Of Stock')}}</span>
        </th>
      </tr>
      <tbody>
        <!--<tr>
          <td colspan="3">
            <product-image :image="image" />
          </td>
        </tr>-->
        <tr>
          <td>
            <div class="h4 weight-400 cl-accent serif headingproduct">
              {{ product.name | htmlDecode }}
            </div>
            <div
              class="error"
              v-if="product.errors && Object.keys(product.errors).length > 0"
            >
              <!-- {{ product.errors | formatProductMessages }} -->
            </div>
            <div class="h5 cl-tertiary pt5">
              <!-- <p class="sku" v-if="product.qty_per_sqm"> -->
                <!-- Sku : {{ product.sku }} -->
                <!-- Area {{ (product.qty/product.qty_per_sqm).toFixed(2) }} Sqm
              </p> -->
            </div>
            <div
              class="h6 cl-bg-tertiary pt5 options"
              v-if="product.totals && product.totals.options"
            >
              <div v-for="opt in product.totals.options" :key="opt.label" v-if="opt.label !== 'recommendations'">
                <span class="opn">{{ opt.label }}:</span>
                <span class="opv" v-html="opt.value" />
              </div>
            </div>
            <div class="h6 cl-bg-tertiary pt5 options" v-else-if="product.options">
              <div v-for="opt in product.options" :key="opt.label">
                <span class="opn">{{ opt.label }}:</span>
                <span class="opv" v-html="opt.value" />
              </div>
            </div>
          </td>
          <td>
            <div>
              <span class="h5 qty">
                <span>x {{ product.qty }}</span>
              </span>
            </div>
          </td>
          <td>
            <div v-if="isOnline && product.totals">
              <span class="h4 price" v-if="product.totals.discount_amount">
                <!-- {{ (product.totals.row_total_incl_tax - product.totals.discount_amount) | price }} -->
                {{ (product.total.price_incl_tax) | price }}
              </span>
              <!-- <span class="price-original h5"
                    v-if="product.totals.discount_amount"> {{ product.totals.row_total_incl_tax | price }} </span> -->
              <span v-if="!product.totals.discount_amount" class="h4 price"> {{ product.totals.price_incl_tax | price }} </span>
            </div>
            <div v-else>
              <span class="h4 cl-error" v-if="product.special_price">
                {{
                  (product.totals.price_incl_tax * product.qty) | price
                }}
              </span>
              <span class="price-original h5" v-if="product.special_price">
                {{
                  (product.totals.price_incl_tax * product.qty) | price
                }}
              </span>
              <span v-if="!product.special_price" class="h4">
                {{
                  (product.totals.price_incl_tax * product.qty) | price
                }}
              </span>
            </div>
          </td>
          </tr>
         <tr>
          <td colspan="2"><p class="sku" v-if="product.qty_per_sqm">
                <!-- Sku : {{ product.sku }} -->
              </p></td>
          <td> <span class="Sqm-price">{{product.totals.base_row_total_incl_tax | price}}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import config from 'config';
import { Product } from '@vue-storefront/core/modules/checkout/components/Product';
import { onlineHelper } from '@vue-storefront/core/helpers';
import ProductImage from 'theme/components/core/ProductImage';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers'

export default {
  computed: {
    isOnline () {
      return onlineHelper.isOnline;
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      };
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
  },

  methods:{
    stockValueSend () {
      this.$bus.$emit('sendvalueToCartSummary', this.product);
    },
    outOfStockCode(){
     let getAllStockStatus = config.customStockStatus;
     let convertStockCodeToArray = Object.keys(getAllStockStatus).map((key) => getAllStockStatus[key])
     const comapreCustomStockCode = this.product.custom_stock_status;
     return convertStockCodeToArray.includes(String(comapreCustomStockCode));
    }
  },
  mixins: [Product],
  components: {
    ProductImage
  }
};
</script>

<style scoped lang="scss">
.product_out_of_stock{
  border: 3px solid #e11d81;
  border-top: none;
  .outofstock-row{
    background: #e11d81;
    .stockOut{
      text-align: left;
    }
  }
  span.stockEmpty{
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 13px;
    color: #fff;
    text-transform: uppercase;
    line-height: 2;
    padding-left: 3px;
  }
}
.checkout-product-detail {
  margin-left: 10px;
  font-family: Arial, Helvetica, sans-serif !important;

  .h4.weight-400 {
    font-size: 14px;
    font-weight: 600;
  }

  .sku {
    color: #4f4f4f;
    font-weight: 600;
  }

  .h5.qty {
    color: #4f4f4f;
    font-size: 14px;
    font-weight: 600;
  }

  .serif {
    .h4 {
      color: #4f4f4f;
      font-weight: 600;
      font-size: 20px;
    }
  }
}

.order-summary-details {
  .p25 {
    padding: 0px 8px 0px 8px;
    border-bottom: 1px solid #bdbdbd;
    margin-bottom: 0px;
    &:last-child{
      border-bottom: 1px solid transparent;
    }
  }
}

.price-original {
  text-decoration: line-through;
}

.blend {
  flex: 0 0 121px;
}

.sku {
  color: #333;
}

.order-summary-inner .blend {
  background-color: #f2f2f2;
  height: 100%;
  border: 1px solid #676767;
}

.cart-summary-product-table tr td:first-child{
  width: 32%;
  padding-left: 20px;
}
.cart-summary-product-table tr td:nth-child(2n){
  width: 15%;
  vertical-align: top;
}
.cart-summary-product-table tr td:last-child{
  width: 15%;
  vertical-align: top;
  padding-right: 17px;
}
.cart-summary-product-table{
  width: 100%;
  padding-bottom: 5px;
  border-spacing: 0;
  .blend{
    height: 150px !important;
  }
  .headingproduct{
    font-family: Arial;
    color: #2a275c;
    margin-top: 10px;
    font-size: 14px;
  }
  .sku{
    margin: 0px;
    color: #3A3E3D;
    font-size: 12px;
    font-family: Arial;
  }
  .qty{
    color:#2a275c;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    display: block;
    margin-top: 10px;
  }
  .price{
    color:#2a275c;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    margin-top: 10px;
    display: block;
    text-align: right;
  }
}
@media (min-width: 767px) and (max-width: 1200px) {
  .checkout-product-detail {
    max-width: 100% !important;
    flex-basis: 100% !important;
  }
  .checkout-product-detail .h4 {
    font-size: 14px !important;
  }
}

@media (min-width: 320px) and (max-width: 767px) {
  .sku {
    margin-bottom: 0;
  }
}
.Sqm-price{
    display: flex;
    font-size: 12px;
    color: #5c5c5c;
    -ms-flex-align: start;
    align-items: flex-start;
    height: 18%;
    -ms-flex-pack: center;
    justify-content: center;
    font-family: Arial;
    float: right;
}
@media (min-width: 992px) and (max-width: 1200px){
.cart-summary-product-table tr td:first-child{
  width: 45%;
}
}
@media (min-width: 420px) and (max-width: 991px){
.cart-summary-product-table tr td:first-child{
  width: 27%;
}
}
</style>
