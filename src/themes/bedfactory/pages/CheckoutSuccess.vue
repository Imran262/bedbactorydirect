<template>
  <div class="top">
    <header class="thank-you-title bg-cl-secondary pl20">
      <div class="container">
        <h2 class="category-title hidden">{{ $t('Order confirmation') }}</h2>
      </div>
    </header>
    <div class="container mobile-container">
      <div class="row">
        <div class="col-md-8 col-sm-12 col-padding order-recieved">
          <div v-if="OnlineOnly" class="success-header">
            <div class="col-md-12 col-lg-12 col-xs-12 success-heading">
              <p class="order-received">Your Order has been received!</p>
              <!-- <p
                class="order-received-text"
              >Please keep an eye on your inbox, we'll send you an email shortly</p> -->
            </div>
          </div>
          <div class="row" v-if="alreadyOrderedMsg !== ''">
            <div class="col-md-12 col-lg-12 col-xs-12 batch-variation-top">
              <div class="batch-variation">
                <div class="batch-top">
                  <img src="/assets/batch-icon.png" alt="batch" />
                  <h2>Batch Variation</h2>
                </div>
                <p>{{ alreadyOrderedMsg }}</p>
              </div>
            </div>
          </div>

          <div v-if="OnlineOnly" class="seccess-body">
            <div class="col-md-12 inner-success">
              <span v-if="purchaserName" class="purchaser-text">
                <!-- <label class="purchaser-name">{{ purchaserName }}</label>, thank you for your purchase! -->
                <label class="purchaser-name"></label>Thank you for your
                purchase with {{ title }}.
              </span>
              <span v-if="backendOrderId">
                Your Order Reference is:
                <label class="order-num">{{ backendOrderId }}</label>
              </span>
              <span class="order-info"
                >You will receive an order confirmation email with full details
                of your purchase and a link to track its progress.</span
              >
            </div>
          </div>
          <div v-if="getAddressInformation">
            <DeliveryInformationSuccess
              :address-information="getAddressInformation"
            />
          </div>
          <ThingsToRememberSuccess v-if="getAddressInformation" />
        </div>
        <div
          class="col-md-4 col-padding account-create"
          v-if="
            lastOrderItem &&
            !getCartItems &&
            getFinalItems &&
            orderPriceElements &&
            getPersonalDetails
          "
        >
          <RegisterAccountSuccess :personal-details="getPersonalDetails" />
          <OrderReviewList
            :products="getFinalItems"
            :totals="orderPriceElements"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueOfflineMixin from 'vue-offline/mixin'
import Composite from '@vue-storefront/core/mixins/composite'
import { isServer } from '@vue-storefront/core/helpers'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import OrderReviewList from 'theme/components/theme/blocks/OrderReviewList/OrderReviewList'
import DeliveryInformationSuccess
  from 'theme/components/theme/blocks/DeliveryInformationSuccess/DeliveryInformationSuccess'
import RegisterAccountSuccess from 'theme/components/theme/blocks/RegisterAccountSuccess/RegisterAccountSuccess'
import ThingsToRememberSuccess from 'theme/components/theme/blocks/ThingsToRememberSuccess/ThingsToRememberSuccess'
import axios from 'axios'
import { format } from 'date-fns'
import config from 'config'

const merchantId = config.googleCustomerReviews.merchantID

