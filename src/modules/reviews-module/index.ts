/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types'
import fetch from 'isomorphic-fetch'
import config from 'config'
const BASE_URL = config.ukReviews.baseUrl
const STORE_CODE = config.ukReviews.storeId

const reviewsModuleStore = {
  namespaced: true,
  state: {
    reviews: null
  },
  actions: {
    async getReviews({}, productSku) {
      try {
        const response = await fetch(`https://api.reviews.co.uk/product/review?store=${STORE_CODE}&sku=${productSku}`,
          {
            method: 'get',
            mode: 'cors',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          })
        const jsonRes = await response.json();
        if (jsonRes && jsonRes.reviews) {
          return jsonRes
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mutations: {
    [types.UPDATE_REVIEWS](state, reviews) {
      state.reviews = reviews
    }
  },
  getters: {
    getReviews: (state) => state.reviews
  }
}

export const UkReviews: StorefrontModule = function ({app, store, router, moduleConfig, appConfig}) {
  console.log(BASE_URL)
  console.log('Reviews Module Registered');
  store.registerModule('ukreviews', reviewsModuleStore);
  coreHooks.afterAppInit(async () => {
  })
}
