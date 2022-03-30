import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const QUOTE_URL = config.baseUrl.url + config.quoteSystem.endpoint;
const QUOTE_URL_CART = config.baseUrl.url + config.quoteSystem.addToCartEndpoint;

const quoteSystemModuleStore = {
  namespaced: true,
  state: {
    quoteSystemState: null
  },
  actions: {
    async quoteSystemFunction({}, systemData) {
      console.log("74125 URL for fetch qoutes is ",QUOTE_URL,"\n\n\n Sysytem data is ",systemData);
      
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
        console.log("74125 Data received is Original",response);
        const jsonRes = await response.json();
        console.log("74125 Data received is Json",jsonRes);
        
        if (jsonRes.code === 200) {
          return jsonRes.result;
        }
        console.log(jsonRes);
      } catch (error) {
        console.log("74125 Error occured while Fteching Quotes ",error);
      }
    },
    async quoteSystemAddtoCart({}, systemData) {
      console.log("74125 URL for qoutes add to cart is ",QUOTE_URL_CART,"\n\n\n Sysytem data is ",systemData);
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
        console.log("74125 Data received Qoute add to cart in Original",response);
        const jsonRes = await response.json();
        console.log("74125 Data received Qoute add to cart in Json",jsonRes);
        if (jsonRes.code === 200) {
          return jsonRes.result;
        }
        console.log(jsonRes);
      } catch (error) {
        console.log("74125 Error occured while Adding to cart Quotes ",error);
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