export default {
  name: 'SuccessPage',
  mixins: [ Composite, VueOfflineMixin ],
  data () {
    return {
      lastOrderItem: null,
      executedOnce: false,
      orderDetailsUrl: null,
      alreadyOrderedMsg: '',
      item: { items: [] },
      googleReviewsData: {
        // REQUIRED FIELDS
        merchant_id: merchantId,
        order_id: null,
        email: null,
        delivery_country: null,
        estimated_delivery_date: 'YYYY-MM-DD',
        // OPTIONAL FIELDS
        // 'products': [{ 'gtin': 'GTIN1' }, { 'gtin': 'GTIN2' }]
      },
      title: config?.themeConfigurations?.title
    }
  },
  components: {
    OrderReviewList,
    DeliveryInformationSuccess,
    RegisterAccountSuccess,
    ThingsToRememberSuccess,
  },
  beforeRouteEnter (to, from, next) {
    let toQuery = to.query
    if (!from.name && toQuery.orderId && !toQuery.hasOwnProperty('cko-session-id')) {
      next({ name: 'home' })
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      getCartToken: 'cart/getCartToken',
      isCartEmpty: 'cart/isCartEmpty',
      totals: 'cart/getTotals'
    }),
    backendOrderId () {
      if (this.lastOrderItem && this.lastOrderItem.confirmation) {
        return this.lastOrderItem.confirmation.backendOrderId
      }
      return undefined
    },
    getAddressInformation () {
      if (this.lastOrderItem && this.lastOrderItem.order) {
        return this.lastOrderItem.order.addressInformation
      }
      return undefined
    },
    purchaserName () {
      if (
        this.lastOrderItem &&
        this.lastOrderItem.order &&
        this.lastOrderItem.order.addressInformation
      ) {
        return this.lastOrderItem.order.addressInformation.billingAddress
          .firstname
      }
      return undefined
    },
    getPersonalDetails () {
      if (this.lastOrderItem) {
        const firstName = this.lastOrderItem.order.addressInformation
          .billingAddress.firstname
        const lastName = this.lastOrderItem.order.addressInformation
          .billingAddress.lastname
        const email = this.lastOrderItem.order.addressInformation.billingAddress
          .email
        return {
          firstName,
          lastName,
          email,
        }
      }
      return undefined
    },
    orderElements () {
      if (!this.getParameterByName('orderId')) {
        if (this.$store.state.order.last_order_confirmation !== null) {
          return this.$store.state.order.last_order_confirmation
        } else {
          return {}
        }
      }
    },
    orderPriceElements () {
      if (this.lastOrderItem && this.lastOrderItem.platformTotals) {
        return this.lastOrderItem.platformTotals
      }
    },
    getOrderItems () {
      if (this.lastOrderItem && this.lastOrderItem.order.products) {
        return _.values(this.lastOrderItem.order.products)
      } else {
        return []
      }
      //   if(!this.getParameterByName("orderId")){
      // if (this.$store.state.order.last_order_confirmation !== null) {
      //   console.log(
      //     "getOrderItemsOrderCheckif ",
      //     this.$store.state.order.last_order_confirmation.order.products
      //   );
      //   return this.$store.state.order.last_order_confirmation.order.products;
      // } else {
      //   return {};
      // }
      //   } else {
      //      if (this.lastOrderItem && this.lastOrderItem.order.products) {
      //   return _.values(this.lastOrderItem.order.products);
      // } else {
      //   return [];
      // }
      //   }
    },
    getCartItems () {
      if (this.lastOrderItem && this.lastOrderItem.platformTotals) {
        return this.lastOrderItem.platformTotals.items
      } else {
        return []
      }
    },
    getFinalItems () {
      const merged = _.merge(
        // _.keyBy(this.getCartItems, 'item_id'),
        _.keyBy(this.getOrderItems, 'sku')
      )
      const values = _.values(merged)
      const extensionAttributes = values.filter(
        (value) =>
          value.extension_attributes &&
          value.extension_attributes.original_item_sku
      )
      const simpleProducts = values.filter(
        (value) =>
          !(
            value.extension_attributes &&
            value.extension_attributes.original_item_sku
          )
      )
      let finalItems = []
      if (extensionAttributes.length > 0) {
        const reducedProducts = extensionAttributes.reduce((acc, current) => {
          const skuKey = current[ 'extension_attributes' ][ 'original_item_sku' ]
          if (!(skuKey in acc) && !acc[ skuKey ]) {
            return { ...acc, [ skuKey ]: [ current ] }
          }
          return { ...acc, [ skuKey ]: [ ...acc[ skuKey ], current ] }
        }, {})

        for (const item of _.values(reducedProducts)) {
          const reducedItem = item.reduce(
            (acc, current) => {
              const price = acc.price_incl_tax

              return {
                price_incl_tax: price + current.price_incl_tax,
                name: current.extension_attributes.product_name,
                sku: current.extension_attributes.original_item_sku,
                qty: current.qty
              }
            },
            { price_incl_tax: 0 }
          )

          finalItems.push(reducedItem)
        }
      }
      if (simpleProducts.length > 0) {
        finalItems = [ ...finalItems, ...simpleProducts ]
      }
      return finalItems
    },
  },
  methods: {
    addBloom () {
      if (config && config.bloomreach) {
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'other'
        br_data.domain_key = config.bloomreach.domainKey
        br_data.view_id = config.bloomreach.viewId
        br_data.test_data = config.bloomreach.testData
        br_data.is_conversion = 1
        br_data.basket_value = this.lastOrderItem.platformTotals.grand_total
        br_data.order_id = this.backendOrderId
        br_data.basket = this.item
        BrTrk.getTracker().updateBrData(br_data)
        BrTrk.getTracker().logPageView()
      }
    },
    removeLastOrderItem () {
      // localStorage.removeItem("lastOrderItem");
    },
    includeGoogleReviews () {
      let googleReviewsScript = document.createElement('script')
      // googleReviewsScript.setAttribute("defer", "defer");
      googleReviewsScript.defer = true
      googleReviewsScript.async = true
      googleReviewsScript.setAttribute(
        'src',
        'https://apis.google.com/js/platform.js?onload=renderOptIn'
      )
      document.head.appendChild(googleReviewsScript)
      window.renderOptIn = () => {
        window.gapi.load('surveyoptin', () => {
          window.gapi.surveyoptin.render(this.googleReviewsData)
        })
      }
    },
    gTagConversionValue () {
      if (this.orderPriceElements && (this.orderPriceElements.base_grand_total || this.orderPriceElements.grand_total)) {
        if (this.orderPriceElements.grand_total) {
          return parseFloat(this.orderPriceElements.grand_total).toFixed(2)
        }
        if (this.orderPriceElements.base_grand_total) {
          return parseFloat(this.orderPriceElements.base_grand_total).toFixed(2)
        }
      }
      return 0.00
    },
    getParameterByName (name, url) {
      if (!url) url = window.location.href
      name = name.replace(/[\[\]]/g, '\\$&')
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
      if (!results) return null
      if (!results[ 2 ]) return ''
      return decodeURIComponent(results[ 2 ].replace(/\+/g, ' '))
    },
    countProducts (products) {
      return Object.keys(products).length
    },
    gTagConversion ({ orderId, data }) {
      if (
        document.documentElement.innerHTML.search(
          'AW-982121778/bFzMCO2byNYBELL6p9QD'
        ) !== -1
      ) {
        this.executedOnce = true
        return false
      }

      const gtagScript = document.createElement('script')
      // If No Order Data was found, then just return false

      // console.log('orderDatadd', data, data.result.orderData);

      if (!data.result || !data.result.orderData) {
        return false
      }
      let orderData = data.result.orderData
      let totalProductsQty = this.countProducts(orderData.order.products)

      if (!orderData.order) {
        return false
      }

      gtagScript.innerHTML =
        'gtag(\'event\', \'conversion\', {\n' +
        '      \'send_to\': \'AW-982121778/bFzMCO2byNYBELL6p9QD\',\n' +
        '      \'value\': ' + this.gTagConversionValue() + ',\n' +
        '      \'currency\': \'GBP\',\n' +
        '      \'transaction_id\': ' +
        orderData.order_id +
        ' \n' +
        '  });'
      document.body.appendChild(gtagScript)
    },
  },
  // async beforeMount() {
  //   let { data } = await axios.get(
  //     "https://tiles247.co.uk/vueapi/ext/sagepay/orderDetails?orderId=" +
  //       orderId
  //   );

  //   if (data.code === 200) {
  //     let order = data.result.orderData.order;
  //     let confirmation = data.result.orderData.confirmation;

  //     this.lastOrderItem = {
  //       order,
  //       confirmation,
  //       platformTotals: this.$store.state.cart.platformTotals,
  //       orderHistory: this.$store.state.user.orders_history
  //     };
  //   }
  // },
  async mounted () {
    this.$bus.$emit('notification-progress-start', i18n.t('Loading'))
    if ((this.productsInCart.length > 0 || this.getCartToken) && (this.$route.fullPath.includes("orderId") || this.$route.fullPath.includes("cko-session-id"))) {
      await this.$store.dispatch('cart/clear', {
        recreateAndSyncCart: true
      }) // just clear the items without sync
      await this.$store.dispatch('cart/sync', {
        forceClientState: true,
      })
    }
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/
    console.log("987654321 Object is ",Object );
    if (!Object.keys) {
      Object.keys = (function() {
        'use strict'
        var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor',
          ],
          dontEnumsLength = dontEnums.length

        return function(obj) {
          if (
            typeof obj !== 'function' &&
            (typeof obj !== 'object' || obj === null)
          ) {
            throw new TypeError('Object.keys called on non-object')
          }

          var result = [],
            prop,
            i

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop)
            }
          }

          if (hasDontEnumBug) {
            for (i = 0;i < dontEnumsLength;i++) {
              if (hasOwnProperty.call(obj, dontEnums[ i ])) {
                result.push(dontEnums[ i ])
              }
            }
          }
          return result
        }
      })()
    }

    await config
    let apiBaseUrl = config.api.url
    let OrderDetailsUrl =
      config.sagepay[ config.sagepay.selectedMode ].urls.orderDetails

