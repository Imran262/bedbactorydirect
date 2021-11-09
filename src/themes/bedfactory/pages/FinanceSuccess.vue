<template>
  <div>
    <header class="thank-you-title bg-cl-secondary pl20">
      <div class="container">
        <h2 class="category-title hidden">
          {{ $t('Order confirmation') }}
        </h2>
      </div>
    </header>
    <div class="container mobile-container">
      <div class="row">
        <div class="col-lg-8 col-md-12 col-sm-12 col-padding">
          <div v-if="OnlineOnly" class="success-header row">
            <div class="col-md-3 col-lg-2 col-xs-4 non-selected-tick" />
            <div class="col-md-9 col-lg-10 col-xs-8 success-heading">
              <p class="order-received">Your Order has been received!</p>
              <p class="order-received-text">
                Please keep an eye on your inbox, we'll send you an email
                shortly
              </p>
            </div>
          </div>
          <div v-if="OnlineOnly" class="seccess-body row">
            <div class="col-md-12 inner-success">
              <span v-if="purchaserName" class="purchaser-text">
                <label class="purchaser-name">{{ purchaserName }}</label
                >, thank you for your purchase!
              </span>
              <span v-if="backendOrderId">
                Your personal Order ID is:
                <label class="order-num">{{ backendOrderId }}</label>
              </span>
              <span
                >You will receive an order confirmation email with full details
                of your order.</span
              >
            </div>
          </div>
          <div v-if="getAddressInformation">
            <DeliveryInformationSuccess
              :address-information="getAddressInformation"
            />
          </div>
          <!-- <ThingsToRememberSuccess /> -->
        </div>
        <div
          class="col-lg-4 col-md-12 col-padding"
          v-if="
            lastOrderItem ||
            (getCartItems &&
              getFinalItems &&
              orderPriceElements &&
              getPersonalDetails)
          "
        >
          <RegisterAccountSuccess :personal-details="getPersonalDetails" />
          <!-- getFinalItemsLive
          <OrderReviewList
            :products="getFinalItemsLive"
            :totals="orderPriceElements"
            :address-information="getAddressInformation"
          /> -->




          <OrderReviewList
            :products="getFinalItems"
            :totals="orderPriceElements"
            :address-information="getAddressInformation"
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
import config from 'config'
import axios from 'axios'
import i18n from '@vue-storefront/i18n'
import OrderReviewList from 'theme/components/theme/blocks/OrderReviewList/OrderReviewList'
import DeliveryInformationSuccess from 'theme/components/theme/blocks/DeliveryInformationSuccess/DeliveryInformationSuccess'
import RegisterAccountSuccess from 'theme/components/theme/blocks/RegisterAccountSuccess/RegisterAccountSuccess'
import ThingsToRememberSuccess from 'theme/components/theme/blocks/ThingsToRememberSuccess/ThingsToRememberSuccess'
export default {
  name: 'SuccessPage',
  mixins: [ Composite, VueOfflineMixin ],
  data () {
    return {
      lastOrderItem: null,
      plateFormTotals: null,
      item: { items: [] },
    }
  },
  components: {
    OrderReviewList,
    DeliveryInformationSuccess,
    RegisterAccountSuccess,
    ThingsToRememberSuccess
  },
  // beforeRouteEnter (to, from, next) {
  //   let toQuery = to.fullPath
  //   console.log("789654 Path received is ",to.fullPath)
  //   next()
  //   if (!from.name && !toQuery.includes('backendorderid')) {
  //     next({ name: 'home' })
  //   } else {
  //     next()
  //   }
  // },
  computed: {
    getAddressInformation () {
        console.log("741258 in getAddress Information");
      if (!this.$route.fullPath.includes('backendorderid') && this.orderElements && this.orderElements.order) {
        return this.orderElements.order.addressInformation
      } else {
        if (this.lastOrderItem) {
          return this.lastOrderItem.order.addressInformation
        } else {
          return undefined
        }
      }
    },
    getPersonalDetails () {
      if (this.orderElements && this.orderElements.order) {
        const firstName = this.orderElements.order.addressInformation
          .billingAddress.firstname
        const lastName = this.orderElements.order.addressInformation
          .billingAddress.lastname
        const email = this.orderElements.order.addressInformation.billingAddress
          .email
        return {
          firstName,
          lastName,
          email,
        }
      } else {
        if (this.lastOrderItem) {
          const firstName = this.lastOrderItem.order.addressInformation.billingAddress.firstname
          const lastName = this.lastOrderItem.order.addressInformation.billingAddress.lastname
          const email = this.lastOrderItem.order.addressInformation.billingAddress.email
          return {
            firstName,
            lastName,
            email
          }
        }
        return undefined
      }
    },
    // lastOrderConfirmation () {
    //   return this.$store.state.order.last_order_confirmation
    //     ? this.$store.state.order.last_order_confirmation.confirmation
    //     : {}
    // },
    purchaserName () {
      if (this.$store.state.order && this.orderElements) {
        return this.orderElements.order.addressInformation.shippingAddress.firstname
      } else {
        if (this.lastOrderItem) {
          return this.lastOrderItem.order.addressInformation.billingAddress.firstname
        } else {
          return undefined
        }
      }
    },
    orderElements () {
      console.log('741258 orderElementsOrderCheck ', this.$store.state.order,"\n\n\n\n ",!this.$route.fullPath.includes('backendorderid'),(this.$store.state.order && this.$store.state.order.last_order_confirmation !== null), (!this.$route.fullPath.includes('backendorderid') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)))
      if (!this.$route.fullPath.includes('backendorderid') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)) {
        console.log("741258 in if orderElements");
        return this.$store.state.order.last_order_confirmation.order
      } else {
        console.log("741258 in else orderElements");
        return {}
      }
    },
    backendOrderId () {
        console.log("741258 in backendorderID ");
      if (!this.$route.fullPath.includes('backendorderid') && this.$store.state.order && this.orderElements) {
          console.log("741258 in backendorderID in if");
        return this.orderElements.confirmation.orderNumber
      } else {
          console.log("741258 in backendorderID in else",this.lastOrderItem);
        if (this.lastOrderItem) {
          return this.lastOrderItem.confirmation.backendOrderId
        } else {
          return undefined
        }
      }
    },
    orderPriceElements () {
      if (!this.$route.fullPath.includes('backendorderid') && this.$store.state.cart.platformTotals) {
        return this.$store.state.cart.platformTotals
      } else {
        if (this.lastOrderItem && this.lastOrderItem.order) {
          var platformTotals = {
            "subtotal_incl_tax": this.lastOrderItem.order.subtotal,
            "base_grand_total": this.lastOrderItem.order.grandtotal,
            "shipping_incl_tax": this.lastOrderItem.order.shipping_incl_tax
          }
        }
        return this.lastOrderItem ? platformTotals : []
      }
    },
    getOrderItems () {
      console.log(this.$route,this.$route.query === "backendorderid","741258 store is ",this.$store.state)
      if (!this.$route.fullPath.includes('backendorderid') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)) {
        console.log("741258 in if getOrderItems")
        return this.$store.state.order? this.$store.state.order.last_order_confirmation.order.products : []
      }
      else if (!this.$route.fullPath.includes('backendorderid') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)) {
        console.log("741258 in if else getOrderItems")
        return this.$store.state.order? this.$store.state.order.last_order_confirmation.order.products : []
      }else {
        console.log("741258 in else getOrderItems")
        if (this.lastOrderItem && this.lastOrderItem.order.products !== null) {
          return _.values(this.lastOrderItem.order.products)
        } else {
          return []
        }
      }
    },
    getCartItems () {
      console.log(
        '741258 getCartItemsOrderCheck ',
        this.$store.state.cart.platformTotals
      )
      if (!this.$route.fullPath.includes('backendorderid') && this.$store.state.cart.platformTotals !== null) {
        console.log("741258 this.$store.state.cart.platformTotals.items", this.$store.state.cart.platformTotals.items)
        return this.$store.state.cart.platformTotals.items
      } else {
        if (this.plateFormTotals) {
          console.log("741258 here we are ",this.plateFormTotals);
          return this.plateFormTotals.platformTotals.items
        } else {
          return []
        }
      }
    },















    getFinalItemsLive() {
      const merged = _.merge(
        _.keyBy(this.getCartItems, "name"),
        _.keyBy(this.getOrderItems, "name")
      );
      const values = _.values(merged);
      console.log('1235689 Values ',values);
      const extensionAttributes = values.filter(
        (value) =>
          value.extension_attributes &&
          value.extension_attributes.original_item_sku
      );
      const simpleProducts = values.filter(
        (value) =>
          !(
            value.extension_attributes &&
            value.extension_attributes.original_item_sku
          )
      );
      // console.log("1235689");
      console.log("1235689 extensionAttributes",extensionAttributes,"\n simpleProducts",simpleProducts);
      let finalItems = [];
      if (extensionAttributes.length > 0) {
        console.log('1235689 in extensionAttributes condition');
        const reducedProducts = extensionAttributes.reduce((acc, current) => {
          const skuKey = current["extension_attributes"]["original_item_sku"];
          if (!(skuKey in acc) && !acc[skuKey]) {
            return { ...acc, [skuKey]: [current] };
          }
          return { ...acc, [skuKey]: [...acc[skuKey], current] };
        }, {});
        console.log("1235689 reducedProducts",reducedProducts);

        for (const item of _.values(reducedProducts)) {
          const reducedItem = item.reduce(
            (acc, current) => {
              const price = acc.price_incl_tax;

              return {
                price_incl_tax: price + current.price_incl_tax,
                name: current.extension_attributes.product_name,
                sku: current.extension_attributes.original_item_sku,
                qty: current.qty,
              };
            },
            { price_incl_tax: 0 }
          );
          console.log("1235689 reducedItem",reducedItem);
          finalItems.push(reducedItem);
        }
      }
      if (simpleProducts.length > 0) {
        console.log("1235689 in condition for simpleProducts",simpleProducts,"\n final products are ",finalItems);

        finalItems = [];
        simpleProducts.forEach((item,index)=>{
      if(item.price>0){
finalItems.push(item);
      }
    })
       // finalItems = [...finalItems, ...simpleProducts];
        console.log("1235689 finalItems",finalItems);
      }
      let newFinalItems=[];
      console.log("1235689 Finally About to return final Items ",finalItems );
      return finalItems;
    },



















    getFinalItems () {
      // const merged = _.merge(_.keyBy(this.getCartItems, 'sku'), _.keyBy(this.getOrderItems, 'sku'))
      const merged = this.getOrderItems

      const values = _.values(merged)
      const merged2 = _.merge(_.keyBy(this.getCartItems, 'name'), _.keyBy(this.getOrderItems, 'name'))

      const values2 = _.values(merged2)
      console.log("663322 key by",_.keyBy(this.getOrderItems, 'sku'),"\t cart items are ",this.getCartItems,"\t order items",this.getOrderItems,"\t values",values,"\n\t\t\tMerged",merged,"\n\n\n\n Second one \t values",values2,"\n\t\t\tMerged",merged2);
      const extensionAttributes = values.filter(value => value.extension_attributes && value.extension_attributes.original_item_sku)
      const simpleProducts = values.filter(value => !(value.extension_attributes && value.extension_attributes.original_item_sku))
      console.log("663322 Simple ",simpleProducts , "\n\n\nextension attributes" , extensionAttributes);
      let finalItems = []
      if (extensionAttributes.length > 0) {
        console.log("663322 in extensionAttributes ",extensionAttributes);
        const reducedProducts = extensionAttributes.reduce((acc, current) => {
          const skuKey = current[ 'extension_attributes' ][ 'original_item_sku' ]
          if (!(skuKey in acc) && !acc[ skuKey ]) {
            return { ...acc, [ skuKey ]: [ current ] }
          }
          return { ...acc, [ skuKey ]: [ ...acc[ skuKey ], current ] }
        }, {})
        console.log("663322 Reduced products ",reducedProducts);
        for (const item of _.values(reducedProducts)) {
          const reducedItem = item.reduce((acc, current) => {
            console.log("663322 getcaritems", current.extension_attributes)
            const price = acc.price_incl_tax
            return {
              price_incl_tax: price + current.price_incl_tax,
              name: current.extension_attributes.product_name,
              sku: current.extension_attributes.original_item_sku,
              qty: current.qty
            }
          }, { price_incl_tax: 0 })
          console.log("663322 Reduced Item ",reducedItem);
          finalItems.push(reducedItem)
        }
      }
      if (simpleProducts.length > 0) {
        console.log("663322 in Simple Product",finalItems);
        finalItems = [ ...finalItems, ...simpleProducts ]
        console.log("663322 After ",finalItems);
      }
      console.log("663322  Final Items are",finalItems);
      finalItems = finalItems.filter(function(item){
        return item.price >0
      })
      console.log("663322  After Final Items are",finalItems);
      return finalItems
    },
  },
  methods: {
    removeLastOrderItem () {
      localStorage.removeItem('lastOrderItem')
    },
    addBloom () {
      if (config && config.bloomreach) {
        console.log('tag', this.lastOrderItem)
        var br_data = br_data || {}
        br_data.acct_id = config.bloomreach.accountID
        br_data.ptype = 'other'
        br_data.domain_key = config.bloomreach.domainKey
        br_data.view_id = config.bloomreach.viewId
        br_data.test_data = config.bloomreach.testData
        br_data.is_conversion = 1
        br_data.basket_value = this.lastOrderItem.order.grandtotal || 0.00
        br_data.order_id = this.backendOrderId
        br_data.basket = this.item
        BrTrk.getTracker().updateBrData(br_data)
        BrTrk.getTracker().logPageView()
      }
    }
  },
  async mounted () {
    if (this.$store.state.order && this.$store.state.order.last_order_confirmation) {
      this.$store.commit('google-gtag/SET_SUCCESS_PURCHASE', {
        order: this.$store.state.order.last_order_confirmation,
        platformTotals: this.$store.state.cart.platformTotals
      })
    }
    // if (!isServer && this.$route.fullPath.includes('backendorderid')) {
      try {
        if (performance.navigation.type === 1) {
          await this.removeLastOrderItem()
        }
        // if (localStorage.getItem('checkout_3dSecure_orderId')) {
          this.$store.dispatch("cart/clear", { recreateAndSyncCart: true }) // just clear the items without sync
          this.$store.dispatch("cart/sync", { forceClientState: true })
          this.$bus.$emit('notification-progress-start', i18n.t('Loading'))
          let plateformTotals = localStorage.getItem('plateFormTotals')
          plateformTotals = JSON.parse(plateformTotals)
          this.plateFormTotals = plateformTotals
          console.log("741258   plateformTotals",this.plateformTotals , plateformTotals);
          // let OrderDetailsUrl ='https://vue.bedfactorydirect.co.uk/' +
          let OrderDetailsUrl = config.baseUrl.url + config.orderDetails
        console.log('OrderDetailsUrl', OrderDetailsUrl)
          let orderId = localStorage.getItem('checkout_3dSecure_orderId')
          console.log("7412589 current route is  ",this.$route.query.backendorderid.split('1?'),'\n',this.$route.query.backendorderid,'\n',this.$route,localStorage.getItem('checkout_3dSecure_orderId'));
          if (orderId)
          {
            console.log("7412589 order Id  form local storage is ",orderId);
          }
          else{
            console.log("7412589 Getting the order id from url");
            // let newOrderID = this.$route.query.backendorderid.split('?')
            orderId = this.$route.query.backendorderid;
            console.log("7412589 Getting the new order id is ");
            if (orderId){
              console.log("7412589 order Id  form URl with no over ride is ",orderId);
            }
            else{
              console.log("7412589 could not get order id from url as there is no url override",orderId);
              console.log("7412589 Getting the order id from url with no override");
            let newOrderIDNew =this.$route.fullpath.split('checkout-success?')
            orderId = newOrderIDNew[1];
            console.log("7412589 Getting the new order id is ",newOrderIDNew, orderId);

            }
          }
          console.log("74125 Finally ",orderId);
          console.log(" 741258   orderId  ",orderId,OrderDetailsUrl,axios.get(OrderDetailsUrl + orderId));
          let { data } = await axios.get(OrderDetailsUrl + orderId)
          this.lastOrderItem = data.result.orderData
          console.log(" 741258       last order",this.lastOrderItem , "\twhole data" ,data);
          this.$bus.$emit('notification-progress-stop')
          this.$bus.$emit('checkout_com-order-placed', { ...this.lastOrderItem, platformTotals: plateformTotals?.platformTotals ? plateformTotals.platformTotals : [] })
          localStorage.removeItem('checkout_3dSecure_orderId')
          localStorage.removeItem('plateFormTotals')
        // } else {
        //   this.$router.push({ name: 'home' })
        // }
      } catch (error) {
        console.log(error)
      }
    // }
        await this.lastOrderItem
      this.getFinalItems.forEach(element => {
        let prod = {
          // 'prod_id': config.bloomreach.prefix + element.item_id,
          'sku': element.sku,
          'name': element.name,
          'quantity': element.qty,
          'price': element.price_incl_tax || 0.00
        }
        this.item.items.push(prod)
      })
      // this.addBloom()

  },
  beforeDestroy () {
    // this.removeLastOrderItem()
  },
  destroyed () {
    this.$bus.$off('checkout_com-order-placed')
  }
}
</script>

