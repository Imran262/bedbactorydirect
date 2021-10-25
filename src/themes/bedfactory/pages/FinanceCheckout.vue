<template>
  <main id="maincontent" class="page-main">
    <div id="imegacheckout" style="opacity: 1">
      <div class="imegacheckout-column">
        <h1 id="imegacheckout-left-header">Now Complete Your Application</h1>
        <div id="imegacheckout-paragraph-text">
          <p>
            Your order has been sent to us but now requires you to complete your
            finance application.
          </p>
          <p>
            Please click on the apply button and once your finance application
            has been successful we will be able to proceed with your order.
            Please note that your goods will not be shipped until this has been
            completed.
          </p>
          <p>
            Only available to UK residents over 18, subject to terms and
            conditions.
          </p>
        </div>
        <div id="imegacheckout-image">
          <img
            src="https://angus.finance-calculator.co.uk/images/logos/v12.png"
          />
        </div>
      </div>

      <div class="imegacheckout-column" id="imegacheckout-loan-details">
        <V12calculator
        v-if="showCalculator"
        @CalculatorValueUpdated='setValues($event)'
          :calculatorData="v12Data"
          :minimumInstallment="minimumMonthlyPayment"
          :currentPrice="currentPrice"
        />
        <button id="imegacheckout-apply-button" @click="submitApplication()">
          <h3 >Apply For Finance</h3>
          <span id="imegacheckout-apply-button-text"
            >You will be redirected to process your application</span
          >
        </button>
      </div>
    </div>
  </main>