console.log("987654321 OrderDetailsUrl is ",this.$route,OrderDetailsUrl,localStorage.getItem('checkout_3dSecure_orderId' ));
    if (!OrderDetailsUrl) {
      OrderDetailsUrl =
        apiBaseUrl + '/vueapi/ext/sagepay/orderDetails?orderId='
    }
    var orderId
    
      if (localStorage.getItem('checkout_3dSecure_orderId')) {
        orderId = localStorage.getItem('checkout_3dSecure_orderId')
        console.log("987654321 order id ",orderId ,OrderDetailsUrl + orderId);
        localStorage.removeItem('checkout_3dSecure_orderId')
      } else {
       // this.$router.push({ name: 'home' })
      }
    // else {
    //   orderId = this.getParameterByName('utm_nooverride')
    //     ? this.getParameterByName('utm_nooverride')
    //     : this.$route.params.utm_nooverride
    // }
    console.log('987654321 full' ,await axios.get(OrderDetailsUrl + localStorage.getItem('checkout_3dSecure_orderId' )));
    let { data } = await axios.get(OrderDetailsUrl + localStorage.getItem('checkout_3dSecure_orderId' ))
    console.log('987654321 data',data , 'full' ,await axios.get(OrderDetailsUrl + orderId));
    this.$bus.$emit('notification-progress-stop')
    if (data && data.result && !data.result.orderData.errors) {
      let confirmedOrderDetails = null
      if (data.result.orderData && data.result.orderData.order) {
        confirmedOrderDetails = data.result.orderData.order
      } else if (data.result.order) {
        confirmedOrderDetails = data.result.order
      }

      if (confirmedOrderDetails && confirmedOrderDetails.addressInformation) {
        this.alreadyOrderedMsg = confirmedOrderDetails.already_ordered_msg
        // Updating values for Google Reviews
        this.googleReviewsData.order_id = orderId
        this.googleReviewsData.email =
          confirmedOrderDetails.addressInformation.billingAddress.email ||
          confirmedOrderDetails.addressInformation.shippingAddress.email
        this.googleReviewsData.delivery_country =
          confirmedOrderDetails.addressInformation.shippingAddress.country_id
        // this.googleReviewsData.products = Object.keys(
        //   confirmedOrderDetails.products
        // ).map((key, index) => {
        //   return { gtin: confirmedOrderDetails.products[key].sku }
        // })
        let mostexpDate = new Date()
        mostexpDate = (format(mostexpDate, 'YYYY-MM-DD'))
        let shippingDate =
          confirmedOrderDetails.addressInformation.shipping_date
        this.googleReviewsData.estimated_delivery_date = shippingDate
          ? shippingDate.split('-').reverse().join('-')
          : mostexpDate
        this.includeGoogleReviews()
      }
    } else {
      this.$router.push({ name: 'home' })
    }

    if (!isServer) {
      try {
        if (data.code === 200) {
          let order = data.result.orderData.order
          let confirmation = data.result.orderData.confirmation
          let subtotal = data.result.orderData.order.subtotal
          let grandtotal = data.result.orderData.order.grandtotal
          let shipping_total = data.result.orderData.order.shipping_incl_tax

          let sagePayDropIn = localStorage.getItem('lastOrderItem')
          sagePayDropIn = JSON.parse(sagePayDropIn)

          // sagePayDropIn = JSON.parse(lastOrderItem);

          // console.log("sagePayDropIn33", sagePayDropIn);

          this.lastOrderItem = {
            order,
            confirmation,
            platformTotals: {
              sub_total: subtotal,
              grand_total: grandtotal,
              shipping_total: shipping_total
            },
            // sagePayDropIn && sagePayDropIn.platformTotals
            //   ? sagePayDropIn.platformTotals
            //   : [],
            orderHistory:
              sagePayDropIn && sagePayDropIn.orders_history
                ? sagePayDropIn.orders_history
                : []
          }
        }
        console.log("last order", this.lastOrderItem)

        // Check if its a reload
        if (this.lastOrderItem && this.lastOrderItem) {
          // this.$bus.$emit('checkout_com-order-placed', this.lastOrderItem)
          // console.log('routeInformation', this.$route.fullPath)
          console.log("purchase mutation fire before")
          this.$store.commit('google-gtag/SET_SUCCESS_PURCHASE', this.lastOrderItem)
          console.log("purchase mutation fire after", this.lastOrderItem)
        }
      } catch (error) {
        console.log('itsGoingToCatch', error)
      }

      if (!this.executedOnce) {
        // this.$nextTick(async () => {
        // await this.gTagConversion({ orderId, data })
        // })
      }
    }
    await this.lastOrderItem
    if (this.lastOrderItem) {
      this.getFinalItems.forEach(element => {
        let prod = {
          'prod_id': config.bloomreach.prefix + element.item_id,
          'sku': element.sku,
          'name': element.name,
          'quantity': element.qty,
          'price': element.price
        }
        this.item.items.push(prod)
      })
      var scriptLoad
      let BloomId = config.bloomreach.accountID
        BloomId = parseInt(BloomId)
        if (typeof BrTrk === 'undefined') {
          [...document.getElementsByTagName('script')].forEach((a, i) => {
            if (a.src === `http://cdn.brcdn.com/v1/br-trk-${BloomId}.js` || a.src === `https://cdn.brcdn.com/v1/br-trk-${BloomId}.js`) {
              scriptLoad = i
            }
          })
          document.getElementsByTagName('script')[scriptLoad || 0].addEventListener('load', () => {
            this.addBloom()
          })
        } else {
          this.addBloom()
        }
    }
  },
  beforeDestroy () {
    // this.removeLastOrderItem();
    let gScriptTag = document.getElementById('data-gtag-script')
    if (gScriptTag) {
      gScriptTag.remove()
    }
  },
  destroyed () {
    if (localStorage.getItem('checkout_3dSecure_orderId')) {
      localStorage.removeItem('checkout_3dSecure_orderId')
    }
    this.$bus.$off('checkout_com-order-placed')
  },
};
</script>

