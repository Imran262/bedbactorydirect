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
          :calculatorData="financecal"
          :minimumInstallment="450"
          :currentPrice="1000"
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
      financecal:  {
  "test_mode": true,
  "finance_available": true,
  "finance_provider": "v12",
  "loan_amount": "1690",
  "currency": "GBP",
  "min_max": {
    "min_loan": "300.00",
    "max_loan": "15000.00",
    "min_order": "335.00",
    "max_order": "15000.00"
  },
  "finance_options": [
    {
      "id": 9793,
      "finance_code": "27|244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e",
      "name": "Interest Free Finance (6 Months)",
      "order_id": 1,
      "min_loan": "300.00",
      "max_loan": "15000.00",
      "min_order": "335.00",
      "max_order": "15000.00",
      "min_deposit": 10,
      "max_deposit": 50,
      "default_deposit": 10,
      "keyword": "ALL",
      "imega_finance_rate_id": 1,
      "deposit_options": [
        {
          "value": 0.5,
          "name": "50%"
        },
        {
          "value": 0.4,
          "name": "40%"
        },
        {
          "value": 0.3,
          "name": "30%"
        },
        {
          "value": 0.2,
          "name": "20%"
        },
        {
          "value": 0.1,
          "name": "10%"
        }
      ],
      "imega_finance_rate": {
        "id": 1,
        "name": "0% 6 Months",
        "apr": "0.00",
        "term": 6,
        "instalment_frequency": "MONTH",
        "deferral_term": 0,
        "rate_type": 1,
        "load_factor": "0.166666666666666666666666666666",
        "settlement_fee": "0.00",
        "processing_fee": "0.00",
        "fixed_deposit_amount": null,
        "custom_1": null,
        "custom_2": null,
        "custom_3": null
      }
    },
    {
      "id": 9794,
      "finance_code": "88|34ee414c-94d8-4cd2-8f62-fc5b8a2d2a7d",
      "name": "Interest Free Finance (10 Months)",
      "order_id": 2,
      "min_loan": "300.00",
      "max_loan": "15000.00",
      "min_order": "335.00",
      "max_order": "15000.00",
      "min_deposit": 10,
      "max_deposit": 50,
      "default_deposit": 10,
      "keyword": "ALL",
      "imega_finance_rate_id": 3,
      "deposit_options": [
        {
          "value": 0.5,
          "name": "50%"
        },
        {
          "value": 0.4,
          "name": "40%"
        },
        {
          "value": 0.3,
          "name": "30%"
        },
        {
          "value": 0.2,
          "name": "20%"
        },
        {
          "value": 0.1,
          "name": "10%"
        }
      ],
      "imega_finance_rate": {
        "id": 3,
        "name": "0% 10 Months",
        "apr": "0.00",
        "term": 10,
        "instalment_frequency": "MONTH",
        "deferral_term": 0,
        "rate_type": 1,
        "load_factor": "0.100000000000000000000000000000",
        "settlement_fee": "0.00",
        "processing_fee": "0.00",
        "fixed_deposit_amount": null,
        "custom_1": null,
        "custom_2": null,
        "custom_3": null
      }
    },
    {
      "id": 9795,
      "finance_code": "28|8e0bd3a9-657f-457c-b488-dbfab37fac39",
      "name": "Interest Free Finance (12 Months)",
      "order_id": 3,
      "min_loan": "300.00",
      "max_loan": "15000.00",
      "min_order": "335.00",
      "max_order": "15000.00",
      "min_deposit": 10,
      "max_deposit": 50,
      "default_deposit": 10,
      "keyword": "ALL",
      "imega_finance_rate_id": 4,
      "deposit_options": [
        {
          "value": 0.5,
          "name": "50%"
        },
        {
          "value": 0.4,
          "name": "40%"
        },
        {
          "value": 0.3,
          "name": "30%"
        },
        {
          "value": 0.2,
          "name": "20%"
        },
        {
          "value": 0.1,
          "name": "10%"
        }
      ],
      "imega_finance_rate": {
        "id": 4,
        "name": "0% 12 Months",
        "apr": "0.00",
        "term": 12,
        "instalment_frequency": "MONTH",
        "deferral_term": 0,
        "rate_type": 1,
        "load_factor": "0.083333333333333333333333333333",
        "settlement_fee": "0.00",
        "processing_fee": "0.00",
        "fixed_deposit_amount": null,
        "custom_1": null,
        "custom_2": null,
        "custom_3": null
      }
    }
  ],
  "style_url": "https://angus.finance-calculator.co.uk/css/imegawidget-base.css",
  "widget_options": {
    "header_img": "https://angus.finance-calculator.co.uk/images/logos/v12.png",
    "anchor_img": "zzhttp://dev1.imega-support.co.uk/images/logos/v12.png",
    "style_css": "#imega-widget-anchor{\r\nbox-shadow: 0px 3px 15px rgba(0,0,0,0.2);\r\n} \r\n#imega-widget-anchor .imega-anchor-bottom .imega-slug{\r\nbackground:#f2f2f2;\r\npadding:10px;\r\nwidth:100%;\r\ndisplay:block;\r\n}\r\na#imega-see-info{\r\nbackground:#00315e;\r\nwidth:initial;\r\nheight:initial;\r\npadding:6px 12px 2px;\r\nfont-size:14px;\r\nborder-radius:20px;\r\n}\r\na#imega-see-info:hover{\r\nbackground:#2393d1;\r\n}\r\n#imega-modal{\r\nwidth: 510px;\r\n}\r\n#imega-modal-head{\r\nbackground: #f3f3f3;\r\npadding: 20px;\r\nborder-radius:8px;\r\n}\r\n#imega-modal-head img{\r\n height:50px;\r\n}\r\n#imega-modal select{\r\n padding: 2px 20px 2px 2px;\r\ntext-align: right;\r\nborder-radius:2px;\r\nfont-size:15px;\r\nfont-weight:bold;\r\ncolor: #00315e;\r\nbackground-color:white;\r\n}\r\n\r\n#calc-table td[data-imega-calculator-field=\"installment-amount\"]{\r\nfont-size:15px;\r\n}\r\n#imega-modal table th {\r\n background-color: #e1eefb;\r\nborder-color:white;\r\nborder-left:none;\r\nborder-color: white; \r\nborder-bottom: 4px solid white;\r\ncolor: #00315e;\r\n}\r\n#imega-modal table td{\r\nfont-weight:bold;\r\nborder-color:white;\r\nborder-right:none;\r\nborder-color: white; \r\nborder-bottom: 4px solid white;\r\nborder-left: 4px solid white;\r\nbackground-color: #f2f2f2;\r\n}\r\n#imega-modal .imega-modal-body h3{\r\nbackground:#00315e;\r\nborder-bottom:2px solid white;\r\n}\r\n#imega-widget span.imega-min-payment-text {\r\ncolor: #00315e;\r\n}\r\n#imega-close-btn{\r\nbackground:#00315e;\r\ncolor:white;\r\nborder-radius:0 4px;\r\n}",
    "monthly_text": "From &lt;strong&gt;&lt;span class=\"imega-min-payment-text\"&gt;£xxxxx&lt;/span&gt;&lt;/strong&gt; per month, subject to details, conditions apply",
    "header_text": "From &lt;span class=\"imega-min-payment-text\"&gt;&lt;/span&gt;  per month, subject to details, conditions apply",
    "footer_text": "Only available to UK residents over 18, subject to terms and conditions.\r\n\r\nTo apply for finance, please add the product to your cart, proceed through checkout and select 'Apply For Finance' as your payment option where you can complete the application form online.",
    "split_payments_text": "",
    "top_text": "Finance available on all orders between £335 and £15000",
    "calculator_fields": [
      {
        "id": 998,
        "calculator_fields_alias": "installment-amount",
        "calculator_style_id": 4,
        "name": "Monthly Payments",
        "sort_order": -1
      },
      {
        "id": 995,
        "calculator_fields_alias": "purchase-price",
        "calculator_style_id": 4,
        "name": "Purchase Price",
        "sort_order": 0
      },
      {
        "id": 1006,
        "calculator_fields_alias": "bnpl-total",
        "calculator_style_id": 4,
        "name": "Total Amount Repayable",
        "sort_order": 0
      },
      {
        "id": 1005,
        "calculator_fields_alias": "settlement-fee",
        "calculator_style_id": 4,
        "name": "Settlement Fee",
        "sort_order": 0
      },
      {
        "id": 1004,
        "calculator_fields_alias": "defer-term",
        "calculator_style_id": 4,
        "name": "Deferral Term",
        "sort_order": 0
      },
      {
        "id": 996,
        "calculator_fields_alias": "deposit-amount",
        "calculator_style_id": 4,
        "name": "Deposit To Pay",
        "sort_order": 1
      },
      {
        "id": 997,
        "calculator_fields_alias": "credit-amount",
        "calculator_style_id": 4,
        "name": "Amount Of Credit",
        "sort_order": 2
      },
      {
        "id": 1007,
        "calculator_fields_alias": "calc-processing-fee",
        "calculator_style_id": 4,
        "name": "Admin Fee",
        "sort_order": 3
      },
      {
        "id": 999,
        "calculator_fields_alias": "interest-amount",
        "calculator_style_id": 4,
        "name": "Amount Of Interest",
        "sort_order": 3
      },
      {
        "id": 1000,
        "calculator_fields_alias": "term",
        "calculator_style_id": 4,
        "name": "Number Of Monthly Payments",
        "sort_order": 4
      },
      {
        "id": 1001,
        "calculator_fields_alias": "total-payable",
        "calculator_style_id": 4,
        "name": "Total Amount Payable",
        "sort_order": 5
      },
      {
        "id": 1002,
        "calculator_fields_alias": "interest-rate",
        "calculator_style_id": 4,
        "name": "Rate Of Interest (Fixed)",
        "sort_order": 6
      },
      {
        "id": 1003,
        "calculator_fields_alias": "apr",
        "calculator_style_id": 4,
        "name": "APR Representative",
        "sort_order": 7
      }
    ]
  },
  "checkout_options": {
    "stylesheet_url": "https://angus.finance-calculator.co.uk/css/imegacheckout-base.css",
    "style_css": "#imegacheckout-left-header { \r\ncolor: #00315e;\r\n}\r\n#imegacheckout-calc-table td select{\r\nwidth:100%;\r\nbackground-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ0NC44MTkgNDQ0LjgxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ0LjgxOSA0NDQuODE5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQzNC4yNTIsMTE0LjIwM2wtMjEuNDA5LTIxLjQxNmMtNy40MTktNy4wNC0xNi4wODQtMTAuNTYxLTI1Ljk3NS0xMC41NjFjLTEwLjA5NSwwLTE4LjY1NywzLjUyMS0yNS43LDEwLjU2MSAgIEwyMjIuNDEsMjMxLjU0OUw4My42NTMsOTIuNzkxYy03LjA0Mi03LjA0LTE1LjYwNi0xMC41NjEtMjUuNjk3LTEwLjU2MWMtOS44OTYsMC0xOC41NTksMy41MjEtMjUuOTc5LDEwLjU2MWwtMjEuMTI4LDIxLjQxNiAgIEMzLjYxNSwxMjEuNDM2LDAsMTMwLjA5OSwwLDE0MC4xODhjMCwxMC4yNzcsMy42MTksMTguODQyLDEwLjg0OCwyNS42OTNsMTg1Ljg2NCwxODUuODY1YzYuODU1LDcuMjMsMTUuNDE2LDEwLjg0OCwyNS42OTcsMTAuODQ4ICAgYzEwLjA4OCwwLDE4Ljc1LTMuNjE3LDI1Ljk3Ny0xMC44NDhsMTg1Ljg2NS0xODUuODY1YzcuMDQzLTcuMDQ0LDEwLjU2Ny0xNS42MDgsMTAuNTY3LTI1LjY5MyAgIEM0NDQuODE5LDEzMC4yODcsNDQxLjI5NSwxMjEuNjI5LDQzNC4yNTIsMTE0LjIwM3oiIGZpbGw9IiMyODMxODgiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\r\nbackground-size:10px;\r\n}\r\n#imegacheckout-apply-button{\r\nbackground:#00315e;\r\n}\r\n#imegacheckout-apply-button:hover{\r\nbackground:#16A9E2;\r\ntransform:scale(1.02);\r\n}\r\n#imegacheckout-calc-table td{\r\nfont-weight:bold;\r\ntext-align:right;\r\n}\r\n#imegacheckout-calc-table td, #imegacheckout-calc-table th{\r\nborder:none;\r\n}\r\n#imegacheckout-calc-table tr:nth-child(odd) {\r\n background-color: #e6e6e6;\r\n}",
    "header_text": "Now Complete Your Application",
    "paragraph_text": "&lt;p&gt;Your order has been sent to us but now requires you to complete your finance application.&lt;/p&gt;&lt;p&gt;Please click on the apply button and once your finance application has been successful we will be able to proceed with your order. Please note that your goods will not be shipped until this has been completed.&lt;/p&gt;&lt;p&gt;Only available to UK residents over 18, subject to terms and conditions.&lt;/p&gt;",
    "details_header_text": "Your Loan"
  }
}
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
        let order = {
            "Order": {
               "CashPrice": (Totals.grand_total).toString(),
               "Deposit": (Totals.grand_total*0.2).toString(),
               "DuplicateSalesReferenceMethod": "ShowError",
               "ProductGuid": "244b3e7a-0ffb-41f2-88d5-adf78b6a3d9e",
               "ProductId": "27",
               "SalesReference": orderId
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
             console.log("order id is ", orderId, typeof order.CashPrice,order);
              const URL = config.api.url + config.v12Finance.endpoint ;
            //const URL = config.api.endpointlocal
            // const URL = "http://localhost:8080/api/ext/V12Finance/startApplication" ;
             axios.post(URL, order, {
                 headers: {
                     "Content-type": "application/json"
                     }
                    })
                    .then(res => {
                        let v12Link = res.data.result.ApplicationFormUrl ;
                        console.log("115599 responseIs",v12Link, res);
                        window.location.replace(v12Link);
                        return v12Link
                        })
                    .catch(error => {
                        console.log("115599 Error", error);
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