</template>
<script>
import V12calculator from "src/themes/bedfactory/components/core/V12Calculator/CalculatorV12.vue";
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
      calculatedData : {},
      v12Data : {},
      minimumMonthlyPayment: 0.0,
      currentPrice : 0,
      showCalculator: false
    }
  },
  components: {
    V12calculator,
    OrderReviewList,
    DeliveryInformationSuccess,
    RegisterAccountSuccess,
    ThingsToRememberSuccess
  },
  beforeRouteEnter (to, from, next) {
    let toQuery = to.fullPath
    console.log(to.fullPath)
    //next()
    if (!from.name && !toQuery.includes('utm_nooverride')) {
      next({ name: 'home' })
    } else {
      next()
    }
  },
  computed: {
    getAddressInformation () {
      if (!this.$route.fullPath.includes('utm_nooverride') && this.orderElements && this.orderElements.order) {
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
      console.log("741258 purchaser name",this.$store.state.order,"\t\t\t\t",this.orderElements);
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
      console.log('741258orderElementsOrderCheck ', this.$store.state.order,"\n\n\n\n ",!this.$route.fullPath.includes('utm_nooverride'),(this.$store.state.order && this.$store.state.order.last_order_confirmation !== null), (!this.$route.fullPath.includes('utm_nooverride') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)))
      if (!this.$route.fullPath.includes('utm_nooverride') && (this.$store.state.order && this.$store.state.order.last_order_confirmation !== null)) {
        console.log("741258 in if ");
        return this.$store.state.order.last_order_confirmation
      } else {
        console.log("741258 in else ");
        return {}
      }
    },
    backendOrderId () {
      if (!this.$route.fullPath.includes('utm_nooverride') && this.$store.state.order && this.orderElements) {
        return this.orderElements.confirmation.orderNumber
      } else {
        if (this.lastOrderItem) {
          return this.lastOrderItem.confirmation.backendOrderId
        } else {
          return undefined
        }
      }
    },
    orderPriceElements () {
      if (!this.$route.fullPath.includes('utm_nooverride') && this.$store.state.cart.platformTotals) {
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
      console.log(this.$route,this.$route.query === "utm_nooverride","741258 store is ",this.$store.state)
      if (!this.$route.fullPath.includes('utm_nooverride') && this.$store.state.order.last_order_confirmation !== null) {
        console.log("741258 in if")
        return this.$store.state.order? this.$store.state.order.last_order_confirmation.order.products : []
      }
      else if (!this.$route.fullPath.includes('utm_nooverride') && this.$store.state.order.last_order_confirmation !== null) {
        console.log("741258 in if else")
        return this.$store.state.order? this.$store.state.order.last_order_confirmation.order.products : []
      }else {
        console.log("741258 in else")
        if (this.lastOrderItem && this.lastOrderItem.order.products !== null) {
          return _.values(this.lastOrderItem.order.products)
        } else {
          return []
        }
      }
    },
    getCartItems () {
      console.log(
        'getCartItemsOrderCheck ',
        this.$store.state.cart.platformTotals
      )
      if (!this.$route.fullPath.includes('utm_nooverride') && this.$store.state.cart.platformTotals !== null) {
        console.log("this.$store.state.cart.platformTotals.items", this.$store.state.cart.platformTotals.items)
        return this.$store.state.cart.platformTotals.items
      } else {
        if (this.plateFormTotals) {
          return this.plateFormTotals.platformTotals.items
        } else {
          return []
        }
      }
    },
    getFinalItems () {
      const merged = _.merge(_.keyBy(this.getCartItems, 'sku'), _.keyBy(this.getOrderItems, 'sku'))

      const values = _.values(merged)
      console.log("663322 \t cart items are ",this.getCartItems,"\t order items",this.getOrderItems,"\t values",values);
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
      finalItems.forEach((item,index)=>{
        if(item.type_id){
          console.log("663322 item has type id ",item.type_id);
        }
      // console.log("663322 item is ",item.type_id,( item.type_id !== 'null' || item.type_id !== 'undefined' ), item.type_id !== 'null' , item.type_id !== 'undefined'  );
      })
      finalItems = finalItems.filter(function(item){
        return item.price >0 && item.type_id
      })
      console.log("663322  After Final Items are",finalItems);
      return finalItems
    },
  },
  methods: {
      retailcalculator (){
          let Totals = this.$store.state.cart.platformTotals;
            let price = (Totals.grand_total).toString();
            this.currentPrice= price;
      // let price = data.special ?(data.original - data.special === 0) ? data.original : data.special : data.original
      console.log("14521452 current price is ",price);
      this.updatedPrice = price
      const URL = "https://angus.finance-calculator.co.uk/api/public/finance-options?loan_amount="+price+"&api_key=79166ebc201070380f581a4a2dcc004a";
      axios.get(URL).then((res) => {
        const response = res;
        console.log("14521452 response for v12 is ",res);
        if (response.status !== 200) {
          throw (
            ("Error Occured while requesting for reviews:",response.data[0].message));
            } else {
              let responseV12 = response.data;
              this.v12Data = responseV12;
              this.showCalculator =true
               let selectedOption =responseV12.finance_options[responseV12.finance_options.length-1];
                let initialdeposit =  selectedOption.deposit_options[0].value * price;
                let noOfMonths = selectedOption.imega_finance_rate.term;
                this.minimumMonthlyPayment = (price - initialdeposit)/noOfMonths;
                this.minimumMonthlyPayment = parseFloat(this.minimumMonthlyPayment).toFixed(
                            2
                          )
                console.log("778855 selcted option",selectedOption , initialdeposit ,noOfMonths, this.minimumMonthlyPayment);
              console.log("14521452 Successfully called V12 API recieved data is new ",responseV12, responseV12.finance_available);
      }
      })
      .catch((err) => {
        throw ("14521452 Error occured while requesting for v12 api:", err);
        });
    },
      setValues(payment){
          console.log("1155889966 payment set for calculator is ",payment);
          this.calculatedData = payment
      },
      submitApplication() {
          console.log("11559988 order is ",this.$store.state.order,this.backendOrderId);
        let CurrentOrder = this.$store.state.order;
        let Totals = this.$store.state.cart.platformTotals;

        console.log("Current order is ",CurrentOrder,"\n current ",Totals);
      let retailerGuid = "e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
        retailerId = "25838",
        authenticationKey =
          "U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM",
        productGuid = "244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e",
        productId = "27",
        salesReference = "012365",
        orderId = Math.floor(Math.random() * 1000000000) + 1000;
        if (this.calculatedData.noOfPayments === '6' || this.calculatedData.noOfPayments === 6){
            productId = "27"
            productGuid = "244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e"
        }else if(this.calculatedData.noOfPayments === '10' || this.calculatedData.noOfPayments === 10 ){
            productId = "88"
            productGuid = "34ee414c-94d8-4cd2-8f62-fc5b8a2d2a7d"
        }
        else {
            productId = "28"
            productGuid = "8e0bd3a9-657f-457c-b488-dbfab37fac39"
        }
        let order = {
            "Order": {
               "CashPrice": this.calculatedData.totalAmount,
               "Deposit": this.calculatedData.initialDeposit,
               "DuplicateSalesReferenceMethod": "ShowError",
               "ProductGuid": productGuid,
               "ProductId": productId,
               "SalesReference": this.backendOrderId,
               "vLink":true
               },
           "Retailer": {
               "AuthenticationKey": "U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM",
               "RetailerGuid": "e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
               "RetailerId": "25838"
            //    "AuthenticationKey": config.v12Finance.authenticationKey"U6BPJvIObeSZkb3dW7E6mqHCxzisV5gvuget1yA4a0y2ALOnzM",
            //    "RetailerGuid": config.v12Finance.retailerGuid"e6eb9e9a-9d8a-4919-9ef5-3ed2b14150a8",
            //    "RetailerId": config.v12Finance.retailerId"25838"
               }
             }
             console.log("order id is ", orderId,this.backendOrderId, typeof order.CashPrice,order);
              const URL = config.api.url + config.v12Finance.endpoint ;
            //const URL = config.api.endpointlocal
            //const URL = "http://localhost:8080/api/ext/V12Finance/startApplication" ;
             axios.post(URL, order, {
                 headers: {
                     "Content-type": "application/json"
                     }
                    })
                    .then(res => {
                      console.log("115599 responseIs before v-12", res);
                        // let v12Link = res.data.result.ApplicationFormUrl ;
                        // console.log("115599 responseIs",v12Link, res);
                        let backendURL = config.api.url + config.v12Finance.applicationSuccess;
                        axios.post(backendURL, {
                          "orderId":this.backendOrderId,
                          "v12ReferenceId": res.data.result.ApplicationId
                        }, {
                          headers: {
                     "Content-type": "application/json"
                     }
                    })
                    .then(responsebackend => {
                       
                        console.log("115599 responseIs backend",responsebackend);
                        // window.location.replace(v12Link);
                        // return v12Link
                        })
                    .catch(error => {
                        console.log("115599 Error", error);
                        // return v12Link
                    });
                        })
                    .catch(error => {
                        console.log("115599 Error", error);
                        return v12Link
                    });
    },
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
    this.retailcalculator();
    if (this.$store.state.order && this.$store.state.order.last_order_confirmation) {
      this.$store.commit('google-gtag/SET_SUCCESS_PURCHASE', {
        order: this.$store.state.order.last_order_confirmation,
        platformTotals: this.$store.state.cart.platformTotals
      })
    }
    if (!isServer && this.$route.fullPath.includes('utm_nooverride')) {
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
          let OrderDetailsUrl =
            config.orderDetails
          let orderId = localStorage.getItem('checkout_3dSecure_orderId')
          console.log(" 741258   orderId  ",orderId,OrderDetailsUrl,axios.get(OrderDetailsUrl + orderId));
          let { data } = await axios.get(OrderDetailsUrl + orderId)
          this.lastOrderItem = data.result.orderData
          console.log(" 741258       last order",this.lastOrderItem , "\twhole data" ,data);
          this.$bus.$emit('notification-progress-stop')
          this.$bus.$emit('checkout_com-order-placed', { ...this.lastOrderItem, platformTotals: plateformTotals.platformTotals ? plateformTotals.platformTotals : [] })
          localStorage.removeItem('checkout_3dSecure_orderId')
          localStorage.removeItem('plateFormTotals')
        // } else {
        //   this.$router.push({ name: 'home' })
        // }
      } catch (error) {
        console.log(error)
      }
    }
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
    await this.retailcalculator();
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
#imegacheckout {
  background: white;
  padding: 10px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 5px 0;
  max-width: 100%;
}
#imegacheckout .imegacheckout-column {
  margin: 10px;
  padding: 20px;
  min-width: 200px;
  max-width: 100%;
  width: 500px;
  text-align: center;
}
h1#imegacheckout-left-header {
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  display: block;
  font-weight: 500;
  color: #00315e;
}
#imegacheckout p {
  display: block;
  text-align: justify;
  margin-bottom: 20px;
  line-height: 1.6;
}
div#imegacheckout-image {
  text-align: center;
  margin-top: 50px;
  border: 2px solid #f3f3f3;
  padding: 20px;
  display: block;
}
#imegacheckout-image img {
  vertical-align: middle;
  border-style: none;
  height: 35px;
  max-width: 100%;
}
#imegacheckout-apply-button {
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 4px;
  background: #00315e;
}
#imegacheckout-apply-button h3 {
  margin-top: 0;
  margin-bottom: 0;
  color: white;
  font-weight: 500;
  font-size: 26px;
  display: block;
  text-align: center;
}
#imegacheckout-apply-button-text {
  color: white;
  display: block;
  text-align: center;
}
#imegacheckout h1 {
  font-size: 32px;
  display: block;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
}
#imegacheckout h3 {
  font-size: 26px;
  display: block;
  text-align: center;
  margin-bottom: 10px;
}
#imegacheckout-top-text {
  font-size: 14px;
  text-align: center;
  font-style: italic;
  display: inline-block;
  line-height: 1.2;
}
#imegacheckout-loan-details .check-v12 {
  position: inherit !important;
  margin: 0 !important;
  padding: 22px 15px 0 15px;
}

@media (max-width: 425px) {
  #imegacheckout .imegacheckout-column {
    padding: 0;
  }
}
@media (max-width: 520px) {
  div#imegacheckout-loan-details .check-v12 {
    width: 100% !important;
  }
  div#imegacheckout-loan-details select#options-select {
    font-size: 11px !important;
  }
  div#imegacheckout-loan-details select#imega-deposit-amount-select {
    font-size: 11px !important;
  }
}
</style>
<style>
#imegacheckout-loan-details .cl-merge {
  display: none !important;
}
#imegacheckout-loan-details .cl-merge {
  display: none !important;
}
#imegacheckout-loan-details .check-v12 .modal-retail-finance {
  display: none !important;
}
div#imegacheckout-loan-details select#options-select {
  font-size: 13px !important;
  text-align: initial !important;
}
div#imegacheckout-loan-details select#imega-deposit-amount-select {
  font-size: 13px !important;
}
@media (max-width: 520px) {
  div#imegacheckout-loan-details select#options-select {
    font-size: 11px !important;
  }
  div#imegacheckout-loan-details select#imega-deposit-amount-select {
    font-size: 11px !important;
  }
}
</style>