/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types'
import fetch from 'isomorphic-fetch'
import config from 'config'
const BASE_URL = config.sagepay.endpoint

const sagePayModuleStore = {
  namespaced: true,
  state: {
    merchantSessionKey: null
  },
  actions: {
    async updateEmailAddress({}, emailData) {
      console.log(config.sagepay.endpoint)
      try {
        const response = await fetch(`${BASE_URL}/updateCartEmail`,
          {
            method: 'put',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
          })
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result
        }
        console.log(jsonRes)
      } catch (error) {
        console.log(error)
      }
    },
    async updateShippingDetails({}, shippingData) {
      try {
        const response = await fetch(`${BASE_URL}/shippingInformation?token=${shippingData.userToken}&cartId=${shippingData.cartId}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(shippingData)
          })
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result
        }
        console.log(jsonRes)
      } catch (error) {
        console.log(error)
      }
    },
    async updatePaymentInformation({}, paymentInfo) {
      try {
        const response = await fetch(`${BASE_URL}/setPaymentInformation?token=${paymentInfo.userToken}&cartId=${paymentInfo.cartId}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentInfo)
          })
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result
        }
        console.log(jsonRes)
      } catch (error) {
        console.log(error)
      }
    },
    async getIdentifierAndSessionKey ({}, cardDetails) {
      try {
        const response = await fetch(`${BASE_URL}/generate-identifier`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardDetails)
          })
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result
        }
        console.log(jsonRes)
      } catch (error) {
        console.log(error)
      }
    },
    async doPayment ({}, transactionData) {
      try {
        const response = await fetch(`${BASE_URL}/do-payment`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
          })
        const jsonRes = await response.json();

        if (jsonRes.code === 200) {
          return jsonRes.result
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}

export const SagePay: StorefrontModule = function ({app, store, router, moduleConfig, appConfig}) {
  console.log('SagePay Module Registered');
  store.registerModule('sagepay', sagePayModuleStore);
  coreHooks.afterAppInit(async () => {
    // const merchantSessionKey = await store.dispatch('sagepay/getIdentifierAndSessionKey')
    // await store.commit(`sagepay/${types.UPDATE_MERCHANT_SESSION_KEY}`, merchantSessionKey)
    console.log('Sage pay initialized ')
  })
}