<style scoped>
.top {
  margin-top: 35px;
}

.thank-you-title .category-title {
  margin-bottom: 0;
}

.success-header {
  position: relative;
  padding: 25px 25px;
  background: #2a285a;
}

.success-header .non-selected-tick {
  background: url(/assets/icons/tick.png) no-repeat;
  height: 80px;
  width: 100%;
}

.success-heading {
  color: #434343;
}

@media (min-width: 767px) {
  .order-recieved {
    padding-right: 70px;
  }

  .account-create {
    padding-right: 0;
    padding-left: 0;
  }
}

p.order-received {
  font-size: 27px;
  font-weight: 700;
  margin: 0px 0 0 0;
  text-align: center;
  color: #fff;
  font-family: Arial;
}

p.order-received-text {
  font-weight: 500;
  font-size: 18px;
  margin: 0px;
  text-align: center;
  color: #fff;
}

/* .col-padding {
  padding-right: 35px;
  padding-left: 20px;
} */
.seccess-body {
  padding: 25px 0px;
  font-size: 24px;
  color: #2a285a;
  font-weight: bold;
}

.seccess-body span {
  display: block;
  padding-bottom: 15px;
  font-size: 24px;
  font-family: Arial;
}

span.purchaser-text {
  font-size: 27px;
  font-weight: 600;
  color: #2a285a;
  padding-bottom: 25px;
  font-family: Arial;
  margin-top: 10px;
}

