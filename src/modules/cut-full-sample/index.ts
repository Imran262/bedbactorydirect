/* eslint-disable no-empty-pattern */
import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { coreHooks } from '@vue-storefront/core/hooks';
import * as types from './store/mutation-types';
import fetch from 'isomorphic-fetch';
import config from 'config';
const BASE_URL = config.api.url;
const SAMPLE_QUOTE_URL = config.sampleQuote.endpoint;
const CONVERT_FULL_TO_CUT_URL = config.sampleQuote.convert_full_to_cut || '/api/ext/sample-order/convert/full/cut/';

const sampleQuoteModuleStore = {
  namespaced: true,
  state: {
    sampleQuoteState: null
  },
  actions: {
    async sampleQuoteFunction ({}, sampleQuoteData) {
      try {
        const response = await fetch(
          `${SAMPLE_QUOTE_URL}`,
          {
            method: 'post',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sampleQuoteData)
          }
        );
        const jsonRes = await response.json();
        if (jsonRes && jsonRes.code === 200) {
          return jsonRes.result;
        } else {
          return jsonRes
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    },
    async convertFullToCutFunction ({}, { cartId }) {
      try {
        const response = await fetch(
          `${config.api.url + CONVERT_FULL_TO_CUT_URL + cartId}`,
          {
            method: 'get',
            mode: 'cors',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          }
        );
        const jsonRes = await response.json();
        if (jsonRes && jsonRes.code === 200) {
          return jsonRes.result;
        } else {
          return jsonRes
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    }
  },
  mutations: {
    [types.sampleQuote] (state, sampleQuote) {
      state.sampleQuote = 'sampleQuote';
    },
    [types.convertFullToCut] (state, convertFullToCut) {
      state.convertFullToCut = 'convertFullToCut';
    }
  }
};

export const sampleQuote: StorefrontModule = function ({
  app,
  store,
  router,
  moduleConfig,
  appConfig
}) {
  store.registerModule('sample-quote', sampleQuoteModuleStore);
  coreHooks.afterAppInit(async () => {
    console.log('App HAVE BEEN initialized');
  });
};
