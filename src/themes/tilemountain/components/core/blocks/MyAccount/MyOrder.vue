<template>
  <div class="mb35" v-if="order">
    <!-- My order header -->
    <div class="row mb15">
      <div class="col-xs-2 col-md-1">
        <return-icon class="p12 icon pointer" />
      </div>
      <div class="col-xs-10 col-md-11">
        <div class="displayFlex">
          <h3 class="m0 mb5 mt5 orderNo">
            <span>Order # {{ localProductData[0].order_id }}</span>
          </h3>
          <span>{{ order.created_at | date('LLL', storeView) }}</span>
        </div>
      </div>
    </div>
    <!-- My order body -->

    <div class="outer_border">
      <div class="row fs16">
        <div class="col-xs-12">
          <div class="flexbox">
            <div class="heading latestHeading">
              {{ $t('Items ordered') }}
            </div>
          </div>
          <table class="brdr-1 brdr-cl-bg-secondary">
            <thead>
              <tr>
                <th class="lh20">
                  {{ $t('Product Name') }}
                </th>
                <th class="lh20">
                  {{ $t('SKU') }}
                </th>
                <th class="lh20">
                  {{ $t('Price') }}
                </th>
                <th class="lh20">
                  {{ $t('Qty') }}
                </th>
                <th class="lh20">
                  {{ $t('Subtotal') }}
                </th>
                <th class="lh20">
                  {{ $t('Thumbnail') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="brdr-top-1 brdr-cl-bg-secondary" if="localProductData" v-for="item in localProductData[0].items" :key="item.sku">
                <td class="fs-medium lh25" :data-th="$t('Product Name')">
                  {{ item.name }}
                </td>
                <td class="fs-medium lh25" :data-th="$t('SKU')">
                  {{ item.sku }}
                </td>
                <td class="fs-medium lh25" :data-th="$t('Price')">
                  {{ item.price | price(storeView) }}
                </td>
                <td class="fs-medium lh25 align-center" :data-th="$t('Qty')">
                  {{ item.qty }}
                </td>
                <td class="fs-medium lh25" :data-th="$t('Subtotal')">
                  {{ item.subtotal | price(storeView) }}
                </td>
                <td class="fs-medium lh25 order-details" :data-th="$t('Thumbnail')">
                  <img
                    class="center quote-detail-image"
                    :src="getQuoteProdImage(item.image)"
                    alt="quoteimage"
                  >
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="brdr-top-1 brdr-cl-bg-secondary">
                <td colspan="5" class="align-right">
                  {{ $t('Subtotal') }}
                </td>
                <td class="align-right">
                  {{ order.subtotal | price(storeView) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="align-right">
                  {{ $t('Shipping') }}
                </td>
                <td class="align-right">
                  {{ order.shipping_amount | price(storeView) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="align-right">
                  {{ $t('Tax') }}
                </td>
                <td class="align-right">
                  {{ order.tax_amount + order.discount_tax_compensation_amount | price(storeView) }}
                </td>
              </tr>
              <tr v-if="order.discount_amount">
                <td colspan="5" class="align-right">
                  {{ $t('Discount') }}
                </td>
                <td class="align-right">
                  {{ order.discount_amount | price(storeView) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="align-right">
                  {{ $t('Grand total') }}
                </td>
                <td class="align-right">
                  {{ order.grand_total | price(storeView) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="row fs16 order-page-infos mb20">
        <div class="col-xs-12">
          <div class="flexbox">
            <div class="heading latestHeading">
              {{ $t('Order information') }}
            </div>
          </div>
          <div class="orderInformationBox">
            <div class="row">
              <div class="col-sm-6 col-md-6" v-if="shippingAddress">
                <h5>{{ $t('Shipping address') }}</h5>
                <address>
                  <p>{{ shippingAddress.firstname }} {{ shippingAddress.lastname }}</p>
                  <p>{{ shippingAddress.street[0] }} {{ shippingAddress.street[1] }}</p>
                  <p>{{ shippingAddress.postcode }} {{ shippingAddress.city }}</p>
                  <p>{{ shippingAddress.country }}</p>
                </address>
              </div>
              <div class="col-sm-6 col-md-6" v-if="order.shipping_description">
                <h5>{{ $t('Shipping method') }}</h5>
                <p>{{ order.shipping_description }}</p>
              </div>
              <div class="col-sm-6 col-md-6">
                <h5>{{ $t('Billing address') }}</h5>
                <address>
                  <p>{{ billingAddress.firstname }} {{ billingAddress.lastname }}</p>
                  <p>{{ billingAddress.street[0] }} {{ billingAddress.street[1] }}</p>
                  <p>{{ billingAddress.postcode }} {{ billingAddress.city }}</p>
                  <p>{{ billingAddress.country }}</p>
                </address>
              </div>
              <div class="col-sm-6 col-md-6">
                <h5>{{ $t('Payment method') }}</h5>
                <p>{{ paymentMethod }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import MyOrder from '@vue-storefront/core/compatibility/components/blocks/MyAccount/MyOrder'
import ReturnIcon from 'theme/components/core/blocks/Header/ReturnIcon'
import ProductImage from 'theme/components/core/ProductImage'
import { getThumbnailPath, productThumbnailPath } from '@vue-storefront/core/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios';
import config from 'config';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';

export default {
  mixins: [MyOrder],
  components: {
    ReturnIcon,
    ProductImage
  },
  data () {
    return {
      productData: [],
      localProductData: [],
      itemThumbnail: [],
      curentUser: '',
      quoteData: [],
      orderId: '',
      currentQuote: []
    }
  },
  computed: {
    ...mapGetters({
      ordersHistory: 'user/getOrdersHistory'
    }),
    orderNew () {
      return this.ordersHistory.find(order =>
        parseInt(order.entity_id) === parseInt(this.$route.params.orderId)
      )
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    ...mapActions({
      getProduct: 'product/single'
    }),
    getQuoteProdImage (slug) {
      return getThumbnailPath(slug, 125, 125);
    },

  async getOrderData () {
      let productReviewsUrl = config.api.url + config.quoteSystem.getOrderData 
      let orderId = this.$route.params.orderId;
      const article = { orderId: orderId }
      await axios.post(productReviewsUrl, article, {
        headers: {
          'Content-type': 'application/json'
        }
      })
        .then(r => {
          console.log('raja check', r.data.result);
          if (r.data.code) {
            this.localProductData = r.data.result
          }
        })
        .catch(error => {
          this.notifyUser(
            notifications.createNotification({
              type: 'error',
              message: 'Failed to Post a Question'
            })
          );
        })
    }

  },
  mounted () {
    this.getOrderData();
  },
  created () {
    this.getOrderData();
  },
  beforeMount () {
    this.getOrderData();
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-tertiary: color(tertiary);
$color-white-smoke: color(white-smoke);
.displayFlex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;

  @media (max-width: 767px) {
    align-items: flex-start;
    flex-direction: column;
  }
}
.outer_border {
  border: 1px solid #cccccc;
  border-radius: 15px;
  background-color: #fff;
}
.orderInformationBox {
  padding: 0 20px;

  h5{
    font-size: 16px;
    margin-bottom: 15px;
  }
  p{
    font-size: 14px;
    margin: 0;
    margin-top: 5px;
    line-height: 20px;
  }

}
.heading {
  text-align: center;
  font-size: 24px;
  font-family: oblik,serif;
  color: #fff;
}
.flexbox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: #071a44;
  color: #fff;
  padding:0 8px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}
table {
  border-collapse: collapse;
  width: 100%;
  border-bottom: unset;
  @media (max-width: 767px) {
    border-top: none;
  }
  @media (max-width: 992px) {
    table-layout: fixed;
  }

  th, td {
    text-align: left;
    padding: 20px;
    font-family: Arial,serif;

    &.align-right {
      text-align: right;

      @media (max-width: 767px) {
        text-align: left;
      }

    }

    @media (max-width: 1199px) {
      padding: 10px;
    }
    @media (max-width: 992px) {
      word-wrap: break-word;
    }
  }

  thead {
    @media (max-width: 767px) {
      display: none;
    }
  }

  tbody {

    tr {
      @media (max-width: 767px) {
        display: block
      }
    }

    td {
      @media (max-width: 767px) {
        display: block;
        text-align: left;
        padding: 10px 20px;
        font-size: 15px;

        &:before {
          content: attr(data-th) ': ';
          font-weight: 700;
          font-size: 15px;
          margin-right: 8px;
        }
      }

      &:first-child {
        @media (max-width: 767px) {
          padding: 20px 20px 10px 20px;
        }
      }

      &:last-child {
        @media (max-width: 767px) {
          padding: 10px 20px 20px 20px;
        }
      }
    }

  }

  tfoot {

    tr {
      @media (max-width: 767px) {
        display: block
      }

      &:last-child {
        td {
         padding-bottom: 20px
        }
      }
      td:first-child{
        font-weight: bold;
        font-family: "Oblik",serif;
      }
    }

    td {
      padding: 10px 20px;
      @media (max-width: 767px) {
        display: block
      }

      &:first-child {
        @media (max-width: 767px) {
          font-weight: 700;
          padding: 20px 20px 5px 20px;
        }
      }

      &:last-child {
        @media (max-width: 767px) {
          padding: 5px 20px 0 20px;
        }
      }

    }

  }

  i {
    vertical-align: middle;
  }

}

a {
  color: #fff;
  padding: 0;
  &:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #fff;
  }

  &:hover {
    &:after {
      opacity: 0;
    }
  }
}

.order-page-infos h5{
  font-family: Arial, Helvetica, sans-serif !important;
}
.orderNo {
  color: #4f4f4f;
}
address {
  font-style: normal;
}

.main_pro {
     border: 1px solid #b7b4b4;
    border-radius: 10px;
    padding: 7px;
    background: #fff;
}
.main_pro1{
     border: 1px solid #b7b4b4;
    background-color: #00a897;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    margin-top: -9px;
      padding: 8px;
}
h3{
    color: #fff;

}

.bg-cl-mine-shaft {
    background-color: #29275b!important;
}
h1, h2, h3, h4, h5 {
   font-family: oblik,serif !important;
}
.cl-tertiary {
    color: #fff!important;
}
</style>