<style scoped>
.thank-you-title .category-title {
  margin-bottom: 0;
}
.success-header {
  position: relative;
  margin-top: 25px;
  padding: 25px 25px;
  background: #00a997;
}
.success-header .non-selected-tick {
  background: url(../assets/tick.png) no-repeat;
  height: 80px;
  width: 100%;
}
.success-heading {
  color: #fff;
  font-family: 'Poppins', sans-serif;
}
p.order-received {
  font-size: 24px;
  font-weight: 700;
  margin: 7px 0 0 0;
  font-family: 'Poppins', sans-serif;
  text-align: center;
}
p.order-received-text {
  font-weight: 500;
  font-size: 18px;
  margin: 0px;
  text-align: center;
}
.col-padding {
  padding-right: 35px;
  padding-left: 20px;
}
.seccess-body {
  padding: 25px 0px;
  font-size: 17px;
  font-family: 'Poppins', sans-serif;
  color: #54575b;
}
.seccess-body span {
  display: block;
  padding-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}
span.purchaser-text {
  font-size: 28px;
  font-weight: 600;
  color: #54575b;
  padding-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}
label.order-num {
  color: #00a997;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}
table.order-item {
  width: 100%;
  font-family: 'Poppins', sans-serif;
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
@media (max-width: 423px) {
  p.order-received {
    font-size: 12px !important;
  }
  p.order-received-text {
    font-size: 12px !important;
  }
}
@media (max-width: 767px) {
  .mobile-container {
    padding: 0px;
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
  span.purchaser-text {
    font-size: 16px;
  }
  .seccess-body span {
    font-size: 14px;
  }
}
@media (min-width: 767px) and (max-width: 991px) {
  .col-padding {
    padding-right: 20px;
    padding-left: 20p;
  }
}
</style>