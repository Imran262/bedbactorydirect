import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const QUOTE_URL = config.quoteSystem.endpoint;
const QUOTE_URL_CART = config.quoteSystem.addToCartEndpoint;

const quoteSystemModuleStore = {
  namespaced: true,
  state: {
    quoteSystemState: null
  },
  actions: {
    async quoteSystemFunction({}, systemData) {
      try {
        console.log("URl is ",QUOTE_URL,JSON.stringify(systemData));
        
        const response = await fetch(
          `${QUOTE_URL}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(systemData)
          }
        );
        console.log("\nquote system", systemData , "\nresponse",response,"\njson ",response.json());
        
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result;
        }
        console.log(jsonRes);
      } catch (error) {
        console.log(error);
      }
    },
    async quoteSystemAddtoCart({}, systemData) {
      try {
        const response = await fetch(
          `${QUOTE_URL_CART}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(systemData)
          }
        );
        const jsonRes = await response.json();
        if (jsonRes.code === 200) {
          return jsonRes.result;
        }
        console.log(jsonRes);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mutations: {
    [types.quoteSystem](state, quoteSystem) {
      state.quoteSystem = 'quoteSystem';
    }
  }
};

export const QuoteSystem: StorefrontModule = function({
  store,
}) {
  console.log('QuoteSystem Module Registered');
  store.registerModule('quotesystem', quoteSystemModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('Qoute system module initialized');
  });
};