span.order-info {
  font-weight: normal;
  color: #434343;
  font-size: 19px;
  line-height: 1.5;
  margin-top: 10px;
}

label.order-num {
  color: #2a285a;
  font-weight: 700;
}

table.order-item {
  width: 100%;
  border-spacing: 0;
  padding: 0;
}

table.order-item thead {
  background: #606060;
}

thead tr th {
  padding: 10px 15px;
  text-align: left;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

table.order-item tbody tr td {
  padding: 15px 5px 35px 5px;
  text-align: center;
}

table.order-item tbody {
  background: #ebebeb;
}

td.empty-dark-row-cell {
  background: #6060608f;
  width: 100%;
  min-width: 100%;
  color: transparent;
}

table.order-item tfoot {
  background: #ebebeb;
}

table.order-item tfoot tr {
  text-align: right;
}

td.empty-row-cell {
  width: 0;
  padding: 10px 0px 15px 15px;
  text-align: center;
}

td.footer-last-cel {
  text-align: left;
  text-align: center;
}

.batch-variation {
  margin: 20px 0px;
  border: 4px solid #ee008c;
  padding: 10px 22px;
}

.batch-variation .batch-top {
  display: flex;
}

.batch-variation .batch-top img,
.batch-variation .batch-top h2 {
  float: left;
}

.batch-variation .batch-top h2 {
  color: #ee008c;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 24px;
  margin-bottom: 0px;
  margin-left: 20px;
}

.batch-variation p {
  margin-bottom: 0px;
  font-family: Arial, Helvetica, sans-serif;
  /* font-weight: 100; */
  color: #434343;
  font-size: 19px;
  line-height: 1.7;
}

@media (max-width: 767px) {
  .mobile-container {
    padding: 0px;
    margin-top: -29px;
  }

  .mobile-container .row {
    margin: 0px;
  }

  .mobile-container .col-padding {
    padding-right: 0px;
    padding-left: 0px;
  }

  p.order-received {
    font-size: 16px;
  }

  p.order-received-text {
    font-size: 14px;
  }

  .seccess-body .inner-success {
    padding: 0px 20px;
  }

  .seccess-body {
    font-size: 17px;
    padding-top: 5px;
    padding-bottom: 0;
  }

  span.order-info {
    font-weight: normal;
    color: #434343;
    font-size: 14px;
    line-height: 1.7;
    margin-top: 0;
  }

  .batch-variation-top {
    padding: 0px 20px;
  }

  .batch-variation {
    padding: 10px;
  }

  .batch-variation p {
    font-size: 14px;
  }

  span.purchaser-text {
    font-size: 14px;
  }

  .seccess-body span {
    font-size: 14px;
    padding-bottom: 14px;
    margin-bottom: -6px;
  }

  .success-header {
    padding: 17px 25px;
  }

  .seccess-body span:nth-child(3n + 2) {
    padding-bottom: 25px;
  }

  .seccess-body span:nth-child(3n + 3) {
    padding-bottom: 25px;
  }
}

@media (min-width: 767px) and (max-width: 991px) {
  .col-padding {
    padding-right: 20px;
    padding-left: 20 p;
  }
}
</style>
